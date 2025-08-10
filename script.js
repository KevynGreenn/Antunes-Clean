// --- FUNÇÕES GLOBAIS ---
let notificationTimeout;
window.showNotification = function(message) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    clearTimeout(notificationTimeout);
    notification.textContent = message;
    notification.classList.add('show');
    notificationTimeout = setTimeout(() => { notification.classList.remove('show'); }, 3000);
};

window.updateCartCount = function() {
    const cart = JSON.parse(localStorage.getItem('antunesCleanCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) { cartCountElement.textContent = totalItems; }
};

window.handleAddToCart = function(e) {
    const card = e.target.closest('.product-card');
    const product = { id: card.dataset.id, name: card.dataset.name, price: parseFloat(card.dataset.price), image: card.dataset.image };
    let cart = JSON.parse(localStorage.getItem('antunesCleanCart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) { existingItem.quantity++; } else { cart.push({ ...product, quantity: 1 }); }
    localStorage.setItem('antunesCleanCart', JSON.stringify(cart));
    window.showNotification(`"${product.name}" foi adicionado ao carrinho!`);
    window.updateCartCount();
};

window.addCartButtonEvents = function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.removeEventListener('click', window.handleAddToCart);
        button.addEventListener('click', window.handleAddToCart);
    });
};

// --- LÓGICA DA PÁGINA ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- OBSERVADORES (Animação e Lazy Loading) ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.onload = () => { img.classList.add('loaded'); };
                observer.unobserve(img);
            }
        });
    });

    // Função GLOBAL que aplica os observadores a um conjunto de elementos
    window.observeElements = function(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        container.querySelectorAll('.animate-on-scroll').forEach(el => animationObserver.observe(el));
        container.querySelectorAll('.lazy-image').forEach(img => lazyImageObserver.observe(img));
    };


    // --- FUNÇÕES ESPECÍFICAS DA PÁGINA INICIAL ---
    function loadFeaturedProducts() {
        const grid = document.getElementById('featured-products-grid');
        if (!grid || typeof allProducts === 'undefined') return;

        const featuredProducts = allProducts.slice(0, 4);
        grid.innerHTML = '';
        featuredProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card animate-on-scroll fade-in-up';
            card.setAttribute('data-delay', index);
            card.setAttribute('data-id', product.id);
            card.setAttribute('data-name', product.name);
            card.setAttribute('data-price', product.price);
            card.setAttribute('data-image', product.image);
            card.innerHTML = `
                <a href="produto-detalhe.html?id=${product.id}" class="product-card-link">
                    <img class="lazy-image" src="imagens/placeholder.webp" data-src="${product.image}" alt="${product.name}">
                    <div class="card-title">${product.name.toUpperCase()}</div>
                    <div class="card-price">R$ ${product.price.toFixed(2)}</div>
                </a>
                <button class="btn add-to-cart-btn">Adicionar ao Carrinho</button>
            `;
            grid.appendChild(card);
        });
        window.addCartButtonEvents();
        window.observeElements('#featured-products-grid'); // Aplica os observadores
    }

    // --- COMPONENTES GERAIS DO SITE ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) { hamburger.addEventListener('click', () => { navMenu.classList.toggle('mobile-active'); }); }

    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => { window.scrollY > 300 ? backToTopButton.classList.add('show') : backToTopButton.classList.remove('show'); });
        backToTopButton.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    // --- INICIALIZAÇÃO ---
    // Aplica observadores aos elementos estáticos de qualquer página
    window.observeElements('main');
    // Carrega os produtos em destaque (só vai funcionar se estiver na index.html)
    loadFeaturedProducts();
    // Atualiza o contador do carrinho
    window.updateCartCount();
});