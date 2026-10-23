// Idiomas do site de pedidos: textos da tela e do PDF (es/pt/en) e tradução PT -> EN das descrições.
// A tradução PT -> ES é a do gerador de proforma (traducao.js); esta segue o mesmo modelo (dicionário simples).
"use strict";
const IDIOMAS = {es: "Español", pt: "Português", en: "English"};

/* ---------- PT -> EN (frases antes das palavras; nomes de linha e marcas ficam como estão) ---------- */
const DIC_EN = [
  // frases
  ["TAPETE DE BANHEIRO","BATH MAT"],["TAPETE DE MINERACAO","MINING MAT"],["VINIL PINTADO","PAINTED VINYL"],["TAPETE DE ENTRADA","DOORMAT"],["TAPETE KIDS","KIDS MAT"],["TAPETE INFANTIL","KIDS MAT"],
  ["TAPETE ANTIFADIGA","ANTI-FATIGUE MAT"],["TOALHA DE MESA","TABLECLOTH"],["GRAMA SINTETICA","ARTIFICIAL GRASS"],["GRAMA SINTÉTICA","ARTIFICIAL GRASS"],
  ["PISO VINILICO","VINYL FLOORING"],["PISO LAMINADO VINILICO","LAMINATED VINYL FLOORING"],["PISO VINÍLICO","VINYL FLOORING"],
  ["PROTEPISO FLEXIVEL","FLEXIBLE FLOOR PROTECTOR"],["PROTEPISO","FLOOR PROTECTOR"],["FIBRA DE COCO","COCONUT FIBER"],
  ["BEM VINDOS","WELCOME"],["BEM VINDO","WELCOME"],["BASE FUNDIDA","CAST BACKING"],["BORDA REBAIXADA","BEVELED EDGE"],["BORDA FLEX","FLEX EDGE"],
  ["AZUL MARINHO","NAVY BLUE"],["AZUL ROYAL","ROYAL BLUE"],["VERDE MUSGO","MOSS GREEN"],["ROSA BEBE","BABY PINK"],["SEM RESINA","WITHOUT RESIN"],
  ["EM ROLO","IN ROLL"],["EM PLACA","IN TILES"],["EM REGUA","IN PLANKS"],["P/ CORTE","FOR CUTTING"],["PARA CORTE","FOR CUTTING"],
  ["HORA DO LANCHE","SNACK TIME"],["CAFE EXPRESSO","ESPRESSO"],["DEMARCACAO TATIL","TACTILE MARKING"],["CLUBE DO CHURRASCO","BARBECUE CLUB"],
  ["OLHO GREGO","GREEK EYE"],["ARCO IRIS","RAINBOW"],["MORA AQUI","LIVES HERE"],["DOCE LAR","SWEET HOME"],["MELHORES AVOS","BEST GRANDPARENTS"],
  ["NAS NUVENS","IN THE CLOUDS"],["PALMA DA MAO","PALM OF THE HAND"],["NOVA IORQUE","NEW YORK"],["PIC NIC","PICNIC"],["MEIO FIO","CURB"],
  ["QUEBRA NOZES","NUTCRACKER"],["FERRO DE SOLDA","SOLDERING IRON"],["JOGO AMERICANO","PLACEMAT"],["DIA DA NOIVA","BRIDE'S DAY"],
  ["PLASTICO PVC","PVC PLASTIC"],["COM PAPEL","WITH PAPER"],["TELHA TERMICA","THERMAL TILE"],["FITA ADESIVA","ADHESIVE TAPE"],
  ["MANTA DE","SHEET OF"],["KIT C/","KIT W/"],["C/","W/"],["S/","W/O "],
  // palavras
  ["TAPETES","MATS"],["TAPETE","MAT"],["PASSADEIRA","RUNNER"],["CAPACHO","DOORMAT"],["TOALHAS","TABLECLOTHS"],["TOALHA","TABLECLOTH"],
  ["VINIL","VINYL"],["VINILICOS","VINYL"],["VINILICO","VINYL"],["VINILICA","VINYL"],["VINÍLICO","VINYL"],["VINÍLICA","VINYL"],
  ["PISOS","FLOORS"],["PISO","FLOOR"],["BORDA","EDGE"],["BASE","BACKING"],["FUNDIDA","CAST"],["REBAIXADA","BEVELED"],["ENTRADA","ENTRANCE"],
  ["MESA","TABLE"],["BANHEIRO","BATHROOM"],["COZINHA","KITCHEN"],["GRAMAS","GRASSES"],["GRAMA","GRASS"],["MANTA","SHEET"],["TELA","MESH"],
  ["ROLOS","ROLLS"],["ROLO","ROLL"],["PECAS","PIECES"],["PEÇAS","PIECES"],["PCS","PCS"],["REGUAS","PLANKS"],["REGUA","PLANK"],["PLACA","TILE"],
  ["CAIXA","BOX"],["LATA","CAN"],["GALAO","GALLON"],["LITROS","LITERS"],["KILOS","KILOS"],["FARDO","BALE"],
  ["PRETOS","BLACK"],["PRETAS","BLACK"],["PRETO","BLACK"],["PRETA","BLACK"],["BRANCO","WHITE"],["BRANCA","WHITE"],["CINZA","GRAY"],["AZUIS","BLUE"],["AZUL","BLUE"],
  ["VERDE","GREEN"],["VERMELHO","RED"],["VERMELHA","RED"],["AMARELO","YELLOW"],["AMARELA","YELLOW"],["MARROM","BROWN"],["BEGE","BEIGE"],["LARANJA","ORANGE"],
  ["ROSA","PINK"],["ROXO","PURPLE"],["GRAFITE","GRAPHITE"],["PRATA","SILVER"],["OURO","GOLD"],["BRONZE","BRONZE"],["BORDO","BURGUNDY"],["MUSGO","MOSS"],
  ["MARINHO","NAVY"],["CRU","RAW"],["CLARO","LIGHT"],["TURQUESA","TURQUOISE"],["MENTA","MINT"],["OLIVA","OLIVE"],["AREIA","SAND"],["CHOCOLATE","CHOCOLATE"],
  ["TRANSPARENTE","TRANSPARENT"],["TRANSP","TRANSP"],["CRISTAL","CRYSTAL"],["COLORIDA","COLORFUL"],["COLORIDO","COLORFUL"],["CORES","COLORS"],["COR","COLOR"],
  ["MULTICOLOR","MULTICOLOR"],["METALIZADA","METALLIC"],["METALICA","METALLIC"],["METALICO","METALLIC"],["PEROLIZADA","PEARLY"],["BRILHO","GLOSS"],
  ["PINTADO","PAINTED"],["PINTADA","PAINTED"],["IMPRESSO","PRINTED"],["LISO","PLAIN"],["LISA","PLAIN"],["LISTRAS","STRIPES"],["XADREZ","PLAID"],["POAS","POLKA DOTS"],
  ["TINTA","PAINT"],["PINTURA","PAINTING"],["RESINA","RESIN"],["COLA","GLUE"],["ADITIVO","ADDITIVE"],["SANITIZANTE","SANITIZER"],
  ["FIBRA","FIBER"],["COCO","COCONUT"],["SISAL","SISAL"],["JUTA","JUTE"],["LINHO","LINEN"],["TECIDO","FABRIC"],["PALHA","STRAW"],["VIME","WICKER"],["BAMBU","BAMBOO"],
  ["MADEIRA","WOOD"],["CARVALHO","OAK"],["NOGUEIRA","WALNUT"],["CEDRO","CEDAR"],["CIMENTO","CEMENT"],["MARMORE","MARBLE"],["CERAMICA","CERAMIC"],["AZULEJOS","TILES"],["AZULEJO","TILE"],
  ["ALUMINIO","ALUMINUM"],["FERRO","IRON"],["BORRACHA","RUBBER"],["EMBORRACHADO","RUBBERIZED"],["POLIAMIDA","POLYAMIDE"],["PLASTICO","PLASTIC"],["PAPEL","PAPER"],
  ["ANTIDERRAPANTE","NON-SLIP"],["ANTIDER","NON-SLIP"],["ANTIFADIGA","ANTI-FATIGUE"],["FLEXIVEL","FLEXIBLE"],["SINTETICA","SYNTHETIC"],["SINTETICO","SYNTHETIC"],
  ["AGULHADO","NEEDLE-PUNCHED"],["MINERACAO","MINING"],["INDUSTRIAL","INDUSTRIAL"],["COMERCIAL","COMMERCIAL"],["RESIDENCIAL","RESIDENTIAL"],["MULTIUSO","MULTIPURPOSE"],
  ["TATIL","TACTILE"],["DIRECIONAL","DIRECTIONAL"],["ALERTA","WARNING"],["DEMARCACAO","MARKING"],["PISTA","TRACK"],["RAMPA","RAMP"],
  ["EXPOSITOR","DISPLAY STAND"],["SUPORTE","STAND"],["ESTANTE","SHELF"],["BANCADA","WORKBENCH"],["PIA","SINK"],["ACABAMENTO","FINISHING"],["INSTALACAO","INSTALLATION"],
  ["MODULO","MODULE"],["RETANGULAR","RECTANGULAR"],["QUADRADO","SQUARE"],["QUADRADA","SQUARE"],["QUADRADOS","SQUARES"],["REDONDO","ROUND"],["REDONDA","ROUND"],
  ["OVAL","OVAL"],["HEXAGONAL","HEXAGONAL"],["CIRCULOS","CIRCLES"],["TRIANGULOS","TRIANGLES"],["LOSANGOS","DIAMONDS"],["GEOMETRICO","GEOMETRIC"],["ABSTRATO","ABSTRACT"],["ABSTRATOS","ABSTRACT"],
  ["LINHAS","LINES"],["LINHA","LINE"],["FORMAS","SHAPES"],["MOSAICO","MOSAIC"],["ARABESCO","ARABESQUE"],["ARABE","ARABIC"],["DEGRADE","GRADIENT"],["TEXTURA","TEXTURE"],
  ["FLORES","FLOWERS"],["FLOR","FLOWER"],["FLORAL","FLORAL"],["FLORAIS","FLORAL"],["FOLHAS","LEAVES"],["FOLHAGEM","FOLIAGE"],["JARDIM","GARDEN"],["FLORESTA","FOREST"],["NATUREZA","NATURE"],
  ["CACTOS","CACTI"],["ORQUIDEAS","ORCHIDS"],["MARGARIDAS","DAISIES"],["PRIMAVERA","SPRING"],["OUTONO","AUTUMN"],["NUVEM","CLOUD"],["NUVENS","CLOUDS"],["ESTRELAS","STARS"],
  ["CORACOES","HEARTS"],["CORACAO","HEART"],["AMOR","LOVE"],["CARINHO","AFFECTION"],["LAR","HOME"],["CASA","HOUSE"],["CASINHA","LITTLE HOUSE"],["CIDADE","CITY"],
  ["BANDEIRA","FLAG"],["CACHORRO","DOG"],["CAO","DOG"],["GATO","CAT"],["GALINHAS","HENS"],["GALINHA","HEN"],["CORUJAS","OWLS"],["BORBOLETA","BUTTERFLY"],["ARARA","MACAW"],["DINOSSAURO","DINOSAUR"],
  ["PEGADAS","FOOTPRINTS"],["LIMOES","LEMONS"],["LIMAO","LEMON"],["CITRICO","CITRUS"],["FRUTAS","FRUITS"],["PIMENTAS","PEPPERS"],["ABACAXI","PINEAPPLE"],["CAFE","COFFEE"],
  ["CERVEJA","BEER"],["VINHO","WINE"],["CHURRASCO","BARBECUE"],["CHURRASQUEIRA","BARBECUE GRILL"],["TALHERES","CUTLERY"],["CAFETERIA","COFFEE SHOP"],
  ["NATAL","CHRISTMAS"],["FESTA","PARTY"],["RENAS","REINDEER"],["FUTEBOL","SOCCER"],["FAZENDINHA","LITTLE FARM"],["BONECA","DOLL"],["ASTRONAUTA","ASTRONAUT"],
  ["ALFABETO","ALPHABET"],["NUMEROS","NUMBERS"],["VOGAIS","VOWELS"],["BLOCOS","BLOCKS"],["LABIRINTO","MAZE"],["AMARELINHA","HOPSCOTCH"],["COLMEIA","HONEYCOMB"],["MAGICO","MAGIC"],
  ["INFANTIL","KIDS"],["BEBE","BABY"],["PAI","FATHER"],["PISCINA","POOL"],["PAISAGISMO","LANDSCAPING"],["PAREDE","WALL"],["LOJA","STORE"],["OBRAS","CONSTRUCTION"],
  ["DECORATIVA","DECORATIVE"],["DECORATIVO","DECORATIVE"],["PERSONALIZADO","CUSTOM"],["PERSONALIZADA","CUSTOM"],["CLASSICO","CLASSIC"],["CLASSICA","CLASSIC"],["CLASSICAS","CLASSIC"],
  ["CONECTADO","INTERLOCKING"],["CONECTADA","INTERLOCKING"],["MOLDURA","FRAME"],["TRANCADO","BRAIDED"],["RUSTICA","RUSTIC"],["ESPECIAL","SPECIAL"],["DELICADO","DELICATE"],
  ["PEQUENO","SMALL"],["MEDIO","MEDIUM"],["GRANDE","LARGE"],["NOVO","NEW"],["NOVA","NEW"],["SORTIDAS","ASSORTED"],["DIVERSOS","ASSORTED"],["DIVERSAS","ASSORTED"],
  ["MAQUINAS","MACHINES"],["MAQUINA","MACHINE"],["MAQ","MACH."],["AEROGRAFOS","AIRBRUSHES"],["AEROGRAFO","AIRBRUSH"],["PISTOLA","SPRAY GUN"],["RESERVATORIO","TANK"],["PONTEIRA","TIP"],["GRAMPO","STAPLE"],
  ["NACIONAL","DOMESTIC"],["NAC","NAT"],["IMPORTADO","IMPORTED"],["IMP","IMP"],
  ["EM","IN"],["COM","WITH"],["SEM","WITHOUT"],["PARA","FOR"],["E","AND"],["DE","OF"],["DO","OF THE"],["DA","OF THE"],["DOS","OF THE"],["DAS","OF THE"],["NA","IN THE"],["NO","IN THE"]
];
const DIC_EN_RE = DIC_EN.map(([pt, en]) => [new RegExp("(?<=[\\s(/])" + pt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=[\\s)/,.])", "g"), en]);
function traduzirEN(s){
  let t = " " + String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase() + " ";
  t = t.replace(/(?<=\s)C\/(?=\d)/g, "W/").replace(/(?<=\s)S\/(?=\d)/g, "W/O ");
  DIC_EN_RE.forEach(([re, en]) => { t = t.replace(re, en); });
  return t.replace(/\s+/g, " ").replace(/\bW\/O\s+/g, "W/O ").trim();
}

/* ---------- unidades e "m² por rollo" em cada idioma (o gerador sugere em espanhol) ---------- */
const UNID = {
  pt: {PIEZA: "PEÇA", ROLLO: "ROLO", METRO: "METRO", UNIDAD: "UNIDADE", CAJA: "CAIXA", LATA: "LATA", KIT: "KIT", JUEGO: "JOGO", "M²": "M²"},
  en: {PIEZA: "PIECE", ROLLO: "ROLL", METRO: "METER", UNIDAD: "UNIT", CAJA: "BOX", LATA: "CAN", KIT: "KIT", JUEGO: "SET", "M²": "M²"}
};
const unidadeEm = (u, l) => (UNID[l] && UNID[l][u]) || u;
const baseEm = (b, l) => !b || l === "es" ? b || "" : l === "pt"
  ? b.replace("m lineales por rollo", "m lineares por rolo").replace("por rollo", "por rolo")
  : b.replace(/([\d,]+) m lineales por rollo/, "$1 linear m per roll").replace("por rollo", "per roll");

/* ---------- textos da tela e do PDF ---------- */
const TXT = {
  es: {
    numero: "Orden de compra Nº", nuevoNum: "(se crea al guardar)", guardarBtn: "Guardar pedido", misPedidos: "Mis pedidos", guardado: n => `Pedido ${n} guardado en este navegador.`,
    pedTitulo: "Mis pedidos", pedAyuda: "Pedidos guardados en este navegador. También puede abrir un PDF descargado de este sitio (por ejemplo, en otra computadora).",
    pedVacio: "Todavía no hay pedidos guardados.", abrir: "Abrir", borrar: "Eliminar", nuevoPed: "Nuevo pedido", abrirPdf: "Abrir PDF de un pedido",
    confNuevo: "¿Empezar un pedido nuevo? Los productos elegidos se vaciarán (sus datos se mantienen). Guarde antes si lo necesita.",
    confAbrir: "¿Abrir este pedido? El pedido en pantalla será reemplazado (guárdelo antes si lo necesita).", confBorrar: n => `¿Eliminar el pedido ${n} de este navegador?`,
    pdfInvalido: "Este PDF no fue generado por este sitio (o es de una versión anterior) y no se puede abrir.", productos_n: n => `${n} producto(s)`,
    visualizar: "Visualizar pedido", cerrar: "Cerrar",
    titulo: "Hoja de Pedido Kapazi", sub: "Exportación · elija los productos por código, descripción o foto", idioma: "Idioma",
    datos: "1. Sus datos", datosAyuda: "Los campos con * son obligatorios. Los datos quedan guardados en este navegador para su próximo pedido.",
    productos: "2. Productos", productosAyuda: "Busque por código Kapazi o por descripción (ej.: vinílica 60x40, césped, 380203) e indique la cantidad. Toque la foto para ampliarla.",
    buscar: "Buscar código o descripción…", soloSel: "Ver solo seleccionados", verTodos: "Ver todos los productos", todos: "Todos", cargando: "Cargando catálogo…",
    mas: n => `Mostrar más productos (${n} más)`, ninguno: "Ningún producto encontrado. Pruebe con otra palabra o con el código.", ningunoSel: "Todavía no eligió productos.",
    sinFoto: "sin foto", fotos: n => `${n} fotos`, nuevo: "Nuevo", saliendo: "Últimas unidades",
    resumen: n => n ? `${n} producto(s) seleccionado(s)` : "Ningún producto seleccionado", revisar: "Revisar y descargar PDF",
    revTitulo: "Revisar pedido", cod: "Código", desc: "Descripción", unidad: "Unidad", cant: "Cantidad", obs: "Observación", opcional: "opcional", quitar: "Quitar",
    obsGen: "Observaciones generales del pedido", obsGenPh: "Ej.: fecha deseada de embarque, mezcla de colores, etiquetado…",
    seguir: "Seguir eligiendo", descargar: "Descargar PDF del pedido", generando: "Generando PDF…",
    completar: "Complete sus datos antes de descargar:", errorCat: "No fue posible cargar el catálogo de productos. Verifique su conexión e intente de nuevo en unos minutos. Si el problema continúa, escriba a",
    errorPdf: "No se pudo generar el PDF: ",
    listo: (n, c, m) => `PDF descargado: <b>${n}</b>. Envíelo por e-mail a <a href="${m}">${c}</a> o a su contacto en Kapazi, adjuntando el archivo.`,
    campos: {empresa: "Empresa / razón social", codCliente: "Código de cliente Kapazi (si lo tiene)", docFiscal: "RUC / NIT / CUIT / Tax ID", pais: "País", ciudad: "Ciudad",
      direccion: "Dirección", contacto: "Persona de contacto", email: "E-mail", telefono: "Teléfono / WhatsApp", oc: "Su referencia interna (opcional)",
      incoterm: "Incoterm deseado", destino: "Puerto / ciudad de destino"},
    pdf: {titulo: "HOJA DE PEDIDO", fecha: "Fecha", cliente: "DATOS DEL CLIENTE", cab: ["Nº", "CÓDIGO", "DESCRIPCIÓN", "UNIDAD", "CANTIDAD", "OBSERVACIÓN"],
      obs: "OBSERVACIONES", pie: (n, c) => `Total: ${n} producto(s). Envíe este PDF a ${c}. Precios y condiciones se confirman en la proforma.`, pag: (i, n) => `Página ${i} de ${n}`,
      archivo: "Pedido Kapazi", asunto: "Pedido"}
  },
  pt: {
    numero: "Ordem de compra Nº", nuevoNum: "(criado ao salvar)", guardarBtn: "Salvar pedido", misPedidos: "Meus pedidos", guardado: n => `Pedido ${n} salvo neste navegador.`,
    pedTitulo: "Meus pedidos", pedAyuda: "Pedidos salvos neste navegador. Você também pode abrir um PDF baixado deste site (por exemplo, em outro computador).",
    pedVacio: "Ainda não há pedidos salvos.", abrir: "Abrir", borrar: "Excluir", nuevoPed: "Novo pedido", abrirPdf: "Abrir PDF de um pedido",
    confNuevo: "Começar um pedido novo? Os produtos escolhidos serão limpos (seus dados continuam). Salve antes se precisar.",
    confAbrir: "Abrir este pedido? O pedido na tela será substituído (salve antes se precisar).", confBorrar: n => `Excluir o pedido ${n} deste navegador?`,
    pdfInvalido: "Este PDF não foi gerado por este site (ou é de uma versão anterior) e não pode ser aberto.", productos_n: n => `${n} produto(s)`,
    visualizar: "Visualizar pedido", cerrar: "Fechar",
    titulo: "Folha de Pedido Kapazi", sub: "Exportação · escolha os produtos por código, descrição ou foto", idioma: "Idioma",
    datos: "1. Seus dados", datosAyuda: "Os campos com * são obrigatórios. Os dados ficam salvos neste navegador para o próximo pedido.",
    productos: "2. Produtos", productosAyuda: "Busque pelo código Kapazi ou pela descrição (ex.: vinil 60x40, grama, 380203) e informe a quantidade. Toque na foto para ampliar.",
    buscar: "Buscar código ou descrição…", soloSel: "Ver só os selecionados", verTodos: "Ver todos os produtos", todos: "Todos", cargando: "Carregando catálogo…",
    mas: n => `Mostrar mais produtos (mais ${n})`, ninguno: "Nenhum produto encontrado. Tente outra palavra ou o código.", ningunoSel: "Você ainda não escolheu produtos.",
    sinFoto: "sem foto", fotos: n => `${n} fotos`, nuevo: "Novo", saliendo: "Últimas unidades",
    resumen: n => n ? `${n} produto(s) selecionado(s)` : "Nenhum produto selecionado", revisar: "Revisar e baixar PDF",
    revTitulo: "Revisar pedido", cod: "Código", desc: "Descrição", unidad: "Unidade", cant: "Quantidade", obs: "Observação", opcional: "opcional", quitar: "Tirar",
    obsGen: "Observações gerais do pedido", obsGenPh: "Ex.: data desejada de embarque, mistura de cores, etiquetagem…",
    seguir: "Continuar escolhendo", descargar: "Baixar PDF do pedido", generando: "Gerando PDF…",
    completar: "Complete seus dados antes de baixar:", errorCat: "Não foi possível carregar o catálogo de produtos. Verifique sua conexão e tente de novo em alguns minutos. Se o problema continuar, escreva para",
    errorPdf: "Não foi possível gerar o PDF: ",
    listo: (n, c, m) => `PDF baixado: <b>${n}</b>. Envie por e-mail para <a href="${m}">${c}</a> ou para seu contato na Kapazi, anexando o arquivo.`,
    campos: {empresa: "Empresa / razão social", codCliente: "Código de cliente Kapazi (se tiver)", docFiscal: "CNPJ / RUC / NIT / Tax ID", pais: "País", ciudad: "Cidade",
      direccion: "Endereço", contacto: "Pessoa de contato", email: "E-mail", telefono: "Telefone / WhatsApp", oc: "Sua referência interna (opcional)",
      incoterm: "Incoterm desejado", destino: "Porto / cidade de destino"},
    pdf: {titulo: "FOLHA DE PEDIDO", fecha: "Data", cliente: "DADOS DO CLIENTE", cab: ["Nº", "CÓDIGO", "DESCRIÇÃO", "UNIDADE", "QUANTIDADE", "OBSERVAÇÃO"],
      obs: "OBSERVAÇÕES", pie: (n, c) => `Total: ${n} produto(s). Envie este PDF para ${c}. Preços e condições são confirmados na proforma.`, pag: (i, n) => `Página ${i} de ${n}`,
      archivo: "Pedido Kapazi", asunto: "Pedido"}
  },
  en: {
    numero: "Purchase order no.", nuevoNum: "(created when saved)", guardarBtn: "Save order", misPedidos: "My orders", guardado: n => `Order ${n} saved in this browser.`,
    pedTitulo: "My orders", pedAyuda: "Orders saved in this browser. You can also open a PDF downloaded from this site (e.g. on another computer).",
    pedVacio: "No saved orders yet.", abrir: "Open", borrar: "Delete", nuevoPed: "New order", abrirPdf: "Open an order PDF",
    confNuevo: "Start a new order? The selected products will be cleared (your details are kept). Save first if you need to.",
    confAbrir: "Open this order? The order on screen will be replaced (save it first if you need to).", confBorrar: n => `Delete order ${n} from this browser?`,
    pdfInvalido: "This PDF was not generated by this site (or is from an older version) and cannot be opened.", productos_n: n => `${n} product(s)`,
    visualizar: "Preview order", cerrar: "Close",
    titulo: "Kapazi Order Sheet", sub: "Export · choose products by code, description or photo", idioma: "Language",
    datos: "1. Your details", datosAyuda: "Fields marked * are required. Your details are kept in this browser for your next order.",
    productos: "2. Products", productosAyuda: "Search by Kapazi code or description (e.g. vinyl 60x40, grass, 380203) and enter the quantity. Tap the photo to enlarge it.",
    buscar: "Search code or description…", soloSel: "Show selected only", verTodos: "Show all products", todos: "All", cargando: "Loading catalog…",
    mas: n => `Show more products (${n} more)`, ninguno: "No products found. Try another word or the code.", ningunoSel: "You have not selected any products yet.",
    sinFoto: "no photo", fotos: n => `${n} photos`, nuevo: "New", saliendo: "Last units",
    resumen: n => n ? `${n} product(s) selected` : "No products selected", revisar: "Review and download PDF",
    revTitulo: "Review order", cod: "Code", desc: "Description", unidad: "Unit", cant: "Quantity", obs: "Note", opcional: "optional", quitar: "Remove",
    obsGen: "General order notes", obsGenPh: "E.g. desired shipping date, color mix, labeling…",
    seguir: "Keep choosing", descargar: "Download order PDF", generando: "Generating PDF…",
    completar: "Please complete your details before downloading:", errorCat: "The product catalog could not be loaded. Check your connection and try again in a few minutes. If the problem persists, write to",
    errorPdf: "The PDF could not be generated: ",
    listo: (n, c, m) => `PDF downloaded: <b>${n}</b>. Email it to <a href="${m}">${c}</a> or to your Kapazi contact, with the file attached.`,
    campos: {empresa: "Company name", codCliente: "Kapazi customer code (if any)", docFiscal: "Tax ID", pais: "Country", ciudad: "City",
      direccion: "Address", contacto: "Contact person", email: "E-mail", telefono: "Phone / WhatsApp", oc: "Your internal reference (optional)",
      incoterm: "Preferred Incoterm", destino: "Destination port / city"},
    pdf: {titulo: "ORDER SHEET", fecha: "Date", cliente: "CUSTOMER DETAILS", cab: ["Nº", "PRODUCT CODE", "DESCRIPTION", "UNIT", "QUANTITY", "NOTE"],
      obs: "NOTES", pie: (n, c) => `Total: ${n} product(s). Send this PDF to ${c}. Prices and terms are confirmed in the proforma.`, pag: (i, n) => `Page ${i} of ${n}`,
      archivo: "Kapazi Order", asunto: "Order"}
  }
};
