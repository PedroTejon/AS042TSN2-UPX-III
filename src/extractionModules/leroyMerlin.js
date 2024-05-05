const axios = require('axios');
const cheerio = require('cheerio');
const utils = require('./utils');
const Product = require('../models/product');

const mapCategories = {
  'Placa Solar Fotovoltaica': 1,
  'Luminárias': 11,
  'Luminárias Solares': 11,
  'Refletores': 11,
  'Aquecedor para Piscinas': 12,
  'Aquecimento Solar': 12,
  'Aquecedor Solar de Piscina': 12,
  'Aquecedor Solar de Água': 12,
  'Coletores Solares': 12,
  'Boilers Solares': 12,
  'Carregador Carro Elétrico': 13,
  'Energia Solar': 14,
};

async function scrape() {
  headers = {
    // eslint-disable-next-line max-len
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en,pt-BR;q=0.9,pt;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
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

  let currentPage = 0;
  let products;
  do {
    // eslint-disable-next-line max-len
    const request = await axios.post('https://1cf3zt43zu-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.22.1)%3B%20Browser%20(lite)%3B%20instantsearch.js%20(4.66.0)%3B%20react%20(18.2.0)%3B%20react-instantsearch%20(7.7.0)%3B%20react-instantsearch-core%20(7.7.0)%3B%20JS%20Helper%20(3.16.3)&x-algolia-api-key=150c68d1c61fc1835826a57a203dab72&x-algolia-application-id=1CF3ZT43ZU', `{"requests":[{"indexName":"production_products","params":"analytics=true&analyticsTags=%5B%22%23sorocaba%22%2C%22%23loginOff%22%2C%22%23desktop%22%5D&clickAnalytics=true&facetFilters=%5B%5B%22attributes.Produto%3ABoiler%20Solar%22%2C%22attributes.Produto%3ACarregador%20de%20Carro%20El%C3%A9trico%22%2C%22attributes.Produto%3AColetor%20Solar%22%2C%22attributes.Produto%3AControle%20Solar%22%2C%22attributes.Produto%3AInversor%22%2C%22attributes.Produto%3AKit%20Aquecedor%20Solar%22%2C%22attributes.Produto%3AKit%20Solar%20Fotovolt%C3%A1ico%22%2C%22attributes.Produto%3ALumin%C3%A1ria%20Solar%22%2C%22attributes.Produto%3APlaca%20Fotovolt%C3%A1ica%22%2C%22attributes.Produto%3APlaca%20Solar%22%5D%5D&facetingAfterDistinct=true&facets=%5B%22*%22%5D&filters=regionalAttributes.sorocaba.promotionalPrice%20%3E%200%20AND%20regionalAttributes.sorocaba.available%3D1&hitsPerPage=36&maxValuesPerFacet=1000&page=${currentPage}&query=solar&tagFilters=&userToken=anonymous-eeb43769-5948-48a9-89a2-97ba3a869a74"}]}`,
      {
        headers: headers
      });
    products = request.data['results'][0]['hits'];

    // eslint-disable-next-line max-len
    const ratingsURL = 'https://api.bazaarvoice.com/data/statistics.json?apiversion=5.4&passkey=caag5mZC6wgKSPPhld3GSUVaOqO46ZEpAemNYqZ38m7Yc&stats=Reviews&filter=ContentLocale:pt_BR,en*,fr*,it*,pt*,es*,uk*&filter=ProductId:' + products.map((product) => product['objectID']).join(',');
    const [ratings, ratingsAmounts] = await axios.get(ratingsURL, {
      responseEncoding: 'utf8',
      headers: headers,
    }).then((response) => {
      const ratings = {};
      const ratingsAmounts = {}
      for (const currentRating of response['data']['Results']) {
        const ratingId = currentRating['ProductStatistics']['ProductId'];
        ratings[ratingId] = currentRating['ProductStatistics']['ReviewStatistics']['AverageOverallRating'];
        ratingsAmounts[ratingId] = currentRating['ProductStatistics']['ReviewStatistics']['TotalReviewCount'];
      }
      return [ratings, ratingsAmounts];
    });

    for (const productData of products) {
      const url = productData['url'];

      const product = new Product();
      await product.load('url', url)
      if (product.productId === undefined) {
        await utils.sleep(1000);
        product.url = url;
        product.platformId = 2;
        product.title = productData['name'];
        product.categoryId = mapCategories[productData['categoryPageId'].length != 0
          ? productData['categoryPageId'].slice(-2, -1)[0].split(' > ').pop()
          : productData['parentName']];
        product.rating = ratings[productData['objectID']] ?? 0;
        product.ratingAmount = ratingsAmounts[productData['objectID']];
        product.image = productData['pictures']['normal'];

        if (!productData['regionalAttributes']['sorocaba']['available']
          && !productData['regionalAttributes']['outros']['available']) {
          continue;
        }
        const region = productData['regionalAttributes']['sorocaba']['available'] ? 'sorocaba' : 'outros';
        product.price = productData['regionalAttributes'][region]['promotionalPrice']
          ? productData['regionalAttributes'][region]['promotionalPrice']
          : productData['regionalAttributes'][region]['originalPrice'];
        await axios.get(url, {
          responseEncoding: 'utf8',
          headers: headers,
        }).then((response) => {
          const page = utils.cleanPage(cheerio.load(response.data));
          product.description = page('span[itemprop=description]').attr('content').trim();
        });

        await product.save();
      }
    }

    currentPage++;
  } while (products.length != 0);
}

module.exports = {
  scrape,
};
