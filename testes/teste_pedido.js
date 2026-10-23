// Teste do site de pedidos (site/index.html), sem internet: usa a cópia do catálogo (site/catalogo.json)
// e o PDF baixado é lido pelo MESMO código de importação do gerador de proforma (lerPdf + processarPedido).
// Uso: GERADOR="/caminho/Gerador de Proforma.html" LIBS=/caminho/libs [BANCO=/caminho/rpc.json] node testes/teste_pedido.js
//   GERADOR: o HTML do gerador (do PC ou o web/gerador.html do export-link)
//   LIBS: pasta com jspdf/dist/jspdf.umd.min.js, jspdf-autotable/dist/jspdf.plugin.autotable.min.js
//         e pdfjs-dist/legacy/build/pdf.js (versões do pedido.html e do gerador)
const {chromium} = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const WEB = path.join(__dirname, "..", "site"), LIBS = process.env.LIBS;
const catalogo = JSON.parse(fs.readFileSync(path.join(WEB, "catalogo.json"), "utf8")).produtos;
const falhas = []; const confere = (cond, msg) => { console.log((cond ? "OK   " : "FALHA") + " " + msg); if(!cond) falhas.push(msg); };

const srv = http.createServer((req, res) => {
  let p = path.join(WEB, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if(p.endsWith(path.sep)) p += "index.html";
  if(!p.startsWith(WEB) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end("404"); }
  res.writeHead(200, {"Content-Type": p.endsWith(".html") ? "text/html; charset=utf-8" : p.endsWith(".js") ? "application/javascript" : p.endsWith(".json") ? "application/json" : "application/octet-stream"});
  fs.createReadStream(p).pipe(res);
}).listen(0);

// importação do gerador, rodando no node com o código copiado do próprio gerador.html
function importadorDoGerador(){
  const html = fs.readFileSync(process.env.GERADOR, "utf8");
  const trecho = (de, ate) => { const i = html.indexOf(de), f = html.indexOf(ate, i); if(i < 0 || f < 0) throw new Error("não achei " + de); return html.slice(i, f); };
  const cod = trecho("const chaveCod = ", "function desenharImport(");
  const pdf = trecho("async function lerPdf(file){", "/* ---------- cadastro de clientes: documentos PDF");
  const norm = html.match(/^const norm = .*$/m)[0];
  const ctx = {resultado: null};
  const fn = new Function("PROD", "pdfjsLib", "ctx", `
    const carregarScript = async () => {}, URL_PDFJS = "", URL_PDFJS_WORKER = "";
    const document = {getElementById: () => ({style: {}})};
    let impLinhas = [], impOrigem = "teste";
    const desenharImport = info => { ctx.resultado = {info, linhas: impLinhas}; };
    ${norm}\n${cod}\n${pdf}
    return {lerPdf, processarPedido};`);
  return {ctx, fn};
}

(async () => {
  const base = `http://localhost:${srv.address().port}`;
  const nav = await chromium.launch();
  const ctx = await nav.newContext({acceptDownloads: true, locale: "es-ES"});
  await ctx.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  // BANCO=<json do catalogo_pedido()>: simula o Supabase do gerador; sem ele o site usa a cópia (catalogo.json)
  let chamadasBanco = 0;
  if(process.env.BANCO) await ctx.route(/supabase\.co\/rest\/v1\/rpc\/catalogo_pedido/, r => { chamadasBanco++; r.fulfill({contentType: "application/json", body: fs.readFileSync(process.env.BANCO)}); });
  await ctx.route(/cdn\.jsdelivr\.net\/npm\/jspdf@/, r => r.fulfill({contentType: "application/javascript", body: fs.readFileSync(path.join(LIBS, "jspdf/dist/jspdf.umd.min.js"))}));
  await ctx.route(/cdn\.jsdelivr\.net\/npm\/jspdf-autotable@/, r => r.fulfill({contentType: "application/javascript", body: fs.readFileSync(path.join(LIBS, "jspdf-autotable/dist/jspdf.plugin.autotable.min.js"))}));
  const pg = await ctx.newPage();
  const erros = []; pg.on("pageerror", e => erros.push(e.message));
  pg.on("dialog", d => { if(d.type() !== "confirm") erros.push("diálogo: " + d.message()); d.accept(); });

  await pg.goto(base + "/?cliente=007700");
  await pg.waitForSelector(".prod");
  const nCat = await pg.evaluate(() => ({total: CAT.length, extra: CAT.filter(p => p.extra).length}));
  console.log("     catálogo:", nCat.total, "produtos,", nCat.extra, "da tabela ATACADO");
  confere(await pg.$$eval(".prod", l => l.length) > 0 && nCat.total - nCat.extra === catalogo.length && nCat.extra > 0, `catálogo carregado (${catalogo.length} do gerador` + (process.env.BANCO ? "" : ", pela cópia") + " + produtos da tabela ATACADO)");
  if(process.env.BANCO) confere(chamadasBanco === 1 && await pg.evaluate(cods => cods.every(c => porCod.get(c).foto), catalogo.filter(p => p.foto).map(p => p.cod)), "lido do banco do gerador, com as fotos extras da cópia");
  confere(await pg.$$eval(".prod", l => l.length) === 40, "lista mostra os primeiros 40 produtos");
  confere(await pg.inputValue("#d_codCliente") === "007700", "?cliente= preenche o código de cliente");

  // fotos da planilha SKUImagens: a 1ª vira a foto do produto e a galeria mostra todas
  const gal = await pg.evaluate(() => { const p = CAT.find(p => p.fotos.length > 2); if(!p) return null; abrirFotos(p); return {n: p.fotos.length, mini: document.querySelectorAll("#zoomM img").length, src: document.getElementById("zoomI").getAttribute("src")}; });
  confere(gal && gal.mini === gal.n && /^\/api\/foto\?url=/.test(gal.src), `galeria com todas as fotos do produto (${gal && gal.n})`);
  await pg.evaluate(() => zoom.close());
  console.log("     produtos com foto:", await pg.evaluate(() => CAT.filter(p => p.foto).length + " de " + CAT.length));

  // busca por código e por descrição em espanhol
  const c1 = catalogo.find(p => p.unidade === "PIEZA").cod, c2 = await pg.evaluate(() => CAT.find(p => p.extra && p.unidade === "ROLLO" && /,/.test(p.pt)).cod);
  await pg.fill("#q", c1); await pg.waitForTimeout(300);
  confere(await pg.$eval(".prod .cod", e => e.textContent) === c1, `buscar o código ${c1} traz o produto primeiro`);
  await pg.fill(`.prod[data-cod="${c1}"] input`, "12");
  confere(await pg.isVisible(`.prod[data-cod="${c1}"] .conf`) && await pg.evaluate(c => !itens[c], c1), "quantidade digitada mostra Confirmar producto e ainda não entra no pedido");
  await pg.click(`.prod[data-cod="${c1}"] .conf`);
  confere(await pg.evaluate(c => itens[c] && itens[c].qtd === 12, c1) && !(await pg.isVisible(`.prod[data-cod="${c1}"] .conf`)) && await pg.isVisible(`.prod[data-cod="${c1}"] .noped`), "confirmar inclui o produto e mostra En el pedido");
  await pg.fill("#q", "cesped"); await pg.waitForTimeout(300);
  const ces = await pg.$$eval(".prod", l => l.map(e => e.dataset.cod + " " + e.querySelector(".desc").textContent));
  confere(ces.length > 0 && ces.every(t => /CÉSPED/i.test(t)), `busca "cesped" (sem acento) acha ${ces.length} produto(s) de césped`);
  const c3 = ces[0].split(" ")[0];
  for(let i = 0; i < 3; i++) await pg.click(`.prod[data-cod="${c3}"] button[data-d="1"]`);
  await pg.click(`.prod[data-cod="${c3}"] .conf`);
  await pg.fill("#q", c2); await pg.waitForTimeout(300);
  await pg.fill(`.prod[data-cod="${c2}"] input`, "2,5");
  await pg.press(`.prod[data-cod="${c2}"] input`, "Enter");
  confere(/3 producto/.test(await pg.textContent("#resumen")), "barra mostra 3 produtos selecionados");

  // sem os dados obrigatórios não baixa: marca os campos
  await pg.click("#revisar"); await pg.click("#pdf");
  confere(await pg.$$eval(".falta", l => l.length) === 11, "todos os campos são obrigatórios: marca os 11 vazios e não gera PDF");
  await pg.fill("#d_empresa", "Alfombras del Sur S.A."); await pg.fill("#d_pais", "Chile"); await pg.fill("#d_contacto", "María Núñez");
  await pg.fill("#d_email", "compras@alfombrasdelsur.cl"); await pg.fill("#d_oc", "OC-2026/118");
  await pg.fill("#d_docFiscal", "76.123.456-7"); await pg.fill("#d_ciudad", "Santiago"); await pg.fill("#d_direccion", "Av. Providencia 1234"); await pg.fill("#d_telefono", "+56 9 1234 5678"); await pg.fill("#d_destino", "San Antonio");
  await pg.click("#revisar"); await pg.click("#pdf");
  confere(await pg.$$eval(".falta", l => l.map(e => e.id).join()) === "d_incoterm", "faltando só o Incoterm, ainda não gera o PDF");
  await pg.selectOption("#d_incoterm", "CIF");
  // recarregar: os itens voltam, "Sus datos" abre em branco e o botão recupera os dados guardados
  await pg.reload(); await pg.waitForSelector(".prod");
  confere(/3 producto/.test(await pg.textContent("#resumen")) && await pg.inputValue("#d_empresa") === "" && await pg.isVisible("#usarDatos"), "ao abrir, os itens voltam e Sus datos está em branco (com o botão Usar mis datos guardados)");
  await pg.click("#usarDatos");
  confere(await pg.inputValue("#d_empresa") === "Alfombras del Sur S.A." && await pg.inputValue("#d_incoterm") === "CIF", "Usar mis datos guardados preenche todos os campos");

  await pg.click("#revisar");
  await pg.fill(`#revTb tr[data-cod="${c3}"] input[data-f="obs"]`, "verde oscuro");
  await pg.fill("#obsGeneral", "Embarque deseado: enero 2027.\nEtiquetas en español.");
  const [dl] = await Promise.all([pg.waitForEvent("download"), pg.click("#pdf")]);
  const arq = path.join(require("os").tmpdir(), "pedido_teste.pdf"); await dl.saveAs(arq);
  console.log("     PDF:", dl.suggestedFilename(), fs.statSync(arq).size, "bytes");
  const num = await pg.evaluate(() => numero);
  confere(/^OC-AS-\d{6}-\d{4}$/.test(num) && dl.suggestedFilename() === `Pedido Kapazi ${num} - Alfombras del Sur S.A..pdf` && (await pg.textContent("#numeroOC")) === num, `nº da ordem de compra criado (${num}), na tela e no nome do PDF`);

  // pedidos salvos: novo pedido mantém os dados do cliente; abrir pela lista e pelo PDF devolve o pedido
  const antes = await pg.evaluate(() => JSON.stringify(itens));
  await pg.evaluate(() => dlgRev.close());
  await pg.click("#btnPedidos"); await pg.click("#btnNovo");
  confere(await pg.evaluate(() => !Object.keys(itens).length && !numero) && await pg.inputValue("#d_empresa") === "Alfombras del Sur S.A.", "novo pedido limpa os produtos e mantém os dados do cliente");
  await pg.reload(); await pg.waitForSelector(".prod");
  confere(await pg.inputValue("#d_contacto") === "", "recarregar abre Sus datos em branco");
  await pg.click("#usarDatos");
  confere(await pg.inputValue("#d_contacto") === "María Núñez", "dados do cliente continuam guardados e voltam pelo botão");
  await pg.click("#btnPedidos");
  confere(await pg.$$eval("#pedTb tr", l => l.length) === 1 && (await pg.textContent("#pedTb")).includes(num), "lista Mis pedidos mostra o pedido salvo");
  await pg.click('#pedTb button[data-a="abrir"]');
  confere(await pg.evaluate(() => JSON.stringify(itens)) === antes && await pg.evaluate(() => numero) === num, "abrir pela lista devolve itens e número");
  await pg.evaluate(() => { itens = {}; numero = ""; LS.set("kz_pedidos_v1", []); resumo(); });
  await pg.click("#btnPedidos");
  await pg.setInputFiles("#pedArquivo", arq);
  await pg.waitForFunction(() => Object.keys(itens).length === 3);
  confere(await pg.evaluate(() => JSON.stringify(itens)) === antes && await pg.evaluate(() => numero + "|" + document.getElementById("obsGeneral").value) === num + "|Embarque deseado: enero 2027.\nEtiquetas en español.", "abrir o PDF baixado devolve o pedido (itens, número e observações)");
  // visualizar: prévia do PDF na página
  await pg.click("#revisar"); await pg.click("#ver");
  await pg.waitForFunction(() => document.getElementById("dlgVer").open && /^blob:/.test(document.getElementById("verPdf").src));
  confere(true, "visualizar pedido abre a prévia do PDF");
  // imprimir: o PDF vai para um iframe escondido e chama print() 
  await pg.evaluate(() => dlgVer.close());
  await pg.click("#imprimir");
  await pg.waitForFunction(() => { const f = document.getElementById("printPdf"); return f && /^blob:/.test(f.src); });
  await pg.waitForTimeout(500);
  confere(await pg.evaluate(() => !!document.getElementById("printPdf") && document.getElementById("imprimir").textContent === "Imprimir PDF" && document.getElementById("verImprimir").textContent === "Imprimir PDF"), "botão Imprimir PDF gera o PDF e abre a impressão (também dentro da prévia)");
  await pg.evaluate(() => { dlgVer.close(); dlgRev.close(); });
  await pg.screenshot({path: path.join(require("os").tmpdir(), "pedido_tela.png"), fullPage: false});

  // o importador do gerador lê o PDF
  const pdfjsLib = require(path.join(LIBS, "pdfjs-dist/legacy/build/pdf.js"));
  const PROD = catalogo.map((p, i) => ({cod: p.cod, desc: p.pt || p.desc, um: "", preco: 1, _i: i}));
  const {ctx: res, fn} = importadorDoGerador(), imp = fn(PROD, pdfjsLib, res);
  const buf = fs.readFileSync(arq);
  const {linhas} = await imp.lerPdf({arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length)});
  if(process.env.DEBUG) linhas.forEach(l => console.log("   ", l.origem, JSON.stringify(l.celulas)));
  imp.processarPedido(linhas);
  const r = res.resultado, got = r.linhas.map(l => [l.codTxt, l.qtd, l.qtdLida]);
  console.log("     importador:", r.info, JSON.stringify(got));
  confere(/^Hoja de pedido Kapazi: 3 produto/.test(r.info), "gerador reconhece a Hoja de pedido (marca KZ-PED + cabeçalho)");
  confere(JSON.stringify(got) === JSON.stringify([[c1, 12, true], [c3, 3, true], [c2, 2.5, true]]), "códigos e quantidades exatos (12, 3 e 2,5)");
  confere(r.linhas.filter(l => l.usar).length === 2 && !r.linhas[2].opcoes.length, "produtos do gerador entram direto; o da tabela ATACADO fica para incluir como item manual");

  // catálogo inteiro: várias páginas, cabeçalho repetido não vira item
  await pg.evaluate(() => { dlgRev.close(); CAT.forEach((p, i) => { itens[p.cod] = {qtd: i + 1, obs: ""}; }); });
  await pg.click("#revisar");
  const [dl2] = await Promise.all([pg.waitForEvent("download"), pg.click("#pdf")]);
  const arq2 = path.join(require("os").tmpdir(), "pedido_teste2.pdf"); await dl2.saveAs(arq2);
  const b2 = fs.readFileSync(arq2), l2 = await imp.lerPdf({arrayBuffer: async () => b2.buffer.slice(b2.byteOffset, b2.byteOffset + b2.length)});
  imp.processarPedido(l2.linhas);
  const r2 = res.resultado, esperado = await pg.evaluate(() => CAT.filter(p => itens[p.cod]).map(p => [p.cod, itens[p.cod].qtd]));
  const lidos = r2.linhas.map(l => [l.codTxt, l.qtd]);
  console.log("     pedido grande:", r2.info, "|", lidos.length, "itens");
  confere(JSON.stringify(lidos) === JSON.stringify(esperado), `catálogo inteiro (${esperado.length} itens, várias páginas) importa igual`);

  // português e inglês: tela traduzida e PDF que o gerador também lê
  for(const [l, titulo] of [["pt", "Folha de Pedido Kapazi"], ["en", "Kapazi Order Sheet"]]){
    await pg.evaluate(() => { dlgRev.close(); Object.keys(itens).forEach(k => delete itens[k]); });
    await pg.selectOption("#idioma", l);
    confere(await pg.textContent("h1") === titulo && await pg.evaluate(() => document.documentElement.lang) === l, `tela em ${l}: "${titulo}"`);
    const amostra = await pg.evaluate(() => CAT.filter(p => /PRETO|TAPETE DE BANHEIRO|C\/\d/.test(p.pt)).slice(0, 3).map(p => p.pt + "  ->  " + descEm(p)));
    amostra.forEach(a => console.log(`     ${l}:`, a));
    await pg.evaluate(([a, b, c]) => { itens[a] = {qtd: 7, obs: ""}; itens[b] = {qtd: 1.5, obs: ""}; itens[c] = {qtd: 40, obs: ""}; resumo(); }, [c1, c3, c2]);
    await pg.click("#revisar");
    const [d] = await Promise.all([pg.waitForEvent("download"), pg.click("#pdf")]);
    const a3 = path.join(require("os").tmpdir(), `pedido_${l}.pdf`); await d.saveAs(a3);
    const b3 = fs.readFileSync(a3), l3 = await imp.lerPdf({arrayBuffer: async () => b3.buffer.slice(b3.byteOffset, b3.byteOffset + b3.length)});
    imp.processarPedido(l3.linhas);
    const g3 = res.resultado.linhas.map(x => [x.codTxt, x.qtd]).sort().join(";"), e3 = [[c1, 7], [c3, 1.5], [c2, 40]].sort().join(";");
    console.log(`     PDF ${l}:`, d.suggestedFilename(), "|", res.resultado.info);
    confere(/^Hoja de pedido Kapazi: 3 produto/.test(res.resultado.info) && g3 === e3, `PDF em ${l} importa no gerador com códigos e quantidades exatos`);
  }

  confere(!erros.length, "sem erros na página" + (erros.length ? ": " + erros.join(" | ") : ""));
  await nav.close(); srv.close();
  console.log(falhas.length ? `\n${falhas.length} FALHA(S)` : "\nTudo certo.");
  process.exit(falhas.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
