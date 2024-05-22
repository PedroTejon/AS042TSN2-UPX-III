const { body, param, query } = require('express-validator')

exports.UserValidator = {
  updateDetailsValidator: [
    body('name').notEmpty(),
    body('birthDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/)
      .customSanitizer(value => new Date(value + ' GMT-0300')),
    body('gender').optional().isIn(['F', 'M']),
  ],
  registerValidator: [
    body('email').isEmail(),
    body('password').isLength({ min: 8, max: 64 }),
    body('name').notEmpty(),
    body('birthDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/)
      .customSanitizer(value => new Date(value + ' GMT-0300')),
    body('gender').optional().isIn(['F', 'M'])
  ],
  loginValidator: [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  requestPassChangeValidator: [
    body('email').isEmail(),
  ],
  confirmPassChangeValidator: [
    body('email').isEmail(),
    body('requestCode').isInt(),
    body('password').isLength({ min: 8, max: 64 })
  ],
  confirmCodeValidator: [
    body('email').isEmail(),
    body('requestCode').isInt()
  ],
  saveProductValidator: [
    param('id').exists().isInt({ min: 1 })
      .withMessage('Parâmetro \'id\' não é um número inteiro inteiro ou maior do que 0')
      .toInt()
  ],
  unsaveProductValidator: [
    param('id').exists().isInt({ min: 1 })
      .withMessage('Parâmetro \'id\' não é um número inteiro inteiro ou maior do que 0')
      .toInt()
  ],
  hideProductValidator: [
    param('id').exists().isInt({ min: 1 })
      .withMessage('Parâmetro \'id\' não é um número inteiro inteiro ou maior do que 0')
      .toInt()
  ],
  unhideProductValidator: [
    param('id').exists().isInt({ min: 1 })
      .withMessage('Parâmetro \'id\' não é um número inteiro inteiro ou maior do que 0')
      .toInt()
  ]
}

exports.ProductValidator = {
  getDetailsValidator: [
    query('id').exists().isInt({ min: 1 })
      .withMessage('Parâmetro \'id\' não é um número inteiro inteiro ou maior do que 0')
  ],
  getPageValidator: [
    query('page').optional().isInt({ min: 1 })
      .withMessage('Parâmetro \'page\' não é um número inteiro inteiro ou maior do que 0'),
    query('sortedBy').optional().toLowerCase()
      .isIn(['avaliacao', 'qntd_avaliacoes', 'preco', 'id_anuncio', 'titulo']),
    query('sortOrder').optional().toUpperCase()
      .isIn(['DESC', 'ASC']),
    query('filter').optional().isJSON(),
    query('searchQuery').optional().trim()
  ]
}