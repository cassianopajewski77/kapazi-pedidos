# Kapazi Pedidos – Hoja de Pedido para clientes

Site público (espanhol, português e inglês), onde o cliente monta o pedido com os **códigos Kapazi corretos** e baixa um PDF.
É separado do gerador de proforma (Export Docs Pro, uso interno): repositório e site próprios, sem login.
Do banco do gerador ele só lê o catálogo, pela função pública `catalogo_pedido()` (sem preços).

## Como funciona
- `site/index.html`: o cliente preenche os dados da empresa, busca produtos por código ou descrição (com foto),
  informa quantidades e baixa o PDF "Hoja de Pedido". O rascunho fica guardado no navegador dele.
  Link com o cliente já preenchido: `/?cliente=<código>&empresa=<nome>`.
- O PDF leva a marca `KZ-PED v1` e o cabeçalho `CÓDIGO / CANTIDAD`: no gerador de proforma, o
  **Importar pedido do cliente** lê os códigos e quantidades direto (só as linhas com cantidad).
- Catálogo: o site chama `catalogo_pedido()` no Supabase do gerador (`site/config.js`; rode
  `supabase/05_pedido_cliente.sql` uma vez no SQL Editor). Ela devolve só código, descrição, unidade e foto dos
  produtos ativos; preços, clientes e documentos continuam fechados. Produto novo no gerador aparece sozinho.
- `site/produtos_extra.json`: produtos da tabela **ATACADO** (aba COMPLETA) que não estão no gerador, com descrição,
  unidade, medidas e status (fora de linha não entra; lançamento aparece como "Novo"). Sem preço.
  Atualizar: `python3 ferramentas/gerar_produtos.py "<ATACADO - TABELA COMPLETA E RESUMIDA.xlsx>"`.
  No gerador, esses códigos aparecem como "não encontrado" no Importar pedido: marque para incluir como item manual e informe o preço.
- Idiomas: Español, Português e English (seletor no topo; `?lang=pt|en|es` no link). Textos da tela e do PDF e a
  tradução PT -> EN em `site/idiomas.js`; PT -> ES é a do gerador (`site/traducao.js`). O PDF em qualquer idioma
  é lido pelo importador do gerador (cabeçalho CÓDIGO/PRODUCT CODE e CANTIDAD/QUANTIDADE/QUANTITY).
- `site/imagens.json`: todas as fotos de cada código, da planilha **SKUImagens** do site Kapazi (aba Produtos:
  id_variante, cod_erp, imagem_1…imagem_N). A 1ª foto aparece na lista e o cliente vê todas ao tocar na foto.
  Atualizar: `python3 ferramentas/gerar_imagens.py "<SKUImagens.xlsx>"`, depois commit e push.
- `site/catalogo.json` + `site/fotos/`: cópia de reserva (usada se o banco não responder) e fotos extras.
  As fotos do site Kapazi passam pelo `worker/index.js` (`/api/foto`).

## Atualizar a cópia de reserva (opcional)
```
node ferramentas/gerar_catalogo.js <produtos.json> [pasta com fotos.js e fotos_catalogo.js]
```
`produtos.json` = lista `[{cod, descricao, descricao_es, um, origem, foto_url}]` dos produtos ativos do gerador
(tabela de preço vigente + cadastrados). A tradução e a unidade usam o código do gerador
(`site/traducao.js`, copiado do bloco "tradução" do gerador).
Depois é só fazer commit e push: o Cloudflare publica.

## Publicar no Cloudflare
Projeto Workers ligado a este repositório: Build command vazio · Deploy command `npx wrangler deploy` · Root `/`.

## Teste (sem internet)
```
GERADOR="<Gerador de Proforma.html>" LIBS=<pasta com jspdf, jspdf-autotable, pdfjs-dist> [BANCO=<json da catalogo_pedido()>] node testes/teste_pedido.js
```
Preenche a página, baixa o PDF e lê com o mesmo código de importação do gerador (inclui o catálogo inteiro).
