/* =====================================================
   URBAN VIBE - Lógica da loja
   Sumário:
   1. Dados dos produtos
   2. Utilitários
   3. Estado do carrinho (com localStorage)
   4. Renderização dos produtos e filtros
   5. Renderização do carrinho
   6. Abrir/fechar carrinho e toast
   7. Menu mobile, header e animações de scroll
   8. Inicialização
   ===================================================== */

(function () {
  "use strict";

  /* ---------- 1. DADOS DOS PRODUTOS ---------- */
  const PRODUCTS = [
    {
      id: 1,
      name: "Camiseta Oversized Essential Preta",
      category: "masculino",
      price: 129.9,
      badge: "Novo",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      name: "Moletom Hoodie Street Black",
      category: "masculino",
      price: 289.9,
      badge: "Mais vendido",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      name: "Jaqueta Corta-Vento Urban",
      category: "masculino",
      price: 349.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      name: "Calça Cargo Concrete Grey",
      category: "masculino",
      price: 259.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      name: "Cropped Boxy Branco",
      category: "feminino",
      price: 119.9,
      badge: "Novo",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      name: "Moletom Oversized Washed Grey",
      category: "feminino",
      price: 279.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 7,
      name: "Calça Wide Leg Street",
      category: "feminino",
      price: 239.9,
      badge: "Mais vendido",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 8,
      name: "Jaqueta Bomber Noir",
      category: "feminino",
      price: 369.9,
      badge: "Edição limitada",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 9,
      name: "Boné Dad Hat Urban Vibe",
      category: "acessorios",
      price: 89.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 10,
      name: "Bolsa Transversal Utility Black",
      category: "acessorios",
      price: 159.9,
      badge: "Novo",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 11,
      name: "Meia Cano Alto Pack 3 Pares",
      category: "acessorios",
      price: 59.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 12,
      name: "Gorro Beanie Monochrome",
      category: "acessorios",
      price: 69.9,
      badge: "",
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const CATEGORY_LABELS = {
    masculino: "Masculino",
    feminino: "Feminino",
    acessorios: "Acessórios"
  };

  const FREE_SHIPPING_MIN = 299;
  const STORAGE_KEY = "urbanvibe_cart_v1";

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
        target.src = placeholderImage();
      }
    },
    true
  );

  /* ---------- 3. ESTADO DO CARRINHO ---------- */
  let cart = loadCart();

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!Array.isArray(saved)) return [];
      // Mantém apenas itens válidos que ainda existem no catálogo
      return saved
        .filter((item) => PRODUCTS.some((p) => p.id === item.id) && item.qty > 0)
        .map((item) => ({ id: item.id, qty: Math.min(parseInt(item.qty, 10) || 1, 99) }));
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

  function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
  }

  function addToCart(id) {
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      if (existing.qty < 99) existing.qty += 1;
    } else {
      cart.push({ id: id, qty: 1 });
    }
    updateCart();
    const product = getProduct(id);
    showToast(product.name + " adicionado ao carrinho");
  }

  function changeQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
    if (item.qty > 99) item.qty = 99;
    updateCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    updateCart();
  }

  function clearCart() {
    cart = [];
    updateCart();
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + getProduct(item.id).price * item.qty, 0);
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

    return (
      '<article class="card" style="animation-delay:' + index * 0.06 + 's">' +
        '<div class="card__media">' +
          '<img src="' + product.image + '" alt="' + escapeHTML(product.name) + '" loading="lazy">' +
          badge +
        "</div>" +
        '<div class="card__body">' +
          '<span class="card__category">' + CATEGORY_LABELS[product.category] + "</span>" +
          '<h3 class="card__name">' + escapeHTML(product.name) + "</h3>" +
          '<p class="card__price">' + formatPrice(product.price) +
            "<small>ou 3x de " + installment + "</small></p>" +
          '<button class="card__btn" data-add="' + product.id + '">Adicionar ao carrinho</button>' +
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

    // Botões "Adicionar ao carrinho" (delegação de eventos)
    productGrid.addEventListener("click", function (event) {
      const button = event.target.closest("[data-add]");
      if (!button) return;
      addToCart(parseInt(button.dataset.add, 10));
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

    // Contador no ícone
    cartCountEl.textContent = count;
    cartCountEl.classList.add("bump");
    setTimeout(() => cartCountEl.classList.remove("bump"), 300);

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
        .map(function (item) {
          const product = getProduct(item.id);
          return (
            '<div class="cart-item">' +
              '<img class="cart-item__img" src="' + product.image + '" alt="' + escapeHTML(product.name) + '">' +
              "<div>" +
                '<h4 class="cart-item__name">' + escapeHTML(product.name) + "</h4>" +
                '<p class="cart-item__price">' + formatPrice(product.price) + "</p>" +
                '<div class="qty">' +
                  '<button data-dec="' + item.id + '" aria-label="Diminuir quantidade">&minus;</button>' +
                  "<span>" + item.qty + "</span>" +
                  '<button data-inc="' + item.id + '" aria-label="Aumentar quantidade">+</button>' +
                "</div>" +
              "</div>" +
              '<div class="cart-item__side">' +
                '<span class="cart-item__total">' + formatPrice(product.price * item.qty) + "</span>" +
                '<button class="cart-item__remove" data-remove="' + item.id + '">Remover</button>' +
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

      if (inc) changeQty(parseInt(inc.dataset.inc, 10), 1);
      else if (dec) changeQty(parseInt(dec.dataset.dec, 10), -1);
      else if (remove) removeFromCart(parseInt(remove.dataset.remove, 10));
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

  function openCart() {
    cartEl.classList.add("is-open");
    cartEl.setAttribute("aria-hidden", "false");
    overlayEl.classList.add("is-visible");
    document.body.classList.add("no-scroll");
    $("#cartClose").focus();
  }

  function closeCart() {
    cartEl.classList.remove("is-open");
    cartEl.setAttribute("aria-hidden", "true");
    overlayEl.classList.remove("is-visible");
    document.body.classList.remove("no-scroll");
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2400);
  }

  function initCartDrawer() {
    $("#cartOpen").addEventListener("click", openCart);
    $("#cartClose").addEventListener("click", closeCart);
    overlayEl.addEventListener("click", closeCart);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeCart();
        closeMenu();
      }
    });
  }

  /* ---------- 7. MENU MOBILE, HEADER E SCROLL ---------- */
  const headerEl = $("#header");
  const navEl = $("#nav");
  const menuToggle = $("#menuToggle");

  function closeMenu() {
    navEl.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    if (!cartEl.classList.contains("is-open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  function toggleMenu() {
    const open = navEl.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("no-scroll", open);
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

  /* ---------- 8. INICIALIZAÇÃO ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    $("#year").textContent = new Date().getFullYear();
    initHeader();
    initProducts();
    initCart();
    initCartDrawer();
    initRevealOnScroll();
  });
})();
