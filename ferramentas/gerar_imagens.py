# Gera site/imagens.json a partir da planilha de imagens do site Kapazi (SKUImagens, aba "Produtos":
# id_variante, id_produto, cod_erp, imagem_1 ... imagem_N). Todas as fotos de cada código, na ordem.
# Uso: python3 ferramentas/gerar_imagens.py "<SKUImagens.xlsx>"
import json, os, re, sys
import openpyxl

chave = lambda s: re.sub(r"[\s.\-/_]", "", str(s or "").upper())
wb = openpyxl.load_workbook(sys.argv[1], read_only=True)
ws = wb["Produtos"] if "Produtos" in wb.sheetnames else wb.worksheets[0]
linhas = ws.iter_rows(values_only=True)
cab = [str(c or "").strip().lower() for c in next(linhas)]
i_var, i_erp = cab.index("id_variante"), cab.index("cod_erp") if "cod_erp" in cab else None
i_img = [i for i, c in enumerate(cab) if c.startswith("imagem_")]
urls = {}
for r in linhas:
    imgs = [str(r[i]).strip() for i in i_img if i < len(r) and r[i] and str(r[i]).startswith("https://")]
    if not r[i_var] or not imgs: continue
    for cod in {r[i_var], r[i_erp] if i_erp is not None else None} - {None, ""}:
        urls.setdefault(chave(cod), imgs)
# prefixo comum (a pasta do site) guardado uma vez só: o arquivo fica bem menor
todas = [u for l in urls.values() for u in l]
base = os.path.commonprefix(todas)
base = base[:base.rfind("/") + 1]
saida = os.path.join(os.path.dirname(__file__), "..", "site", "imagens.json")
json.dump({"base": base, "img": {k: [u[len(base):] for u in l] for k, l in sorted(urls.items())}}, open(saida, "w"), separators=(",", ":"))
print(f"{len(urls)} códigos com foto, {len(todas)} fotos; base {base}; {os.path.getsize(saida) // 1024} KB")
