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
            const cardLink = document.createElement('a');
            cardLink.href = `produto-detalhe.html?id=${product.id}`;
            cardLink.className = 'product-card-link';
            cardLink.innerHTML = `<div class="product-card"><img src="${product.image}" alt="${product.name}"><div class="card-title">${product.name.toUpperCase()}</div><div class="card-price">R$ ${product.price.toFixed(2)}</div></div>`;
            productGridElement.appendChild(cardLink);
        });
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

        // 1. Aplica Filtro de Marca
        const selectedBrand = brandFilter.value;
        if (selectedBrand !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
        }

        // 2. Aplica Filtro de Preço
        filteredProducts = filteredProducts.filter(p => p.price >= currentPriceFilter.min && p.price <= currentPriceFilter.max);

        // 3. Aplica Ordenação
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
    brandFilter.addEventListener('change', filterAndSortProducts);
    sortBySelect.addEventListener('change', filterAndSortProducts);

    priceFilterList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove 'active' de outros links e aplica no clicado
            priceFilterList.querySelector('a.active')?.classList.remove('active');
            link.classList.add('active');

            currentPriceFilter.min = parseFloat(link.dataset.min);
            currentPriceFilter.max = parseFloat(link.dataset.max);
            filterAndSortProducts();
        });
    });

    filterAndSortProducts();
});