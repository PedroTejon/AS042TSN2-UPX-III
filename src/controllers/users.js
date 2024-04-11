const db = require('../services/db');
const crypto = require('crypto')
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

exports.register = asyncHandler(async (req, res, next) => {
    try {
        const dbConn = await db.getConnection();

        const passHash = await bcrypt.hash(req.body.password, 10);
        await db.query('INSERT INTO usuarios VALUES (?, ?, ?, ?, ?, ?)', [
            null,
            req.body.email,
            passHash,
            req.body.nome,
            req.body.dataNasc,
            req.body.genero
        ], dbConn);

        res.send({message: 'Usuário criado com sucesso!'});
    } catch (err) {
        if (err.errno == 1062) {
            res.status(409).send({ message: 'Usuário já existe.' })
            res.end();
        } else {
            next(err);
        }
    }
});

exports.login = asyncHandler(async (req, res, next) => {
    try {
        const dbConn = await db.getConnection();

        const user = await db.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], dbConn);
        if (!user.length) {
            res.status(404).send({message: `Usuário com e-mail ${req.body.email} não encontrado.`});
            return;
        }

        if (!await bcrypt.compare(req.body.password, user[0].senha_hash)) {
            res.status(403).send({message: `Dados de usuário incorretos.`});
            return;
        }

        const dataAtual = new Date();
        const dataExpiracao = new Date(dataAtual.setMonth(dataAtual.getMonth() + 1));
        const idUsuario = user[0].id_usuario;
        const sessHash = crypto.createHash('md5').update(`${idUsuario}-${dataAtual.toISOString()}`).digest('hex');
        await db.query('INSERT INTO sessoes_usuario VALUES (?, ?, ?, ?)', [
            sessHash,
            idUsuario,
            dataAtual.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            dataExpiracao.toISOString().replace(/T/, ' ').replace(/\..+/, '')
        ], dbConn)

        res.cookie('sessHash', sessHash, {
            maxAge: dataExpiracao.getTime()
        });
        res.cookie('userId', idUsuario, {
            maxAge: dataExpiracao.getTime()
        });

        res.send({message: 'Usuário logado com sucesso!'});
    } catch (err) {
        next(err);
    }
});

exports.authorize = asyncHandler(async (req, res, next) => {
    const dbConn = await db.getConnection();
    const sessHash = req.cookies.sessHash

    if (sessHash === undefined) {
        res.status(403).send({ message: 'Autenticação necessária.' });
        return;
    }

    const session = await db.query('SELECT sess_hash, expires FROM sessoes_usuario WHERE sess_hash = ?', [sessHash], dbConn)
    if (!sessHash.length || sessHash != session[0].sess_hash) {
        res.status(403).send({ message: 'Autenticação inválida.' });
        return;
    }

    next()
});

exports.getDetails = asyncHandler(async (req, res, next) => {
    const dbConn = await db.getConnection();

    res.send(await db.query('SELECT email, nome, data_nasc, genero FROM usuarios WHERE id_usuario = ?', [req.cookies.userId], dbConn));
});