const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../services/db');
const utils = require('./utils');

const mapCategorias = {
  'Placa Solar': 1,
  'Painel Solar': 1,
  'Gerador de Energia': 1,
  'Contator': 2,
  'Chave Elétrica': 2,
  'Material Hidráulico': 2,
  'Movimentação de Carga': 3,
  'Inversor Solar': 4,
  'Ferramentas': 5,
  'Medidor de Energia': 5,
  'Cabos e Adaptadores': 8,
  'Fio e Cabo': 8,
  'Conector': 8,
  'Disjuntor e Fusível': 9,
  'Iluminação': 11,
  'Aquecedor de Água': 12,
  'Peças para Celular': 14,
  'Peças e Acessórios': 14
}

async function scrape() {
  headers = {
    // eslint-disable-next-line max-len
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en,pt-BR;q=0.9,pt;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    // eslint-disable-next-line max-len
    'cookie': 'form_key=TZKrBWYL7Exinxr8; PHPSESSID=ln5mr14u6k6mg238vuko94ab1s; mage-cache-storage={}; mage-cache-storage-section-invalidation={}; mage-cache-sessid=true; mage-messages=; recently_viewed_product={}; recently_viewed_product_previous={}; recently_compared_product={}; recently_compared_product_previous={}; product_data_storage={}; form_key=TZKrBWYL7Exinxr8; zc_consent=1; zc_cu=3zf2d2c5aa0fbd9ab6fa8fc8e19ae29161-v3zafd366e81aca0015a583f7e6088ab310078097868fcb2d5ffc9fe843e495984c; zc_show=1; zc_tp=3zd87fd5c7b820262b5c05e3ee2b3f98906ff96e25903fba5d232b09af74b35303; zc_cu_exp=1712265970000,1',
    'pragma': 'no-cache',
    'sec-ch-ua': '\'Microsoft Edge\';v=\'123\', \'Not:A-Brand\';v=\'8\', \'Chromium\';v=\'123\'',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '\'Windows\'',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    // eslint-disable-next-line max-len
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
  };

  let pagina = 1;
  while (true) {
    // eslint-disable-next-line max-len
    const site = await axios.get(`https://www.magazineluiza.com.br/busca/fotovoltaico/?sfilters=0&filters=entity---refletor--cabo-eletrico--placa-solar--inversor-solar--conector--gerador--luminaria-industrial-e-publica--controlador-de-carga--estrutura-para-painel-solar--kit-ferramentas--medidor-de-energia--dispositivo-de-protecao--chave-eletrica--alicate--conector-eletrico--luminaria--contator-eletrico--cabo-extensor--fusivel--disjuntor-nema--disjuntor-dr--disjuntor-din&page=${pagina}`, {
      headers: headers,
    }).then((response) => {
      return cheerio.load(response.data);
    });

    if (site('div[data-testid=product-list]').length == 0) {
      break;
    }

    const anuncios = JSON.parse(site('div[data-testid=product-list] > script[data-testid=jsonld-script]').text());
    for (const anuncio of anuncios['@graph']) {
      const url = anuncio['offers']['url'];
      if ((await db.query(`SELECT * FROM anuncios WHERE url = '${url}'`, [])).length == 0) {
        const nome = anuncio['name'];
        const preco = parseFloat(anuncio['offers']['price']);
        const avaliacao = anuncio['aggregateRating']
          ? parseFloat(anuncio['aggregateRating']['ratingValue']) : null;
        const qntdAvaliacoes = anuncio['aggregateRating']
          ? parseFloat(anuncio['aggregateRating']['reviewCount']) : null;
        const foto = anuncio['image'];
        const [categorias, descricao] = await axios.get(url, {
          responseEncoding: 'utf8',
          headers: headers,
        }).then((response) => {
          const page = utils.cleanPage(cheerio.load(response.data));
          const categorias = [...page('a[data-testid=breadcrumb-item] span')].map((el) => page(el).text());
          const descricao = page('[data-testid=rich-content-container]').html().trim();
          return [categorias, descricao];
        });

        let categoria = mapCategorias[
          categorias.filter((cat) => Object.keys(mapCategorias).includes(cat)).slice(-1)];

        await db.query(`CALL insert_anun(?, ?, ?, ?, ?, ?, 3, ?, ?)`,
          [nome, avaliacao, preco, descricao, url, foto, categoria, qntdAvaliacoes]);

        await utils.sleep(1000);
      }
    }

    pagina++;
  }
}

module.exports = {
  scrape,
};
