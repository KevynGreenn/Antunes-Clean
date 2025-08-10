//teste
document.addEventListener('DOMContentLoaded', function() {

    // --- ELEMENTOS DA PÁGINA ---
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const pageTitleElement = document.getElementById('page-title');
    const productGridElement = document.getElementById('product-grid-dynamic');
    const brandFilter = document.getElementById('filter-brand');
    const priceFilterList = document.getElementById('price-filter-list');
    const sortBySelect = document.getElementById('sort-by');
    const activeFiltersContainer = document.getElementById('active-filters');
    
    // Pega o novo campo de busca do HTML
    const searchInput = document.getElementById('search-input'); 

    // Verifica se a base de dados de produtos existe
    if (typeof allProducts === 'undefined') {
        console.error("Database de produtos (database.js) não foi carregada.");
        if (productGridElement) productGridElement.innerHTML = "<p>Erro ao carregar produtos.</p>";
        return;
    }

    const initialProducts = category ? allProducts.filter(p => p.category === category) : allProducts;
    let currentPriceFilter = { min: 0, max: 9999 };

    // --- FUNÇÕES ---

    function formatTitle(categoryKey) {
        if (!categoryKey) return 'TODOS OS PRODUTOS';
        return categoryKey.replace(/-/g, ' ').toUpperCase();
    }
    
    function populateBrandFilter() {
        const brands = [...new Set(initialProducts.map(p => p.brand))];
        brandFilter.innerHTML = '<option value="all">Todas</option>';
        brands.forEach(brand => {
            if (brand) {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandFilter.appendChild(option);
            }
        });
    }

    function renderProducts(products) {
        productGridElement.innerHTML = '';
        if (products.length === 0) {
            productGridElement.innerHTML = '<p>Nenhum produto encontrado com os filtros selecionados.</p>';
            return;
        }
        products.forEach(product => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'product-card';
            cardContainer.setAttribute('data-id', product.id);
            cardContainer.setAttribute('data-name', product.name);
            cardContainer.setAttribute('data-price', product.price);
            cardContainer.setAttribute('data-image', product.image);
            cardContainer.innerHTML = `
                <a href="produto-detalhe.html?id=${product.id}" class="product-card-link">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="card-title">${product.name.toUpperCase()}</div>
                    <div class="card-price">R$ ${product.price.toFixed(2)}</div>
                </a>
                <button class="btn add-to-cart-btn">Adicionar ao Carrinho</button>
            `;
            productGridElement.appendChild(cardContainer);
        });
        addCartEventsOnProductsPage();
    }

    function addCartEventsOnProductsPage() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', handleAddToCartOnProductsPage);
        });
    }

    function handleAddToCartOnProductsPage(e) {
        const card = e.target.closest('.product-card');
        const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            image: card.dataset.image
        };
        let cart = JSON.parse(localStorage.getItem('antunesCleanCart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('antunesCleanCart', JSON.stringify(cart));
        window.showNotification(`"${product.name}" foi adicionado ao carrinho!`);
        window.updateCartCount();
    }

    function updateActiveFilters() {
        activeFiltersContainer.innerHTML = '';
        const priceLink = priceFilterList.querySelector('a.active');
        if (priceLink) {
            const tag = document.createElement('span');
            tag.className = 'filter-tag';
            tag.innerHTML = `Preço: ${priceLink.textContent} <button class="remove-filter">&times;</button>`;
            tag.querySelector('button').addEventListener('click', () => {
                priceLink.classList.remove('active');
                currentPriceFilter = { min: 0, max: 9999 };
                filterAndSortProducts();
            });
            activeFiltersContainer.appendChild(tag);
        }
    }

    function filterAndSortProducts() {
        let filteredProducts = [...initialProducts];

        // 1. APLICA FILTRO DE BUSCA (NOVA LÓGICA)
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(searchTerm)
            );
        }

        // 2. Aplica Filtro de Marca
        const selectedBrand = brandFilter.value;
        if (selectedBrand !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
        }

        // 3. Aplica Filtro de Preço
        filteredProducts = filteredProducts.filter(p => p.price >= currentPriceFilter.min && p.price <= currentPriceFilter.max);

        // 4. Aplica Ordenação
        const sortValue = sortBySelect.value;
        switch (sortValue) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        renderProducts(filteredProducts);
        updateActiveFilters();
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    pageTitleElement.textContent = formatTitle(category);

    populateBrandFilter();
    
    // Adiciona o listener para o campo de busca
    searchInput.addEventListener('input', filterAndSortProducts);

    brandFilter.addEventListener('change', filterAndSortProducts);
    sortBySelect.addEventListener('change', filterAndSortProducts);

    priceFilterList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            priceFilterList.querySelector('a.active')?.classList.remove('active');
            link.classList.add('active');
            currentPriceFilter.min = parseFloat(link.dataset.min);
            currentPriceFilter.max = parseFloat(link.dataset.max);
            filterAndSortProducts();
        });
    });

    filterAndSortProducts();
});