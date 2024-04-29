const neosolarLogo = document.querySelectorAll('.neosolar-logo');
const magaluLogo = document.querySelectorAll('.magalu-logo');
const energiatotalLogo = document.querySelectorAll('.energiatotal-logo');
const leroyLogo = document.querySelectorAll('.leroy-logo');
const mercadoLogo = document.querySelectorAll('.mercado-logo');

neosolarLogo.forEach(el => el.addEventListener('click', event => {
    window.location.href="https://www.neosolar.com.br/";
}));

magaluLogo.forEach(el => el.addEventListener('click', event => {
    window.location.href="https://www.magazineluiza.com.br/";
}));

mercadoLogo.forEach(el => el.addEventListener('click', event => {
    window.location.href="https://www.mercadolivre.com.br/";
}));

leroyLogo.forEach(el => el.addEventListener('click', event => {
    window.location.href="https://www.leroymerlin.com.br/";
}));

energiatotalLogo.forEach(el => el.addEventListener('click', event => {
    window.location.href="https://www.energiatotal.com.br/";
}));

