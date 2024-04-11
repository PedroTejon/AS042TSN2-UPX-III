var controller = require('../controllers/products');
var express = require('express');
var router = express.Router();

/* GET Detalhes produto */
router.get('/details/:id', controller.getDetails);

/* GET Paginação */
router.get('/page/:page', controller.getPage);

module.exports = router;
