document.addEventListener('DOMContentLoaded', function() {
    
    // --- DADOS DA SUA EMPRESA ---
    const seuNumeroWhatsapp = '5567998879733'; 
    const suaChavePix = "kevynwpantunes2@gmail.com"; // INSIRA AQUI SUA CHAVE PIX
    const seuNomeComercial = "Antunes Clean"; // NOME QUE APARECERÁ NO APP DO CLIENTE
    const suaCidade = "CAMPO GRANDE"; // CIDADE ONDE SUA EMPRESA ESTÁ REGISTRADA

    // --- ELEMENTOS DA PÁGINA ---
    const modal = document.getElementById('confirmation-modal');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const enderecoTextarea = document.getElementById('endereco-entrega');

    const pixModal = document.getElementById('pix-modal');
    const pixQrcodeCanvas = document.getElementById('pix-qrcode');
    const pixCopyCodeInput = document.getElementById('pix-copy-code');
    const copyPixBtn = document.getElementById('copy-pix-btn');
    const closePixModalBtn = document.getElementById('close-pix-modal');
    const checkoutPixButton = document.getElementById('checkout-pix-btn');
    const checkoutWhatsappButton = document.getElementById('checkout-whatsapp-btn');
    
    // --- FUNÇÕES GLOBAIS DE CARRINHO ---
    function getCart() {
        return JSON.parse(localStorage.getItem('antunesCleanCart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('antunesCleanCart', JSON.stringify(cart));
        renderCart();
    }

    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }
    
    function carregarEnderecoSalvo() {
        const enderecoSalvo = localStorage.getItem('antunesCleanUserAddress');
        if (enderecoSalvo) {
            enderecoTextarea.value = enderecoSalvo;
        }
    }
    
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartWithItems = document.getElementById('cart-with-items');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');

    function renderCart() {
        const cart = getCart();
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartWithItems.style.display = 'none';
        } else {
            emptyCartMessage.style.display = 'none';
            cartWithItems.style.display = 'grid';
            cartItemsList.innerHTML = '';
            let subtotal = 0;
            cart.forEach(item => {
                const itemTotalPrice = item.price * item.quantity;
                subtotal += itemTotalPrice;
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">R$ ${item.price.toFixed(2)}</div>
                    </div>
                    <div class="item-actions">
                        <div class="item-quantity">
                            <button class="quantity-btn decrease-btn" data-id="${item.id}" title="Diminuir">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn increase-btn" data-id="${item.id}" title="Aumentar">+</button>
                        </div>
                        <div class="item-total-price">R$ ${itemTotalPrice.toFixed(2)}</div>
                        <button class="remove-item-btn" data-id="${item.id}" title="Remover item"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartItemsList.appendChild(cartItemElement);
            });
            summarySubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
            summaryTotal.textContent = `R$ ${subtotal.toFixed(2)}`;
        }
        updateCartCount();
        addEventListenersToCartButtons();
    }

    function addEventListenersToCartButtons() {
        document.querySelectorAll('.decrease-btn').forEach(button => { button.addEventListener('click', e => handleQuantityChange(e.currentTarget.dataset.id, -1)); });
        document.querySelectorAll('.increase-btn').forEach(button => { button.addEventListener('click', e => handleQuantityChange(e.currentTarget.dataset.id, 1)); });
        document.querySelectorAll('.remove-item-btn').forEach(button => { button.addEventListener('click', e => removeItem(e.currentTarget.dataset.id)); });
    }

    function handleQuantityChange(productId, change) {
        let cart = getCart();
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== productId);
            }
            saveCart(cart);
        }
    }

    function removeItem(productId) {
        modal.classList.add('show');
        const handleConfirm = () => {
            let cart = getCart();
            cart = cart.filter(i => i.id !== productId);
            saveCart(cart);
            modal.classList.remove('show');
            cleanUpListeners();
        };
        const handleCancel = () => {
            modal.classList.remove('show');
            cleanUpListeners();
        };
        const cleanUpListeners = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
        };
        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
    }
    
    // --- LÓGICA DE PAGAMENTO VIA PIX (SEM NODE.JS) ---
    if (checkoutPixButton) {
        checkoutPixButton.addEventListener('click', () => {
            const cart = getCart();
            const endereco = enderecoTextarea.value.trim();
            const totalAmount = calculateTotal(cart).toFixed(2);

            if (cart.length === 0 || !endereco) {
                window.showNotification('Preencha o carrinho e o endereço para continuar.');
                return;
            }
            
            localStorage.setItem('antunesCleanUserAddress', endereco);

            // --- FUNÇÃO PARA GERAR O BRCODE (PIX COPIA E COLA) - VERSÃO CORRIGIDA ---
            function generateBRCode(pixKey, merchantName, merchantCity, amount) {
                
                // Função para sanitizar (limpar) os textos
                const sanitizeText = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").toUpperCase().replace(/\s/g, '');

                const sanitizedName = sanitizeText(merchantName).substring(0, 25);
                const sanitizedCity = sanitizeText(merchantCity).substring(0, 15);

                const f = (id, value) => {
                    const size = String(value.length).padStart(2, '0');
                    return id + size + value;
                };

                const payload = [
                    f('00', '01'),
                    f('26', f('00', 'BR.GOV.BCB.PIX') + f('01', pixKey)),
                    f('52', '0000'),
                    f('53', '986'),
                    f('54', amount),
                    f('58', 'BR'),
                    f('59', sanitizedName),
                    f('60', sanitizedCity),
                    f('62', f('05', '***'))
                ].join('');

                const fullPayload = payload + '6304';

                // Cálculo do CRC16
                let crc = 0xFFFF;
                for (let i = 0; i < fullPayload.length; i++) {
                    crc ^= (fullPayload.charCodeAt(i) << 8);
                    for (let j = 0; j < 8; j++) {
                        crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
                    }
                }
                const crc16 = ('0000' + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
                
                return fullPayload + crc16;
            }

            const brCode = generateBRCode(suaChavePix, seuNomeComercial, suaCidade, totalAmount);
            pixCopyCodeInput.value = brCode;

            if (window.QRious) {
                new QRious({ element: pixQrcodeCanvas, value: brCode, size: 220, level: 'H' });
            } else {
                window.showNotification("Erro ao gerar QR Code. Tente novamente.");
                return;
            }

            pixModal.classList.add('show');
        });
    }

    // Ações do Modal PIX
    if (copyPixBtn) {
      copyPixBtn.addEventListener('click', () => {
          pixCopyCodeInput.select();
          document.execCommand('copy');
          window.showNotification('Código Pix copiado!');
      });
    }

    if (closePixModalBtn) {
      closePixModalBtn.addEventListener('click', () => pixModal.classList.remove('show'));
    }

    function calculateTotal(cart) {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    // --- LÓGICA DO BOTÃO DO WHATSAPP ---
    if (checkoutWhatsappButton) {
        checkoutWhatsappButton.addEventListener('click', () => {
            const cart = getCart();
            const endereco = enderecoTextarea.value.trim();

            if (cart.length === 0 || !endereco) {
                window.showNotification('Preencha o carrinho e o endereço.');
                return;
            }

            localStorage.setItem('antunesCleanUserAddress', endereco);
            let mensagem = 'Olá! Gostaria de fazer o seguinte pedido:\n\n';
            let totalPedido = 0;
            cart.forEach(item => {
                const subtotalItem = item.price * item.quantity;
                mensagem += `*Produto:* ${item.name}\n`;
                mensagem += `*Quantidade:* ${item.quantity}\n`;
                mensagem += `*Subtotal:* R$ ${subtotalItem.toFixed(2)}\n\n`;
                totalPedido += subtotalItem;
            });
            mensagem += `*ENDEREÇO DE ENTREGA:*\n${endereco}\n\n`;
            mensagem += `*TOTAL DO PEDIDO: R$ ${totalPedido.toFixed(2)}*`;
            
            const mensagemCodificada = encodeURIComponent(mensagem);
            const linkWhatsapp = `https://wa.me/${seuNumeroWhatsapp}?text=${mensagemCodificada}`;
            window.open(linkWhatsapp, '_blank');
        });
    }
    
    // --- INICIALIZAÇÃO DA PÁGINA ---
    carregarEnderecoSalvo();
    renderCart();
});