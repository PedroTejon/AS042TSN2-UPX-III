const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../services/db');
const utils = require('./utils');

async function scrape() {
  headers = {
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
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
  };

  const dbConn = await db.getConnection();
  let page = 0;
  while (true) {
    const request = await axios.post('https://1cf3zt43zu-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.22.1)%3B%20Browser%20(lite)%3B%20instantsearch.js%20(4.66.0)%3B%20react%20(18.2.0)%3B%20react-instantsearch%20(7.7.0)%3B%20react-instantsearch-core%20(7.7.0)%3B%20JS%20Helper%20(3.16.3)&x-algolia-api-key=150c68d1c61fc1835826a57a203dab72&x-algolia-application-id=1CF3ZT43ZU', `{"requests":[{"indexName":"production_products","params":"analytics=true&analyticsTags=%5B%22%23sorocaba%22%2C%22%23loginOff%22%2C%22%23desktop%22%5D&clickAnalytics=true&facetFilters=%5B%5B%22attributes.Produto%3ABoiler%20Solar%22%2C%22attributes.Produto%3ACarregador%20de%20Carro%20El%C3%A9trico%22%2C%22attributes.Produto%3AColetor%20Solar%22%2C%22attributes.Produto%3AControle%20Solar%22%2C%22attributes.Produto%3AInversor%22%2C%22attributes.Produto%3AKit%20Aquecedor%20Solar%22%2C%22attributes.Produto%3AKit%20Solar%20Fotovolt%C3%A1ico%22%2C%22attributes.Produto%3ALumin%C3%A1ria%20Solar%22%2C%22attributes.Produto%3APlaca%20Fotovolt%C3%A1ica%22%2C%22attributes.Produto%3APlaca%20Solar%22%5D%5D&facetingAfterDistinct=true&facets=%5B%22*%22%5D&filters=regionalAttributes.sorocaba.promotionalPrice%20%3E%200%20AND%20regionalAttributes.sorocaba.available%3D1&hitsPerPage=36&maxValuesPerFacet=1000&page=${page}&query=solar&tagFilters=&userToken=anonymous-eeb43769-5948-48a9-89a2-97ba3a869a74"}]}`, { headers: headers });
    const anuncios = request.data['results'][0]['hits'];

    const urlAvaliacoes = 'https://api.bazaarvoice.com/data/statistics.json?apiversion=5.4&passkey=caag5mZC6wgKSPPhld3GSUVaOqO46ZEpAemNYqZ38m7Yc&stats=Reviews&filter=ContentLocale:pt_BR,en*,fr*,it*,pt*,es*,uk*&filter=ProductId:' + anuncios.map((anuncio) => anuncio['objectID']).join(',');
    const avaliacoes = await axios.get(urlAvaliacoes, {
      responseEncoding: 'utf8',
      headers: headers,
    }).then((response) => {
      const avaliacoes = {};
      for (const avaliacaoAtual of response['data']['Results']) {
        avaliacoes[avaliacaoAtual['ProductStatistics']['ProductId']] = avaliacaoAtual['ProductStatistics']['ReviewStatistics']['AverageOverallRating'];
      }
      return avaliacoes;
    });

    for (let anuncio of anuncios) {
      const url = anuncio['url'];
      if ((await db.query(`SELECT * FROM anuncios WHERE url = '${url}'`, [], dbConn)).length == 0) {
        await utils.sleep(1000);

        const nome = anuncio['name'];
        let preco = null;
        if (anuncio['regionalAttributes']['sorocaba']['available']) {
          preco = anuncio['regionalAttributes']['sorocaba']['promotionalPrice'] ? anuncio['regionalAttributes']['sorocaba']['promotionalPrice'] : anuncio['regionalAttributes']['sorocaba']['originalPrice'];
        } else if (anuncio['regionalAttributes']['outros']['available']) {
          preco = anuncio['regionalAttributes']['outros']['promotionalPrice'] ? anuncio['regionalAttributes']['sorocaba']['promotionalPrice'] : anuncio['regionalAttributes']['outros']['originalPrice'];
        } else {
          continue;
        }
        const avaliacao = avaliacoes[anuncio['objectID']];
        const foto = anuncio['pictures']['normal'];
        const descricao = await axios.get(url, {
          responseEncoding: 'utf8',
          headers: headers,
        }).then((response) => {
          const pag = cheerio.load(response.data);
          pag('*').removeAttr('style');
          pag('script,style').remove();
          const descricao = pag('span[itemprop=description]').attr('content').trim();
          return descricao;
        });

        await db.query(`CALL insert_anun(?, ?, ?, ?, ?, ?, 2)`, [nome, avaliacao, preco, descricao, url, foto], dbConn);
      }
    }

    page++;
  }
}

module.exports = {
  scrape,
};
