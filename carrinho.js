document.addEventListener('DOMContentLoaded', function() {
    
    // --- NÚMERO DE WHATSAPP ---
    const seuNumeroWhatsapp = '5567998879733'; 

    // --- ELEMENTOS DA PÁGINA ---
    const modal = document.getElementById('confirmation-modal');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const enderecoTextarea = document.getElementById('endereco-entrega');

    // NOVOS ELEMENTOS PARA O MODAL PIX
    const pixModal = document.getElementById('pix-modal');
    const pixQrcode = document.getElementById('pix-qrcode');
    const pixCopyCodeInput = document.getElementById('pix-copy-code');
    const copyPixBtn = document.getElementById('copy-pix-btn');
    const closePixModalBtn = document.getElementById('close-pix-modal');
    const checkoutPixButton = document.getElementById('checkout-pix-btn');
    
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
    
    // --- FUNÇÃO PARA CARREGAR ENDEREÇO SALVO ---
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
                let cart = getCart();
                cart = cart.filter(i => i.id !== productId);
                saveCart(cart);
            } else {
                saveCart(cart);
            }
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
    
    // NOVO BLOCO DE LÓGICA PARA PAGAMENTO VIA PIX
    if (checkoutPixButton) {
        checkoutPixButton.addEventListener('click', async () => {
            const cart = getCart();
            const endereco = enderecoTextarea.value.trim();
            const pixKey = "kevynwpantunes2@gmail.com"; // Chave Pix fixa

            if (cart.length === 0) {
                window.showNotification('Seu carrinho está vazio!');
                return;
            }

            if (!endereco) {
                window.showNotification('Por favor, preencha o endereço para entrega.');
                enderecoTextarea.focus();
                return;
            }
            
            // Salva o endereço para a próxima visita
            localStorage.setItem('antunesCleanUserAddress', endereco);

            try {
                // Envia o pedido para o novo servidor de backend
                const response = await fetch('https://servidorpix.onrender.com', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pixKey: pixKey, total: calculateTotal(cart) })
                });

                const data = await response.json();

                if (data.success) {
                    pixQrcode.src = data.qrCodeImage;
                    pixCopyCodeInput.value = data.pixCode;
                    pixModal.classList.add('show');
                } else {
                    window.showNotification('Erro ao gerar pagamento.');
                }
            } catch (error) {
                console.error('Erro:', error);
                window.showNotification('Erro de comunicação com o servidor de pagamento.');
            }
        });
    }

    // Ações do Modal
    if (copyPixBtn) {
      copyPixBtn.addEventListener('click', () => {
          pixCopyCodeInput.select();
          document.execCommand('copy');
          window.showNotification('Código Pix copiado!');
      });
    }

    if (closePixModalBtn) {
      closePixModalBtn.addEventListener('click', () => {
          pixModal.classList.remove('show');
      });
    }

    function calculateTotal(cart) {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    // --- LÓGICA DO BOTÃO DO WHATSAPP (antigo) ---
    const checkoutWhatsappButton = document.getElementById('checkout-whatsapp-btn');
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