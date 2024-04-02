var controller = require('../controllers/users')
var express = require('express');
var router = express.Router();

/* GET */
router.get('/', controller.get);

module.exports = router;
