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

  const query = `SELECT * FROM anuncios
    WHERE 
    titulo LIKE ?
    ${orderBy} LIMIT ${page}, 50`;
  res.send(await db.query(query, [req.query['searchQuery'] ? '%' + req.query['searchQuery'] + '%' : '%%'], dbConn));
});
