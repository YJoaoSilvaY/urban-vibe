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

  // Campos de cada produto: id, name, category (masculino | feminino | acessorios), type, price, badge,
  // sizes, description, details, added (data de lançamento: usada em "Mais recentes"),
  // featured (true = aparece em "Produtos em destaque" na página inicial) e as imagens:
  //   - image: foto principal (opcional). Sem "image", a vista frontal é gerada a partir de "art".
  //   - art: { kind, color, ... } gera as vistas frontal e de costas na cor do produto.
  //   - images: ["url1", "url2"] (opcional) troca as duas imagens por fotos reais suas.
  const PRODUCTS = [
    {
      id: 1,
      name: "Camiseta Oversized Essential Preta",
      category: "masculino",
      type: "Camiseta",
      price: 129.9,
      badge: "Novo",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
      added: "2026-09-20",
      art: { kind: "tee", color: "#0f0f0f" },
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
      added: "2026-08-10",
      featured: true,
      art: { kind: "hoodie", color: "#141414" },
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
      added: "2026-09-05",
      art: { kind: "jacket", color: "#1c1c1c", style: "wind" },
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
      added: "2026-08-25",
      featured: true,
      art: { kind: "pants", color: "#8a8a86", style: "cargo" },
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
      added: "2026-09-28",
      art: { kind: "tee", color: "#f2f2ee", crop: true },
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
      added: "2026-07-15",
      art: { kind: "hoodie", color: "#9a9a98" },
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
      added: "2026-08-18",
      featured: true,
      art: { kind: "pants", color: "#2b2b2b", style: "wide" },
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
      added: "2026-09-12",
      featured: true,
      art: { kind: "jacket", color: "#0b0b0b", style: "bomber" },
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
      added: "2026-07-01",
      featured: true,
      art: { kind: "cap", color: "#1a1a1a", style: "dad" },
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
      added: "2026-09-30",
      featured: true,
      art: { kind: "crossbody", color: "#111111" },
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
      added: "2026-06-20",
      art: { kind: "socks", color: "#f2f2ee" },
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
      added: "2026-07-28",
      art: { kind: "beanie", color: "#3a3a39" },
      sizes: SIZES_ONE,
      description:
        "Preto, branco e cinza em tricô canelado. O beanie URBAN VIBE tem punho dobrável, malha elástica que abraça sem apertar e etiqueta bordada discreta. Quente o bastante para o frio, leve o bastante para usar o dia inteiro.",
      details: [
        "Tricô canelado em acrílico",
        "Punho dobrável",
        "Malha elástica que se adapta à cabeça (tamanho único)",
        "Etiqueta bordada URBAN VIBE"
      ]
    },
    {
      id: 13,
      name: "Camiseta Estampada City Nights Preta",
      category: "masculino",
      type: "Camiseta estampada",
      price: 139.9,
      badge: "Novo",
      added: "2026-11-05",
      art: { kind: "tee", color: "#0f0f0f", print: "skyline", printInk: "#f4f4f2" },
      sizes: SIZES_CLOTHING,
      description:
        "A cidade acordada de madrugada, estampada no peito e nas costas. Camiseta preta com skyline em silk de alta definição, modelagem solta e algodão encorpado. Peça de rolê para usar com cargo, bermuda ou jaqueta por cima.",
      details: [
        "100% algodão penteado, 200 g/m²",
        "Estampa em silk frente e costas",
        "Modelagem solta, ombro levemente caído",
        "Gola em ribana reforçada"
      ]
    },
    {
      id: 14,
      name: "Camiseta Oversized Washed Grey",
      category: "masculino",
      type: "Camiseta oversized",
      price: 134.9,
      badge: "",
      added: "2026-10-28",
      art: { kind: "tee", color: "#9a9a98" },
      sizes: SIZES_CLOTHING,
      description:
        "Cinza lavado com aquele ar de peça vivida desde o primeiro dia. Oversized de verdade, com caimento largo, manga ampla e tecido macio por causa da lavagem enzimática. Fácil de combinar com preto, branco e tudo no meio.",
      details: [
        "100% algodão com lavagem enzimática",
        "Modelagem oversized",
        "Manga ampla e barra reta",
        "Etiqueta interna estampada"
      ]
    },
    {
      id: 15,
      name: "Calça Cargo Utility Black",
      category: "masculino",
      type: "Calça cargo",
      price: 269.9,
      badge: "",
      added: "2026-10-20",
      art: { kind: "pants", color: "#111111", style: "cargo" },
      sizes: SIZES_CLOTHING,
      description:
        "A cargo preta que resolve o look inteiro. Bolsos laterais com aba e botão, cós firme com passadores e perna reta para usar com tênis ou bota. Sarja resistente que aguenta o dia a dia sem perder a forma.",
      details: [
        "Sarja de algodão com elastano",
        "Bolsos cargo laterais com aba e botão",
        "Cós com passadores e fecho com zíper",
        "Perna reta, barra com costura dupla"
      ]
    },
    {
      id: 16,
      name: "Bermuda Cargo Concrete",
      category: "masculino",
      type: "Bermuda",
      price: 179.9,
      badge: "Novo",
      added: "2026-11-08",
      art: { kind: "pants", color: "#8a8a86", style: "cargoshorts" },
      sizes: SIZES_CLOTHING,
      description:
        "Para os dias quentes sem abrir mão da atitude. Bermuda cargo no cinza concreto, na altura do joelho, com bolsos laterais de verdade e tecido leve que respira. Combina com camiseta oversized e tênis.",
      details: [
        "Sarja leve de algodão",
        "Altura do joelho",
        "Dois bolsos cargo com aba",
        "Cós com passadores e zíper"
      ]
    },
    {
      id: 17,
      name: "Moletom Crewneck Heavy Off White",
      category: "masculino",
      type: "Moletom",
      price: 259.9,
      badge: "",
      added: "2026-10-15",
      art: { kind: "hoodie", color: "#f2f2ee", hood: false },
      sizes: SIZES_CLOTHING,
      description:
        "Moletom de gola redonda em felpa pesada, no off white que ilumina qualquer composição. Ribana grossa nos punhos, na gola e na barra, caimento boxy e interior macio para os dias de frio na cidade.",
      details: [
        "Moletom flanelado, 380 g/m²",
        "Gola, punhos e barra em ribana grossa",
        "Modelagem boxy",
        "Etiqueta bordada discreta"
      ]
    },
    {
      id: 18,
      name: "Jaqueta Coach Black Label",
      category: "masculino",
      type: "Jaqueta",
      price: 329.9,
      badge: "Edição limitada",
      added: "2026-11-02",
      art: { kind: "jacket", color: "#1a1a1a", style: "coach" },
      sizes: SIZES_CLOTHING,
      description:
        "A jaqueta coach da URBAN VIBE: gola reta, fechamento por zíper e bolsos frontais embutidos. Tecido leve e resistente ao vento, com assinatura estampada nas costas. Edição limitada, produzida em pequena tiragem.",
      details: [
        "Nylon resinado resistente a vento",
        "Forro leve em poliéster",
        "Dois bolsos frontais embutidos",
        "Assinatura estampada nas costas"
      ]
    },
    {
      id: 19,
      name: "Camiseta Oversized Off White Feminina",
      category: "feminino",
      type: "Camiseta oversized",
      price: 124.9,
      badge: "",
      added: "2026-10-30",
      art: { kind: "tee", color: "#f2f2ee" },
      sizes: SIZES_CLOTHING,
      description:
        "O básico que nunca sai de moda, na versão oversized. Off white, caimento solto e tecido encorpado que não marca. Usa com calça wide leg, cargo ou por dentro de uma saia: sempre funciona.",
      details: [
        "100% algodão penteado, 200 g/m²",
        "Modelagem oversized",
        "Gola em ribana reforçada",
        "Barra reta com costura dupla"
      ]
    },
    {
      id: 20,
      name: "Camiseta Estampada Vibe Ring Preta",
      category: "feminino",
      type: "Camiseta estampada",
      price: 139.9,
      badge: "Novo",
      added: "2026-11-06",
      art: { kind: "tee", color: "#0f0f0f", print: "ring", printInk: "#f4f4f2" },
      sizes: SIZES_CLOTHING,
      description:
        "Preta, solta e com o símbolo UV em destaque. O círculo duplo no peito e a assinatura gigante nas costas deixam o visual com cara de coleção de rua. Tecido macio e modelagem confortável.",
      details: [
        "100% algodão penteado",
        "Estampa em silk frente e costas",
        "Modelagem solta",
        "Gola em ribana reforçada"
      ]
    },
    {
      id: 21,
      name: "Calça Cargo Cinza Street",
      category: "feminino",
      type: "Calça cargo",
      price: 249.9,
      badge: "",
      added: "2026-10-12",
      art: { kind: "pants", color: "#9a9a98", style: "cargo" },
      sizes: SIZES_CLOTHING,
      description:
        "Cargo cinza de cintura marcada e perna reta, com bolsos laterais de aba que são a cara do streetwear. Sarja macia, cós firme e barra que pode ser usada solta ou dobrada.",
      details: [
        "Sarja de algodão com elastano",
        "Bolsos cargo laterais",
        "Cós com passadores",
        "Perna reta e barra com costura dupla"
      ]
    },
    {
      id: 22,
      name: "Bermuda Ciclista Black",
      category: "feminino",
      type: "Bermuda",
      price: 109.9,
      badge: "Mais vendido",
      added: "2026-10-25",
      art: { kind: "pants", color: "#111111", style: "bike" },
      sizes: SIZES_CLOTHING,
      description:
        "A bermuda ciclista preta que vai de academia a rolê. Cintura alta, tecido com compressão leve e que não fica transparente, perfeita por baixo de camisetas longas e moletons oversized.",
      details: [
        "Poliamida com elastano",
        "Cintura alta com elástico largo",
        "Tecido opaco com compressão leve",
        "Costura plana, sem marcas"
      ]
    },
    {
      id: 23,
      name: "Moletom Cropped Hoodie Off White",
      category: "feminino",
      type: "Moletom",
      price: 269.9,
      badge: "",
      added: "2026-11-01",
      art: { kind: "hoodie", color: "#f2f2ee", crop: true },
      sizes: SIZES_CLOTHING,
      description:
        "Hoodie cropped em off white, com capuz amplo, cordão ajustável e barra na altura da cintura. Combina com calça de cintura alta e fica ótimo em camadas com camiseta longa por baixo.",
      details: [
        "Moletom flanelado macio",
        "Capuz com cordão ajustável",
        "Modelagem cropped",
        "Punhos e barra em ribana"
      ]
    },
    {
      id: 24,
      name: "Jaqueta Corta-Vento Grafite",
      category: "feminino",
      type: "Jaqueta",
      price: 339.9,
      badge: "",
      added: "2026-10-18",
      art: { kind: "jacket", color: "#3a3a39", style: "wind" },
      sizes: SIZES_CLOTHING,
      description:
        "Leve, resistente e com faixa refletiva no peito. A corta-vento grafite protege do vento e da garoa sem pesar, tem gola alta, zíper frontal e bolsos laterais com fechamento.",
      details: [
        "Nylon leve resistente a vento e respingos",
        "Faixa refletiva no peito",
        "Gola alta e zíper frontal",
        "Bolsos laterais com fechamento"
      ]
    },
    {
      id: 25,
      name: "Boné Trucker Black",
      category: "acessorios",
      type: "Boné",
      price: 79.9,
      badge: "",
      added: "2026-10-22",
      art: { kind: "cap", color: "#111111", style: "trucker" },
      sizes: SIZES_ONE,
      description:
        "O trucker clássico em preto: frente firme com patch UV, laterais e parte de trás em tela que deixa a cabeça respirar. Aba curva e ajuste regulável para qualquer tamanho.",
      details: [
        "Frente em espuma estruturada",
        "Tela respirável nas laterais e atrás",
        "Aba curva",
        "Regulagem com snap traseiro (tamanho único)"
      ]
    },
    {
      id: 26,
      name: "Boné Snapback Aba Reta Branco",
      category: "acessorios",
      type: "Boné",
      price: 84.9,
      badge: "Novo",
      added: "2026-11-04",
      art: { kind: "cap", color: "#f2f2ee", style: "snapback" },
      sizes: SIZES_ONE,
      description:
        "Aba reta, copa estruturada e patch UV bordado no centro. O snapback branco dá contraste em looks pretos e funciona com qualquer camiseta. Regulagem em snap atrás.",
      details: [
        "Sarja de algodão",
        "Copa estruturada de 6 painéis",
        "Aba reta",
        "Regulagem com snap (tamanho único)"
      ]
    },
    {
      id: 27,
      name: "Bucket Hat Urban Black",
      category: "acessorios",
      type: "Chapéu",
      price: 99.9,
      badge: "",
      added: "2026-10-26",
      art: { kind: "bucket", color: "#141414" },
      sizes: SIZES_ONE,
      description:
        "O bucket hat preto que voltou com tudo. Aba larga para proteger do sol, copa macia que dobra e vai na mochila, olhais laterais para ventilação e patch UV na frente.",
      details: [
        "Sarja de algodão macia",
        "Aba média com costura dupla",
        "Olhais laterais para ventilação",
        "Dobrável, tamanho único"
      ]
    },
    {
      id: 28,
      name: "Pochete Waist Bag Black",
      category: "acessorios",
      type: "Pochete",
      price: 139.9,
      badge: "Novo",
      added: "2026-11-07",
      art: { kind: "waist", color: "#161616" },
      sizes: SIZES_ONE,
      description:
        "Compacta e prática: cabem celular, chaves e carteira. Zíper com dois cursores, bolso frontal e alça com regulagem para usar na cintura ou atravessada no peito.",
      details: [
        "Poliéster 600D resistente à água",
        "Zíper com dois cursores",
        "Bolso frontal extra",
        "Alça regulável com fivela"
      ]
    },
    {
      id: 29,
      name: "Ecobag Tote Canvas Off White",
      category: "acessorios",
      type: "Bolsa",
      price: 74.9,
      badge: "",
      added: "2026-10-10",
      art: { kind: "tote", color: "#f2f2ee" },
      sizes: SIZES_ONE,
      description:
        "Tote de lona grossa com a assinatura URBAN VIBE estampada na frente. Alças longas para usar no ombro, boca ampla e costuras reforçadas que seguram o peso do dia a dia.",
      details: [
        "Lona 100% algodão",
        "Alças reforçadas",
        "Estampa URBAN VIBE em silk",
        "Costuras duplas"
      ]
    },
    {
      id: 30,
      name: "Cinto Tático Preto",
      category: "acessorios",
      type: "Cinto",
      price: 69.9,
      badge: "",
      added: "2026-10-05",
      art: { kind: "belt", color: "#1c1c1c" },
      sizes: ["P/M", "G/GG"],
      description:
        "O cinto que fecha o look utilitário: fita resistente com furos de ajuste e fivela quadrada em metal escovado. Combina com cargo, bermuda e calça wide leg.",
      details: [
        "Fita de nylon resistente",
        "Fivela quadrada em metal escovado",
        "Furos de ajuste",
        "Disponível em P/M e G/GG"
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

  // ----- Imagens dos produtos geradas no código (ilustração frente/costas, sem internet) -----
  // Cada produto tem "art: { kind, color, ... }". A vista frontal e a de costas viram imagens SVG
  // na cor exata do produto. Para usar fotos reais no lugar, veja o campo "images" em productPhotos().
  const artCache = {};

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

  // Pequenos blocos de desenho reutilizados pelas peças
  function artPath(d, extra) {
    return '<path d="' + d + '" ' + (extra || "") + "/>";
  }

  function artRibs(x, y, w, h, fill, line) {
    let out = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"/>';
    for (let i = x + 9; i < x + w - 3; i += 11) {
      out += '<path d="M' + i + " " + y + "V" + (y + h) + '" stroke="' + line + '" stroke-width="2.4" opacity="0.55"/>';
    }
    return out;
  }

  function artText(text, x, y, size, fill, spacing, weight) {
    return (
      '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-weight="' + (weight || 800) +
      '" font-size="' + size + '" letter-spacing="' + (spacing || 0) + '" fill="' + fill + '">' + text + "</text>"
    );
  }

  // Estampas das camisetas (frente: peito; costas: grande)
  function artGraphic(style, x, y, scale, ink) {
    const bars = [34, 62, 46, 88, 54, 72, 40, 96, 58, 66, 44];
    let g = '<g transform="translate(' + x + " " + y + ") scale(" + scale + ')" fill="' + ink + '" stroke="' + ink + '">';
    if (style === "ring") {
      g += '<circle cx="0" cy="0" r="62" fill="none" stroke-width="7"/><circle cx="0" cy="0" r="40" fill="none" stroke-width="3"/>' +
        artText("UV", 0, 16, 46, ink, 2, 900).replace(/stroke="[^"]*"/, "") +
        artText("URBAN VIBE", 0, 104, 17, ink, 6, 800);
    } else if (style === "lines") {
      for (let i = 0; i < 5; i++) {
        g += '<path d="M-90 ' + (i * 20 - 40) + " q 22.5 -22 45 0 t 45 0 t 45 0 t 45 0" + '" fill="none" stroke-width="6" stroke-linecap="round"/>';
      }
      g += artText("NO RULES", 0, 98, 24, ink, 7, 900);
    } else {
      bars.forEach(function (h, i) {
        g += '<rect x="' + (-95 + i * 17.5) + '" y="' + (50 - h) + '" width="12" height="' + h + '" stroke="none"/>';
      });
      g += '<rect x="-98" y="52" width="196" height="3" stroke="none"/>' + artText("CITY NIGHTS", 0, 92, 24, ink, 6, 900) +
        artText("SÃO PAULO · 2026", 0, 116, 12, ink, 4, 700);
    }
    return g + "</g>";
  }

  // Cada peça devolve { shape: contorno(s) preenchido(s) na cor do produto, detail: costuras e detalhes, under: desenhado atrás }
  const ART_KINDS = {
    tee: function (view, c, o, k) {
      const hem = o.crop ? 640 : 842;
      const body = "M335 140L185 190L92 372L212 428L238 396L" + (o.crop ? "232 " : "226 ") + hem + "L" + (o.crop ? "568 " : "574 ") + hem +
        "L" + (o.crop ? "568 " : "562 ") + "396L588 428L708 372L615 190L465 140" +
        (view === "front" ? "C458 222 342 222 335 140Z" : "C450 166 350 166 335 140Z");
      const ink = k.dark ? "#f4f4f2" : "#0a0a0a";
      let d = artPath("M185 190Q228 300 238 396", k.seam) + artPath("M615 190Q572 300 562 396", k.seam) +
        artPath("M101 356L221 411", k.seam) + artPath("M699 356L579 411", k.seam) +
        artPath("M232 " + (hem - 16) + "H568", k.stitch);
      if (view === "front") {
        d += artPath("M335 140C342 222 458 222 465 140", 'fill="none" stroke="' + k.lo + '" stroke-width="15" opacity="0.7"') +
          artPath("M342 146C350 212 450 212 458 146", 'fill="none" stroke="' + k.hi + '" stroke-width="2.5" opacity="0.8"');
        d += o.print ? artGraphic(o.print, 400, o.crop ? 330 : 360, o.crop ? 1.0 : 1.15, o.printInk || ink)
          : artText("URBAN VIBE", 468, 300, 13, ink, 3, 800);
      } else {
        d += artPath("M335 140C350 166 450 166 465 140", 'fill="none" stroke="' + k.lo + '" stroke-width="15" opacity="0.7"') +
          '<rect x="382" y="168" width="36" height="22" rx="3" fill="#f4f4f2" opacity="0.92"/>' + artPath("M390 179H410", 'stroke="#777" stroke-width="2"');
        if (o.print) d += artGraphic(o.print, 400, o.crop ? 330 : 400, o.crop ? 1.25 : 1.6, o.printInk || ink);
      }
      d += artPath("M300 330Q330 400 300 470M510 300Q480 380 520 470", 'fill="none" stroke="' + k.lo + '" stroke-width="12" opacity="0.18"');
      return { shape: artPath(body), detail: d };
    },

    hoodie: function (view, c, o, k) {
      const hem = o.crop ? 650 : 800;
      const hood = o.hood !== false;
      const neck = view === "front" ? "C455 215 345 215 335 150Z" : "C450 176 350 176 335 150Z";
      const body = "M335 150L190 195L120 330L92 730L192 745L225 445L230 " + hem + "L570 " + hem + "L575 445L608 745L708 730L680 330L610 195L465 150" + neck;
      let under = "";
      if (hood && view === "front") {
        under = artPath("M300 178C280 50 520 50 500 178C470 198 330 198 300 178Z", 'fill="' + c + '" stroke="' + k.edge + '" stroke-width="2.5"');
      }
      let d = artPath("M190 195Q215 330 225 445", k.seam) + artPath("M610 195Q585 330 575 445", k.seam);
      d += artRibs(230, hem - 26, 340, 26, k.lo, k.edge);
      d += '<g transform="rotate(7 142 760)">' + artRibs(92, 725, 100, 52, k.lo, k.edge) + "</g>";
      d += '<g transform="rotate(-7 658 760)">' + artRibs(608, 725, 100, 52, k.lo, k.edge) + "</g>";
      if (view === "front") {
        if (hood) {
          d += artPath("M335 150C345 215 455 215 465 150C440 122 360 122 335 150Z", 'fill="' + k.ink + '" stroke="' + k.edge + '" stroke-width="2.5"') +
            artPath("M372 205L366 335", 'stroke="' + k.hi + '" stroke-width="6" stroke-linecap="round"') +
            artPath("M428 205L434 335", 'stroke="' + k.hi + '" stroke-width="6" stroke-linecap="round"') +
            '<rect x="360" y="332" width="12" height="22" rx="4" fill="' + k.edge + '"/><rect x="428" y="332" width="12" height="22" rx="4" fill="' + k.edge + '"/>';
        } else {
          d += artPath("M335 150C345 215 455 215 465 150", 'fill="none" stroke="' + k.lo + '" stroke-width="18" opacity="0.8"');
        }
        if (!o.crop) {
          d += artPath("M296 560H504L542 745H258Z", k.seam) + artPath("M300 565L272 640M500 565L528 640", k.seam);
        }
        d += artText("URBAN VIBE", 468, 290, 13, k.dark ? "#f4f4f2" : "#0a0a0a", 3, 800);
      } else {
        if (hood) {
          d += artPath("M300 160C262 150 268 330 400 345C532 330 538 150 500 160C470 122 330 122 300 160Z", 'fill="' + c + '" stroke="' + k.edge + '" stroke-width="2.5"') +
            artPath("M400 140V340", k.seam) + artPath("M310 200Q330 300 395 335M490 200Q470 300 405 335", 'fill="none" stroke="' + k.lo + '" stroke-width="3" opacity="0.6"');
        } else {
          d += artPath("M335 150C350 176 450 176 465 150", 'fill="none" stroke="' + k.lo + '" stroke-width="18" opacity="0.8"');
        }
        d += artText("URBAN VIBE", 400, 480, 30, k.dark ? "#f4f4f2" : "#0a0a0a", 8, 900);
      }
      return { under: under, shape: artPath(body), detail: d };
    },

    jacket: function (view, c, o, k) {
      const style = o.style || "wind";
      const hem = style === "bomber" ? 700 : style === "coach" ? 790 : 820;
      const neck = view === "front" ? "L465 150C455 200 345 200 335 150Z" : "L465 150C450 172 350 172 335 150Z";
      const body = "M335 150L190 195L120 330L92 735L192 750L225 445L230 " + hem + "L570 " + hem + "L575 445L608 750L708 735L680 330L610 195" + neck;
      let d = artPath("M190 195Q215 330 225 445", k.seam) + artPath("M610 195Q585 330 575 445", k.seam);
      if (style === "bomber") {
        d += artRibs(230, hem - 34, 340, 34, k.lo, k.edge);
        d += '<g transform="rotate(7 142 765)">' + artRibs(92, 730, 100, 60, k.lo, k.edge) + "</g>";
        d += '<g transform="rotate(-7 658 765)">' + artRibs(608, 730, 100, 60, k.lo, k.edge) + "</g>";
      } else {
        d += artPath("M230 " + (hem - 14) + "H570", k.stitch);
        d += '<g transform="rotate(7 142 765)"><rect x="92" y="735" width="100" height="26" fill="' + k.lo + '" opacity="0.7"/></g>';
        d += '<g transform="rotate(-7 658 765)"><rect x="608" y="735" width="100" height="26" fill="' + k.lo + '" opacity="0.7"/></g>';
      }
      if (view === "front") {
        // gola
        const collar = style === "bomber"
          ? artRibs(322, 118, 156, 40, k.lo, k.edge)
          : artPath("M335 150L322 112L398 128L400 232Z", 'fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2.5"') +
            artPath("M465 150L478 112L402 128L400 232Z", 'fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2.5"');
        d += collar;
        d += artPath("M400 232V" + hem, 'stroke="' + k.edge + '" stroke-width="5"') +
          artPath("M400 232V" + hem, 'stroke="' + k.hi + '" stroke-width="2" stroke-dasharray="3 5"') +
          '<rect x="393" y="236" width="14" height="30" rx="5" fill="' + k.edge + '"/>';
        if (style === "wind") {
          d += '<rect x="226" y="330" width="348" height="16" fill="' + k.hi + '" opacity="0.85"/>' + artPath("M262 560L284 700M538 560L516 700", 'stroke="' + k.edge + '" stroke-width="4" fill="none"');
        } else if (style === "bomber") {
          d += artPath("M262 540L284 660M538 540L516 660", 'stroke="' + k.edge + '" stroke-width="4" fill="none"') +
            '<rect x="112" y="470" width="14" height="110" rx="6" fill="' + k.hi + '" opacity="0.8" transform="rotate(7 119 525)"/>';
        } else {
          for (let i = 0; i < 4; i++) {
            d += '<circle cx="400" cy="' + (280 + i * 120) + '" r="0" fill="none"/>';
          }
          d += artPath("M255 590H335V690H255Z M465 590H545V690H465Z", 'fill="none" stroke="' + k.lo + '" stroke-width="3"');
        }
        d += artText("URBAN VIBE", 480, 300, 12, k.dark ? "#f4f4f2" : "#0a0a0a", 3, 800);
      } else {
        d += (style === "bomber" ? artRibs(322, 120, 156, 36, k.lo, k.edge) : artPath("M335 150C350 172 450 172 465 150L478 118C440 140 360 140 322 118Z", 'fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2.5"')) +
          artPath("M230 300Q400 340 570 300", k.seam) + artPath("M400 335V" + (hem - 10), k.seam);
        d += artText("URBAN VIBE", 400, 470, style === "coach" ? 38 : 26, k.dark ? "#f4f4f2" : "#0a0a0a", 8, 900);
      }
      return { shape: artPath(body), detail: d };
    },

    pants: function (view, c, o, k) {
      const style = o.style || "cargo"; // cargo | wide | shorts | cargoshorts | bike
      const hemY = style === "shorts" || style === "cargoshorts" ? 640 : style === "bike" ? 560 : 920;
      const wide = style === "wide";
      const bike = style === "bike";
      const lo = bike ? 262 : wide ? 150 : style === "shorts" || style === "cargoshorts" ? 208 : 205;
      const li = bike ? 392 : wide ? 385 : 385;
      const ro = 800 - lo;
      const ri = 800 - li;
      const wl = bike ? 262 : 245;
      const body = "M" + wl + " 110L" + (800 - wl) + " 110L" + (bike ? 540 : 568) + " 300L" + ro + " " + hemY + "L" + ri + " " + hemY +
        "L400 400L" + li + " " + hemY + "L" + lo + " " + hemY + "L" + (bike ? 260 : 232) + " 300Z";
      let d = artRibs(wl, 110, 800 - 2 * wl, 40, k.lo, k.edge).replace(/stroke-width="2.4"/g, 'stroke-width="0"');
      d += '<rect x="' + wl + '" y="110" width="' + (800 - 2 * wl) + '" height="40" fill="none" stroke="' + k.edge + '" stroke-width="2.5"/>';
      d += artPath("M" + (lo + 6) + " " + (hemY - 22) + "H" + (li - 4) + "M" + (ri + 4) + " " + (hemY - 22) + "H" + (ro - 6), k.stitch);
      [275, 400, 525].forEach(function (x) {
        d += '<rect x="' + (x - 8) + '" y="104" width="16" height="52" rx="4" fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2" opacity="0.95"/>';
      });
      if (view === "front") {
        d += artPath("M400 150V300Q400 345 370 350", 'fill="none" stroke="' + k.edge + '" stroke-width="3"') +
          '<circle cx="400" cy="131" r="9" fill="' + k.edge + '"/>' +
          artPath("M" + (wl + 4) + " 156Q310 192 322 320M" + (796 - wl) + " 156Q490 192 478 320", k.seam);
        if (style === "cargo" || style === "cargoshorts") {
          const px = style === "cargo" ? 226 : 214;
          const py = style === "cargo" ? 440 : 380;
          d += '<g fill="' + k.lo + '" fill-opacity="0.22" stroke="' + k.edge + '" stroke-width="3">' +
            '<rect x="' + px + '" y="' + py + '" width="76" height="130" rx="4"/><rect x="' + (800 - px - 76) + '" y="' + py + '" width="76" height="130" rx="4"/>' +
            '<rect x="' + px + '" y="' + py + '" width="76" height="34" rx="4" fill="' + k.hi + '" fill-opacity="0.35"/><rect x="' + (800 - px - 76) + '" y="' + py + '" width="76" height="34" rx="4" fill="' + k.hi + '" fill-opacity="0.35"/></g>' +
            '<circle cx="' + (px + 38) + '" cy="' + (py + 17) + '" r="5" fill="' + k.edge + '"/><circle cx="' + (800 - px - 38) + '" cy="' + (py + 17) + '" r="5" fill="' + k.edge + '"/>';
        }
        if (wide) {
          d += artPath("M300 180L250 880M500 180L550 880", 'fill="none" stroke="' + k.lo + '" stroke-width="4" opacity="0.35"');
        }
      } else {
        d += artPath("M400 150V400", k.seam) +
          '<g fill="' + k.lo + '" fill-opacity="0.18" stroke="' + k.edge + '" stroke-width="3">' +
          '<path d="M280 210H372V312H280Z"/><path d="M428 210H520V312H428Z"/></g>' +
          artPath("M280 236H372M428 236H520", k.seam) +
          artPath("M" + wl + " 190Q330 235 400 200Q470 235 " + (800 - wl) + " 190", 'fill="none" stroke="' + k.edge + '" stroke-width="2.5"');
        if (wide) d += artPath("M300 330L262 880M500 330L538 880", 'fill="none" stroke="' + k.lo + '" stroke-width="4" opacity="0.35"');
      }
      return { shape: artPath(body), detail: d };
    },

    cap: function (view, c, o, k) {
      const flat = o.style === "snapback";
      const trucker = o.style === "trucker";
      let under = "";
      let shape;
      let d = "";
      const mesh = '<pattern id="mesh" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.3" fill="' + k.ink + '" opacity="0.55"/></pattern>';
      shape = artPath("M190 520C190 240 610 240 610 520C560 548 240 548 190 520Z");
      if (view === "front") {
        // aba
        const brim = flat
          ? "M150 515C300 575 500 575 650 515L692 585C560 640 240 640 108 585Z"
          : "M165 520C290 575 510 575 635 520C655 600 520 640 400 640C280 640 145 600 165 520Z";
        under = "";
        d += artPath(brim, 'fill="' + k.lo + '" stroke="' + k.edge + '" stroke-width="2.5"') +
          artPath(flat ? "M160 572C300 626 500 626 640 572" : "M185 556C300 606 500 606 615 556", 'fill="none" stroke="' + k.hi + '" stroke-width="3" opacity="0.7"');
        d += artPath("M400 314V525M400 317C335 345 305 440 290 528M400 317C465 345 495 440 510 528", k.seam) +
          '<circle cx="400" cy="314" r="11" fill="' + k.lo + '" stroke="' + k.edge + '" stroke-width="2"/>';
        if (trucker) {
          d += "<defs>" + mesh + '</defs><g clip-path="url(#g)"><path d="M190 520C190 380 230 300 292 270L300 530C250 536 215 530 190 520Z" fill="url(#mesh)"/>' +
            '<path d="M610 520C610 380 570 300 508 270L500 530C550 536 585 530 610 520Z" fill="url(#mesh)"/></g>';
        }
        d += '<rect x="352" y="378" width="96" height="62" rx="8" fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2.5"/>' + artText("UV", 400, 420, 30, k.ink2, 2, 900);
      } else {
        d += artPath("M400 314V525M400 317C335 345 305 440 290 528M400 317C465 345 495 440 510 528", k.seam) + '<circle cx="400" cy="314" r="11" fill="' + k.lo + '" stroke="' + k.edge + '" stroke-width="2"/>';
        if (trucker) {
          d += "<defs>" + mesh + '</defs><g clip-path="url(#g)"><path d="M190 520C190 300 610 300 610 520C560 548 240 548 190 520Z" fill="url(#mesh)"/></g>';
        }
        // tira de ajuste
        d += '<rect x="262" y="480" width="276" height="34" rx="6" fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2.5"/>';
        for (let i = 0; i < 7; i++) d += '<circle cx="' + (290 + i * 36) + '" cy="497" r="5" fill="' + k.edge + '"/>';
        d += '<rect x="500" y="474" width="28" height="46" rx="4" fill="#9a9a98" stroke="' + k.edge + '" stroke-width="2"/>';
      }
      return { under: under, shape: shape, detail: d, xf: "translate(-140 -190) scale(1.35)" };
    },

    bucket: function (view, c, o, k) {
      let d = artPath("M105 560C105 650 695 650 695 560C695 505 105 505 105 560Z", 'fill="' + k.lo + '" stroke="' + k.edge + '" stroke-width="2.5"');
      d += artPath("M125 585C250 635 550 635 675 585M150 568C280 612 520 612 650 568", k.stitch);
      d += artPath("M250 340C250 262 550 262 550 340L592 548C500 585 300 585 208 548Z", 'fill="' + c + '" stroke="' + k.edge + '" stroke-width="2.5"') +
        artPath("M250 345C340 372 460 372 550 345", 'fill="none" stroke="' + k.lo + '" stroke-width="3" opacity="0.6"');
      d += '<circle cx="252" cy="440" r="8" fill="' + k.ink + '" stroke="' + k.edge + '"/><circle cx="548" cy="440" r="8" fill="' + k.ink + '" stroke="' + k.edge + '"/>';
      if (view === "front") d += '<rect x="360" y="420" width="80" height="52" rx="8" fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2.5"/>' + artText("UV", 400, 458, 28, k.ink2, 2, 900);
      else d += artPath("M300 470H500M300 500H500", 'stroke="' + k.lo + '" stroke-width="3" opacity="0.6"') + '<rect x="378" y="520" width="44" height="20" rx="3" fill="#f4f4f2" opacity="0.9"/>';
      return { shape: "", detail: d, noClip: true, xf: "translate(-120 -110) scale(1.3)" };
    },

    beanie: function (view, c, o, k) {
      const shape = artPath("M232 560C212 250 588 250 568 560Z");
      let d = '<g clip-path="url(#g)">' + artPath("M300 300Q290 420 300 520M360 275Q352 420 360 530M440 275Q448 420 440 530M500 300Q510 420 500 520", 'fill="none" stroke="' + k.lo + '" stroke-width="5" opacity="0.5"') + "</g>";
      d += artRibs(206, 500, 388, 140, k.lo, k.edge) + '<rect x="206" y="500" width="388" height="140" rx="20" fill="none" stroke="' + k.edge + '" stroke-width="2.5"/>';
      if (view === "front") d += '<rect x="362" y="535" width="76" height="50" rx="6" fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2.5"/>' + artText("UV", 400, 570, 26, k.ink2, 2, 900);
      else d += '<rect x="384" y="520" width="32" height="20" rx="3" fill="#f4f4f2" opacity="0.9"/>';
      return { shape: shape, detail: d, xf: "translate(-120 -150) scale(1.3)" };
    },

    crossbody: function (view, c, o, k) {
      let under = artPath("M250 330C250 70 550 70 550 330", 'fill="none" stroke="' + k.edge + '" stroke-width="34" stroke-linecap="round"') +
        artPath("M250 330C250 70 550 70 550 330", 'fill="none" stroke="' + c + '" stroke-width="26" stroke-linecap="round"');
      const shape = '<rect x="195" y="330" width="410" height="400" rx="46"/>';
      let d = "";
      if (view === "front") {
        d += artPath("M195 376H605V470Q400 540 195 470Z", 'fill="' + k.hi + '" fill-opacity="0.22" stroke="' + k.edge + '" stroke-width="3"') +
          '<rect x="372" y="480" width="56" height="52" rx="8" fill="#9a9a98" stroke="' + k.edge + '" stroke-width="2.5"/>' +
          artPath("M215 600H585", 'stroke="' + k.edge + '" stroke-width="5"') + '<rect x="388" y="588" width="24" height="26" rx="6" fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2"/>';
        d += artText("URBAN VIBE", 400, 680, 22, k.ink2, 6, 800);
      } else {
        d += '<rect x="235" y="400" width="330" height="250" rx="18" fill="none" stroke="' + k.edge + '" stroke-width="3"/>' +
          artPath("M255 450H545", 'stroke="' + k.edge + '" stroke-width="5"') + '<rect x="388" y="438" width="24" height="26" rx="6" fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2"/>';
      }
      return { under: under, shape: shape, detail: d, xf: "translate(-60 -120) scale(1.15)" };
    },

    waist: function (view, c, o, k) {
      const shape = '<ellipse cx="400" cy="520" rx="260" ry="185"/>';
      const under =
        '<rect x="20" y="486" width="150" height="56" rx="10" fill="' + k.lo + '" stroke="' + k.edge + '" stroke-width="2.5"/>' +
        '<rect x="630" y="486" width="150" height="56" rx="10" fill="' + k.lo + '" stroke="' + k.edge + '" stroke-width="2.5"/>' +
        '<rect x="48" y="478" width="46" height="72" rx="8" fill="#9a9a98" stroke="' + k.edge + '" stroke-width="2.5"/>';
      let d = "";
      if (view === "front") {
        d += artPath("M170 470C300 372 500 372 630 470", 'fill="none" stroke="' + k.edge + '" stroke-width="4"') +
          '<rect x="386" y="404" width="28" height="44" rx="8" fill="' + k.hi + '" stroke="' + k.edge + '" stroke-width="2.5"/>' +
          artPath("M230 560Q400 640 570 560", 'fill="none" stroke="' + k.lo + '" stroke-width="4" opacity="0.7"') +
          artText("URBAN VIBE", 400, 548, 22, k.ink2, 6, 800);
      } else {
        for (let i = 0; i < 6; i++) d += artPath("M" + (230 + i * 68) + " 420V620", 'stroke="' + k.lo + '" stroke-width="6" opacity="0.45"');
        d += '<rect x="372" y="500" width="56" height="36" rx="5" fill="#f4f4f2" opacity="0.9"/>';
      }
      return { under: under, shape: shape, detail: d };
    },

    tote: function (view, c, o, k) {
      const under =
        artPath("M275 335C275 100 345 100 345 335", 'fill="none" stroke="' + k.edge + '" stroke-width="30" stroke-linecap="round"') +
        artPath("M275 335C275 100 345 100 345 335", 'fill="none" stroke="' + c + '" stroke-width="22" stroke-linecap="round"') +
        artPath("M455 335C455 100 525 100 525 335", 'fill="none" stroke="' + k.edge + '" stroke-width="30" stroke-linecap="round"') +
        artPath("M455 335C455 100 525 100 525 335", 'fill="none" stroke="' + c + '" stroke-width="22" stroke-linecap="round"');
      const shape = artPath("M195 330H605L620 880H180Z");
      let d = artPath("M200 372H600", k.stitch);
      if (view === "front") {
        d += artText("URBAN", 400, 560, 78, k.ink2, 6, 900) + artText("VIBE", 400, 640, 78, k.ink2, 18, 300) + artText("STREETWEAR · SÃO PAULO", 400, 700, 17, k.ink2, 5, 700);
      } else {
        d += artText("UV", 400, 640, 58, k.ink2, 2, 900);
      }
      d += artPath("M190 855H610", k.stitch);
      return { under: under, shape: shape, detail: d };
    },

    belt: function (view, c, o, k) {
      let d = "";
      let shape;
      if (view === "front") {
        shape = '<rect x="150" y="448" width="620" height="76" rx="8"/>';
        for (let i = 0; i < 7; i++) d += '<circle cx="' + (330 + i * 56) + '" cy="486" r="7" fill="' + k.ink + '" stroke="' + k.edge + '" stroke-width="2"/>';
        d += artPath("M160 458H760M160 514H760", k.stitch);
        d += '<rect x="108" y="410" width="150" height="152" rx="14" fill="none" stroke="#9a9a98" stroke-width="16"/>' +
          artPath("M190 486H300", 'stroke="#9a9a98" stroke-width="10" stroke-linecap="round"');
      } else {
        shape = '<circle cx="400" cy="500" r="250"/>';
        d += '<circle cx="400" cy="500" r="205" fill="none" stroke="' + k.edge + '" stroke-width="3"/><circle cx="400" cy="500" r="160" fill="none" stroke="' + k.edge + '" stroke-width="3"/>' +
          '<circle cx="400" cy="500" r="115" fill="' + k.ink + '" opacity="0.18"/><circle cx="400" cy="500" r="115" fill="none" stroke="' + k.edge + '" stroke-width="3"/>' +
          '<rect x="330" y="236" width="140" height="112" rx="12" fill="none" stroke="#9a9a98" stroke-width="14"/>';
      }
      return { shape: shape, detail: d };
    },

    socks: function (view, c, o, k) {
      const sock = function (x, y, s, stripes) {
        let g = '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">' +
          '<path d="M0 0H100V300C100 360 240 360 252 440C258 500 170 522 90 522C30 522 0 470 0 410Z" fill="' + c + '" stroke="' + k.edge + '" stroke-width="3"/>' +
          artRibs(0, 0, 100, 70, k.lo, k.edge) + '<rect x="0" y="0" width="100" height="70" fill="none" stroke="' + k.edge + '" stroke-width="3"/>';
        if (stripes) g += '<rect x="0" y="86" width="100" height="12" fill="' + k.ink + '" opacity="0.85"/><rect x="0" y="108" width="100" height="12" fill="' + k.ink + '" opacity="0.85"/>';
        g += '<path d="M250 440C256 495 170 520 92 520" fill="none" stroke="' + k.ink + '" stroke-width="22" opacity="0.4"/></g>';
        return g;
      };
      if (view === "front") {
        return { shape: "", detail: sock(70, 230, 0.95, true) + sock(290, 250, 0.95, true) + sock(510, 230, 0.95, true), noClip: true };
      }
      return { shape: "", detail: sock(250, 160, 1.5, false), noClip: true };
    }
  };

  function artImage(spec, view) {
    const key = JSON.stringify(spec) + view;
    if (artCache[key]) return artCache[key];

    const c = spec.color;
    const dark = colorLuma(c) < 90;
    const k = {
      dark: dark,
      lo: shadeColor(c, dark ? 14 : -26),
      hi: shadeColor(c, dark ? 42 : 14),
      edge: dark ? shadeColor(c, 70) : shadeColor(c, -70),
      ink: dark ? shadeColor(c, 70) : shadeColor(c, -60),
      ink2: dark ? "#f4f4f2" : "#0a0a0a"
    };
    k.seam = 'fill="none" stroke="' + k.edge + '" stroke-width="3" opacity="0.55" stroke-linecap="round"';
    k.stitch = 'fill="none" stroke="' + k.edge + '" stroke-width="2.5" stroke-dasharray="7 6" opacity="0.6"';
    // contorno escuro em peças pretas ficaria invisível: usa linha clara; em peças claras, linha escura
    k.outline = dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.32)";

    const parts = ART_KINDS[spec.kind](view, c, spec, k);
    const clipId = "g";
    const shapeFill = parts.shape
      ? '<g fill="' + c + '" stroke="' + k.outline + '" stroke-width="3" stroke-linejoin="round">' + parts.shape + "</g>"
      : "";
    const shade =
      parts.shape && !parts.noClip
        ? '<g clip-path="url(#' + clipId + ')"><rect width="800" height="1000" fill="url(#sh)"/><rect width="800" height="1000" filter="url(#nz)" opacity="0.22"/></g>'
        : "";
    const floor = "";

    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">' +
      "<defs>" +
        '<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ececea"/><stop offset="1" stop-color="#d6d6d3"/></linearGradient>' +
        '<linearGradient id="sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.2"/><stop offset="0.3" stop-color="#fff" stop-opacity="0.12"/><stop offset="0.7" stop-color="#000" stop-opacity="0.02"/><stop offset="1" stop-color="#000" stop-opacity="0.26"/></linearGradient>' +
        '<filter id="nz" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0.8 0 0 0 -0.2"/></filter>' +
        '<filter id="bl"><feGaussianBlur stdDeviation="14"/></filter>' +
        '<filter id="ds" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#000" flood-opacity="0.22"/></filter>' +
        (parts.shape ? '<clipPath id="' + clipId + '">' + parts.shape + "</clipPath>" : "") +
      "</defs>" +
      '<rect width="800" height="1000" fill="url(#bg)"/>' + floor +
      '<g filter="url(#ds)"><g' + (parts.xf ? ' transform="' + parts.xf + '"' : "") + ">" +
      (parts.under || "") + shapeFill + shade + (parts.detail || "") + "</g></g></svg>";

    artCache[key] = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
    return artCache[key];
  }

  // Fotos de um produto: foto principal (image) + vista de costas gerada; ou as duas geradas.
  // Para usar fotos reais, basta preencher "images: ['url1','url2']" no produto.
  function productPhotos(product) {
    if (product.images && product.images.length >= 2) {
      return product.images.map(function (src, i) {
        return { src: src, generated: false, alt: product.name + " – foto " + (i + 1) };
      });
    }
    const front = product.image
      ? { src: product.image, generated: false, alt: product.name }
      : { src: artImage(product.art, "front"), generated: true, alt: product.name + " – vista frontal" };
    const back = { src: artImage(product.art, "back"), generated: true, alt: product.name + " – vista de costas" };
    return [front, back];
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

  /* ---------- 4. PRODUTOS: DESTAQUES E PÁGINAS DE CATEGORIA ---------- */
  const productGrid = $("#productGrid");
  const CATEGORY_HASH = /^#categoria-(masculino|feminino|acessorios)$/;
  const CATEGORY_TITLES = { masculino: "Masculino", feminino: "Feminino", acessorios: "Acessórios" };

  function createCard(product, index) {
    const badge = product.badge
      ? '<span class="card__badge">' + escapeHTML(product.badge) + "</span>"
      : "";
    const installment = formatPrice(product.price / 3);
    const photos = productPhotos(product);
    const first = photos[0];
    const second = photos[1];
    const firstAttrs = first.generated
      ? ' src="' + first.src + '"'
      : ' src="' + first.src + '" srcset="' + imageSrcSet(first.src, [400, 800]) + '"' +
        ' sizes="(max-width: 560px) 50vw, (max-width: 1100px) 33vw, 300px"';

    // Produtos com tamanhos abrem os detalhes para o visitante escolher; os demais adicionam direto
    const button = hasSizeChoice(product)
      ? '<button class="card__btn" data-details="' + product.id + '">Escolher tamanho</button>'
      : '<button class="card__btn" data-add="' + product.id + '">Adicionar ao carrinho</button>';

    return (
      '<article class="card" style="animation-delay:' + Math.min(index, 8) * 0.05 + 's">' +
        '<div class="card__media">' +
          '<img class="card__img"' + firstAttrs + ' alt="' + escapeHTML(product.name) + '" loading="lazy" decoding="async">' +
          '<img class="card__img card__img--alt" src="' + second.src + '"' +
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

  // Destaques: apenas os produtos marcados com featured: true (sem filtros)
  function renderFeatured() {
    productGrid.innerHTML = PRODUCTS.filter((p) => p.featured).map(createCard).join("");
  }

  // Cliques nos cards (vale para os destaques e para as páginas de categoria)
  function handleGridClick(event) {
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
  }

  /* --- Página de categoria --- */
  const catalogEl = $("#catalogPage");
  const catalogGrid = $("#catalogGrid");
  const cpForm = $("#cpFilters");
  const cpSearch = $("#cpSearch");
  const cpSize = $("#cpSize");
  const cpMin = $("#cpMin");
  const cpMax = $("#cpMax");
  const cpSort = $("#cpSort");
  const cpEmpty = $("#cpEmpty");
  const cpCount = $("#cpCount");
  const cpClear = $("#cpClear");
  let catalogCategory = null;
  let catalogScrollY = 0;
  let lastFocusedBeforeCatalog = null;

  function catalogOpen() {
    return !catalogEl.hidden;
  }

  // Sem acentos e em minúsculas: "calca" encontra "Calça"
  function normalizeText(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();
  }

  function parsePrice(value) {
    const n = parseFloat(String(value).replace(",", "."));
    return isFinite(n) && n >= 0 ? n : null;
  }

  function hasActiveFilters() {
    return !!(cpSearch.value.trim() || cpSize.value || cpMin.value.trim() || cpMax.value.trim() || cpSort.value !== "destaque");
  }

  function categoryProducts(category) {
    return PRODUCTS.filter((p) => p.category === category);
  }

  // Preenche as opções de tamanho com os tamanhos que realmente existem na categoria
  function fillSizeOptions(category) {
    const order = ["P", "M", "G", "GG", "P/M", "G/GG", "Único"];
    const found = [];
    categoryProducts(category).forEach(function (p) {
      p.sizes.forEach(function (size) {
        if (found.indexOf(size) === -1) found.push(size);
      });
    });
    found.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    cpSize.innerHTML =
      '<option value="">Todos os tamanhos</option>' +
      found.map((size) => '<option value="' + escapeHTML(size) + '">' + escapeHTML(size) + "</option>").join("");
  }

  function resetCatalogFilters() {
    cpSearch.value = "";
    cpSize.value = "";
    cpMin.value = "";
    cpMax.value = "";
    cpSort.value = "destaque";
  }

  function renderCatalog() {
    if (!catalogCategory) return;
    const all = categoryProducts(catalogCategory);
    const q = normalizeText(cpSearch.value);
    const size = cpSize.value;
    let min = parsePrice(cpMin.value);
    let max = parsePrice(cpMax.value);
    if (min !== null && max !== null && min > max) {
      const t = min; min = max; max = t; // faixa invertida: ajusta sozinho
    }

    let list = all.filter(function (p) {
      if (q && normalizeText(p.name + " " + p.type).indexOf(q) === -1) return false;
      if (size && p.sizes.indexOf(size) === -1) return false;
      if (min !== null && p.price < min) return false;
      if (max !== null && p.price > max) return false;
      return true;
    });

    const sort = cpSort.value;
    list = list.slice();
    if (sort === "menor") list.sort((a, b) => a.price - b.price || a.id - b.id);
    else if (sort === "maior") list.sort((a, b) => b.price - a.price || a.id - b.id);
    else if (sort === "recentes") list.sort((a, b) => (a.added < b.added ? 1 : a.added > b.added ? -1 : b.id - a.id));
    else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.id - b.id);

    catalogGrid.innerHTML = list.map(createCard).join("");
    cpEmpty.hidden = list.length > 0;
    catalogGrid.hidden = list.length === 0;
    cpCount.textContent =
      list.length === all.length
        ? all.length + (all.length === 1 ? " produto" : " produtos")
        : list.length + " de " + all.length + " produtos";
    cpClear.hidden = !hasActiveFilters();
  }

  function paintCatalogHeader() {
    $("#cpTitle").textContent = CATEGORY_TITLES[catalogCategory];
    $("#cpCrumb").textContent = CATEGORY_TITLES[catalogCategory];
    $$(".catalog-tabs a").forEach(function (a) {
      const active = a.dataset.cat === catalogCategory;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = CATEGORY_TITLES[catalogCategory] + " | URBAN VIBE";
  }

  const BASE_TITLE = document.title;

  // Abre a página da categoria. opts.push === false: veio do histórico/link direto
  function openCatalog(category, opts) {
    const options = opts || {};
    if (!CATEGORY_TITLES[category]) return;
    closeMenu();
    closeAuthUI();
    closeProductUI();
    if (cartEl.classList.contains("is-open")) closeCart();
    closeAccountPageUI();

    const alreadyOpen = catalogOpen();
    if (alreadyOpen && catalogCategory === category) return; // mesma categoria: mantém filtros e posição

    if (!alreadyOpen) {
      lastFocusedBeforeCatalog = document.activeElement;
      catalogScrollY = window.scrollY;
      document.body.classList.add("view-catalog");
      catalogEl.hidden = false;
    }
    catalogCategory = category;
    resetCatalogFilters();
    fillSizeOptions(category);
    paintCatalogHeader();
    renderCatalog();
    window.scrollTo(0, 0);
    $("#cpTitle").focus({ preventScroll: true });

    if (options.push === true) {
      try {
        history.pushState({ urbanCatalog: category }, "", "#categoria-" + category);
      } catch (error) {
        /* ambiente sem suporte a histórico */
      }
    }
  }

  // Fecha só a parte visual. quiet: não recoloca a rolagem (usado ao trocar de tela)
  function closeCatalogUI(quiet) {
    if (!catalogOpen()) return false;
    catalogEl.hidden = true;
    document.body.classList.remove("view-catalog");
    catalogCategory = null;
    document.title = BASE_TITLE;
    if (!quiet) window.scrollTo(0, catalogScrollY);
    if (lastFocusedBeforeCatalog && typeof lastFocusedBeforeCatalog.focus === "function" && document.contains(lastFocusedBeforeCatalog)) {
      lastFocusedBeforeCatalog.focus({ preventScroll: true });
    }
    return true;
  }

  function initCatalog() {
    catalogGrid.addEventListener("click", handleGridClick);

    cpForm.addEventListener("submit", function (event) {
      event.preventDefault();
      renderCatalog();
    });
    // Digitar filtra na hora. "change" só vale para os menus: nos campos de texto ele dispara ao sair do campo
    // e recriaria os cards no meio do clique, fazendo o primeiro toque em um produto se perder.
    cpForm.addEventListener("input", function () {
      renderCatalog();
    });
    cpForm.addEventListener("change", function (event) {
      if (event.target.tagName === "SELECT") renderCatalog();
    });
    function clearAll() {
      resetCatalogFilters();
      renderCatalog();
      cpSearch.focus({ preventScroll: true });
    }
    cpClear.addEventListener("click", clearAll);
    $("#cpEmptyClear").addEventListener("click", clearAll);

    // Links de categoria na vitrine e nas abas usam o endereço #categoria-...; o roteador abre a página.
    // O clique com a tecla Ctrl/Cmd continua abrindo em nova aba.
    $("#cpHome").addEventListener("click", function () {
      closeMenu();
    });
  }

  function initProducts() {
    renderFeatured();
    productGrid.addEventListener("click", handleGridClick);
    initCatalog();
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
        const attrs = photo.generated
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
        const thumbSrc = photo.generated ? photo.src : resizeImage(photo.src, 160);
        return (
          '<button type="button" class="gallery__thumb' + (i === 0 ? " is-active" : "") + '" data-photo="' + i + '"' +
            ' aria-label="' + (photo.generated && i === 1 ? "Ver vista de costas" : i === 0 ? "Ver foto principal" : "Ver foto " + (i + 1)) + '"' +
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
    const ours = state && (state.urbanAuth || state.urbanAccount || state.urbanProduct || state.urbanCatalog);
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
    closeCatalogUI(true);

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
    const categoryMatch = CATEGORY_HASH.exec(location.hash);

    if (categoryMatch) {
      closeProductUI();
      closeAuthUI();
      openCatalog(categoryMatch[1], { push: false });
    } else if (ACCOUNT_HASH.test(location.hash)) {
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
      if (!catalogOpen()) closeAccountPageUI();
      openProduct(parseInt(productMatch[1], 10), { push: false });
    } else {
      closeProductUI();
      closeAuthUI();
      // Saiu da Minha conta ou de uma categoria por um link do menu (ex.: #destaques): leva até a seção pedida
      const leftAccount = closeAccountPageUI();
      const leftCatalog = closeCatalogUI(location.hash.length > 1);
      if ((leftAccount || leftCatalog) && location.hash.length > 1) {
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
