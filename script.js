/* =====================================================
   URBAN VIBE - Lógica da loja
   Sumário:
   0. Configuração do Supabase (cole aqui a Project URL e a Publishable key)
   1. Dados dos produtos
   2. Utilitários
   3. Estado do carrinho (com localStorage)
   4. Renderização dos produtos e filtros
   5. Renderização do carrinho
   6. Abrir/fechar carrinho e toast
   7. Detalhes do produto (modal)
   8. Menu mobile, header e animações de scroll
   9. Inicialização
   ===================================================== */

(function () {
  "use strict";

  /* ---------- 0. CONFIGURAÇÃO DO SUPABASE ---------- */
  // >>> COLE AQUI SEUS DOIS VALORES (Supabase → Project Settings → API / API Keys) <<<
  // 1) Project URL, ex.: "https://abcdefghijkl.supabase.co"
  const SUPABASE_URL = "https://bbfpzvssjfkkrubsxsju.supabase.co";
  // 2) Publishable key, ex.: "sb_publishable_xxxxxxxx" (chave PÚBLICA, feita para ficar no navegador)
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qdBVGtE0vNDIY_p28Ysr2w_v5usptt7";
  // NUNCA coloque aqui a "secret key" nem a "service_role": elas dão acesso total ao banco.

  /* ---------- 1. DADOS DOS PRODUTOS ---------- */
  // sizes: lista de tamanhos. Com 1 só item (ex.: "Único") o visitante não precisa escolher.
  const SIZES_CLOTHING = ["P", "M", "G", "GG"];
  const SIZES_ONE = ["Único"];

  // Cada produto tem 2 fotos: a foto principal (image) e o "zoom do material" (material),
  // gerado no próprio código na cor exata do produto. Para mudar a cor do zoom, edite material.color.
  const PRODUCTS = [
    {
      id: 1,
      name: "Camiseta Oversized Essential Preta",
      category: "masculino",
      type: "Camiseta",
      price: 129.9,
      badge: "Novo",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
      material: { kind: "jersey", color: "#0f0f0f", label: "Malha de algodão preta" },
      sizes: SIZES_CLOTHING,
      description:
        "A base de todo look URBAN VIBE. Modelagem oversized com ombro caído e caimento solto, feita em algodão encorpado que mantém a forma lavagem após lavagem. Preta profunda, sem estampa: combina com tudo e aguenta a rotina da rua do primeiro ao último rolê.",
      details: [
        "100% algodão penteado, 220 g/m²",
        "Modelagem oversized com ombro caído",
        "Gola reforçada com ribana dupla",
        "Etiqueta interna estampada, sem coceira"
      ]
    },
    {
      id: 2,
      name: "Moletom Hoodie Street Black",
      category: "masculino",
      type: "Moletom",
      price: 289.9,
      badge: "Mais vendido",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
      material: { kind: "fleece", color: "#141414", label: "Moletom flanelado preto" },
      sizes: SIZES_CLOTHING,
      description:
        "O hoodie que virou uniforme. Moletom felpudo por dentro, capuz estruturado com cordão chato e bolso canguru fundo para as mãos e para o celular. Corte levemente amplo, pensado para usar sobre uma camiseta ou sozinho nos dias frios.",
      details: [
        "Moletom flanelado 400 g/m² (algodão e poliéster)",
        "Capuz duplo com cordão chato",
        "Bolso canguru profundo",
        "Punhos e barra em ribana elástica"
      ]
    },
    {
      id: 3,
      name: "Jaqueta Corta-Vento Urban",
      category: "masculino",
      type: "Jaqueta",
      price: 349.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
      material: { kind: "ripstop", color: "#1c1c1c", label: "Ripstop grafite" },
      sizes: SIZES_CLOTHING,
      description:
        "Leve, rápida e pronta para a garoa da cidade. Tecido que repele a água, capuz embutido na gola e zíperes firmes. Cabe fácil na mochila e entra em cena quando o tempo vira, sem pesar no resto do look.",
      details: [
        "Tecido ripstop com repelência à água",
        "Capuz recolhível na gola",
        "Zíper frontal com proteção no queixo",
        "Bolsos laterais com zíper"
      ]
    },
    {
      id: 4,
      name: "Calça Cargo Concrete Grey",
      category: "masculino",
      type: "Calça",
      price: 259.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
      material: { kind: "twill", color: "#8a8a86", label: "Sarja cinza concreto" },
      sizes: SIZES_CLOTHING,
      description:
        "Cargo com alma de skate. Cinza concreto, bolsos laterais volumosos e perna reta ampla que cai bem sobre tênis ou bota. Sarja firme, cós com ajuste interno e barra com cordão para você escolher entre o visual solto ou mais justo.",
      details: [
        "Sarja de algodão com elastano",
        "Bolsos cargo com botão de pressão",
        "Cós com elástico interno e passantes",
        "Barra com cordão ajustável"
      ]
    },
    {
      id: 5,
      name: "Cropped Boxy Branco",
      category: "feminino",
      type: "Camiseta cropped",
      price: 119.9,
      badge: "Novo",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
      material: { kind: "jersey", color: "#f2f2ee", label: "Malha de algodão branca" },
      sizes: SIZES_CLOTHING,
      description:
        "Branco limpo, corte boxy e comprimento cropped na medida. Malha encorpada que não marca nem transparece, ideal para camadas sob jaquetas ou com calça de cintura alta. Simples, afiada e feita para repetir a semana inteira.",
      details: [
        "Malha de algodão 200 g/m², opaca",
        "Corte boxy com comprimento cropped",
        "Gola careca com acabamento duplo",
        "Costuras reforçadas nos ombros"
      ]
    },
    {
      id: 6,
      name: "Moletom Oversized Washed Grey",
      category: "feminino",
      type: "Moletom",
      price: 279.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
      material: { kind: "fleece", color: "#9a9a98", label: "Moletom cinza lavado" },
      sizes: SIZES_CLOTHING,
      description:
        "Cinza lavado com cara de peça vintage desde o primeiro dia. Moletom oversized de ombro caído e gola alta, com efeito stone wash que deixa cada peça um pouco diferente da outra. Conforto de casa, presença de rua.",
      details: [
        "Moletom 360 g/m² com lavagem stone wash",
        "Modelagem oversized, ombro caído",
        "Gola alta em ribana",
        "Punhos e barra elásticos"
      ]
    },
    {
      id: 7,
      name: "Calça Wide Leg Street",
      category: "feminino",
      type: "Calça",
      price: 239.9,
      badge: "Mais vendido",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
      material: { kind: "twill", color: "#2b2b2b", label: "Sarja grafite" },
      sizes: SIZES_CLOTHING,
      description:
        "Perna larga, cintura alta e movimento de sobra. A wide leg URBAN VIBE tem tecido de caimento fluido, cós confortável e comprimento pensado para tênis volumoso. Alonga a silhueta e vai do rolê ao trabalho criativo sem trocar de roupa.",
      details: [
        "Sarja leve com toque macio",
        "Cintura alta com cós largo",
        "Bolsos laterais embutidos",
        "Perna ampla e comprimento longo"
      ]
    },
    {
      id: 8,
      name: "Jaqueta Bomber Noir",
      category: "feminino",
      type: "Jaqueta",
      price: 369.9,
      badge: "Edição limitada",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
      material: { kind: "satin", color: "#0b0b0b", label: "Nylon acetinado preto" },
      sizes: SIZES_CLOTHING,
      description:
        "Edição limitada em preto total. Bomber clássica com gola e punhos em ribana, forro acetinado e zíper metálico escovado. Um volume que impõe respeito e combina do cropped ao moletom. Quando acabar, acabou.",
      details: [
        "Shell em nylon com toque acetinado",
        "Forro interno acetinado",
        "Zíper metálico com acabamento escovado",
        "Ribana na gola, nos punhos e na barra"
      ]
    },
    {
      id: 9,
      name: "Boné Dad Hat Urban Vibe",
      category: "acessorios",
      type: "Boné",
      price: 89.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      material: { kind: "twill", color: "#1a1a1a", label: "Sarja de algodão preta" },
      sizes: SIZES_ONE,
      description:
        "Aba curva, copa baixa e bordado discreto da marca na frente. O dad hat é o acessório que fecha o look sem pesar: regulagem metálica atrás, tecido macio e uma cor que conversa com preto, branco e cinza.",
      details: [
        "Sarja 100% algodão",
        "Aba curva pré-formada",
        "Bordado URBAN VIBE na frente",
        "Regulagem metálica traseira (tamanho único)"
      ]
    },
    {
      id: 10,
      name: "Bolsa Transversal Utility Black",
      category: "acessorios",
      type: "Bolsa",
      price: 159.9,
      badge: "Novo",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      material: { kind: "basket", color: "#111111", label: "Nylon trançado preto" },
      sizes: SIZES_ONE,
      description:
        "Pequena por fora, esperta por dentro. A utility cruza o corpo e guarda celular, carteira, chaves e fones em compartimentos separados. Nylon resistente, alça ajustável e zíperes firmes: feita para andar de metrô, de bike ou a pé.",
      details: [
        "Nylon resistente à água",
        "Alça ajustável e removível",
        "3 compartimentos com zíper",
        "Tamanho único, aprox. 22 × 14 × 6 cm"
      ]
    },
    {
      id: 11,
      name: "Meia Cano Alto Pack 3 Pares",
      category: "acessorios",
      type: "Meias",
      price: 59.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80",
      material: { kind: "rib", color: "#f2f2ee", label: "Algodão canelado branco" },
      sizes: ["36–39", "40–44"],
      description:
        "O detalhe que faz diferença. Pack com três pares de cano alto em algodão macio, com ribana firme que não escorrega. Entram bem com tênis, skate e bota, e sobem o nível quando aparecem entre a barra da calça e o calçado.",
      details: [
        "Pack com 3 pares",
        "Algodão com elastano",
        "Cano alto com ribana reforçada",
        "Calcanhar e ponta reforçados"
      ]
    },
    {
      id: 12,
      name: "Gorro Beanie Monochrome",
      category: "acessorios",
      type: "Gorro",
      price: 69.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80",
      material: { kind: "rib", color: "#3a3a39", label: "Tricô canelado cinza" },
      sizes: SIZES_ONE,
      description:
        "Preto, branco e cinza em tricô canelado. O beanie URBAN VIBE tem punho dobrável, malha elástica que abraça sem apertar e etiqueta bordada discreta. Quente o bastante para o frio, leve o bastante para usar o dia inteiro.",
      details: [
        "Tricô canelado em acrílico",
        "Punho dobrável",
        "Malha elástica que se adapta à cabeça (tamanho único)",
        "Etiqueta bordada URBAN VIBE"
      ]
    }
  ];

  const CATEGORY_LABELS = {
    masculino: "Masculino",
    feminino: "Feminino",
    acessorios: "Acessórios"
  };

  const FREE_SHIPPING_MIN = 299;
  const STORAGE_KEY = "urbanvibe_cart_v1";
  const PRODUCT_HASH = /^#produto-(\d+)$/;

  /* ---------- 2. UTILITÁRIOS ---------- */
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  function formatPrice(value) {
    return currency.format(value);
  }

  function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Troca a largura (?w=) da foto (Unsplash aceita vários tamanhos da mesma imagem)
  function resizeImage(url, width) {
    return url.replace(/([?&])w=\d+/, "$1w=" + width);
  }

  // Gera versões menores da mesma foto para o celular baixar menos dados
  function imageSrcSet(url, widths) {
    return widths
      .map(function (width) {
        return resizeImage(url, width) + " " + width + "w";
      })
      .join(", ");
  }

  // Imagem substituta (SVG) usada se alguma foto não carregar
  function placeholderImage() {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#2a2a2a"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient></defs>' +
      '<rect width="800" height="1000" fill="url(#g)"/>' +
      '<text x="400" y="510" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" ' +
      'font-size="64" fill="#7a7a78" letter-spacing="6">URBAN VIBE</text></svg>';
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  // Captura erros de carregamento de qualquer <img> (inclusive os criados dinamicamente)
  document.addEventListener(
    "error",
    function (event) {
      const target = event.target;
      if (target && target.tagName === "IMG" && !target.dataset.fallback) {
        target.dataset.fallback = "true";
        target.removeAttribute("srcset"); // srcset tem prioridade sobre src; precisa sair
        target.src = placeholderImage();
      }
    },
    true
  );

  // Zoom do material: textura de tecido gerada em SVG, na cor exata do produto (sem rede, sem arquivo extra)
  const materialCache = {};

  function shadeColor(hex, amount) {
    const n = parseInt(hex.slice(1), 16);
    const clamp = (v) => Math.max(0, Math.min(255, v));
    const r = clamp((n >> 16) + amount);
    const g = clamp(((n >> 8) & 255) + amount);
    const b = clamp((n & 255) + amount);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  function colorLuma(hex) {
    const n = parseInt(hex.slice(1), 16);
    return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  }

  // Camada de ruído colorida (granulação do tecido)
  function noiseLayer(id, freq, octaves, seed, color, gain, offset) {
    const n = parseInt(color.slice(1), 16);
    const r = (n >> 16) / 255;
    const g = ((n >> 8) & 255) / 255;
    const b = (n & 255) / 255;
    return (
      '<filter id="' + id + '" x="0" y="0" width="100%" height="100%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="' + freq + '" numOctaves="' + octaves + '" seed="' + seed + '"/>' +
        '<feColorMatrix type="matrix" values="0 0 0 0 ' + r + ' 0 0 0 0 ' + g + ' 0 0 0 0 ' + b +
          ' ' + gain + ' 0 0 0 ' + offset + '"/>' +
      "</filter>"
    );
  }

  function materialImage(material) {
    const key = material.kind + material.color;
    if (materialCache[key]) return materialCache[key];

    const base = material.color;
    const dark = colorLuma(base) < 80;
    const hi = shadeColor(base, dark ? 34 : 18);
    const lo = shadeColor(base, dark ? -10 : -30);
    let defs = "";
    let layers = "";

    if (material.kind === "jersey") {
      // Malha de ponto jersey: carreiras de pontos em "V"
      defs +=
        '<pattern id="p" width="44" height="52" patternUnits="userSpaceOnUse">' +
          '<path d="M4 8L22 34L40 8" fill="none" stroke="' + lo + '" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 3)"/>' +
          '<path d="M-18 34L0 60L18 34" fill="none" stroke="' + lo + '" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 3)"/>' +
          '<path d="M26 34L44 60L62 34" fill="none" stroke="' + lo + '" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 3)"/>' +
          '<path d="M4 8L22 34L40 8" fill="none" stroke="' + hi + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M-18 34L0 60L18 34" fill="none" stroke="' + hi + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M26 34L44 60L62 34" fill="none" stroke="' + hi + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</pattern>";
      layers += '<rect width="1000" height="1250" fill="url(#p)" opacity="0.8"/>';
    } else if (material.kind === "rib") {
      // Tricô canelado: costelas verticais
      defs +=
        '<linearGradient id="rg" x1="0" x2="1" y1="0" y2="0">' +
          '<stop offset="0" stop-color="' + lo + '"/><stop offset="0.5" stop-color="' + hi + '"/><stop offset="1" stop-color="' + lo + '"/></linearGradient>' +
        '<pattern id="p" width="56" height="14" patternUnits="userSpaceOnUse">' +
          '<rect width="56" height="14" fill="url(#rg)"/>' +
          '<path d="M14 0L14 14M42 0L42 14" stroke="' + lo + '" stroke-width="2" opacity="0.6"/>' +
        "</pattern>";
      layers += '<rect width="1000" height="1250" fill="url(#p)"/>';
    } else if (material.kind === "twill") {
      // Sarja: diagonais finas
      defs +=
        '<pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">' +
          '<rect width="28" height="14" fill="' + hi + '" opacity="0.75"/>' +
          '<rect y="14" width="28" height="14" fill="' + lo + '" opacity="0.85"/>' +
          '<rect y="12" width="28" height="3" fill="' + lo + '" opacity="0.7"/>' +
        "</pattern>";
      layers += '<rect width="1000" height="1250" fill="url(#p)" opacity="0.85"/>';
    } else if (material.kind === "ripstop") {
      // Ripstop: trama fina com reforço em grade
      defs +=
        '<pattern id="p" width="14" height="14" patternUnits="userSpaceOnUse">' +
          '<path d="M0 7H14M7 0V14" stroke="' + hi + '" stroke-width="3" opacity="0.7"/>' +
          '<path d="M0 0H14M0 0V14" stroke="' + lo + '" stroke-width="2" opacity="0.8"/>' +
        "</pattern>" +
        '<pattern id="q" width="112" height="112" patternUnits="userSpaceOnUse">' +
          '<path d="M0 0H112M0 0V112" stroke="' + hi + '" stroke-width="4" opacity="0.9"/>' +
          '<path d="M2 3H112M3 2V112" stroke="' + lo + '" stroke-width="3" opacity="0.9"/>' +
        "</pattern>";
      layers += '<rect width="1000" height="1250" fill="url(#p)"/><rect width="1000" height="1250" fill="url(#q)"/>';
    } else if (material.kind === "basket") {
      // Nylon trançado: fios cruzados
      defs +=
        '<pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse">' +
          '<rect width="24" height="24" fill="' + lo + '"/>' +
          '<rect x="1" y="1.5" width="10" height="9" rx="3" fill="' + hi + '"/>' +
          '<rect x="13" y="13.5" width="10" height="9" rx="3" fill="' + hi + '"/>' +
          '<rect x="13.5" y="1" width="9" height="10" rx="3" fill="' + shadeColor(base, dark ? 18 : 6) + '"/>' +
          '<rect x="1.5" y="13" width="9" height="10" rx="3" fill="' + shadeColor(base, dark ? 18 : 6) + '"/>' +
        "</pattern>";
      layers += '<rect width="1000" height="1250" fill="url(#p)"/>';
    } else if (material.kind === "satin") {
      // Nylon acetinado: brilho em faixas e dobras suaves
      defs +=
        '<linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + lo + '"/><stop offset="0.28" stop-color="' + hi + '"/>' +
          '<stop offset="0.45" stop-color="' + base + '"/><stop offset="0.68" stop-color="' + hi + '"/>' +
          '<stop offset="1" stop-color="' + lo + '"/></linearGradient>' +
        noiseLayer("fold", "0.004 0.018", 3, 7, hi, 2.4, -0.9);
      layers += '<rect width="1000" height="1250" fill="url(#sg)"/>' +
        '<rect width="1000" height="1250" filter="url(#fold)" opacity="0.45"/>';
    }

    if (material.kind === "fleece") {
      // Moletom: fibras felpudas e pelinhos
      defs +=
        noiseLayer("n1", "0.35", 3, 3, hi, 2.6, -0.95) +
        noiseLayer("n2", "0.6", 2, 11, lo, 2.6, -0.95) +
        noiseLayer("n3", "0.12", 2, 5, hi, 2, -0.9);
      layers +=
        '<rect width="1000" height="1250" filter="url(#n3)" opacity="0.7"/>' +
        '<rect width="1000" height="1250" filter="url(#n2)"/>' +
        '<rect width="1000" height="1250" filter="url(#n1)"/>';
    } else {
      // Granulação fina sobre os demais tecidos
      defs += noiseLayer("n1", "0.8", 2, 4, hi, 1.8, -0.7) + noiseLayer("n2", "0.8", 2, 9, lo, 1.8, -0.7);
      layers += '<rect width="1000" height="1250" filter="url(#n2)" opacity="0.7"/>' +
        '<rect width="1000" height="1250" filter="url(#n1)" opacity="0.6"/>';
    }

    // Luz suave vinda do alto e vinheta leve (dá a sensação de lente de zoom)
    defs +=
      '<radialGradient id="v" cx="0.4" cy="0.35" r="0.85">' +
        '<stop offset="0.45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.28"/></radialGradient>';

    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1250" preserveAspectRatio="xMidYMid slice">' +
      "<defs>" + defs + "</defs>" +
      '<rect width="1000" height="1250" fill="' + base + '"/>' +
      layers +
      '<rect width="1000" height="1250" fill="url(#v)"/></svg>';

    materialCache[key] = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    return materialCache[key];
  }

  // Lista de fotos do produto: [foto principal, zoom do material]
  function productPhotos(product) {
    return [
      { src: product.image, zoom: false, alt: product.name },
      { src: materialImage(product.material), zoom: true, alt: "Zoom do material: " + product.material.label }
    ];
  }

  function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
  }

  // Produto com mais de um tamanho exige que o visitante escolha
  function hasSizeChoice(product) {
    return product.sizes.length > 1;
  }

  // Tamanho assumido para itens antigos salvos sem tamanho (carrinho de versões anteriores)
  function fallbackSize(product) {
    if (product.sizes.length === 1) return product.sizes[0];
    return product.sizes.indexOf("M") !== -1 ? "M" : product.sizes[0];
  }

  // Cada linha do carrinho é identificada por produto + tamanho (ex.: "2|M")
  function lineKey(id, size) {
    return id + "|" + size;
  }

  /* ---------- 3. ESTADO DO CARRINHO ---------- */
  let cart = loadCart();

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!Array.isArray(saved)) return [];

      const lines = [];
      saved.forEach(function (item) {
        const product = getProduct(item.id);
        const qty = Math.min(parseInt(item.qty, 10) || 0, 99);
        if (!product || qty <= 0) return; // descarta itens inválidos ou que saíram do catálogo

        let size = item.size;
        if (product.sizes.indexOf(size) === -1) size = fallbackSize(product);

        const existing = lines.find((l) => l.id === product.id && l.size === size);
        if (existing) {
          existing.qty = Math.min(existing.qty + qty, 99);
        } else {
          lines.push({ id: product.id, size: size, qty: qty });
        }
      });
      return lines;
    } catch (error) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      /* localStorage indisponível: o carrinho continua funcionando em memória */
    }
  }

  function findLine(key) {
    return cart.find((line) => lineKey(line.id, line.size) === key);
  }

  function addToCart(id, size) {
    const product = getProduct(id);
    const existing = cart.find((line) => line.id === id && line.size === size);
    if (existing) {
      if (existing.qty < 99) existing.qty += 1;
    } else {
      cart.push({ id: id, size: size, qty: 1 });
    }
    updateCart();

    const sizeLabel = hasSizeChoice(product) ? " (tam. " + size + ")" : "";
    showToast(product.name + sizeLabel + " adicionado ao carrinho");
  }

  function changeQty(key, delta) {
    const line = findLine(key);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) {
      removeFromCart(key);
      return;
    }
    if (line.qty > 99) line.qty = 99;
    updateCart();
  }

  function removeFromCart(key) {
    cart = cart.filter((line) => lineKey(line.id, line.size) !== key);
    updateCart();
  }

  function clearCart() {
    cart = [];
    updateCart();
  }

  function getCartCount() {
    return cart.reduce((sum, line) => sum + line.qty, 0);
  }

  function getCartSubtotal() {
    return cart.reduce((sum, line) => sum + getProduct(line.id).price * line.qty, 0);
  }

  function updateCart() {
    saveCart();
    renderCart();
  }

  /* ---------- 4. PRODUTOS E FILTROS ---------- */
  const productGrid = $("#productGrid");
  let currentFilter = "todos";

  function createCard(product, index) {
    const badge = product.badge
      ? '<span class="card__badge">' + escapeHTML(product.badge) + "</span>"
      : "";
    const installment = formatPrice(product.price / 3);

    // Produtos com tamanhos abrem os detalhes para o visitante escolher; os demais adicionam direto
    const button = hasSizeChoice(product)
      ? '<button class="card__btn" data-details="' + product.id + '">Escolher tamanho</button>'
      : '<button class="card__btn" data-add="' + product.id + '">Adicionar ao carrinho</button>';

    return (
      '<article class="card" style="animation-delay:' + index * 0.06 + 's">' +
        '<div class="card__media">' +
          '<img class="card__img" src="' + product.image + '" srcset="' + imageSrcSet(product.image, [400, 800]) + '"' +
            ' sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, (max-width: 1100px) 33vw, 300px"' +
            ' alt="' + escapeHTML(product.name) + '" loading="lazy" decoding="async">' +
          '<img class="card__img card__img--alt" src="' + productPhotos(product)[1].src + '"' +
            ' alt="" aria-hidden="true" loading="lazy" decoding="async">' +
          '<span class="card__dots" aria-hidden="true"><i class="is-on"></i><i></i></span>' +
          badge +
        "</div>" +
        '<div class="card__body">' +
          '<span class="card__category">' + CATEGORY_LABELS[product.category] + "</span>" +
          '<h3 class="card__name"><a class="card__link" href="#produto-' + product.id + '" data-product="' + product.id + '">' +
            escapeHTML(product.name) + "</a></h3>" +
          '<p class="card__price">' + formatPrice(product.price) +
            "<small>ou 3x de " + installment + "</small></p>" +
          button +
        "</div>" +
      "</article>"
    );
  }

  function renderProducts() {
    const list =
      currentFilter === "todos"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === currentFilter);

    productGrid.innerHTML = list.map(createCard).join("");
  }

  function setFilter(filter) {
    currentFilter = filter;
    $$(".filter").forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    renderProducts();
  }

  function initProducts() {
    renderProducts();

    productGrid.addEventListener("click", function (event) {
      // Clique no card (foto, nome ou área do card): abre os detalhes
      const link = event.target.closest("[data-product]");
      if (link) {
        // Ctrl/Cmd/Shift + clique mantém o comportamento normal do navegador (nova aba/janela)
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        openProduct(parseInt(link.dataset.product, 10));
        return;
      }

      // Botão "Escolher tamanho": abre os detalhes
      const details = event.target.closest("[data-details]");
      if (details) {
        openProduct(parseInt(details.dataset.details, 10));
        return;
      }

      // Botão "Adicionar ao carrinho" (produtos de tamanho único)
      const button = event.target.closest("[data-add]");
      if (!button) return;
      const product = getProduct(parseInt(button.dataset.add, 10));
      addToCart(product.id, product.sizes[0]);
      button.textContent = "Adicionado ✓";
      setTimeout(function () {
        button.textContent = "Adicionar ao carrinho";
      }, 1200);
    });

    // Filtros
    $$(".filter").forEach((button) => {
      button.addEventListener("click", () => setFilter(button.dataset.filter));
    });

    // Cards de categoria aplicam o filtro correspondente
    $$(".category").forEach((link) => {
      link.addEventListener("click", () => setFilter(link.dataset.filter));
    });
  }

  /* ---------- 5. RENDERIZAÇÃO DO CARRINHO ---------- */
  const cartItemsEl = $("#cartItems");
  const cartCountEl = $("#cartCount");
  const cartSubtotalEl = $("#cartSubtotal");
  const cartShippingEl = $("#cartShipping");
  const checkoutBtn = $("#checkoutBtn");
  const clearBtn = $("#clearCart");

  function renderCart() {
    const count = getCartCount();
    const subtotal = getCartSubtotal();

    // Contador no ícone (e no botão "Ver carrinho" dos detalhes do produto)
    cartCountEl.textContent = count;
    cartCountEl.classList.add("bump");
    setTimeout(() => cartCountEl.classList.remove("bump"), 300);
    pmCartCount.textContent = count;

    // Lista de itens
    if (cart.length === 0) {
      cartItemsEl.innerHTML =
        '<div class="cart__empty">' +
          '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<path d="M6 7h12l1 13H5L6 7z"></path><path d="M9 7V6a3 3 0 0 1 6 0v1"></path></svg>' +
          "<p>Seu carrinho está vazio.</p>" +
          '<a href="#destaques" class="btn btn--dark" data-close-cart>Ver produtos</a>' +
        "</div>";
    } else {
      cartItemsEl.innerHTML = cart
        .map(function (line) {
          const product = getProduct(line.id);
          const key = lineKey(line.id, line.size);
          const sizeInfo = hasSizeChoice(product)
            ? '<p class="cart-item__meta">Tamanho: ' + escapeHTML(line.size) + "</p>"
            : "";
          return (
            '<div class="cart-item">' +
              '<img class="cart-item__img" src="' + product.image + '" alt="' + escapeHTML(product.name) + '">' +
              "<div>" +
                '<h4 class="cart-item__name">' + escapeHTML(product.name) + "</h4>" +
                sizeInfo +
                '<p class="cart-item__price">' + formatPrice(product.price) + "</p>" +
                '<div class="qty">' +
                  '<button data-dec="' + key + '" aria-label="Diminuir quantidade">&minus;</button>' +
                  "<span>" + line.qty + "</span>" +
                  '<button data-inc="' + key + '" aria-label="Aumentar quantidade">+</button>' +
                "</div>" +
              "</div>" +
              '<div class="cart-item__side">' +
                '<span class="cart-item__total">' + formatPrice(product.price * line.qty) + "</span>" +
                '<button class="cart-item__remove" data-remove="' + key + '">Remover</button>' +
              "</div>" +
            "</div>"
          );
        })
        .join("");
    }

    // Totais e frete
    cartSubtotalEl.textContent = formatPrice(subtotal);

    if (cart.length === 0) {
      cartShippingEl.textContent = "";
    } else if (subtotal >= FREE_SHIPPING_MIN) {
      cartShippingEl.textContent = "Você ganhou frete grátis! 🎉";
    } else {
      cartShippingEl.textContent =
        "Faltam " + formatPrice(FREE_SHIPPING_MIN - subtotal) + " para o frete grátis.";
    }

    checkoutBtn.disabled = cart.length === 0;
    checkoutBtn.style.opacity = cart.length === 0 ? "0.4" : "1";
    checkoutBtn.style.pointerEvents = cart.length === 0 ? "none" : "auto";
    clearBtn.style.display = cart.length === 0 ? "none" : "block";
  }

  function initCart() {
    // Botões dentro da lista do carrinho (delegação de eventos)
    cartItemsEl.addEventListener("click", function (event) {
      const inc = event.target.closest("[data-inc]");
      const dec = event.target.closest("[data-dec]");
      const remove = event.target.closest("[data-remove]");

      if (inc) changeQty(inc.dataset.inc, 1);
      else if (dec) changeQty(dec.dataset.dec, -1);
      else if (remove) removeFromCart(remove.dataset.remove);
      else if (event.target.closest("[data-close-cart]")) closeCart();
    });

    clearBtn.addEventListener("click", function () {
      clearCart();
      showToast("Carrinho esvaziado");
    });

    // Finalização (simulada nesta versão, sem banco de dados nem pagamento)
    checkoutBtn.addEventListener("click", function () {
      if (cart.length === 0) return;
      const total = formatPrice(getCartSubtotal());
      alert(
        "Obrigado pela preferência!\n\n" +
        "Total do pedido: " + total + "\n\n" +
        "Esta é a primeira versão da loja: a finalização de compra será integrada em breve."
      );
    });

    renderCart();
  }

  /* ---------- 6. ABRIR/FECHAR CARRINHO E TOAST ---------- */
  const cartEl = $("#cart");
  const overlayEl = $("#overlay");
  const toastEl = $("#toast");
  let toastTimer = null;
  let lastFocusedBeforeCart = null;

  // Libera a rolagem da página somente quando menu, carrinho e detalhes estão todos fechados
  function unlockScrollIfIdle() {
    const busy =
      cartEl.classList.contains("is-open") ||
      modalEl.classList.contains("is-open") ||
      authEl.classList.contains("is-open") ||
      navEl.classList.contains("is-open");
    if (!busy) document.body.classList.remove("no-scroll");
  }

  function openCart() {
    closeMenu(); // se o menu mobile estiver aberto, fecha antes de abrir o carrinho
    closeProduct(); // idem para os detalhes do produto
    closeAuth(); // e para o login/cadastro
    lastFocusedBeforeCart = document.activeElement;
    cartEl.classList.add("is-open");
    cartEl.setAttribute("aria-hidden", "false");
    overlayEl.classList.add("is-visible");
    document.body.classList.add("no-scroll");
    $("#cartClose").focus();
  }

  function closeCart() {
    const wasOpen = cartEl.classList.contains("is-open");
    cartEl.classList.remove("is-open");
    cartEl.setAttribute("aria-hidden", "true");
    overlayEl.classList.remove("is-visible");
    unlockScrollIfIdle();

    // Devolve o foco ao botão que abriu o carrinho (teclado e leitores de tela)
    if (wasOpen && lastFocusedBeforeCart && typeof lastFocusedBeforeCart.focus === "function") {
      lastFocusedBeforeCart.focus();
    }
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2400);
  }

  // Mantém o foco do teclado dentro de um painel aberto (carrinho ou detalhes)
  function trapFocus(event, container) {
    const focusables = $$("button, a[href], input", container).filter(
      (el) => !el.disabled && el.offsetParent !== null
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function initCartDrawer() {
    $("#cartOpen").addEventListener("click", openCart);
    $("#cartClose").addEventListener("click", closeCart);
    overlayEl.addEventListener("click", closeCart);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        // Se os detalhes do produto estão abertos, o Esc fecha só eles
        if (authEl.classList.contains("is-open")) {
          closeAuth();
          return;
        }
        if (modalEl.classList.contains("is-open")) {
          closeProduct();
          return;
        }
        closeCart();
        closeMenu();
        return;
      }

      if (event.key === "Tab") {
        if (cartEl.classList.contains("is-open")) trapFocus(event, cartEl);
        else if (authEl.classList.contains("is-open")) trapFocus(event, authEl);
        else if (modalEl.classList.contains("is-open")) trapFocus(event, modalEl);
      }
    });
  }

  /* ---------- 7. DETALHES DO PRODUTO (MODAL) ---------- */
  const modalEl = $("#productModal");
  const pmScroll = $("#pmScroll");
  const pmMedia = $("#pmMedia");
  const pmCategory = $("#pmCategory");
  const pmName = $("#pmName");
  const pmPrice = $("#pmPrice");
  const pmInstall = $("#pmInstall");
  const pmDesc = $("#pmDesc");
  const pmDetails = $("#pmDetails");
  const pmSizes = $("#pmSizes");
  const pmSizesList = $("#pmSizesList");
  const pmHint = $("#pmHint");
  const pmAdd = $("#pmAdd");
  const pmViewCart = $("#pmViewCart");
  const pmCartCount = $("#pmCartCount");
  const pmClose = $("#pmClose");

  let currentProduct = null;
  let lastFocusedBeforeModal = null;
  let addFeedbackTimer = null;

  function renderProductModal(product) {
    const badge = product.badge
      ? '<span class="card__badge">' + escapeHTML(product.badge) + "</span>"
      : "";

    // Galeria: uma <img> nova a cada abertura (o tratamento de foto quebrada recomeça do zero)
    const photos = productPhotos(product);
    const slides = photos
      .map(function (photo, i) {
        const attrs = photo.zoom
          ? ' src="' + photo.src + '"'
          : ' src="' + resizeImage(photo.src, 1200) + '" srcset="' + imageSrcSet(photo.src, [800, 1200]) + '"' +
            ' sizes="(max-width: 620px) 100vw, 520px"';
        return (
          '<figure class="gallery__slide" role="group" aria-roledescription="foto" aria-label="Foto ' + (i + 1) + " de " + photos.length + '">' +
            "<img" + attrs + ' alt="' + escapeHTML(photo.alt) + '" decoding="async">' +
          "</figure>"
        );
      })
      .join("");
    const thumbs = photos
      .map(function (photo, i) {
        const thumbSrc = photo.zoom ? photo.src : resizeImage(photo.src, 160);
        return (
          '<button type="button" class="gallery__thumb' + (i === 0 ? " is-active" : "") + '" data-photo="' + i + '"' +
            ' aria-label="' + (photo.zoom ? "Ver zoom do material" : "Ver foto principal") + '"' +
            (i === 0 ? ' aria-current="true"' : "") + ">" +
            '<img src="' + thumbSrc + '" alt="" aria-hidden="true">' +
          "</button>"
        );
      })
      .join("");
    const chevron = (d) =>
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"></path></svg>';

    pmMedia.innerHTML =
      '<div class="gallery__track" id="pmTrack" tabindex="0" role="group" aria-label="Fotos do produto">' + slides + "</div>" +
      '<button type="button" class="gallery__nav gallery__nav--prev" id="pmPrev" aria-label="Foto anterior" disabled>' + chevron("M15 5l-7 7 7 7") + "</button>" +
      '<button type="button" class="gallery__nav gallery__nav--next" id="pmNext" aria-label="Próxima foto">' + chevron("M9 5l7 7-7 7") + "</button>" +
      '<span class="gallery__tag" id="pmTag" aria-live="polite"></span>' +
      '<div class="gallery__thumbs" id="pmThumbs">' + thumbs + "</div>" +
      badge;
    photoIndex = 0;
    updateGallery();

    pmCategory.textContent = CATEGORY_LABELS[product.category] + " · " + product.type;
    pmName.textContent = product.name;
    pmPrice.textContent = formatPrice(product.price);
    pmInstall.textContent = "ou 3x de " + formatPrice(product.price / 3) + " sem juros";
    pmDesc.textContent = product.description;
    pmDetails.innerHTML = product.details
      .map((item) => "<li>" + escapeHTML(item) + "</li>")
      .join("");

    // Tamanhos: botões de escolha ou aviso de tamanho único
    if (hasSizeChoice(product)) {
      pmSizesList.innerHTML = product.sizes
        .map(
          (size) =>
            '<label class="size"><input type="radio" name="pmSize" value="' + escapeHTML(size) + '">' +
            "<span>" + escapeHTML(size) + "</span></label>"
        )
        .join("");
      pmHint.textContent = "Selecione um tamanho para adicionar ao carrinho.";
    } else {
      pmSizesList.innerHTML = '<span class="pm__single">Tamanho único</span>';
      pmHint.textContent = "";
    }
    pmHint.classList.remove("is-error");
    pmSizes.classList.remove("shake");

    clearTimeout(addFeedbackTimer);
    pmAdd.textContent = "Adicionar ao carrinho";
  }

  // ----- Galeria de fotos (deslizar no celular, setas, miniaturas e teclado) -----
  let photoIndex = 0;
  let galleryRaf = null;

  function updateGallery() {
    const track = $("#pmTrack");
    if (!track) return;
    const total = $$(".gallery__slide", track).length;
    $$(".gallery__thumb", pmMedia).forEach(function (thumb, i) {
      const active = i === photoIndex;
      thumb.classList.toggle("is-active", active);
      if (active) thumb.setAttribute("aria-current", "true");
      else thumb.removeAttribute("aria-current");
    });
    $("#pmPrev").disabled = photoIndex === 0;
    $("#pmNext").disabled = photoIndex >= total - 1;
    const tag = $("#pmTag");
    tag.textContent = photoIndex === 1 && currentProduct ? "Zoom do material · " + currentProduct.material.label : "";
    tag.classList.toggle("is-visible", photoIndex === 1);
  }

  function goToPhoto(index) {
    const track = $("#pmTrack");
    if (!track) return;
    const total = $$(".gallery__slide", track).length;
    photoIndex = Math.max(0, Math.min(total - 1, index));
    const smooth = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    track.scrollTo({ left: photoIndex * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
    updateGallery();
  }

  // Ao deslizar com o dedo, descobre qual foto está visível
  function onTrackScroll() {
    if (galleryRaf) return;
    galleryRaf = requestAnimationFrame(function () {
      galleryRaf = null;
      const track = $("#pmTrack");
      if (!track || !track.clientWidth) return;
      const index = Math.round(track.scrollLeft / track.clientWidth);
      if (index !== photoIndex) {
        photoIndex = index;
        updateGallery();
      }
    });
  }

  function initGallery() {
    pmMedia.addEventListener("click", function (event) {
      const thumb = event.target.closest(".gallery__thumb");
      if (thumb) return goToPhoto(parseInt(thumb.dataset.photo, 10));
      if (event.target.closest("#pmPrev")) return goToPhoto(photoIndex - 1);
      if (event.target.closest("#pmNext")) return goToPhoto(photoIndex + 1);
    });
    pmMedia.addEventListener("scroll", onTrackScroll, true);

    // Setas do teclado trocam de foto (exceto quando o foco está nos tamanhos)
    document.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (!modalEl.classList.contains("is-open")) return;
      if (event.target.closest && event.target.closest("#pmSizesList")) return;
      event.preventDefault();
      goToPhoto(photoIndex + (event.key === "ArrowRight" ? 1 : -1));
    });
  }

  function getSelectedSize() {
    if (!currentProduct) return null;
    if (!hasSizeChoice(currentProduct)) return currentProduct.sizes[0];
    const checked = $('input[name="pmSize"]:checked', pmSizesList);
    return checked ? checked.value : null;
  }

  function addFromModal() {
    if (!currentProduct) return;
    const size = getSelectedSize();

    // Sem tamanho escolhido: avisa com uma animação discreta, sem adicionar
    if (!size) {
      pmHint.textContent = "Escolha um tamanho para continuar.";
      pmHint.classList.add("is-error");
      pmSizes.classList.remove("shake");
      void pmSizes.offsetWidth; // reinicia a animação
      pmSizes.classList.add("shake");
      const firstSize = $('input[name="pmSize"]', pmSizesList);
      if (firstSize) firstSize.focus();
      return;
    }

    addToCart(currentProduct.id, size);
    pmAdd.textContent = "Adicionado ✓";
    clearTimeout(addFeedbackTimer);
    addFeedbackTimer = setTimeout(function () {
      pmAdd.textContent = "Adicionar ao carrinho";
    }, 1400);
  }

  // Abre os detalhes. opts.push === false: não cria entrada no histórico (link direto / botão Voltar)
  function openProduct(id, opts) {
    const product = getProduct(id);
    if (!product) return;
    const options = opts || {};

    closeMenu();
    closeAuthUI();
    if (cartEl.classList.contains("is-open")) closeCart();

    const alreadyOpen = modalEl.classList.contains("is-open");
    if (!alreadyOpen) lastFocusedBeforeModal = document.activeElement;

    currentProduct = product;
    renderProductModal(product);

    modalEl.inert = false; // aberto: volta a aceitar foco e cliques
    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    pmScroll.scrollTop = 0;

    // O histórico faz o botão Voltar do navegador/celular fechar os detalhes e voltar à vitrine
    if (options.push !== false && !alreadyOpen) {
      try {
        history.pushState({ urbanProduct: id }, "", "#produto-" + id);
      } catch (error) {
        /* ambiente sem suporte (ex.: alguns arquivos locais): os detalhes funcionam sem histórico */
      }
    }

    pmClose.focus({ preventScroll: true });
  }

  // Fecha apenas a parte visual. Retorna true se estava aberto.
  function closeProductUI() {
    if (!modalEl.classList.contains("is-open")) return false;

    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.inert = true; // fechado: sem foco, sem clique e fora do leitor de tela, na hora
    currentProduct = null;
    unlockScrollIfIdle();

    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
      lastFocusedBeforeModal.focus({ preventScroll: true });
    }
    return true;
  }

  function closeProduct() {
    const wasOpen = closeProductUI();
    if (!wasOpen) return;

    if (history.state && history.state.urbanProduct) {
      history.back(); // desfaz a entrada criada ao abrir; a página continua na mesma posição
    } else if (PRODUCT_HASH.test(location.hash)) {
      // Abriu por link direto (#produto-N): só limpa o endereço
      try {
        history.replaceState(null, "", location.pathname + location.search);
      } catch (error) {
        /* ignora */
      }
    }
  }

  function initProductModal() {
    pmClose.addEventListener("click", closeProduct);
    $("#pmBackdrop").addEventListener("click", closeProduct);
    pmAdd.addEventListener("click", addFromModal);

    pmViewCart.addEventListener("click", function () {
      closeProduct();
      openCart();
    });

    // Escolher um tamanho limpa o aviso de erro
    pmSizesList.addEventListener("change", function () {
      pmHint.classList.remove("is-error");
      pmHint.textContent = "";
      pmSizes.classList.remove("shake");
    });
  }

  /* ---------- 7B. LOGIN E CADASTRO (SUPABASE AUTH) ---------- */
  // Autenticação real com Supabase Auth: e-mail + senha. O nome fica nos metadados do usuário (full_name).
  // O site usa somente a Publishable key; a senha vai direto ao Supabase por HTTPS e nunca é guardada aqui.
  const AUTH_HASH = /^#(login|cadastro|recuperar|nova-senha)$/;
  const ACCOUNT_HASH = /^#minha-conta$/;

  // Troca o endereço (#...) sem criar entrada no histórico. Só marca a entrada como "nossa" se ela já era:
  // assim, em um link direto, fechar a tela não manda a pessoa de volta para fora do site.
  function replaceRoute(hash, marker) {
    const state = history.state;
    const ours = state && (state.urbanAuth || state.urbanAccount || state.urbanProduct);
    try {
      history.replaceState(ours ? marker : null, "", location.pathname + location.search + hash);
    } catch (error) {
      /* ambiente sem suporte a histórico */
    }
  }
  const authEl = $("#authModal");
  const authPanels = $$(".auth__panel", authEl);
  const authClose = $("#authClose");
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  let lastFocusedBeforeAuth = null;
  let sb = null; // cliente do Supabase (null se não configurado ou se a biblioteca não carregou)
  let currentUser = null;
  let authBusy = false;
  let sessionChecked = false; // true depois que o Supabase informou se há sessão salva
  let recoveryMode = false; // true quando a pessoa chegou pelo link de recuperação de senha

  // Detecta, antes do Supabase limpar o endereço, se a pessoa chegou pelo link do e-mail de confirmação
  const cameFromEmailLink = /[#&?]type=(signup|email|magiclink)/.test(location.hash + location.search);
  const cameFromRecoveryLink = /[#&?]type=recovery/.test(location.hash + location.search);
  const emailLinkError = /[#&?]error_code=/.test(location.hash + location.search);

  // Guarda só um "1" na aba (sessionStorage) para a tela "Nova senha" sobreviver a um recarregamento
  function setRecoveryFlag(on) {
    recoveryMode = on;
    try {
      if (on) sessionStorage.setItem("urbanvibe_recovery", "1");
      else sessionStorage.removeItem("urbanvibe_recovery");
    } catch (error) {
      /* armazenamento indisponível: segue sem o recurso */
    }
  }

  function hadRecoveryFlag() {
    try {
      return sessionStorage.getItem("urbanvibe_recovery") === "1";
    } catch (error) {
      return false;
    }
  }

  // Confere a chave: recusa qualquer chave "secret" ou "service_role" no navegador
  function isUnsafeKey(key) {
    if (/^sb_secret_/.test(key)) return true;
    const parts = key.split(".");
    if (parts.length === 3) {
      try {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        return payload.role === "service_role";
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  function createAuthClient() {
    const configured =
      /^https:\/\/[a-z0-9-]+\.supabase\.(co|in)\/?$/i.test(SUPABASE_URL) &&
      SUPABASE_PUBLISHABLE_KEY.length > 20 &&
      SUPABASE_PUBLISHABLE_KEY.indexOf("COLE_AQUI") === -1;

    if (!configured) {
      console.warn("[URBAN VIBE] Supabase não configurado: preencha SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY no topo do script.js.");
      return null;
    }
    if (isUnsafeKey(SUPABASE_PUBLISHABLE_KEY)) {
      console.error("[URBAN VIBE] Chave secreta/service_role detectada no frontend. Use apenas a Publishable key.");
      return null;
    }
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      console.warn("[URBAN VIBE] Biblioteca do Supabase não carregou (CDN indisponível?).");
      return null;
    }
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }

  function displayName(user) {
    const meta = user && user.user_metadata ? user.user_metadata : {};
    const name = (meta.full_name || "").trim();
    if (name) return name;
    return user && user.email ? user.email.split("@")[0] : "";
  }

  // Nome mostrado: o do perfil (banco) e, se ainda não carregou, o dos metadados do usuário
  function currentName() {
    const fromProfile = profile && profile.full_name ? profile.full_name.trim() : "";
    return fromProfile || displayName(currentUser);
  }

  // Ícone do cabeçalho conforme a pessoa esteja logada ou não
  function updateHeaderAccount() {
    const initial = $("#accountInitial");
    const button = $("#accountOpen");
    if (currentUser) {
      const name = currentName();
      initial.textContent = (name.charAt(0) || "?").toUpperCase();
      initial.hidden = false;
      button.classList.add("is-logged");
      button.setAttribute("aria-label", "Minha conta (" + name + ")");
    } else {
      initial.hidden = true;
      initial.textContent = "";
      button.classList.remove("is-logged");
      button.setAttribute("aria-label", "Entrar ou criar conta");
    }
  }

  // Chamada sempre que a sessão muda. Ao trocar de usuário, os dados do anterior são descartados.
  function setCurrentUser(user) {
    const previousId = currentUser ? currentUser.id : null;
    currentUser = user || null;
    const newId = currentUser ? currentUser.id : null;

    if (newId !== previousId) {
      resetProfileState(); // nunca deixa dados de outra pessoa na tela
      // adiado: não chamar o Supabase de dentro do onAuthStateChange evita travar a biblioteca
      if (currentUser) setTimeout(loadProfile, 0);
    }
    updateHeaderAccount();
    renderAccountPage();

    // Saiu da conta (ou a sessão expirou) com a página Minha conta aberta: volta para a loja
    if (!currentUser && accountPageOpen()) closeAccountPage();
  }

  function setAuthView(view) {
    authPanels.forEach(function (panel) {
      const active = panel.dataset.view === view;
      panel.hidden = !active;
      if (active) {
        panel.classList.remove("is-entering");
        void panel.offsetWidth; // reinicia a animação de entrada
        panel.classList.add("is-entering");
      }
    });
    authEl.dataset.view = view;
    const titles = { cadastro: "registerTitle", recuperar: "recoverTitle", "nova-senha": "newPassTitle", login: "loginTitle" };
    authEl.setAttribute("aria-labelledby", titles[view] || "loginTitle");
  }

  function setFormStatus(container, type, message) {
    const el = container.matches(".auth__status") ? container : $(".auth__status", container);
    el.textContent = message || "";
    el.className = "auth__status" + (message ? " is-" + type : "");
    el.hidden = !message;
  }

  function setFormBusy(form, busy, label) {
    authBusy = busy;
    const btn = $('button[type="submit"]', form);
    if (busy) {
      btn.dataset.label = btn.textContent;
      btn.textContent = label;
    } else if (btn.dataset.label) {
      btn.textContent = btn.dataset.label;
    }
    btn.disabled = busy;
    btn.classList.toggle("is-loading", busy);
    form.setAttribute("aria-busy", busy ? "true" : "false");
  }

  function clearAuthForms() {
    $$("form", authEl).forEach(function (form) {
      form.reset();
      setFormStatus(form, "", "");
      $$(".field", form).forEach(function (field) {
        field.classList.remove("is-invalid");
        const input = $("input", field);
        input.removeAttribute("aria-invalid");
        input.type = input.dataset.type || input.type;
        $(".field__error", field).textContent = "";
      });
    });
    $$("form", authEl).forEach((form) => (form.hidden = false)); // volta a mostrar formulários ocultados após sucesso
    $("#newPassDone").hidden = true;
    $$(".field__toggle", authEl).forEach(function (btn) {
      btn.textContent = "Mostrar";
      btn.setAttribute("aria-pressed", "false");
    });
  }

  // Abre o login/cadastro/conta. opts.push === false: sem nova entrada no histórico
  function openAuth(view, opts) {
    const options = opts || {};
    const known = ["login", "cadastro", "recuperar", "nova-senha"];
    let target = known.indexOf(view) !== -1 ? view : "login";
    // "Nova senha" só existe depois de abrir o link de recuperação enviado por e-mail
    if (target === "nova-senha" && !(recoveryMode && currentUser)) target = "login";
    // Logado (fora da recuperação de senha): login/cadastro não fazem sentido, vai para Minha conta
    if (currentUser && !recoveryMode) {
      openAccountPage({ replace: options.push === false });
      return;
    }

    closeMenu();
    if (cartEl.classList.contains("is-open")) closeCart();
    closeProductUI();
    closeAccountPageUI();

    const alreadyOpen = authEl.classList.contains("is-open");
    if (!alreadyOpen) lastFocusedBeforeAuth = document.activeElement;

    if (alreadyOpen && authEl.dataset.view !== target) clearAuthForms();
    setAuthView(target);

    authEl.inert = false;
    authEl.classList.add("is-open");
    authEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    $(".auth__box", authEl).scrollTop = 0;

    if (options.push !== false) {
      try {
        // Trocar entre telas substitui a entrada (o Voltar fecha a tela, não alterna)
        if (alreadyOpen) replaceRoute("#" + target, { urbanAuth: target });
        else history.pushState({ urbanAuth: target }, "", "#" + target);
      } catch (error) {
        /* ambiente sem suporte a histórico: as telas funcionam do mesmo jeito */
      }
    }

    if (!alreadyOpen) authClose.focus({ preventScroll: true });
  }

  function closeAuthUI() {
    if (!authEl.classList.contains("is-open")) return false;
    authEl.classList.remove("is-open");
    authEl.setAttribute("aria-hidden", "true");
    authEl.inert = true;
    clearAuthForms(); // nada digitado fica na página depois de fechar
    unlockScrollIfIdle();

    if (lastFocusedBeforeAuth && typeof lastFocusedBeforeAuth.focus === "function") {
      lastFocusedBeforeAuth.focus({ preventScroll: true });
    }
    return true;
  }

  function closeAuth() {
    if (!closeAuthUI()) return;
    if (history.state && history.state.urbanAuth) {
      history.back();
    } else if (AUTH_HASH.test(location.hash)) {
      try {
        history.replaceState(null, "", location.pathname + location.search);
      } catch (error) {
        /* ignora */
      }
    }
  }

  function setFieldError(field, message) {
    const input = $("input, select", field);
    field.classList.toggle("is-invalid", Boolean(message));
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    $(".field__error", field).textContent = message || "";
  }

  function fieldValue(form, role) {
    return $('input[data-role="' + role + '"]', form).value;
  }

  // Validação no navegador (o Supabase valida de novo no servidor)
  function validateForm(form) {
    const kind = form.dataset.form;
    const fields = {};
    $$(".field", form).forEach(function (field) {
      fields[$("input", field).dataset.role] = field;
    });
    let firstInvalid = null;

    function check(role, message) {
      setFieldError(fields[role], message);
      if (message && !firstInvalid) firstInvalid = $("input", fields[role]);
    }

    if (kind === "register") {
      check("name", fieldValue(form, "name").trim().length < 3 ? "Informe seu nome completo." : "");
    }
    if (kind !== "newpass") {
      check("email", !EMAIL_PATTERN.test(fieldValue(form, "email").trim()) ? "Digite um e-mail válido." : "");
    }
    if (kind === "register" || kind === "newpass") {
      const pass = fieldValue(form, "password");
      check("password", pass.length < 8 ? "Use pelo menos 8 caracteres." : "");
      check("confirm", !fieldValue(form, "confirm") || fieldValue(form, "confirm") !== pass ? "As senhas não conferem." : "");
    } else if (kind === "login") {
      check("password", !fieldValue(form, "password") ? "Digite sua senha." : "");
    }

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  // Traduz erros do Supabase em mensagens claras, sem revelar se um e-mail existe
  function authErrorMessage(error, context) {
    const code = (error && (error.code || "")).toString();
    const status = error && error.status;
    const text = ((error && error.message) || "").toLowerCase();

    if (code === "email_not_confirmed" || text.indexOf("email not confirmed") !== -1) {
      return "Confirme seu e-mail antes de entrar. Procure o link na sua caixa de entrada (e no spam).";
    }
    if (code === "invalid_credentials" || text.indexOf("invalid login credentials") !== -1) {
      return "E-mail ou senha incorretos.";
    }
    if (code === "same_password" || text.indexOf("different from the old password") !== -1) {
      return "A nova senha precisa ser diferente da atual.";
    }
    if (code === "weak_password" || text.indexOf("password should") !== -1) {
      return "Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.";
    }
    if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit" || status === 429) {
      return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.";
    }
    if (code === "email_address_invalid" || text.indexOf("invalid email") !== -1) {
      return "Esse e-mail não pôde ser usado. Verifique o endereço digitado.";
    }
    if (code === "session_not_found" || text.indexOf("session missing") !== -1 || text.indexOf("session_not_found") !== -1) {
      return "Este link expirou ou já foi usado. Peça um novo link de recuperação.";
    }
    if (code === "signup_disabled") {
      return "Novos cadastros estão temporariamente desativados.";
    }
    if (error && (error.name === "AuthRetryableFetchError" || text.indexOf("failed to fetch") !== -1 || text.indexOf("network") !== -1)) {
      return "Não foi possível conectar. Verifique sua internet e tente novamente.";
    }
    const fallback = {
      register: "Não foi possível criar a conta agora. Tente novamente em instantes.",
      recover: "Não foi possível enviar o link agora. Tente novamente em instantes.",
      newpass: "Não foi possível atualizar a senha agora. Tente novamente em instantes."
    };
    return fallback[context] || "Não foi possível entrar agora. Tente novamente em instantes.";
  }

  async function handleRegister(form) {
    const name = fieldValue(form, "name").trim();
    const email = fieldValue(form, "email").trim();
    const password = fieldValue(form, "password");

    setFormStatus(form, "", "");
    if (!sb) return setFormStatus(form, "error", "O cadastro está indisponível no momento. Tente novamente mais tarde.");

    setFormBusy(form, true, "Criando conta…");
    try {
      const options = { data: { full_name: name } };
      if (/^https?:$/.test(location.protocol)) options.emailRedirectTo = location.origin + location.pathname;

      const result = await sb.auth.signUp({ email: email, password: password, options: options });
      if (result.error) throw result.error;

      const open = authEl.classList.contains("is-open");
      if (result.data && result.data.session) {
        // Confirmação de e-mail desligada no painel: a pessoa já entra logada
        showToast("Conta criada! Bem-vindo(a), " + name.split(" ")[0] + ".");
        setFormBusy(form, false);
        closeAuth();
        return;
      }

      // Confirmação de e-mail ativada: mensagem única, também usada se o e-mail já existir (sem revelar)
      form.reset();
      $$(".field", form).forEach((field) => setFieldError(field, ""));
      if (open) {
        setFormStatus(form, "success", "Quase lá! Se o e-mail informado puder ser cadastrado, enviamos um link de confirmação para " + email + ". Confirme para poder entrar.");
      } else {
        showToast("Enviamos um link de confirmação para o seu e-mail.");
      }
    } catch (error) {
      setFormStatus(form, "error", authErrorMessage(error, "register"));
      $('input[data-role="password"]', form).value = "";
      $('input[data-role="confirm"]', form).value = "";
    } finally {
      setFormBusy(form, false);
    }
  }

  async function handleLogin(form) {
    const email = fieldValue(form, "email").trim();
    const password = fieldValue(form, "password");

    setFormStatus(form, "", "");
    if (!sb) return setFormStatus(form, "error", "O login está indisponível no momento. Tente novamente mais tarde.");

    setFormBusy(form, true, "Entrando…");
    try {
      const result = await sb.auth.signInWithPassword({ email: email, password: password });
      if (result.error) throw result.error;

      setCurrentUser(result.data.user);
      showToast("Bem-vindo(a), " + displayName(result.data.user).split(" ")[0] + "!");
      setFormBusy(form, false);
      closeAuth();
    } catch (error) {
      setFormStatus(form, "error", authErrorMessage(error, "login"));
      $('input[data-role="password"]', form).value = "";
    } finally {
      setFormBusy(form, false);
    }
  }

  // Envia o link de recuperação de senha (resetPasswordForEmail)
  async function handleRecover(form) {
    const email = fieldValue(form, "email").trim();
    setFormStatus(form, "", "");
    if (!sb) return setFormStatus(form, "error", "A recuperação de senha está indisponível no momento. Tente novamente mais tarde.");

    setFormBusy(form, true, "Enviando…");
    try {
      const options = {};
      // Volta para a página inicial do site; a loja abre a tela "Nova senha" ao reconhecer o link
      if (/^https?:$/.test(location.protocol)) options.redirectTo = location.origin + location.pathname;

      const result = await sb.auth.resetPasswordForEmail(email, options);
      if (result.error) throw result.error;

      form.reset();
      $$(".field", form).forEach((field) => setFieldError(field, ""));
      // Mesma mensagem exista ou não conta com esse e-mail (não revela quem tem cadastro)
      setFormStatus(form, "success", "Se existir uma conta com " + email + ", enviamos um link para criar uma nova senha. Confira também o spam.");
    } catch (error) {
      setFormStatus(form, "error", authErrorMessage(error, "recover"));
    } finally {
      setFormBusy(form, false);
    }
  }

  // Salva a nova senha (updateUser) usando a sessão aberta pelo link do e-mail
  async function handleNewPassword(form) {
    const password = fieldValue(form, "password");
    setFormStatus(form, "", "");
    if (!sb) return setFormStatus(form, "error", "Não foi possível atualizar a senha no momento. Tente novamente mais tarde.");

    setFormBusy(form, true, "Salvando…");
    try {
      const result = await sb.auth.updateUser({ password: password });
      if (result.error) throw result.error;

      setRecoveryFlag(false);
      form.reset();
      $$(".field", form).forEach((field) => setFieldError(field, ""));
      // Encerra a sessão de recuperação: a pessoa entra de novo com a senha nova
      try {
        await sb.auth.signOut();
      } catch (signOutError) {
        /* a senha já foi trocada; seguimos */
      }
      setCurrentUser(null);
      form.hidden = true;
      $("#newPassDone").hidden = false;
      showToast("Senha atualizada com sucesso!");
    } catch (error) {
      setFormStatus(form, "error", authErrorMessage(error, "newpass"));
    } finally {
      setFormBusy(form, false);
    }
  }

  async function handleLogout(button) {
    if (!sb || authBusy) return;
    authBusy = true;
    button.disabled = true;
    const status = $("#apAccountStatus");
    setFormStatus(status, "", "");
    try {
      const result = await sb.auth.signOut();
      if (result.error) throw result.error;
      setCurrentUser(null);
      showToast("Você saiu da sua conta.");
    } catch (error) {
      setFormStatus(status, "error", "Não foi possível sair agora. Tente novamente.");
    } finally {
      authBusy = false;
      button.disabled = false;
    }
  }

  function initAuth() {
    // Cliente Supabase e sessão (o supabase-js guarda e renova a sessão sozinho)
    sb = createAuthClient();
    if (sb) {
      sb.auth.getSession().then(function (result) {
        if (result.data && result.data.session) {
          setCurrentUser(result.data.session.user);
          if (hadRecoveryFlag()) recoveryMode = true; // recarregou a página durante a recuperação de senha
        } else {
          setRecoveryFlag(false);
        }
        sessionChecked = true;
        // Link direto para Minha conta / login: agora que a sessão é conhecida, abre a tela certa
        if (ACCOUNT_HASH.test(location.hash) || AUTH_HASH.test(location.hash)) syncFromLocation();
      });
      sb.auth.onAuthStateChange(function (event, session) {
        if (event === "SIGNED_OUT") setRecoveryFlag(false);
        setCurrentUser(session ? session.user : null);

        if (event === "PASSWORD_RECOVERY") {
          // Chegou pelo link de recuperação: abre a tela para cadastrar a nova senha
          setRecoveryFlag(true);
          try {
            replaceRoute("#nova-senha", { urbanAuth: "nova-senha" });
          } catch (error) {
            /* ignora */
          }
          openAuth("nova-senha", { push: false });
        } else if (event === "SIGNED_IN" && cameFromEmailLink && !cameFromRecoveryLink) {
          showToast("E-mail confirmado! Sua conta está ativa.");
        }
      });
    } else {
      sessionChecked = true;
    }
    if (emailLinkError) {
      showToast("Link de confirmação inválido ou expirado. Tente criar a conta ou entrar novamente.");
      try {
        history.replaceState(null, "", location.pathname + location.search);
      } catch (error) {
        /* ignora */
      }
    }

    $("#accountOpen").addEventListener("click", function () {
      if (currentUser) openAccountPage();
      else openAuth("login");
    });
    authClose.addEventListener("click", closeAuth);
    $("#authBackdrop").addEventListener("click", closeAuth);

    // Links "Cadastre-se aqui" / "Faça login"
    $$("[data-auth-view]", authEl).forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        openAuth(link.dataset.authView);
      });
    });

    // Mostrar/ocultar senha
    $$(".field__toggle", authEl).forEach(function (btn) {
      btn.addEventListener("click", function () {
        const input = $("input", btn.closest(".field"));
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.textContent = show ? "Ocultar" : "Mostrar";
        btn.setAttribute("aria-pressed", show ? "true" : "false");
      });
    });

    // Esqueci minha senha: abre a tela de recuperação (levando o e-mail já digitado, se for válido)
    $("#forgotPassword").addEventListener("click", function () {
      const typed = $("#loginEmail").value.trim();
      openAuth("recuperar");
      if (EMAIL_PATTERN.test(typed)) $("#recEmail").value = typed;
    });

    $$("form", authEl).forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (authBusy || !validateForm(form)) return;
        const kind = form.dataset.form;
        if (kind === "register") handleRegister(form);
        else if (kind === "recover") handleRecover(form);
        else if (kind === "newpass") handleNewPassword(form);
        else handleLogin(form);
      });

      // Apaga o aviso do campo assim que a pessoa volta a digitar
      form.addEventListener("input", function (event) {
        const field = event.target.closest(".field");
        if (field && field.classList.contains("is-invalid")) setFieldError(field, "");
      });
    });
  }

  /* ---------- 7C. MINHA CONTA (PERFIL E ENDEREÇO NO SUPABASE) ---------- */
  // Tabela public.profiles (ver supabase-profiles.sql). Com RLS, cada pessoa só enxerga e edita a própria linha.
  const accountPageEl = $("#accountPage");
  const addressForm = $("#addressForm");
  const PROFILE_SELECT = "full_name,cep,street,number,complement,neighborhood,city,state";
  const ADDRESS_FIELDS = ["cep", "street", "number", "complement", "neighborhood", "city", "state"];
  const ADDRESS_REQUIRED = ["cep", "street", "number", "neighborhood", "city", "state"];
  const UF_LIST = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
  let profile = null; // linha de profiles da pessoa logada (ou null)
  let profileExists = false; // já existe linha no banco? (define insert x update)
  let profileState = "idle"; // idle | loading | ready | error
  let profileRequest = 0; // descarta respostas atrasadas de outra sessão
  let profileBusy = false;
  let accountScrollY = 0;
  let lastFocusedBeforeAccount = null;

  function accountPageOpen() {
    return !accountPageEl.hidden;
  }

  function resetProfileState() {
    profile = null;
    profileExists = false;
    profileState = "idle";
    profileRequest += 1;
    addressForm.reset();
    $$(".field", addressForm).forEach((field) => setFieldError(field, ""));
    setFormStatus($("#apSaveStatus"), "", "");
    setFormStatus($("#apLoadStatus"), "", "");
    setFormStatus($("#apAccountStatus"), "", "");
  }

  function formatCep(digits) {
    const d = (digits || "").replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
  }

  function addressInput(name) {
    return $('[data-field="' + name + '"]', addressForm);
  }

  // Escreve no formulário os dados do perfil carregado
  function fillAddressForm() {
    ADDRESS_FIELDS.forEach(function (name) {
      const value = profile && profile[name] ? profile[name] : "";
      addressInput(name).value = name === "cep" ? formatCep(value) : value;
    });
  }

  function renderAccountPage() {
    if (!currentUser) {
      $("#apName").textContent = "";
      $("#apEmail").textContent = "";
      $("#apAvatar").textContent = "";
      return;
    }
    const name = currentName();
    $("#apName").textContent = name;
    $("#apEmail").textContent = currentUser.email || "";
    $("#apAvatar").textContent = (name.charAt(0) || "?").toUpperCase();

    const ready = profileState === "ready";
    $$("input, select", addressForm).forEach((el) => (el.disabled = !ready));
    $("#apSave").disabled = !ready || profileBusy;

    const loadStatus = $("#apLoadStatus");
    if (profileState === "loading") {
      setFormStatus(loadStatus, "info", "Carregando seu endereço…");
    } else if (profileState === "error") {
      setFormStatus(loadStatus, "error", "Não foi possível carregar seus dados agora. ");
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "auth__retry";
      retry.textContent = "Tentar novamente";
      retry.addEventListener("click", loadProfile);
      loadStatus.appendChild(retry);
    } else {
      setFormStatus(loadStatus, "", "");
    }
  }

  function profileErrorMessage(error, saving) {
    const code = ((error && error.code) || "").toString();
    const text = ((error && error.message) || "").toLowerCase();
    if (code === "PGRST205" || code === "42P01" || text.indexOf("could not find the table") !== -1) {
      console.warn("[URBAN VIBE] Tabela public.profiles não encontrada: execute o arquivo supabase-profiles.sql no SQL Editor do Supabase.");
      return "O cadastro de endereço ainda não está disponível. Tente novamente mais tarde.";
    }
    if (error && (error.name === "AuthRetryableFetchError" || text.indexOf("failed to fetch") !== -1 || text.indexOf("network") !== -1)) {
      return "Não foi possível conectar. Verifique sua internet e tente novamente.";
    }
    if (code === "42501" || text.indexOf("row-level security") !== -1 || text.indexOf("permission denied") !== -1) {
      return "Sua sessão não tem permissão para isso. Saia e entre novamente na conta.";
    }
    if (code === "23514") return "Algum campo está em formato inválido. Confira os dados e tente de novo.";
    return saving ? "Não foi possível salvar agora. Tente novamente em instantes." : "Não foi possível carregar seus dados agora.";
  }

  // Busca o perfil da pessoa logada (a RLS já devolve só a própria linha; o .eq("id") reforça)
  async function loadProfile() {
    if (!sb || !currentUser) return;
    const uid = currentUser.id;
    const request = ++profileRequest;
    profileState = "loading";
    renderAccountPage();

    let nextState = "ready";
    let row = null;
    try {
      const result = await sb.from("profiles").select(PROFILE_SELECT).eq("id", uid).maybeSingle();
      if (result.error) throw result.error;
      row = result.data;
    } catch (error) {
      nextState = "error";
      console.warn("[URBAN VIBE] Falha ao carregar perfil:", error && error.message);
    }

    // Se a sessão mudou enquanto a resposta vinha, ignora (nunca mostra dados de outra pessoa)
    if (request !== profileRequest || !currentUser || currentUser.id !== uid) return;
    profileState = nextState;
    if (nextState === "ready") {
      profile = row;
      profileExists = Boolean(row);
      fillAddressForm();
      updateHeaderAccount();
    }
    renderAccountPage();
  }

  function cleanText(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function validateAddress() {
    const values = {};
    ADDRESS_FIELDS.forEach(function (name) {
      const raw = addressInput(name).value;
      values[name] = name === "cep" ? raw.replace(/\D/g, "") : name === "state" ? raw.trim().toUpperCase() : cleanText(raw);
    });
    const anyFilled = ADDRESS_FIELDS.some((name) => values[name] !== "");
    let firstInvalid = null;

    ADDRESS_FIELDS.forEach(function (name) {
      const input = addressInput(name);
      let message = "";
      if (anyFilled && ADDRESS_REQUIRED.indexOf(name) !== -1 && !values[name]) message = "Preencha este campo.";
      else if (name === "cep" && values.cep && values.cep.length !== 8) message = "CEP inválido. Use 8 números.";
      else if (name === "state" && values.state && UF_LIST.indexOf(values.state) === -1) message = "Escolha um estado.";
      setFieldError(input.closest(".field"), message);
      if (message && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return null;
    }
    return values;
  }

  async function saveAddress() {
    if (!sb || !currentUser || profileBusy || profileState !== "ready") return;
    const values = validateAddress();
    const status = $("#apSaveStatus");
    setFormStatus(status, "", "");
    if (!values) return;

    const uid = currentUser.id;
    const payload = {};
    ADDRESS_FIELDS.forEach((name) => (payload[name] = values[name] === "" ? null : values[name]));

    profileBusy = true;
    const button = $("#apSave");
    button.dataset.label = button.textContent;
    button.textContent = "Salvando…";
    button.classList.add("is-loading");
    button.disabled = true;
    try {
      let result;
      if (profileExists) {
        // .select() devolve a linha alterada: se vier vazio, a RLS bloqueou e nada foi salvo
        result = await sb.from("profiles").update(payload).eq("id", uid).select("id");
        if (!result.error && (!result.data || result.data.length === 0)) {
          throw { code: "42501", message: "row-level security" };
        }
      } else {
        // Perfil ainda não existe (ex.: conta antiga): cria a própria linha
        const insertRow = Object.assign({ id: uid, full_name: currentName() }, payload);
        result = await sb.from("profiles").insert(insertRow);
      }
      if (result.error) throw result.error;

      if (!currentUser || currentUser.id !== uid) return;
      profile = Object.assign({}, profile || { full_name: currentName() }, payload);
      profileExists = true;
      fillAddressForm();
      setFormStatus(status, "success", "Endereço salvo com sucesso!");
      showToast("Endereço salvo com sucesso!");
    } catch (error) {
      setFormStatus(status, "error", profileErrorMessage(error, true));
    } finally {
      profileBusy = false;
      button.textContent = button.dataset.label || "Salvar alterações";
      button.classList.remove("is-loading");
      renderAccountPage();
    }
  }

  // Abre a página Minha conta (a loja fica oculta enquanto ela está aberta)
  function openAccountPage(opts) {
    const options = opts || {};
    if (!currentUser) {
      openAuth("login");
      return;
    }
    closeMenu();
    if (cartEl.classList.contains("is-open")) closeCart();
    closeProductUI();
    closeAuthUI();

    const alreadyOpen = accountPageOpen();
    if (!alreadyOpen) {
      lastFocusedBeforeAccount = document.activeElement;
      accountScrollY = window.scrollY;
      document.body.classList.add("view-account");
      accountPageEl.hidden = false;
      window.scrollTo(0, 0);
    }

    try {
      if (options.replace) replaceRoute("#minha-conta", { urbanAccount: true });
      else if (options.push !== false && !alreadyOpen) history.pushState({ urbanAccount: true }, "", "#minha-conta");
    } catch (error) {
      /* ambiente sem suporte a histórico: a página funciona sem ele */
    }

    renderAccountPage();
    if (profileState === "idle" || profileState === "error") loadProfile();
    $("#apTitle").focus({ preventScroll: true });
  }

  function closeAccountPageUI() {
    if (!accountPageOpen()) return false;
    accountPageEl.hidden = true;
    document.body.classList.remove("view-account");
    setFormStatus($("#apSaveStatus"), "", "");
    setFormStatus($("#apAccountStatus"), "", "");
    window.scrollTo(0, accountScrollY); // volta para onde a pessoa estava na loja
    if (lastFocusedBeforeAccount && typeof lastFocusedBeforeAccount.focus === "function" && document.contains(lastFocusedBeforeAccount)) {
      lastFocusedBeforeAccount.focus({ preventScroll: true });
    }
    return true;
  }

  function closeAccountPage() {
    if (!closeAccountPageUI()) return;
    if (history.state && history.state.urbanAccount) {
      history.back();
    } else if (ACCOUNT_HASH.test(location.hash)) {
      try {
        history.replaceState(null, "", location.pathname + location.search);
      } catch (error) {
        /* ignora */
      }
    }
  }

  function initAccountPage() {
    $("#apBack").addEventListener("click", closeAccountPage);
    $("#apLogout").addEventListener("click", function () {
      handleLogout(this);
    });

    addressForm.addEventListener("submit", function (event) {
      event.preventDefault();
      saveAddress();
    });

    // Máscara do CEP (00000-000) e limpeza do aviso ao digitar
    addressForm.addEventListener("input", function (event) {
      if (event.target.dataset.field === "cep") event.target.value = formatCep(event.target.value);
      const field = event.target.closest(".field");
      if (field && field.classList.contains("is-invalid")) setFieldError(field, "");
      setFormStatus($("#apSaveStatus"), "", "");
    });
    addressForm.addEventListener("change", function () {
      setFormStatus($("#apSaveStatus"), "", "");
    });
  }

  // Mantém produto, login/cadastro/recuperação e Minha conta sincronizados com o endereço
  function syncFromLocation() {
    const authMatch = AUTH_HASH.exec(location.hash);
    const productMatch = PRODUCT_HASH.exec(location.hash);

    if (ACCOUNT_HASH.test(location.hash)) {
      if (!sessionChecked) return; // espera o Supabase dizer se há sessão salva
      if (!currentUser) {
        try {
          replaceRoute("#login", { urbanAuth: "login" });
        } catch (error) {
          /* ignora */
        }
        openAuth("login", { push: false });
      } else {
        openAccountPage({ push: false });
      }
    } else if (authMatch) {
      if (!sessionChecked) return; // espera saber se há sessão (evita abrir "login" para quem já está logado)
      openAuth(authMatch[1], { push: false });
    } else if (productMatch && getProduct(parseInt(productMatch[1], 10))) {
      closeAccountPageUI();
      openProduct(parseInt(productMatch[1], 10), { push: false });
    } else {
      closeProductUI();
      closeAuthUI();
      // Saiu da Minha conta por um link do menu (ex.: #destaques): leva até a seção pedida
      if (closeAccountPageUI() && location.hash.length > 1) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) target.scrollIntoView();
      }
    }
  }

  function initRouting() {
    // Botão Voltar/Avançar do navegador e links diretos
    window.addEventListener("popstate", syncFromLocation);
    syncFromLocation();
  }

  /* ---------- 8. MENU MOBILE, HEADER E SCROLL ---------- */
  const headerEl = $("#header");
  const navEl = $("#nav");
  const menuToggle = $("#menuToggle");

  // Abre/fecha o menu mobile mantendo header, botão, ARIA e bloqueio de rolagem sincronizados
  function setMenuState(open) {
    navEl.classList.toggle("is-open", open);
    headerEl.classList.toggle("menu-open", open);
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");

    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      unlockScrollIfIdle();
    }
  }

  function closeMenu() {
    setMenuState(false);
  }

  function toggleMenu() {
    setMenuState(!navEl.classList.contains("is-open"));
  }

  function initHeader() {
    menuToggle.addEventListener("click", toggleMenu);

    // Fecha o menu ao clicar em um link
    $$(".nav__link").forEach((link) => link.addEventListener("click", closeMenu));

    // Fundo do header ao rolar a página
    function onScroll() {
      headerEl.classList.toggle("is-scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Garante que o menu mobile feche se a tela voltar ao tamanho de desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  function initRevealOnScroll() {
    const elements = $$(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ---------- 9. INICIALIZAÇÃO ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    $("#year").textContent = new Date().getFullYear();
    initHeader();
    initProducts();
    initCart();
    initCartDrawer();
    initProductModal();
    initGallery();
    initAuth();
    initAccountPage();
    initRouting();
    initRevealOnScroll();
  });
})();
