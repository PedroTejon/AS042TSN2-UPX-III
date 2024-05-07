const db = require('../services/db');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Product = require('../models/product');
const User = require('../models/user');

exports.getDetails = asyncHandler(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty())
    return res.status(400).send({ error: validation.array() })

  const product = new Product();
  await product.load('productId', req.params['id']);
  return res.send({
    productId: product.productId,
    title: product.title,
    description: product.description,
    price: product.price,
    rating: product.rating,
    ratingAmount: product.ratingAmount,
    image: product.image,
    category: {
      categoryId: product.category.categoryId,
      name: product.category.name
    },
    platform: {
      platformId: product.platform.platformId,
      name: product.platform.name,
      url: product.platform.url
    }
  });
});

exports.getPage = asyncHandler(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty())
    return res.status(400).send({ error: validation.array() })

  const page = parseInt(req.params['page']) * 50;
  let orderBy = 'ORDER BY productId DESC';
  if ('sortedBy' in req.query) {
    orderBy = `ORDER BY ${req.query['sortedBy']} ${'sortOrder' in req.query ? req.query['sortOrder'] : 'DESC'}`;
  }

  const user = new User();
  await user.load('userId', req.cookies.userId);
  let showHidden = 'AND hidden = 0';
  if (req.cookies.userId && user.administrator == 1) {
    showHidden = 'AND hiddem IN (0, 1)'
  }

  let filter = ''
  if ('filter' in req.query) {
    const filterObject = JSON.parse(req.query.filter);
    if (filterObject.categories.length) {
      filter += 'AND ('
      for (let i = 0; i < filterObject.categories.length; i++) {
        filter += `categoryId = ${filterObject.categories[i]} ${i != filterObject.categories.length - 1 ? 'OR' : ')'}`
      }
    }

    if (filterObject.platforms.length) {
      filter += 'AND ('
      for (let i = 0; i < filterObject.platforms.length; i++) {
        filter += `platformId = ${filterObject.platforms[i]} ${i != filterObject.platforms.length - 1 ? 'OR' : ')'}`
      }
    }

    if (filterObject.minRating) {
      filter += 'AND rating >= ' + filterObject.minRating
    }

    if (filterObject.maxRating) {
      filter += 'AND rating <= ' + filterObject.maxRating
    }

    if (filterObject.minPrice) {
      filter += 'AND price >= ' + filterObject.minPrice
    }

    if (filterObject.maxPrice) {
      filter += 'AND price <= ' + filterObject.maxPrice
    }
  }

  const query = `SELECT * FROM Product
    WHERE 
    title LIKE ?
    ${showHidden}
    ${filter}
    ${orderBy} LIMIT ${page}, 50`;
  return res.send(await db.query(query, [req.query['searchQuery'] ? '%' + req.query['searchQuery'] + '%' : '%%']));
});
