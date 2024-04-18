const db = require('../services/db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

exports.register = asyncHandler(async (req, res, next) => {
  try {
    const dbConn = await db.getConnection();

    const passHash = await bcrypt.hash(req.body.password, 10);
    await db.query('INSERT INTO usuarios VALUES (?, ?, ?, ?, ?, ?, 0)', [
      null,
      req.body.email,
      passHash,
      req.body.nome,
      req.body.dataNasc,
      req.body.genero,
    ], dbConn);

    res.send({ message: 'Usuário criado com sucesso!' });
  } catch (err) {
    if (err.errno == 1062) {
      res.status(409).send({ message: 'Usuário já existe.' });
      return;
    } else {
      next(err);
    }
  }
});

exports.updateDetails = asyncHandler(async (req, res, next) => {
  try {
    const dbConn = await db.getConnection();

    const user = (await db.query(`SELECT * FROM usuarios WHERE id_usuario = ${req.cookies.userId}`, [], dbConn))[0];

    if (user) {
      let changes = []
      for (let prop of Object.keys(user)) {
        if (req.body[prop] != undefined && user[prop] != req.body[prop]) {
          changes.push(`${prop} = '${req.body[prop]}'`)
        }
      }

      if (changes.length != 0) {
        await db.query(`UPDATE usuarios SET ${changes.join(', ')} WHERE id_usuario = ${req.cookies.userId}`, [], dbConn);
        res.send({ message: 'Usuário alterado com sucesso!' });
      } else {
        res.status(409).send({ message: 'Nenhuma alteração aplicada pois Usuário já possui tais características e/ou nenhuma propriedade foi válida.' })
      }
    } else {
      res.status(404).send({ message: 'Usuário não encontrado.' })
    }
  } catch (err) {
    next(err);
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  try {
    const dbConn = await db.getConnection();

    const user = await db.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], dbConn);
    if (!user.length) {
      res.status(404).send({ message: `Usuário com e-mail ${req.body.email} não encontrado.` });
      return;
    }

    if (!await bcrypt.compare(req.body.password, user[0].senha_hash)) {
      res.status(403).send({ message: `Dados de usuário incorretos.` });
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
      dataExpiracao.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    ], dbConn);

    res.cookie('sessHash', sessHash, {
      maxAge: dataExpiracao.getTime(),
    });
    res.cookie('userId', idUsuario, {
      maxAge: dataExpiracao.getTime(),
    });

    res.send({ message: 'Usuário logado com sucesso!' });
  } catch (err) {
    next(err);
  }
});

exports.authorize = asyncHandler(async (req, res, next) => {
  const dbConn = await db.getConnection();
  const sessHash = req.cookies.sessHash;

  if (sessHash === undefined) {
    res.status(403).send({ message: 'Autenticação necessária.' });
    return;
  }

  const session = (await db.query('SELECT sess_hash, id_usuario, expires FROM sessoes_usuario WHERE sess_hash = ?', [sessHash], dbConn))[0];
  if (!sessHash.length || sessHash != session.sess_hash || req.cookies.userId != session.id_usuario) {
    res.status(403).send({ message: 'Autenticação inválida.' });
    return;
  }

  next();
});

exports.getDetails = asyncHandler(async (req, res, next) => {
  const dbConn = await db.getConnection();

  res.send(await db.query('SELECT email, nome, data_nasc, genero FROM usuarios WHERE id_usuario = ?', [req.cookies.userId], dbConn));
});

exports.saveProduct = asyncHandler(async (req, res, next) => {
  const dbConn = await db.getConnection();

  try {
    const out = await db.query('CALL save_anun(?, ?)', [req.cookies.userId, req.params.anunId], dbConn);

    if (out.affectedRows != 0) {
      res.send({ message: 'Anúncio salvo com sucesso.' });
    } else {
      res.status(500).send({ message: 'Falha ao salvar anúncio.' });
    }
  } catch (err) {
    if (err.errno == 1062) {
      res.status(409).send({ message: 'Anúncio já foi salvo por usuário.' });
      return;
    } else {
      next(err);
    }
  }
});

exports.unsaveProduct = asyncHandler(async (req, res, next) => {
  const dbConn = await db.getConnection();

  try {
    const out = await db.query('CALL unsave_anun(?, ?)', [req.cookies.userId, req.params.anunId], dbConn);

    if (out.affectedRows != 0) {
      res.send({ message: 'Anúncio retirado da lista de anúncios salvos com sucesso.' });
    } else {
      res.status(404).send({ message: 'Usuário não tem este anúncio salvo.' });
    }
  } catch (err) {
    next(err);
  }
});

exports.hideProduct = asyncHandler(async (req, res, next) => {
  const dbConn = await db.getConnection();

  try {
    const out = await db.query('CALL hide_anun(?, ?)', [req.cookies.userId, req.params.anunId], dbConn);

    if (out[0][0]['code']) {
      res.send({ message: 'Anúncio oculto com sucesso.' });
    } else {
      res.status(500).send({ message: 'Falha ao ocultar anúncio.' });
    }
  } catch (err) {
    if (err.errno == 1062) {
      res.status(409).send({ message: 'Este anúncio já está oculto.' });
      return;
    } else {
      next(err);
    }
  }
});

exports.unhideProduct = asyncHandler(async (req, res, next) => {
  const dbConn = await db.getConnection();

  try {
    const out = await db.query('CALL unhide_anun(?, ?)', [req.cookies.userId, req.params.anunId], dbConn);

    if (out[0][0]['code']) {
      res.send({ message: 'Anúncio retirado da lista de anúncios ocultos com sucesso.' });
    } else {
      res.status(404).send({ message: 'Este anúncio não está oculto.' });
    }
  } catch (err) {
    next(err);
  }
});
