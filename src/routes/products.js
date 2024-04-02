var controller = require('../controllers/products')
var express = require('express');
var router = express.Router();

/* GET */
router.get('/', controller.get);

module.exports = router;
