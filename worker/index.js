// Cloudflare Worker do site de pedidos. Os arquivos do site (pasta site/) são servidos direto
// pelo Cloudflare (static assets); este código só roda para /api/foto?url=... : busca a foto do
// produto do site Kapazi, que o navegador não consegue ler direto do digitaloceanspaces por causa do CORS.
// Mesma regra do ajudante do PC: só https e só *.digitaloceanspaces.com.
export default {
  async fetch(request, env){
    const url = new URL(request.url);
    if(url.pathname !== "/api/foto") return env.ASSETS.fetch(request);
    let u;
    try{ u = new URL(url.searchParams.get("url") || ""); }catch(e){ return new Response("endereço inválido", {status:400}); }
    if(u.protocol !== "https:" || !u.hostname.endsWith(".digitaloceanspaces.com")) return new Response("endereço de foto não permitido", {status:400});
    const r = await fetch(u.toString(), {cf:{cacheTtl:86400 * 30, cacheEverything:true}});
    if(!r.ok) return new Response("foto não encontrada", {status:r.status});
    const tipo = r.headers.get("Content-Type") || "image/jpeg";
    if(!tipo.startsWith("image/")) return new Response("não é imagem", {status:415});
    return new Response(r.body, {headers:{"Content-Type":tipo, "Cache-Control":"public, max-age=2592000"}});
  }
};
