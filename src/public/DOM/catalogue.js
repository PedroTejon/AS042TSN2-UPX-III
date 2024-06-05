const params = new URLSearchParams(window.location.search);
const page = parseInt(params.get('page')) || 1;
const filter = JSON.parse(params.get('filter')) ?? {};
const searchQuery = params.get('searchQuery') ?? '';

function loadProducts() {
    fetch(`api/products/catalogue${params.size > 0 ? '?' + params.toString() : ''}`).then(response => response.json()).then(products => {
        if (!products.hasOwnProperty('error')) {
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
                        origem = 'ms.svg';
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

            if (products.length == 0) {
                document.getElementById('notFoundSearch').style.display = 'flex';
            }
        } else {
            document.getElementById('loginRequired').style.display = 'flex';
        }
    });

    document.getElementById('productSearch').value = searchQuery;

    if (filter.hasOwnProperty('platforms')) {
        document.getElementById('energia').checked = filter.platforms.includes(1);
        document.getElementById('leroy').checked = filter.platforms.includes(2);
        document.getElementById('magalu').checked = filter.platforms.includes(3);
        document.getElementById('mercado').checked = filter.platforms.includes(4);
        document.getElementById('casa').checked = filter.platforms.includes(5);
        document.getElementById('neo').checked = filter.platforms.includes(6);
    }

    if (filter.hasOwnProperty('categories')) {
        document.getElementById('painelSolar').checked = filter.categories.includes(1);
        document.getElementById('estrutura').checked = filter.categories.includes(2);
        document.getElementById('controlador').checked = filter.categories.includes(3);
        document.getElementById('inversor').checked = filter.categories.includes(4);
        document.getElementById('ferramenta').checked = filter.categories.includes(5);
        document.getElementById('bateria').checked = filter.categories.includes(6);
        document.getElementById('kit').checked = filter.categories.includes(7);
        document.getElementById('cabo').checked = filter.categories.includes(8);
        document.getElementById('disjuntor').checked = filter.categories.includes(9);
        document.getElementById('protecao').checked = filter.categories.includes(10);
        document.getElementById('iluminacao').checked = filter.categories.includes(11);
        document.getElementById('aquecimento').checked = filter.categories.includes(12);
        document.getElementById('carro').checked = filter.categories.includes(13);
        document.getElementById('outros').checked = filter.categories.includes(14);
        document.getElementById('bombeamento').checked = filter.categories.includes(15);
    }

    if (filter.hasOwnProperty('minPrice')) {
        document.getElementById('minPriceChk').checked = true;
        document.getElementById('minPrice').disabled = false;
        document.getElementById('minPrice').value = filter.minPrice;
    }
    if (filter.hasOwnProperty('maxPrice')) {
        document.getElementById('maxPriceChk').checked = true;
        document.getElementById('maxPrice').disabled = false;
        document.getElementById('maxPrice').value = filter.maxPrice;
    }

    if (filter.hasOwnProperty('minRating')) {
        document.getElementById('minRatingChk').checked = true;
        document.getElementById('minRating').disabled = false;
        document.getElementById('minRating').value = filter.minRating;
    }
    if (filter.hasOwnProperty('maxRating')) {
        document.getElementById('maxRatingChk').checked = true;
        document.getElementById('maxRating').disabled = false;
        document.getElementById('maxRating').value = filter.maxRating;
    }
}

function setSearchQuery(event) {
    event.preventDefault();
    const searchValue = document.getElementById('productSearch').value;
    if (searchValue != '') {
        params.set('searchQuery', searchValue);
    }
    else if (searchValue == '' && params.has('searchQuery')) {
        params.delete('searchQuery');
    }
    if (page > 1) {
        params.set('page', 1);
    }

    window.location.href = `catalogue${params.size > 0 ? '?' : ''}${params.toString()}`;
}

function setFilters(event) {
    event.preventDefault();
    if (!filter.hasOwnProperty('platforms')) {
        filter.platforms = [];
    }
    const platforms = ['energia', 'leroy', 'magalu', 'mercado', 'casa', 'neo'];
    for (let platform of platforms) {
        if (document.getElementById(platform).checked) {
            filter.platforms.push(platforms.indexOf(platform) + 1);
        }
        else if (!document.getElementById(platform).checked && filter.platforms.includes(platforms.indexOf(platform) + 1)) {
            filter.platforms = filter.platforms.filter(function (item) {
                return item !== (platforms.indexOf(platform) + 1)
            })
        }
    }

    if (!filter.hasOwnProperty('categories')) {
        filter.categories = [];
    }
    const categories = ['painelSolar', 'estrutura', 'controlador', 'inversor', 'ferramenta', 'bateria', 'kit', 'cabo', 'disjuntor', 'protecao', 'iluminacao', 'aquecimento', 'carro', 'outros', 'bombeamento'];
    for (let category of categories) {
        if (document.getElementById(category).checked) {
            filter.categories.push(categories.indexOf(category) + 1);
        }
        else if (!document.getElementById(category).checked && filter.categories.includes(categories.indexOf(category) + 1)) {
            filter.categories = filter.categories.filter(function (item) {
                return item !== (categories.indexOf(category) + 1)
            })
        }
    }

    if (document.getElementById('minPriceChk').checked) {
        filter.minPrice = document.getElementById('minPrice').value;
    } else if (filter.hasOwnProperty('minPrice')) {
        delete filter.minPrice;
    }
    if (document.getElementById('maxPriceChk').checked) {
        filter.maxPrice = document.getElementById('maxPrice').value;
    } else if (filter.hasOwnProperty('maxPrice')) {
        delete filter.maxPrice;
    }

    if (document.getElementById('minRatingChk').checked) {
        filter.minRating = document.getElementById('minRating').value;
    } else if (filter.hasOwnProperty('minRating')) {
        delete filter.minRating;
    }
    if (document.getElementById('maxRatingChk').checked) {
        filter.maxRating = document.getElementById('maxRating').value;
    } else if (filter.hasOwnProperty('maxRating')) {
        delete filter.maxRating;
    }

    params.set('filter', JSON.stringify(filter));
}

function toggleFilters(event) {
    event.preventDefault();

    const filterContainer = document.getElementById('filter');
    filterContainer.style.display = filterContainer.style.display == 'none' || !filterContainer.style.display ? 'flex' : 'none';
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

function gotoSaved(event) {
    event.preventDefault();
    params.set('filter', JSON.stringify({ savedSection: filter.savedSection ? false : true }));
    window.location.href = `catalogue${params.size > 0 ? '?' : ''}${params.toString()}`;
}

function toggleField(event, field) {
    event.preventDefault();

    const check = document.getElementById(field + 'Chk');
    const fieldElement = document.getElementById(field);
    fieldElement.disabled = !check.checked;
}

loadProducts();