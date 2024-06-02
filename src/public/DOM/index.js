var slideI = 1;
var i;
var slides = document.querySelectorAll('.slides');
var dots = document.querySelectorAll('.dot');
var sectionAdd = document.getElementById("showingInfo");

//template
let pch = "<article class='fade'><aside class='side-to-side'><div id='text-info'><h2><i class='fa-solid fa-droplet'></i>PCH (Pequenas Centrais Hidrelétricas)</h2><p>Pequenas Centrais Hidrelétricas (PCH's) são usinas hidrelétricas de pequeno porte com capacidade menor ou igual a 30 megawatts. Nas PCH's a energia gerada é a hidrelétrica, a qual surge da transformação de energia potencial existente entre corpos d'água que são encontrados em diferentes altitudes em energia elétrica.</p><p>Os humanos utilizam da energia de correntes fluviais há muito tempo, primeiramente se utilizavam rodas d'água para movimentar a economia. A energia hidrelétrica em si, só se tornou uma fonte no final do século XIX, quando o engenheiro britânico James Francis apresentou a primeira turbina hidráulica moderna, em 1882, a primeira usina hidrelétrica iniciou suas operações em Appleton, nos Estados Unidos.</p><h2><i class='fa-solid fa-circle-check' id='benefits'></i>Vantagens</h2><ol><li><b>Recuperação de áreas pantanosas:</b> Com a possibilidade de regularização dos fluxos, as áreas pantanosas podem ser recuperadas a partir da redução do acúmulo de água estagnada, a infra-estrutura das usinas hidrelétricas também permite a retenção de alguns objetos sólidos, facilitando a navegabilidade dos rios a jusante;</li><li><b>Redução de riscos de inundação:</b> Com a possibilidade de controle preciso da quantidade de água, é possível regular o fluxo continuamente, assim os riscos de inudação em tempestades são menores, também beneficia culturas em áreas irrigadas a jusante;</li><li><b>Fonte de energia renovável mais barata:</b> Mesmo que a instalação inicial de uma usina desse tipo exija um investimento alto, essa fonte acaba sendo menos cara em médio e longo prazo, a manutenção necessária é mínima.</li></ol></div><div id='icon-info'><div><img class='unselectable' draggable='false' src='../assets/index-page/icons-svg/hidreletrica-icon.svg' alt='Ilustração de uma usina hidrelétrica'></div></div></aside> </article><article><div id='video-info'><h2>Veja esse vídeo informativo sobre PCH's</h2><iframe src='https://www.youtube.com/embed/u2oBNLHxSqA?si=gpmQYqw2sUkBs68s' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe></div></article>"
let bio = "<article class='fade'><aside class='side-to-side'><div id='text-info'><h2><i class='fa-solid fa-leaf'></i>Energia por biomassa</h2><p>A energia gerada por biomassa é uma forma de energia renovável que utiliza matéria orgânica, como resíduos agrícolas, florestais e de origem animal, para a produção de eletricidade e calor. Esse processo pode ocorrer por meio da combustão direta, onde a biomassa é queimada para gerar calor e, subsequentemente, eletricidade, ou por meio de processos bioquímicos, como a fermentação anaeróbica, que produz biogás a partir da decomposição de matéria orgânica em ambientes sem oxigênio. O biogás pode então ser usado para gerar eletricidade e calor ou ser convertido em biometano, um substituto direto do gás natural.</p><h2><i class='fa-solid fa-circle-check' id='benefits'></i>Vantagens</h2><ol><li><b>Redução das Emissões:</b> Diminui a emissão de gases de efeito estufa, substituindo combustíveis fósseis e evitando a liberação de metano de resíduos em aterros.</li><li><b>Aproveitamento de Resíduos:</b>Utiliza resíduos agrícolas, florestais e animais, reduzindo o lixo em aterros.</li><li><b>Geração de Empregos Rurais:</b> Cria empregos e promove o desenvolvimento econômico em áreas rurais.</li><li><b>Fonte Renovável:</b> É uma fonte de energia sustentável, desde que a taxa de consumo não exceda a regeneração dos materiais.</li><li><b>Versatilidade:</b> Pode ser convertida em eletricidade, calor e combustíveis líquidos, permitindo diversas aplicações energéticas.</li></ol></div><div id='icon-info'><div><img class='unselectable' draggable='false' src='../assets/index-page/icons-svg/biomassa-icon.svg' alt='Ilustração de uma termelétrica utilizando biomassa'></div></div></aside> </article><article><div id='video-info'><h2>Veja esse vídeo informativo sobre biomassa de cana-de-açúcar</h2><iframe src='https://www.youtube.com/embed/GhoBYBCoUhY?si=3ZtJd3MOr7q9cGQV' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe></div></article>"
let solar = "<article class='fade'><aside class='side-to-side'><div id='text-info'><h2><i class='fa-solid fa-sun'></i>Energia solar fotovoltaica</h2><p>A energia solar é uma das formas mais promissoras e sustentáveis de produção de eletricidade no mundo atual. Ela se baseia na conversão da luz do sol em energia elétrica, utilizando painéis fotovoltaicos ou sistemas de energia solar concentrada. Os painéis fotovoltaicos são compostos por células solares que captam a luz solar e a transformam diretamente em eletricidade, enquanto os sistemas de energia solar concentrada usam espelhos ou lentes para focar a luz do sol em um pequeno ponto, gerando calor que pode ser usado para produzir eletricidade. A abundância de luz solar em diversas partes do mundo, especialmente em regiões tropicais e desérticas, torna essa fonte de energia extremamente acessível e capaz de suprir uma grande parte das necessidades energéticas globais.</p><h2><i class='fa-solid fa-circle-check' id='benefits'></i>Vantagens</h2><ol><li><b>Redução das Emissões:</b> Energia solar não emite gases poluentes, reduzindo a poluição do ar e contribuindo para a luta contra as mudanças climáticas.</li><li><b>Renovável e Inesgotável:</b> O sol é uma fonte inesgotável de energia, tornando a energia solar uma opção sustentável a longo prazo.</li><li><b>Economia Financeira: </b>Instalar painéis solares pode significar economia nas contas de energia, além de oferecer oportunidades para vendas de energia excedente.</li><li><b>Criação de Empregos:</b> A indústria solar cria empregos em diversas áreas, desde fabricação até instalação e manutenção de sistemas solares.</li><li><b>Independência Energética:</b> Investir em energia solar promove independência energética, reduzindo a dependência de fontes externas e aumentando a segurança energética.</li></ol></div><div id='icon-info'><div><img class='unselectable' draggable='false' src='../assets/index-page/icons-svg/solar-icon.svg' alt='Ilustração de painéis solares em funcionamento'></div></div></aside> </article><article><div id='video-info'><h2>Veja esse vídeo informativo sobre geração de energia por efeito fotovoltaico</h2><iframe src='https://www.youtube.com/embed/o2TTiInBTjQ?si=DiDh-YEvT3eKDpVc' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe></div></article>"
let eolica = "<article class='fade'><aside class='side-to-side'><div id='text-info'><h2><i class='fa-solid fa-wind'></i>Energia eólica</h2><p>A energia eólica é uma das formas mais antigas de aproveitamento dos recursos naturais para a geração de energia. Utilizando a força dos ventos, aerogeradores convertem a energia cinética do movimento do ar em energia elétrica de forma limpa e renovável. Esse tipo de energia é extremamente benéfico ao meio ambiente, pois não emite gases de efeito estufa durante sua operação, contribuindo significativamente para a redução da poluição atmosférica e mitigação das mudanças climáticas. Além disso, a energia eólica tem a vantagem de ser uma fonte inesgotável e amplamente disponível em diversas regiões do mundo, especialmente em áreas costeiras e de campo aberto onde os ventos são mais constantes e fortes.</p><h2><i class='fa-solid fa-circle-check' id='benefits'></i>Vantagens</h2><ol><li><b>Sustentabilidade Ambiental:</b> A energia eólica não emite gases de efeito estufa, ajudando a combater a poluição e as mudanças climáticas.</li><li><b>Inesgotabilidade:</b> O vento é um recurso natural ilimitado e disponível em muitas regiões do mundo.</li><li><b>Criação de Empregos e Desenvolvimento Econômico:</b> A indústria eólica gera empregos e impulsiona o desenvolvimento econômico local.</li><li><b>Redução da Dependência de Combustíveis Fósseis:</b> Diversifica a matriz energética e diminui a dependência de combustíveis fósseis, melhorando a segurança energética.</li><li><b>Baixos Custos Operacionais:</b> Após a instalação, os parques eólicos têm baixos custos de operação e manutenção, tornando-se uma fonte de energia econômica a longo prazo.</li></ol></div><div id='icon-info'><div><img class='unselectable' draggable='false' src='../assets/index-page/icons-svg/eolica-icon.svg' alt='Ilustração geradores de energia eólica em funcionamento'></div></div></aside> </article><article><div id='video-info'><h2>Veja esse vídeo informativo sobre geração de energia eólica</h2><iframe src='https://www.youtube.com/embed/rtaJvCijoFk?si=i_zek6E7XNgV7Gi3' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe></div></article>"

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


    









