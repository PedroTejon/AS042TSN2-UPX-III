const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../services/db');
const utils = require('./utils');

const mapCategorias = {
  'Painel Solar': 1,
  'Estrutura Solar': 2,
  'Controlador de Carga': 3,
  'Inversor': 4,
  'Inversor Off-Grid': 4,
  'Inversor Solar On-Grid': 4,
  'Inversor Drive Bomba Solar': 4,
  'Ferramentas': 5,
  'Fontes Carregadoras': 6,
  'Baterias': 6,
  'Kit Energia Solar': 7,
  'Kit Energia Solar On-grid': 7,
  'Kit Energia Solar Off-grid': 7,
  'Cabos e Conectores': 8,
  'Disjuntor': 9,
  'Stringbox e Proteções': 10,
  'Eletrificador Solar': 14,
  'Variedades': 14,
  'Bombeamento Solar Profissional': 15,
  'Bomba Solar': 15,
  'Kit Bomba Solar': 15,
}

async function scrape() {
  const categorias = [
    'painel-solar',
    'controlador-de-carga',
    'inversores',
    'baterias-estacionarias',
    'kits-solar',
    'bomba-solar',
    'variedades',
    'eletrificador-solar',
    'ferramentas',
    'fontes-carregadoras',
  ];

  headers = {
    // eslint-disable-next-line max-len
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en,pt-BR;q=0.9,pt;q=0.8,en-GB;q=0.7,en-US;q=0.6',
    'cache-control': 'no-cache',
    // eslint-disable-next-line max-len
    'cookie': 'PHPSESSID=ppjc0mdmel51gvun7get1gjlv5; PHPSESSID=ppjc0mdmel51gvun7get1gjlv5; CAKEPHP=98mmiki0lks66qf2op09jtj5g0; LOJA=1089437; hist[p1089437]=a%3A2%3A%7Bi%3A0%3Bi%3A1185%3Bi%3A1%3Bi%3A355%3B%7D; paginaOrigem=https%3A%2F%2Fwww.energiatotal.com.br%2Floja%2Fcatalogo.php%3Floja%3D1089437%26categoria%3D1%26pg%3D1',
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
  for (const categoria of categorias) {
    let pagina = 1;
    while (true) {
      const site = await axios.get(`https://www.energiatotal.com.br/${categoria}?pg=${pagina}`, {
        headers: headers,
        responseEncoding: 'latin1'
      }).then((response) => {
        return cheerio.load(response.data);
      });

      for (const anuncio of [...site('li.item.flex')].map((anuncio) => site(anuncio))) {
        const url = anuncio.find('.info-product').attr('href').trim();
        if ((await db.query(`SELECT * FROM anuncios WHERE url = '${url}'`, [], dbConn)).length == 0) {
          const nome = anuncio.find('.product-name').text().trim();
          const precoTexto = anuncio.find('.precoAvista').text()
            .replace(' ', '')
            .replace('R$', '')
            .replace('.', '')
            .replace(',', '.')
            .trim();
          let precoFinal;
          if (precoTexto != 'ESGOTADO!') {
            precoFinal = parseFloat(precoTexto);
          } else {
            continue;
          }
          const avaliacao = anuncio.find('.icon.active').length;
          const foto = anuncio.find('img').attr('data-src');
          const [descricao, categoria, qntdAvaliacoes] = await axios.get(url, {
            responseEncoding: 'latin1',
            headers: headers,
          }).then((response) => {
            const pag = cheerio.load(response.data);
            pag('*').removeAttr('style');
            pag('script,style').remove();
            const categoria = mapCategorias[pag('.breadcrumb-item').slice(-2, -1).find('a').attr('title')];
            const descricao = pag('.board_htm').html().trim();
            const qntdAvaliacoes = parseInt(pag('.fixed-info .list-star .total').text().split(' ')[0]);
            return [descricao, categoria, qntdAvaliacoes];
          });

          // eslint-disable-next-line max-len
          await db.query('CALL insert_anun(?, ?, ?, ?, ?, ?, 1, ?, ?)', [nome, avaliacao, precoFinal, descricao, url, foto, categoria, qntdAvaliacoes], dbConn);

          await utils.sleep(1000);
        }
      }

      pagina++;

      if (site('.page-next.page-link').length == 0) {
        break;
      }
    }
  }
}

scrape()

module.exports = {
  scrape,
};
