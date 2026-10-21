# Kapazi Pedidos – Hoja de Pedido para clientes

Site público, em espanhol, onde o cliente monta o pedido com os **códigos Kapazi corretos** e baixa um PDF.
É separado do gerador de proforma (Export Docs Pro, uso interno): não tem login e não acessa o banco interno.

## Como funciona
- `site/index.html`: o cliente preenche os dados da empresa, busca produtos por código ou descrição (com foto),
  informa quantidades e baixa o PDF "Hoja de Pedido". O rascunho fica guardado no navegador dele.
  Link com o cliente já preenchido: `/?cliente=<código>&empresa=<nome>`.
- O PDF leva a marca `KZ-PED v1` e o cabeçalho `CÓDIGO / CANTIDAD`: no gerador de proforma, o
  **Importar pedido do cliente** lê os códigos e quantidades direto (só as linhas com cantidad).
- `site/catalogo.json` + `site/fotos/`: **cópia** do catálogo do gerador, sem preços (código, descrição em
  espanhol, unidade, foto). As fotos do site Kapazi passam pelo `worker/index.js` (`/api/foto`).

## Atualizar o catálogo (quando os produtos do gerador mudarem)
```
node ferramentas/gerar_catalogo.js <produtos.json> [pasta com fotos.js e fotos_catalogo.js]
```
`produtos.json` = lista `[{cod, descricao, descricao_es, um, origem, foto_url}]` dos produtos ativos do gerador
(tabela de preço vigente + cadastrados). A tradução e a unidade usam o código do gerador
(`ferramentas/traducao_gerador.js`, copiado do bloco "tradução" do gerador).
Depois é só fazer commit e push: o Cloudflare publica.

## Publicar no Cloudflare
Projeto Workers ligado a este repositório: Build command vazio · Deploy command `npx wrangler deploy` · Root `/`.

## Teste (sem internet)
```
GERADOR="<Gerador de Proforma.html>" LIBS=<pasta com jspdf, jspdf-autotable, pdfjs-dist> node testes/teste_pedido.js
```
Preenche a página, baixa o PDF e lê com o mesmo código de importação do gerador (inclui o catálogo inteiro).
