// Teste da página interna fotos.html com um Supabase falso (sem internet) e das fotos da Kapazi no site de pedidos.
// Uso: node testes/teste_fotos.js
const {chromium} = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WEB = path.join(__dirname, "..", "site");
const falhas = []; const confere = (cond, msg) => { console.log((cond ? "OK   " : "FALHA") + " " + msg); if(!cond) falhas.push(msg); };
const srv = http.createServer((req, res) => {
  let p = path.join(WEB, decodeURIComponent(new URL(req.url, "http://x").pathname)); if(p.endsWith(path.sep)) p += "index.html";
  if(!p.startsWith(WEB) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end("404"); }
  res.writeHead(200, {"Content-Type": p.endsWith(".html") ? "text/html; charset=utf-8" : p.endsWith(".js") ? "application/javascript" : "application/json"}); fs.createReadStream(p).pipe(res);
}).listen(0);
// supabase-js falso: guarda login, tabela fotos_pedido e uploads em memória (window.__sb)
const FAKE = `window.__sb = {logado: null, membros: ["kapazi@x.com"], fotos: [], arquivos: {}};
window.supabase = {createClient(){
  const S = window.__sb, q = (rows) => { const o = {data: rows, error: null, select(){ return o; }, order(){ return o; }, limit(){ return o; }, then(f){ return Promise.resolve({data: o.data, error: null}).then(f); }}; return o; };
  return {
    auth: {getSession: async () => ({data: {session: S.logado ? {user: {email: S.logado}} : null}}),
      signInWithPassword: async ({email, password}) => password === "certa" ? (S.logado = email, {error: null}) : {error: {message: "Invalid login credentials"}},
      signOut: async () => { S.logado = null; }},
    rpc: async () => ({data: null, error: {message: "sem banco"}}),
    from(t){
      if(t === "membros") return q(S.membros.includes(S.logado) ? [{email: S.logado}] : []);
      return {select(){ return q(S.fotos.slice()); }, insert: async r => { S.fotos.push(r); return {error: null}; },
        delete(){ return {eq: async (k, v) => { S.fotos = S.fotos.filter(f => f[k] !== v); return {error: null}; }}; }};
    },
    storage: {from(){ return {upload: async (c, b, o) => { S.arquivos[c] = {size: b.size, type: o.contentType}; return {error: null}; }, remove: async l => { l.forEach(c => delete S.arquivos[c]); return {error: null}; }}; }}
  };
}};`;
(async () => {
  const base = `http://localhost:${srv.address().port}`;
  const nav = await chromium.launch(), ctx = await nav.newContext();
  await ctx.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  await ctx.route(/supabase-js@/, r => r.fulfill({contentType: "application/javascript", body: FAKE}));
  const pg = await ctx.newPage(), erros = []; pg.on("pageerror", e => erros.push(e.message)); pg.on("dialog", d => d.accept());
  await pg.goto(base + "/fotos.html");
  confere(await pg.isVisible("#login") && !(await pg.isVisible("#painel")), "sem login mostra só o formulário");
  await pg.fill("#email", "kapazi@x.com"); await pg.fill("#senha", "errada"); await pg.click("#login button");
  await pg.waitForSelector("#loginErro:not([hidden])"); confere(!(await pg.isVisible("#painel")), "senha errada não entra");
  await pg.evaluate(() => { document.getElementById("loginErro").hidden = true; });
  await pg.fill("#email", "outro@x.com"); await pg.fill("#senha", "certa"); await pg.click("#login button");
  await pg.waitForSelector("#loginErro:not([hidden])"); confere(/não tem acesso/.test(await pg.textContent("#loginErro")) && !(await pg.isVisible("#painel")), "e-mail que não é membro não entra");
  await pg.fill("#email", "kapazi@x.com"); await pg.fill("#senha", "certa"); await pg.click("#login button");
  await pg.waitForSelector(".prod");
  const sem = await pg.evaluate(() => filtrados().length), cod = await pg.getAttribute(".prod", "data-cod");
  console.log("     produtos sem foto:", sem, "| 1º:", cod);
  confere(sem > 0 && await pg.evaluate(() => filtrados().every(p => !p.outras.length && !KZ.has(p.k))), "lista mostra os produtos sem foto");
  // imagem de teste 2000x1000 -> deve subir reduzida para 1600x800 JPEG
  const png = await pg.evaluate(() => { const c = document.createElement("canvas"); c.width = 2000; c.height = 1000; c.getContext("2d").fillStyle = "red"; c.getContext("2d").fillRect(0, 0, 2000, 1000); return c.toDataURL("image/png").split(",")[1]; });
  const arqImg = path.join(require("os").tmpdir(), "foto_teste.png"); fs.writeFileSync(arqImg, Buffer.from(png, "base64"));
  const [fc] = await Promise.all([pg.waitForEvent("filechooser"), pg.click(`button[data-colocar="${cod}"]`)]);
  await fc.setFiles(arqImg);
  await pg.waitForFunction(() => __sb.fotos.length === 1);
  const st = await pg.evaluate(() => ({f: __sb.fotos[0], a: Object.values(__sb.arquivos)[0]}));
  confere(st.f.cod === cod && st.f.caminho.startsWith(cod.replace(/[^A-Za-z0-9_-]/g, "_") + "/") && st.a.type === "image/jpeg", "foto enviada ao bucket e registrada em fotos_pedido");
  confere(await pg.evaluate(c => !filtrados().some(p => p.cod === c), cod), "produto sai da lista 'sem foto'");
  await pg.selectOption("#filtro", "kz");
  confere(await pg.$$eval(".ft.kz img", l => l.length) === 1 && /\/storage\/v1\/object\/public\/fotos-pedido\//.test(await pg.getAttribute(".ft.kz img", "src")), "filtro 'colocadas aqui' mostra a foto com o link público");
  await pg.click(".ft.kz button"); await pg.waitForFunction(() => !__sb.fotos.length);
  confere(!(await pg.evaluate(() => Object.keys(__sb.arquivos).length)), "apagar remove do bucket e da tabela");

  // site de pedidos: a foto colocada pela Kapazi aparece primeiro
  const pg2 = await ctx.newPage(); pg2.on("pageerror", e => erros.push(e.message));
  await ctx.route(/supabase\.co\/rest\/v1\/fotos_pedido/, r => r.fulfill({contentType: "application/json", body: JSON.stringify([{cod, caminho: cod + "/1.jpg"}])}));
  await pg2.goto(base + "/"); await pg2.waitForSelector(".prod");
  const p2 = await pg2.evaluate(c => porCod.get(c), cod);
  confere(p2 && /\/storage\/v1\/object\/public\/fotos-pedido\//.test(p2.foto) && p2.fotos[0] === p2.foto, "site de pedidos usa a foto colocada pela Kapazi");
  confere(!erros.length, "sem erros nas páginas" + (erros.length ? ": " + erros.join(" | ") : ""));
  await nav.close(); srv.close();
  console.log(falhas.length ? falhas.length + " FALHA(S)" : "Tudo certo."); process.exit(falhas.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
