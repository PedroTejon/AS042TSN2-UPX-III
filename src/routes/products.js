const controller = require('../controllers/products');
const express = require('express');
const router = express.Router();
const { ProductValidator } = require('../services/validator')


router.get('/details', ProductValidator.getDetailsValidator, controller.getDetails);
router.get('/catalogue', ProductValidator.getPageValidator, controller.getPage);

module.exports = router;
