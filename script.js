document.addEventListener('DOMContentLoaded', function() {

    // --- FUNÇÃO GLOBAL DE NOTIFICAÇÃO ---
    let notificationTimeout;
    function showNotification(message) {
        const notification = document.getElementById('notification');
        if (!notification) return;

        // Limpa timeout anterior se houver
        clearTimeout(notificationTimeout);

        notification.textContent = message;
        notification.classList.add('show');

        // Esconde a notificação após 3 segundos
        notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    window.showNotification = showNotification; // Torna a função global

    // --- FUNÇÕES GLOBAIS DE CARRINHO ---
    function getCart() {
        return JSON.parse(localStorage.getItem('antunesCleanCart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('antunesCleanCart', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }
    window.updateCartCount = updateCartCount;

    // --- LÓGICA DA PÁGINA PRINCIPAL ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const product = { id: card.dataset.id, name: card.dataset.name, price: parseFloat(card.dataset.price), image: card.dataset.image };
            let cart = getCart();
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) { existingItem.quantity++; } else { cart.push({ ...product, quantity: 1 }); }
            saveCart(cart);
            showNotification(`"${product.name}" foi adicionado ao carrinho!`);
        });
    });

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) { hamburger.addEventListener('click', () => { navMenu.classList.toggle('mobile-active'); }); }

    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = document.getElementById('submit-button');
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso!');
                contactForm.reset();
                submitButton.textContent = 'CONTACT US';
                submitButton.disabled = false;
            }, 1500);
        });
    }

    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { backToTopButton.classList.add('show'); } else { backToTopButton.classList.remove('show'); }
        });
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => animationObserver.observe(el));

    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a.nav-link');
    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) { link.classList.add('active'); }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    if (sections.length > 0 && navLinks.length > 0) { sections.forEach(section => scrollSpyObserver.observe(section)); }

    updateCartCount();
});