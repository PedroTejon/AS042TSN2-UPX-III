const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../services/db');
const utils = require('./utils');

const mapCategorias = {
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
}

async function scrape() {
  const urlCategorias = [
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

  const dbConn = await db.getConnection();
  for (const urlCategoria of urlCategorias) {
    let pagina = 1;
    while (true) {
      const site = await axios.get(`https://www.minhacasasolar.com.br/${urlCategoria}?pagina=${pagina}&tamanho=24`, {
        headers: headers,
        responseEncoding: 'utf8',
      }).then((response) => {
        return cheerio.load(response.data);
      });

      const urlAvaliacoes = 'codes[]=' + [...site('div[data-trustvox-product-code]')].map((el) => {
        return site(el).attr('data-trustvox-product-code');
      }).join('&codes[]=');

      const avaliacoes = await axios.get(
        `https://trustvox.com.br/widget/shelf/v2/products_rates?${urlAvaliacoes}&store_id=81798&callback=_tsRatesReady`,
        {
          responseEncoding: 'utf8',
          headers: headers,
        }).then((response) => {
          let json = response.data.replace('/**/_tsRatesReady(', '');
          json = JSON.parse(json.substring(0, json.length - 1))['products_rates'];
          const avaliacoes = {};
          for (const avaliacaoAtual of json) {
            avaliacoes[avaliacaoAtual['product_code']] = [avaliacaoAtual['average'], avaliacaoAtual['count']];
          }
          return avaliacoes;
        });

      for (const anuncio of [...site('.spot')].map((anuncio) => site(anuncio))) {
        const url = anuncio.find('a.spot__content').attr('href').trim();
        if ((await db.query(`SELECT * FROM anuncios WHERE url = '${url}'`, [], dbConn)).length == 0) {
          const nome = anuncio.find('.spot__name').text().trim();
          const precoTexto = anuncio.find('.pix-discount');
          let precoFinal;
          if (precoTexto.length != 0) {
            precoFinal = parseFloat(precoTexto.text().trim().replace(/[\D$\s]*/, '').replace(',', '.'));
          } else {
            continue;
          }
          const [avaliacao, qntdAvaliacoes] = avaliacoes[anuncio.find('div[data-trustvox-product-code]')
            .attr('data-trustvox-product-code')];
          const foto = anuncio.find('.spot-image').attr('data-src');
          const [categorias, descricao] = await axios.get(url, {
            responseEncoding: 'utf8',
            headers: headers,
          }).then((response) => {
            const page = utils.cleanPage(cheerio.load(response.data));
            const categorias = [...page('.breadcrumbs a')].map((el) => page(el).text());
            const descricaoElement = page('.description__item.menu_groups')
            const descricao = descricaoElement.length > 0 ? descricaoElement.first().html().trim() : null;
            return [categorias, descricao];
          });

          const categoria = mapCategorias[
            categorias.filter((cat) => Object.keys(mapCategorias).includes(cat)).slice(-1)];

          await db.query(`CALL insert_anun(?, ?, ?, ?, ?, ?, 5, ?, ?)`,
            [nome, avaliacao, precoFinal, descricao, url, foto, categoria, qntdAvaliacoes], dbConn);

          await utils.sleep(1000);
        }
      }

      pagina++;

      if (site('#pagination_next').length == 0) {
        break;
      }

      await utils.sleep(1000);
    }
  }
}

module.exports = {
  scrape,
};
