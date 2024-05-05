const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../services/db');
const utils = require('./utils');
const Product = require('../models/product');

const mapCategories = {
  'painel-solar': 1,
  'estrutura-cabo-outros/estrutura-montagem-solar': 2,
  'controlador-de-carga-solar': 3,
  'inversor-solar': 4,
  'bateria-solar': 6,
  'kit-energia-solar-off-grid': 7,
  'kit-energia-solar-on-grid': 7,
  'estrutura-cabo-outros/cabo-solar-conector-mc4': 8,
  'estrutura-cabo-outros/stringbox-protecoes-solar': 10,
  'carro-eletrico': 13,
  'bomba-solar': 15
};

async function scrape() {
  const categories = [
    'painel-solar',
    'kit-energia-solar-off-grid',
    'kit-energia-solar-on-grid',
    'bomba-solar',
    'controlador-de-carga-solar',
    'inversor-solar',
    'bateria-solar',
    'carro-eletrico',
    'estrutura-cabo-outros/cabo-solar-conector-mc4',
    'estrutura-cabo-outros/estrutura-montagem-solar',
    'estrutura-cabo-outros/stringbox-protecoes-solar'
  ];

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

  for (const category of categories) {
    let currentPage = 1;
    while (true) {
      const currentSite = await axios.get(`https://www.neosolar.com.br/loja/${category}.html?p=${currentPage}`, {
        headers: headers,
      }).then((response) => {
        return cheerio.load(response.data);
      });

      if (currentSite('.message.info.empty').length != 0) {
        break;
      }


      for (const productContainer of [...currentSite('.item.product.product-item')]
        .map((product) => currentSite(product))) {
        const url = productContainer.find('a.product.photo.product-item-photo').attr('href').trim();

        const product = new Product();
        await product.load('url', url);
        if (product.productId === undefined) {
          await utils.sleep(1000);
          product.url = url;
          product.platformId = 6;
          product.title = productContainer.find('.product.name.product-item-name').text().trim();
          const ratingElement = productContainer.find('.rating-result');
          product.rating = ratingElement.length != 0
            ? 5 * parseInt(ratingElement.attr('title').replace('%', '')) / 100
            : 0;
          product.ratingAmount = ratingElement.length != 0
            ? parseInt(currentSite('span[itemprop=reviewCount]').text())
            : 0;
          product.image = productContainer.find('img.product-image-photo').attr('src');

          const priceTexto = productContainer.find('span[data-price-type=finalPrice] .price');
          if (priceTexto.length == 0) {
            continue;
          }
          product.price = parseFloat(priceTexto.first().text().trim().replace(/[\D$\s]*/, '').replace(',', '.'));
          await axios.get(url, {
            responseEncoding: 'utf8',
            headers: headers,
          }).then((response) => {
            const page = utils.cleanPage(cheerio.load(response.data));
            product.description = page('.product.attribute.description').html().trim();
            product.categoryId = mapCategories[category];
          });

          await product.save();
        }
      }

      currentPage++;
    }
  }
}

module.exports = {
  scrape,
};
