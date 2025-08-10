//teste
document.addEventListener('DOMContentLoaded', function() {
    
    // --- DADOS DA EMPRESA ---
    const numeroWhatsapp = '5567998879733';

    // --- ELEMENTOS DO DOM ---
    const checkoutForm = document.getElementById('checkout-form');
    const summaryItemsList = document.getElementById('summary-items-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const cartContainer = document.getElementById('cart-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    // --- FUNÇÕES DE MANIPULAÇÃO DO CARRINHO ---
    function getCart() { return JSON.parse(localStorage.getItem('antunesCleanCart')) || []; }
    function saveCart(cart) {
        localStorage.setItem('antunesCleanCart', JSON.stringify(cart));
        renderPage(); // Renderiza novamente a página inteira para refletir as mudanças
    }
    function changeQuantity(productId, change) {
        let cart = getCart();
        const item = cart.find(p => p.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) { // Se a quantidade for 0 ou menos, remove o item
                cart = cart.filter(p => p.id !== productId);
            }
        }
        saveCart(cart);
    }
    function removeItem(productId) {
        let cart = getCart();
        cart = cart.filter(p => p.id !== productId);
        saveCart(cart);
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    function renderOrderSummary() {
        const cart = getCart();
        summaryItemsList.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="summary-item-details">
                    <div class="name">${item.name}</div>
                    <div class="item-controls">
                        <button class="qty-btn decrease-qty" data-id="${item.id}">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn increase-qty" data-id="${item.id}">+</button>
                        <button class="remove-btn" data-id="${item.id}" title="Remover Item">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <span class="price">R$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            summaryItemsList.appendChild(itemElement);
        });

        summarySubtotal.textContent = `R$${subtotal.toFixed(2)}`;
        summaryTotal.textContent = `R$${subtotal.toFixed(2)}`;
        addCartEventListeners(); // Adiciona eventos aos novos botões
    }
    
    // Mostra/Esconde o conteúdo da página com base no carrinho
    function renderPage() {
        const cart = getCart();
        if (cart.length === 0) {
            cartContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
        } else {
            cartContainer.style.display = 'grid';
            emptyCartMessage.style.display = 'none';
            renderOrderSummary();
        }
        window.updateCartCount(); // Atualiza o contador no header
    }

    // --- EVENT LISTENERS ---
    function addCartEventListeners() {
        document.querySelectorAll('.decrease-qty').forEach(btn => btn.addEventListener('click', e => changeQuantity(e.currentTarget.dataset.id, -1)));
        document.querySelectorAll('.increase-qty').forEach(btn => btn.addEventListener('click', e => changeQuantity(e.currentTarget.dataset.id, 1)));
        document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', e => removeItem(e.currentTarget.dataset.id)));
    }

    function handleCheckoutSubmit(e) {
        e.preventDefault();
        const customerInfo = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            reference: document.getElementById('reference').value
        };
        const cart = getCart();
        const totalPedido = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        let mensagem = `Olá, Antunes Clean! Gostaria de fazer um novo pedido.\n\n`;
        mensagem += `*--- DADOS DO CLIENTE ---*\n*Nome:* ${customerInfo.name}\n*Telefone:* ${customerInfo.phone}\n\n`;
        mensagem += `*--- ENDEREÇO DE ENTREGA (Três Lagoas) ---*\n${customerInfo.address}\n`;
        if (customerInfo.reference) { mensagem += `*Referência:* ${customerInfo.reference}\n`; }
        mensagem += `\n*--- ITENS DO PEDIDO ---*\n`;
        cart.forEach(item => {
            mensagem += `*${item.name}*\n   - Quantidade: ${item.quantity}\n   - Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
        });
        mensagem += `*TOTAL DO PEDIDO: R$ ${totalPedido.toFixed(2)}*\n\nAguardo o contato para combinar o pagamento e a entrega. Obrigado!`;
        
        const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
        window.open(linkWhatsapp, '_blank');
        
        localStorage.removeItem('antunesCleanCart');
        window.showNotification('Seu pedido foi enviado! Continue a conversa no WhatsApp.');
        setTimeout(() => {
           checkoutForm.reset();
           renderPage();
        }, 500);
    }

    // --- INICIALIZAÇÃO ---
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    renderPage();
});