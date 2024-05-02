const { body, param, query } = require('express-validator')

exports.UserValidator = {
    updateDetailsValidator: [
        body('nome').notEmpty(),
        body('data_nasc').optional(),
        body('genero').optional().isIn(['F', 'M']),
    ],
    registerValidator: [
        body('email').isEmail(),
        body('password').isLength({ min: 8, max: 64 }),
        body('nome').notEmpty(),
        body('dataNasc').optional().isDate(),
        body('genero').optional().isIn(['F', 'M'])
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
        body('code').isInt(),
        body('password').isLength({ min: 8, max: 64 })
    ],
    confirmCodeValidator: [
        body('email').isEmail(),
        body('code').isInt()
    ],
    saveProductValidator: [
        param('id').exists().isInt({ min: 1 })
            .withMessage('Parâmetro \'id\' não é um número inteiro inteiro ou maior do que 0')
    ],
    unsaveProductValidator: [
        param('id').exists().isInt({ min: 1 })
            .withMessage('Parâmetro \'id\' não é um número inteiro inteiro ou maior do que 0')
    ],
    hideProductValidator: [
        param('id').exists().isInt({ min: 1 })
            .withMessage('Parâmetro \'id\' não é um número inteiro inteiro ou maior do que 0')
    ],
    unhideProductValidator: [
        param('id').exists().isInt({ min: 1 })
            .withMessage('Parâmetro \'id\' não é um número inteiro inteiro ou maior do que 0')
    ]
}

exports.ProductValidator = {
    getDetailsValidator: [
        param('id').exists().isInt({ min: 1 })
            .withMessage('Parâmetro \'id\' não é um número inteiro inteiro ou maior do que 0')
    ],
    getPageValidator: [
        param('page').exists().isInt({ min: 1 })
            .withMessage('Parâmetro \'page\' não é um número inteiro inteiro ou maior do que 0'),
        query('sortedBy').optional().toLowerCase()
            .isIn(['avaliacao', 'qntd_avaliacoes', 'preco', 'id_anuncio', 'titulo']),
        query('sortOrder').optional().toUpperCase()
            .isIn(['DESC', 'ASC']),
        query('filter').optional().isJSON(),
        query('searchQuery').optional().trim()
    ]
}