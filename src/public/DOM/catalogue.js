const params = new URLSearchParams(window.location.search);
const page = parseInt(params.get('page')) || 1;
const filter = JSON.parse(params.get('filter')) ?? {};
const searchQuery = params.get('searchQuery') ?? '';

function loadProducts() {
    fetch(`api/products/catalogue${params.size > 0 ? '?' + params.toString() : ''}`).then(response => response.json()).then(products => {
        const productContainer = document.querySelector('.catalogue-view');
        for (let product of products) {
            let origem;
            switch (product.platformId) {
                case 1:
                    origem = 'et.svg';
                    break;
                case 2:
                    origem = 'lm.svg';
                    break;
                case 3:
                    origem = 'mg.svg';
                    break;
                case 4:
                    origem = 'ml.svg';
                    break;
                case 5:
                    origem = 'et.svg';
                    break;
                case 6:
                    origem = 'ns.svg';
                    break;
            }
    
            let productRating = parseFloat(product.rating);
            productContainer.innerHTML += `
        <div class="catalogue-item">
            <div class="item-div">
                <div class="item-img-div">
                    <img draggable="false" class="item-img unselectable" src="${product.image}">
                </div>
                <div class="flex-name-save">
                    <div class="item-name-wrap">
                        <span class="item-name">${product.title}</span>
                    </div>
                    ${isAdmin 
                        ? `<i id="hide-button-${product.productId}" onclick="hideProduct(${product.productId})" class="unselectable fa-solid ${product.hidden ? 'fa-eye' : 'fa-eye-slash'}"></i>` 
                        : `<i id="save-button-${product.productId}" onclick="saveProduct(${product.productId})" class="unselectable fa-solid fa-heart ${product.saved ? 'saved' : 'unsaved'}"></i>`}
                </div>
                <div class="origin-store">
                    <img class="unselectable" draggable="false" src="../assets/catalogue-page/${origem}">
                </div>
                <div class="item-price">
                    <h3>R$${product.price}</h3>
                </div>
                <div class="item-evaluation unselectable">
                    ${'<i class="fa-solid fa-star evaluated"></i>'.repeat(Math.floor(productRating))}
                    ${'<i class="fa-solid fa-star-half-stroke evaluated"></i>'.repeat(productRating % 1 > 0)}
                    ${'<i class="fa-solid fa-star not-evaluated"></i>'.repeat((5 - Math.ceil(productRating)))}
                    <span style="color: #929495">${product.rating} (${product.ratingAmount})</span>
                </div>
                <div class="item-button">
                    <button class="button-for-items" onclick="window.location.href='/product?id=${product.productId}'">Ver detalhes</button>
                </div>
            </div>
        </div>`
        }
    });
}

function setSearchQuery(event) {
    event.preventDefault();
    const searchValue = document.getElementById('productSearch').value;
    if (searchValue != '') {
        params.set('searchQuery', searchValue);
    }
    if (page > 1) {
        params.set('page', 1);
    }

    window.location.href = `catalogue${params.size > 0 ? '?' : ''}${params.toString()}`;
}

function nextPage() {
    params.set('page', page + 1);
    window.location.href = `catalogue${params.size > 0 ? '?' : ''}${params.toString()}`;
}

function previousPage() {
    if (page > 1) {
        params.set('page', page - 1);
        window.location.href = `catalogue${params.size > 0 ? '?' : ''}${params.toString()}`;
    }
}

function saveProduct(productId) {
    if (authenticated) {
        const saveElement = document.getElementById('save-button-' + productId);
        if (saveElement.classList.contains('unsaved')) {
            fetch('api/users/saveProduct/' + productId, {
                method: 'POST'
            }).then(response => response.json()).then(data => {
                if (data.message == 'Anúncio salvo com sucesso.') {
                    saveElement.classList.remove('unsaved');
                }
            });
        }
        else {
            fetch('api/users/unsaveProduct/' + productId, {
                method: 'POST'
            }).then(response => response.json()).then(data => {
                if (data.message == 'Anúncio retirado da lista de anúncios salvos com sucesso.') {
                    saveElement.classList.add('unsaved');
                }
            });
        }
    }
}

function hideProduct(productId) {
    if (authenticated) {
        const saveElement = document.getElementById('hide-button-' + productId);
        if (saveElement.classList.contains('fa-eye-slash')) {
            fetch('api/users/hideProduct/' + productId, {
                method: 'POST'
            }).then(response => response.json()).then(data => {
                if (data.message == 'Anúncio oculto com sucesso.') {
                    saveElement.classList.remove('fa-eye-slash');
                    saveElement.classList.add('fa-eye');
                }
            });
        }
        else {
            fetch('api/users/unsaveProduct/' + productId, {
                method: 'POST'
            }).then(response => response.json()).then(data => {
                if (data.message == 'Anúncio retirado da lista de anúncios ocultos com sucesso.') {
                    saveElement.classList.remove('fa-eye');
                    saveElement.classList.add('fa-eye-slash');
                }
            });
        }
    }
}

loadProducts();