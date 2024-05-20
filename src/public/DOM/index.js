var slideI = 1;
var i;
var slides = document.querySelectorAll('.slides');
var dots = document.querySelectorAll('.dot');
var sectionAdd = document.getElementById("showingInfo");

//template
let pch = "<article class='fade'><aside class='side-to-side'><div id='text-info'><h2><i class='fa-solid fa-droplet'></i>PCH (Pequenas Centrais Hidrelétricas)</h2><p>Pequenas Centrais Hidrelétricas (PCH's) são usinas hidrelétricas de pequeno porte com capacidade menor ou igual a 30 megawatts. Nas PCH's a energia gerada é a hidrelétrica, a qual surge da transformação de energia potencial existente entre corpos d'água que são encontrados em diferentes altitudes em energia elétrica.</p><p>Os humanos utilizam da energia de correntes fluviais há muito tempo, primeiramente se utilizavam rodas d'água para movimentar a economia. A energia hidrelétrica em si, só se tornou uma fonte no final do século XIX, quando o engenheiro britânico James Francis apresentou a primeira turbina hidráulica moderna, em 1882, a primeira usina hidrelétrica iniciou suas operações em Appleton, nos Estados Unidos.</p><h2><i class='fa-solid fa-circle-check' id='benefits'></i>Vantagens</h2><ol><li><b>Recuperação de áreas pantanosas:</b> Com a possibilidade de regularização dos fluxos, as áreas pantanosas podem ser recuperadas a partir da redução do acúmulo de água estagnada, a infra-estrutura das usinas hidrelétricas também permite a retenção de alguns objetos sólidos, facilitando a navegabilidade dos rios a jusante;</li><li><b>Redução de riscos de inundação:</b> Com a possibilidade de controle preciso da quantidade de água, é possível regular o fluxo continuamente, assim os riscos de inudação em tempestades são menores, também beneficia culturas em áreas irrigadas a jusante;</li><li><b>Flexibilidade:</b></li><li><b>Redução de riscos de inundação:</b></li><li><b>Fonte de energia renovável mais barata:</b> Mesmo que a instalação inicial de uma usina desse tipo exija um investimento alto, essa fonte acaba sendo menos cara em médio e longo prazo, a manutenção necessária é mínima.</li></ol></div><div id='icon-info'><div><img class='unselectable' draggable='false' src='../assets/index-page/icons-svg/hidreletrica-icon.svg' alt='Ilustração de uma usina hidrelétrica'></div></div></aside> </article><article><div id='video-info'><h2>Veja esse vídeo informativo sobre PCH's</h2><iframe src='https://www.youtube.com/embed/u2oBNLHxSqA?si=gpmQYqw2sUkBs68s' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe></div></article>"
let bio = "<article class='fade'><aside class='side-to-side'><div id='text-info'><h2><i class='fa-solid fa-leaf'></i>Energia por biomassa</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero. Quisque iaculis ac felis non ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero. Quisque iaculis ac felis non ullamcorper.</p><h2><i class='fa-solid fa-circle-check' id='benefits'></i>Vantagens</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero.</p></div><div id='icon-info'><div><img class='unselectable' draggable='false' src='../assets/index-page/icons-svg/biomassa-icon.svg' alt='Ilustração de uma termelétrica utilizando biomassa'></div></div></aside> </article><article><div id='video-info'><h2>Veja esse vídeo informativo sobre biomassa de cana-de-açúcar</h2><iframe src='https://www.youtube.com/embed/GhoBYBCoUhY?si=3ZtJd3MOr7q9cGQV' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe></div></article>"
let solar = "<article class='fade'><aside class='side-to-side'><div id='text-info'><h2><i class='fa-solid fa-sun'></i>Energia solar fotovoltaica</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero. Quisque iaculis ac felis non ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero. Quisque iaculis ac felis non ullamcorper.</p><h2><i class='fa-solid fa-circle-check' id='benefits'></i>Vantagens</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero.</p></div><div id='icon-info'><div><img class='unselectable' draggable='false' src='../assets/index-page/icons-svg/solar-icon.svg' alt='Ilustração de painéis solares em funcionamento'></div></div></aside> </article><article><div id='video-info'><h2>Veja esse vídeo informativo sobre geração de energia por efeito fotovoltaico</h2><iframe src='https://www.youtube.com/embed/o2TTiInBTjQ?si=DiDh-YEvT3eKDpVc' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe></div></article>"
let eolica = "<article class='fade'><aside class='side-to-side'><div id='text-info'><h2><i class='fa-solid fa-wind'></i>Energia eólica</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero. Quisque iaculis ac felis non ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero. Quisque iaculis ac felis non ullamcorper.</p><h2><i class='fa-solid fa-circle-check' id='benefits'></i>Vantagens</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt sagittis ante, quis sodales nisi condimentum eget. Etiam ut tincidunt dui. Vivamus tempor, nisl eu fermentum blandit, magna velit vulputate purus, et sagittis sapien ligula at libero.</p></div><div id='icon-info'><div><img class='unselectable' draggable='false' src='../assets/index-page/icons-svg/eolica-icon.svg' alt='Ilustração geradores de energia eólica em funcionamento'></div></div></aside> </article><article><div id='video-info'><h2>Veja esse vídeo informativo sobre geração de energia eólica</h2><iframe src='https://www.youtube.com/embed/rtaJvCijoFk?si=i_zek6E7XNgV7Gi3' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe></div></article>"

showSlide(slideI);

function showSlide(n){
    if (n > slides.length){
        slideI = 1
    }

    if (n < 1){
        slideI = slides.length
    }

    for (i = 0; i < slides.length; i++){
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++){
        dots[i].className = dots[i].className.replace(" act", "")
    }

    slides[slideI-1].style.display = "block";
    dots[slideI-1].className += " act";
}

function curSlide(n){
    showSlide(slideI = n);
    curInfo()

}

function allSlides(n){
    showSlide(slideI += n);
    curInfo()
}

function curInfo(){
    switch(slideI){
        case 1:
            sectionAdd.innerHTML= pch;
            break;
        case 2:
            sectionAdd.innerHTML = bio;
            break;
        case 3:
            sectionAdd.innerHTML = solar;
            break;
        case 4:
            sectionAdd.innerHTML = eolica;
            break;
        default:
            sectionAdd.innerHTML = pch;
            break;
    }
}


    









