const axios = require('axios');
const cheerio = require('cheerio');
const utils = require('./utils');
const Product = require('../models/product');

const mapCategories = {
  'Painel solar': 1,
  'De 150w até 330w': 1,
  'Painel acima de 330w': 1,
  'Até 150w': 1,
  'Acessórios para painel': 2,
  'Estruturas de fixação': 2,
  'Tomadas e interruptores': 2,
  'Controladores de carga': 3,
  'Inversor': 4,
  'Baterias': 6,
  'Kits solares': 7,
  'Cabos': 8,
  'Conectores e terminais': 8,
  'Fusíveis e Porta-fusíveis': 10,
  'Stringbox': 10,
  'Iluminação': 11,
  'Carro elétrico': 13,
  'Queima de estoque': 14,
  'Kits para bombeamento': 15,
  'Bombas solares': 15
};

async function scrape() {
  const categories = [
    'painel-solar',
    'kits-solares',
    'baterias',
    'inversor',
    'inversor/inversor-hibrido',
    'estruturas-de-fixacao',
    'acessorios',
    'controladores-de-carga',
    'bombas-solares',
    'carro-eletrico',
  ];

  headers = {
    // eslint-disable-next-line max-len
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en,pt-BR;q=0.9,pt;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    'cookie': 'MCPopupClosed=yes; SmartHint-Overlay-LeavingPage=1',
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

  for (const category of categories) {
    let currentPage = 1;
    while (true) {
      // eslint-disable-next-line max-len
      const currentSite = await axios.get(`https://www.minhacasasolar.com.br/${category}?pagina=${currentPage}&tamanho=24`, {
        headers: headers,
        responseEncoding: 'utf8',
      }).then((response) => {
        return cheerio.load(response.data);
      });

      const ratingsURL = 'codes[]=' + [...currentSite('div[data-trustvox-product-code]')].map((el) => {
        return currentSite(el).attr('data-trustvox-product-code');
      }).join('&codes[]=');
      const ratings = await axios.get(
        `https://trustvox.com.br/widget/shelf/v2/products_rates?${ratingsURL}&store_id=81798&callback=_tsRatesReady`,
        {
          responseEncoding: 'utf8',
          headers: headers,
        }).then((response) => {
          let json = response.data.replace('/**/_tsRatesReady(', '');
          json = JSON.parse(json.substring(0, json.length - 1))['products_rates'];
          const ratings = {};
          for (const currentRating of json) {
            ratings[currentRating['product_code']] = [currentRating['average'], currentRating['count']];
          }
          return ratings;
        });

      for (const productContainer of [...currentSite('.spot')]
        .map((productContainer) => currentSite(productContainer))) {
        const url = productContainer.find('a.spot__content').attr('href').trim();

        const product = new Product();
        await product.load('url', url);
        if (product.productId === undefined) {
          await utils.sleep(1000);
          product.url = url;
          product.platformId = 5;
          product.title = productContainer.find('.spot__name').text().trim();
          [product.rating, product.ratingAmount] = ratings[productContainer.find('div[data-trustvox-product-code]')
            .attr('data-trustvox-product-code')];
          product.image = productContainer.find('.spot-image').attr('data-src');

          const precoTexto = productContainer.find('.pix-discount');
          if (precoTexto.length == 0) {
            continue;
          }
          product.price = parseFloat(precoTexto.text().trim().replace(/[\D$\s]*/, '').replace(',', '.'));
          await axios.get(url, {
            responseEncoding: 'utf8',
            headers: headers,
          }).then((response) => {
            const currentPage = utils.cleanPage(cheerio.load(response.data));
            const categorias = [...currentPage('.breadcrumbs a')].map((el) => currentPage(el).text());
            product.categoryId = mapCategories[
              categorias.filter((cat) => Object.keys(mapCategories).includes(cat)).slice(-1)];
            const descricaoElement = currentPage('.description__item.menu_groups')
            product.description = descricaoElement.length > 0 ? descricaoElement.first().html().trim() : null;
          });

          await product.save();
        }
      }

      currentPage++;

      if (currentSite('#pagination_next').length == 0) {
        break;
      }

      await utils.sleep(1000);
    }
  }
}

module.exports = {
  scrape,
};
