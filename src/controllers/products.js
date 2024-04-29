const db = require('../services/db');
const asyncHandler = require('express-async-handler');

exports.getDetails = asyncHandler(async (req, res, next) => {
  const dbConn = await db.getConnection();

  res.send(await db.query('SELECT * FROM ANUNCIOS WHERE id_anuncio = ?', [req.params['id']], dbConn));
});

exports.getPage = asyncHandler(async (req, res, next) => {
  const dbConn = await db.getConnection();

  const page = parseInt(req.params['page']) * 50;
  let orderBy = 'ORDER BY id_anuncio DESC';
  if ('sortedBy' in req.query) {
    orderBy = `ORDER BY ${req.query['sortedBy']} ${'sortOrder' in req.query ? req.query['sortOrder'] : 'DESC'}`;
  }

  let showHidden = 'AND oculto = 0';
  if (req.cookies.userId &&
    (await db.query(`SELECT administrador FROM usuarios WHERE id_usuario = ?`,
      [req.cookies.userId], dbConn))[0]['administrador'] == 1) {
    showHidden = 'AND oculto IN (0, 1)'
  }

  let filter = ''
  if ('filter' in req.query) {
    const filterObject = JSON.parse(req.query.filter);
    if (filterObject.categories.length) {
      filter += 'AND ('
      for (let i = 0; i < filterObject.categories.length; i++) {
        filter += `id_categoria = ${filterObject.categories[i]} ${i != filterObject.categories.length - 1 ? 'OR' : ')'}`
      }
    }

    if (filterObject.minRating) {
      filter += 'AND avaliacao >= ' + filterObject.minRating
    }

    if (filterObject.maxRating) {
      filter += 'AND avaliacao <= ' + filterObject.maxRating
    }

    if (filterObject.minPrice) {
      filter += 'AND preco >= ' + filterObject.minPrice
    }

    if (filterObject.maxPrice) {
      filter += 'AND preco <= ' + filterObject.maxPrice
    }
  }

  const query = `SELECT * FROM anuncios
    WHERE 
    titulo LIKE ?
    ${showHidden}
    ${filter}
    ${orderBy} LIMIT ${page}, 50`;
  res.send(await db.query(query, [req.query['searchQuery'] ? '%' + req.query['searchQuery'] + '%' : '%%'], dbConn));
});
