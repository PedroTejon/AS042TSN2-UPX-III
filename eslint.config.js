const globals = require('globals');
const google = require('eslint-config-google')

module.exports = [
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                ...globals.browser
            }
        },
        plugins: google,
        rules: {
            "require-jsdoc": 0,
            "max-len": [
                "error",
                {
                    "code": 120
                }
            ],
            "linebreak-style": 0
        }
    }
];