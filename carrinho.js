//teste
document.addEventListener('DOMContentLoaded', function() {
    
    // --- DADOS DA EMPRESA E PIX ---
    const numeroWhatsapp = '5567998879733';
    const chavePix = 'kevynwpantunes2@gmail.com';
    const nomeBeneficiado = 'Antunes Clean';
    const cidadeBeneficiado = 'TRES LAGOAS';

    // --- ELEMENTOS DO DOM ---
    const checkoutForm = document.getElementById('checkout-form');
    const summaryItemsList = document.getElementById('summary-items-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const cartContainer = document.getElementById('cart-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    // --- SEÇÃO PIX ---
    const pixPaymentSection = document.getElementById('pix-payment-section');
    const pixQrCodeContainer = document.getElementById('pix-qrcode-container');
    const pixCopyPaste = document.getElementById('pix-copy-paste');
    const copyPixBtn = document.getElementById('copy-pix-btn');
    const sendReceiptBtn = document.getElementById('send-receipt-btn');

    // --- FUNÇÕES DE MANIPULAÇÃO DO CARRINHO ---
    function getCart() { return JSON.parse(localStorage.getItem('antunesCleanCart')) || []; }
    function saveCart(cart) {
        localStorage.setItem('antunesCleanCart', JSON.stringify(cart));
        renderPage(); 
    }
    function changeQuantity(productId, change) {
        let cart = getCart();
        const item = cart.find(p => p.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
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
        addCartEventListeners();
    }
    
    function renderPage() {
        const cart = getCart();
        if (cart.length === 0) {
            cartContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            pixPaymentSection.style.display = 'none';
        } else {
            cartContainer.style.display = 'grid';
            emptyCartMessage.style.display = 'none';
            renderOrderSummary();
        }
        window.updateCartCount();
    }

    // --- EVENT LISTENERS ---
    function addCartEventListeners() {
        document.querySelectorAll('.decrease-qty').forEach(btn => btn.addEventListener('click', e => changeQuantity(e.currentTarget.dataset.id, -1)));
        document.querySelectorAll('.increase-qty').forEach(btn => btn.addEventListener('click', e => changeQuantity(e.currentTarget.dataset.id, 1)));
        document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', e => removeItem(e.currentTarget.dataset.id)));
    }
    
    // --- LÓGICA DE CHECKOUT ---
    function handleCheckoutSubmit(e) {
        e.preventDefault();
        
        // A notificação automática para o dono foi REMOVIDA daqui.

        cartContainer.style.display = 'none';
        pixPaymentSection.style.display = 'block';

        const cart = getCart();
        const totalPedido = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const txid = "pedido" + new Date().getTime(); 
        const valorFormatado = totalPedido.toFixed(2);
        
        const formatField = (id, value) => {
            const len = value.length.toString().padStart(2, '0');
            return `${id}${len}${value}`;
        };

        let payload = '000201' +
                      formatField('26', 
                          formatField('00', 'br.gov.bcb.pix') +
                          formatField('01', chavePix)
                      ) +
                      formatField('52', '0000') +
                      formatField('53', '986') +
                      formatField('54', valorFormatado) +
                      formatField('58', 'BR') +
                      formatField('59', nomeBeneficiado.substring(0, 25)) +
                      formatField('60', cidadeBeneficiado.substring(0, 15)) +
                      formatField('62', formatField('05', txid.substring(0, 25))) +
                      '6304';
        
        let crc = 0xFFFF;
        for (let i = 0; i < payload.length; i++) {
            crc ^= (payload.charCodeAt(i) << 8);
            for (let j = 0; j < 8; j++) {
                crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
            }
        }
        const crc16 = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
        payload += crc16;

        pixQrCodeContainer.innerHTML = '';
        new QRCode(pixQrCodeContainer, {
            text: payload,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        pixCopyPaste.value = payload;
    }

    // A função de notificação para o dono foi completamente REMOVIDA.

    if (copyPixBtn) {
        copyPixBtn.addEventListener('click', () => {
            pixCopyPaste.select();
            document.execCommand('copy');
            window.showNotification('Código PIX copiado!');
        });
    }

    if (sendReceiptBtn) {
        sendReceiptBtn.addEventListener('click', () => {
            const customerInfo = {
                name: document.getElementById('name').value
            };
            const cart = getCart();
            const totalPedido = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            let mensagem = `Olá, Antunes Clean! 👋\n\nEstou enviando o comprovante do PIX de *${customerInfo.name}* referente ao pedido no valor de *R$ ${totalPedido.toFixed(2)}*.\n\nAguardo a confirmação. Obrigado(a)!`;

            const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
            window.open(linkWhatsapp, '_blank');

            localStorage.removeItem('antunesCleanCart');
            setTimeout(() => {
               checkoutForm.reset();
               renderPage();
            }, 1000);
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    renderPage();
});