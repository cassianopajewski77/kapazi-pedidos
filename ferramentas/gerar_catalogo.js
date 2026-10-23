// Gera a cópia do catálogo do site de pedidos (site/catalogo.json + site/fotos/) a partir da base do gerador.
// Uso: node ferramentas/gerar_catalogo.js <produtos.json> [pasta com fotos.js e fotos_catalogo.js]
//   produtos.json: [{cod, descricao, descricao_es, um, origem, foto_url}, ...] – os produtos ativos do gerador
//   (tabela de preço vigente + produtos cadastrados). Preço NÃO entra na cópia.
// A descrição em espanhol e a unidade usam o mesmo código do gerador (site/traducao.js).
const fs = require("fs"), path = require("path");
const raiz = path.join(__dirname, ".."), SITE = path.join(raiz, "site");
const [entrada, pastaFotos] = process.argv.slice(2);
if(!entrada){ console.error("uso: node ferramentas/gerar_catalogo.js <produtos.json> [pasta das fotos]"); process.exit(1); }
global.window = {};
const T = new Function(fs.readFileSync(path.join(SITE, "traducao.js"), "utf8") + "; return {traduzir, sugerirUnidade};")();
const lista = JSON.parse(fs.readFileSync(entrada, "utf8"));
let F = {}, C = {img: [], map: {}};
if(pastaFotos){
  for(const js of ["fotos.js", "fotos_catalogo.js"]){ const p = path.join(pastaFotos, js); if(fs.existsSync(p)) new Function("window", fs.readFileSync(p, "utf8"))(window); }
  F = window.FOTOS_PADRAO || {}; C = window.FOTOS_CATALOGO || C;
}
// fotos da planilha SKUImagens (site/imagens.json, ferramentas/gerar_imagens.py) têm prioridade
const IMG = fs.existsSync(path.join(SITE, "imagens.json")) ? JSON.parse(fs.readFileSync(path.join(SITE, "imagens.json"), "utf8")) : {base: "", img: {}};
const chave = s => String(s || "").toUpperCase().replace(/[\s.\-\/_]/g, "");
const fotoSku = cod => { const l = IMG.img[chave(cod)] || IMG.img[chave(cod).replace(/^0+/, "")]; return l ? IMG.base + l[0] : ""; };
const dirFotos = path.join(SITE, "fotos");
fs.rmSync(dirFotos, {recursive: true, force: true}); fs.mkdirSync(dirFotos, {recursive: true});
const vistos = new Set(), out = []; let locais = 0;
for(const p of lista){
  if(!p || !p.cod || vistos.has(p.cod)) continue; vistos.add(p.cod);
  const s = T.sugerirUnidade({um: p.um, desc: p.descricao || ""});
  let foto = fotoSku(p.cod) || (/^https:\/\/[^/]+\.digitaloceanspaces\.com\//.test(p.foto_url || "") ? p.foto_url : "");
  if(!foto){
    const d = F[p.cod] || (C.map && C.map[p.cod] != null ? C.img[C.map[p.cod]] : "");
    const m = /^data:image\/(png|jpe?g);base64,(.+)$/.exec(d || "");
    if(m){ const nome = p.cod.replace(/[^A-Za-z0-9_-]/g, "_") + "." + (m[1] === "png" ? "png" : "jpg"); fs.writeFileSync(path.join(dirFotos, nome), Buffer.from(m[2], "base64")); foto = "fotos/" + nome; locais++; }
  }
  const desc = (p.descricao_es || T.traduzir(p.descricao || "")).trim() || p.cod;
  out.push({cod: p.cod, desc, pt: p.descricao && p.descricao !== desc ? p.descricao : "", unidade: s.unidade, base: s.baseFator || "", foto});   // pt: só para a busca
}
fs.writeFileSync(path.join(SITE, "catalogo.json"), JSON.stringify({gerado: new Date().toISOString().slice(0, 10), produtos: out}));
console.log(`${out.length} produtos; ${out.filter(p => p.foto).length} com foto (${locais} em site/fotos)`);
