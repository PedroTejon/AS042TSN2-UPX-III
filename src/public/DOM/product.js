const params = new URLSearchParams(window.location.search);

function loadProduct() {
    fetch(`api/products/details${params.size > 0 ? '?' + params.toString() : ''}`).then(response => response.json()).then(product => {
        document.getElementById('productImage').src = product.image;
        document.getElementById('productName').textContent = product.title;
        document.getElementById('productPrice').textContent = 'R$' + product.price;
        document.getElementById('productDescription').innerHTML = product.description;
        document.getElementById('productLink').onclick = () => {
            window.open(product.url, "_blank");
        }
        let origem;
        switch (product.platformId) {
            case 1:
                origem = '<b>Origem de anúncio:</b> EnergiaTotal';
                break;
            case 2:
                origem = '<b>Origem de anúncio:</b> Leroy Merlin';
                break;
            case 3:
                origem = '<b>Origem de anúncio:</b> Magazine Luiza';
                break;
            case 4:
                origem = '<b>Origem de anúncio:</b> Mercado Livre';
                break;
            case 5:
                origem = '<b>Origem de anúncio:</b> Minha Casa Solar';
                break;
            case 6:
                origem = '<b>Origem de anúncio:</b> NeoSolar';
                break;
        }
        
        document.getElementById('extractionName').innerHTML = origem;
    })
}

loadProduct();