var controller = require('../controllers/users')
var express = require('express');
var router = express.Router();

/* GET */
router.get('/', controller.authorize, controller.getDetails);
router.post('/register', controller.register)
router.post('/login', controller.login)

module.exports = router;
