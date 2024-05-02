const controller = require('../controllers/users');
const express = require('express');
const router = express.Router();
const { UserValidator } = require('../services/validator')

router.get('/', controller.authorize, controller.getDetails);
router.post('/', controller.authorize, UserValidator.updateDetailsValidator, controller.updateDetails);
router.post('/register', UserValidator.registerValidator, controller.register);
router.post('/login', UserValidator.loginValidator, controller.login);
router.post('/requestPassChange', UserValidator.requestPassChangeValidator, controller.requestPassChange);
router.post('/confirmPassChange', UserValidator.confirmPassChangeValidator, controller.confirmPassChange);
router.post('/confirmCode', UserValidator.confirmCodeValidator, controller.confirmCode);
router.post('/saveProduct/:id', UserValidator.saveProductValidator, controller.saveProduct);
router.post('/unsaveProduct/:id', UserValidator.unsaveProductValidator, controller.unsaveProduct);
router.post('/hideProduct/:id', UserValidator.hideProductValidator, controller.hideProduct);
router.post('/unhideProduct/:id', UserValidator.unhideProductValidator, controller.unhideProduct);

module.exports = router;
