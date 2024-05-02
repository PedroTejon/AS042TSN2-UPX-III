var controller = require('../controllers/users');
var express = require('express');
var router = express.Router();

/* GET */
router.get('/', controller.authorize, controller.getDetails);
router.post('/', controller.authorize, controller.updateDetails);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/requestPassChange', controller.requestPassChange);
router.post('/confirmPassChange', controller.confirmPassChange);
router.post('/confirmCode', controller.confirmCode);
router.post('/saveProduct/:anunId', controller.saveProduct);
router.post('/unsaveProduct/:anunId', controller.unsaveProduct);
router.post('/hideProduct/:anunId', controller.hideProduct);
router.post('/unhideProduct/:anunId', controller.unhideProduct);

module.exports = router;
