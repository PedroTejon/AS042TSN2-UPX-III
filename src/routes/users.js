var controller = require('../controllers/users')
var express = require('express');
var router = express.Router();

/* GET */
router.get('/', controller.authorize, controller.getDetails);
router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/saveProduct/:anunId', controller.saveProduct)
router.post('/unsaveProduct/:anunId', controller.unsaveProduct)
router.post('/hideProduct/:anunId', controller.hideProduct)
router.post('/unhideProduct/:anunId', controller.unhideProduct)

module.exports = router;
