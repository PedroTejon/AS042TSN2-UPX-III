const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../services/db');

async function scrape() {
  const categorias = [
    'painel-solar',
    'kit-energia-solar-off-grid',
    'kit-energia-solar-on-grid',
    'bomba-solar',
    'controlador-de-carga-solar',
    'inversor-solar',
    'bateria-solar',
    'carro-eletrico',
    'estrutura-cabo-outros',
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

  const dbConn = await db.getConnection();
  for (const categoria of categorias) {
    let pagina = 1;
    while (true) {
      const site = await axios.get(`https://www.neosolar.com.br/loja/${categoria}.html?p=${pagina}`, {
        headers: headers,
      }).then((response) => {
        return cheerio.load(response.data);
      });

      if (site('.message.info.empty').length != 0) {
        break;
      }

      // eslint-disable-next-line max-len
      for (const anuncio of [...site('.item.product.product-item')].map((anuncio) => site(anuncio))) {
        const url = anuncio.find('a.product.photo.product-item-photo').attr('href').trim();
        if ((await db.query(`SELECT * FROM anuncios WHERE url = '${url}'`, [], dbConn)).length == 0) {
          const nome = anuncio.find('.product.name.product-item-name').text().trim();
          const precoTexto = anuncio.find('span[data-price-type=finalPrice] .price');
          let precoFinal;
          if (precoTexto.length != 0) {
            precoFinal = parseFloat(precoTexto.first().text().trim().replace(/[\D$\s]*/, '').replace(',', '.'));
          } else {
            continue;
          }
          const avaliacaoTexto = anuncio.find('.rating-result');
          let avaliacao = 0;
          if (avaliacaoTexto.length != 0) {
            avaliacao = 5 * (parseInt(avaliacaoTexto.attr('title').replace('%', '')) / 100);
          }
          const foto = anuncio.find('img.product-image-photo').attr('src');
          const descricao = await axios.get(url, {
            responseEncoding: 'binary',
            headers: headers,
          }).then((responseRaw) => responseRaw.data.toString('utf8')).then((response) => {
            const pag = cheerio.load(response);
            pag('*').removeAttr('style');
            pag('script,style').remove();
            const descricao = pag('.product.attribute.description').html().trim();
            return descricao;
          });

          // eslint-disable-next-line max-len
          await db.query(`CALL insert_anun('${nome}', ${avaliacao}, ${precoFinal}, '${descricao}', '${url}', '${foto}', 6)`, [], dbConn);

          await utils.sleep(1000);
        }
      }

      pagina++;
    }
  }
}

module.exports = {
  scrape,
};
