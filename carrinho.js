document.addEventListener('DOMContentLoaded', function() {
    
    // --- DADOS DA EMPRESA ---
    const numeroWhatsapp = '5567998879733'; // Coloque seu número aqui

    // --- ELEMENTOS DO DOM ---
    const checkoutForm = document.getElementById('checkout-form');
    const summaryItemsList = document.getElementById('summary-items-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');

    // --- FUNÇÕES ---

    // Pega o carrinho salvo no navegador
    function getCart() {
        return JSON.parse(localStorage.getItem('antunesCleanCart')) || [];
    }

    // Renderiza o resumo do pedido na coluna da direita
    function renderOrderSummary() {
        const cart = getCart();
        if (!summaryItemsList) return;

        summaryItemsList.innerHTML = ''; // Limpa a lista antes de adicionar
        let subtotal = 0;

        if (cart.length === 0) {
            summaryItemsList.innerHTML = '<p>Seu carrinho está vazio.</p>';
            // Desabilita o formulário se o carrinho estiver vazio
            if(checkoutForm) checkoutForm.querySelector('button').disabled = true;
        }

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="summary-item-details">
                    <div class="name">${item.name}</div>
                    <div class="quantity">Quantidade: ${item.quantity}</div>
                </div>
                <span class="price">R$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            summaryItemsList.appendChild(itemElement);
        });

        // Atualiza os totais
        summarySubtotal.textContent = `R$${subtotal.toFixed(2)}`;
        summaryTotal.textContent = `R$${subtotal.toFixed(2)}`;
    }

    // Lida com o envio do formulário
    function handleCheckoutSubmit(e) {
        e.preventDefault();

        // Coleta os dados do formulário
        const customerInfo = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            reference: document.getElementById('reference').value
        };

        const cart = getCart();
        const totalPedido = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Monta a mensagem para o WhatsApp
        let mensagem = `Olá, Antunes Clean! Gostaria de fazer um novo pedido.\n\n`;
        mensagem += `*--- DADOS DO CLIENTE ---*\n`;
        mensagem += `*Nome:* ${customerInfo.name}\n`;
        mensagem += `*Telefone:* ${customerInfo.phone}\n\n`;
        
        mensagem += `*--- ENDEREÇO DE ENTREGA (Três Lagoas) ---*\n`;
        mensagem += `${customerInfo.address}\n`;
        if (customerInfo.reference) {
            mensagem += `*Referência:* ${customerInfo.reference}\n`;
        }
        
        mensagem += `\n*--- ITENS DO PEDIDO ---*\n`;
        cart.forEach(item => {
            mensagem += `*${item.name}*\n`;
            mensagem += `   - Quantidade: ${item.quantity}\n`;
            mensagem += `   - Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
        });
        
        mensagem += `*TOTAL DO PEDIDO: R$ ${totalPedido.toFixed(2)}*\n\n`;
        mensagem += `Aguardo o contato para combinar o pagamento e a entrega. Obrigado!`;
        
        // Abre o link do WhatsApp
        const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
        window.open(linkWhatsapp, '_blank');
        
        // Opcional: Limpar o carrinho e notificar o usuário
        localStorage.removeItem('antunesCleanCart');
        window.showNotification('Seu pedido foi enviado! Continue a conversa no WhatsApp.');
        setTimeout(() => {
           renderOrderSummary(); // Atualiza a tela para mostrar o carrinho vazio
           checkoutForm.reset();
        }, 500);
    }

    // --- INICIALIZAÇÃO ---
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    renderOrderSummary();
    window.updateCartCount(); // Atualiza o contador de itens no header
});