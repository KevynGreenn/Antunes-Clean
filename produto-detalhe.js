//teste
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = allProducts.find(p => p.id === productId);

    if (product) {
        document.title = `${product.name} - Antunes Clean`;
        document.getElementById('breadcrumbs').innerHTML = `<a href="index.html">Home</a> / <a href="produtos.html?category=${product.category}">${product.category.replace('-', ' ')}</a> / ${product.name}`;
        
        const mainImage = document.getElementById('main-product-image');
        mainImage.src = product.image;
        mainImage.alt = product.name;

        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `R$ ${product.price.toFixed(2)}`;
        document.getElementById('product-short-description').textContent = product.description;

        const tagElement = document.getElementById('product-tag');
        if (product.tag) { tagElement.textContent = product.tag; tagElement.style.display = 'block'; } else { tagElement.style.display = 'none'; }
        
        // --- LÓGICA DA GALERIA DE IMAGENS ---
        const thumbnailsContainer = document.getElementById('product-thumbnails');
        if (product.gallery && product.gallery.length > 1) {
            thumbnailsContainer.innerHTML = ''; 
            product.gallery.forEach((imgSrc, index) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc;
                thumb.className = 'thumbnail-image';
                if (index === 0) thumb.classList.add('active'); 

                thumb.addEventListener('click', () => {
                    // 1. Atualiza a imagem principal
                    mainImage.src = imgSrc;

                    // 2. ATUALIZAÇÃO PARA O ZOOM: Reinicia o efeito na nova imagem
                    var container = document.getElementById('product-image-container');
                    // Remove a janela de zoom antiga, se houver
                    var oldZoomView = container.querySelector('.js-image-zoom__zoomed-area');
                    if (oldZoomView) {
                        oldZoomView.remove();
                    }
                    // A imagem dentro do container também precisa ser atualizada para o zoom funcionar
                    container.querySelector('img').src = imgSrc; 
                    // Cria uma nova instância do zoom para a nova imagem
                    new ImageZoom(container, {
                        width: 400,
                        zoomWidth: 500,
                        offset: {vertical: 0, horizontal: 10},
                        zoomPosition: 'right'
                    });

                    // 3. Atualiza qual miniatura está ativa (com a borda)
                    thumbnailsContainer.querySelector('.active').classList.remove('active');
                    thumb.classList.add('active');
                });
                thumbnailsContainer.appendChild(thumb);
            });
        }

        const decreaseBtn = document.getElementById('decrease-qty');
        const increaseBtn = document.getElementById('increase-qty');
        const quantityInput = document.getElementById('quantity-input');
        decreaseBtn.addEventListener('click', () => { if (parseInt(quantityInput.value) > 1) { quantityInput.value--; } });
        increaseBtn.addEventListener('click', () => { quantityInput.value++; });
        
        const addToCartBtn = document.getElementById('add-to-cart-detail');
        addToCartBtn.addEventListener('click', () => {
            if (addToCartBtn.disabled) { return; }

            let cart = JSON.parse(localStorage.getItem('antunesCleanCart')) || [];
            const quantity = parseInt(quantityInput.value);
            const existingItem = cart.find(item => item.id === product.id.toString());
            if (existingItem) { existingItem.quantity += quantity; } else { cart.push({ ...product, id: product.id.toString(), quantity: quantity }); }
            localStorage.setItem('antunesCleanCart', JSON.stringify(cart));
            window.updateCartCount();
            window.showNotification(`${quantity}x "${product.name}" foi adicionado ao carrinho!`);

            addToCartBtn.textContent = 'Adicionado ✓';
            addToCartBtn.classList.add('added');
            addToCartBtn.disabled = true;

            setTimeout(() => {
                addToCartBtn.textContent = 'Adicionar ao Carrinho';
                addToCartBtn.classList.remove('added');
                addToCartBtn.disabled = false;
            }, 2000);
        });
        
        const buyNowBtn = document.getElementById('buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', () => {
                let cart = JSON.parse(localStorage.getItem('antunesCleanCart')) || [];
                const quantity = parseInt(quantityInput.value);
                const existingItem = cart.find(item => item.id === product.id.toString());
                if (existingItem) { existingItem.quantity += quantity; } else { cart.push({ ...product, id: product.id.toString(), quantity: quantity }); }
                localStorage.setItem('antunesCleanCart', JSON.stringify(cart));
                window.updateCartCount();
                window.location.href = 'carrinho.html';
            });
        }
        
        const shareWhatsapp = document.getElementById('share-whatsapp');
        if(shareWhatsapp) {
            const pageUrl = window.location.href;
            const shareText = encodeURIComponent(`Olha que legal este produto que encontrei na Antunes Clean: ${product.name}! ${pageUrl}`);
            shareWhatsapp.href = `https://api.whatsapp.com/send?text=${shareText}`;
        }

        const relatedProductsGrid = document.getElementById('related-products-grid');
        const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        if (relatedProducts.length > 0) {
            relatedProducts.forEach(related => {
                const cardLink = document.createElement('a');
                cardLink.href = `produto-detalhe.html?id=${related.id}`;
                cardLink.className = 'product-card-link';
                cardLink.innerHTML = `<div class="product-card"><img src="${related.image}" alt="${related.name}"><div class="card-title">${related.name.toUpperCase()}</div><div class="card-price">R$ ${related.price.toFixed(2)}</div></div>`;
                relatedProductsGrid.appendChild(cardLink);
            });
        } else {
            document.querySelector('.related-products-section').style.display = 'none';
        }
    } else {
        document.querySelector('.product-detail-page .container').innerHTML = '<h1>Produto não encontrado</h1><p>O produto que você está procurando não existe ou foi removido.</p><a href="index.html" class="btn">Voltar para a Home</a>';
    }
});