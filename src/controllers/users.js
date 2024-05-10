const db = require('../services/db');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const { sendMail } = require('../services/email');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const UserSession = require('../models/userSession');
const PasswordChangeRequest = require('../models/passwordChangeRequest');

exports.register = asyncHandler(async (req, res, next) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty())
      return res.status(400).send({ error: validation.array() })

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      passwordHash: passwordHash,
      name: req.body.name,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
    })
    await user.save();

    return res.send({ message: 'Usuário criado com sucesso!' });
  } catch (err) {
    if (err.errno == 1062) {
      return res.status(409).send({ message: 'Usuário já existe.' });
    } else {
      next(err);
    }
  }
});

exports.updateDetails = asyncHandler(async (req, res, next) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty())
      return res.status(400).send({ error: validation.array() })

    const user = new User();
    await user.load('userId', req.cookies.userId)

    if (user.userId !== undefined) {
      Object.assign(user, req.body);
      if (user.changedFields.size != 0) {
        await user.save();
        return res.send({ message: 'Usuário alterado com sucesso!' });
      } else {
        return res.status(409).send({ message: 'Nenhuma alteração aplicada.' })
      }
    } else {
      return res.status(404).send({ message: 'Usuário não encontrado.' })
    }
  } catch (err) {
    next(err);
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty())
      return res.status(400).send({ error: validation.array() })

    const user = new User();
    await user.load('email', req.body.email)
    if (user.userId === undefined) {
      return res.status(404).send({ message: `Usuário com e-mail ${req.body.email} não encontrado.` });
    }

    if (!await bcrypt.compare(req.body.password, user.passwordHash)) {
      return res.status(403).send({ message: `Dados de usuário incorretos.` });
    }

    const userSession = new UserSession({ user: user });
    await userSession.save();

    res.cookie('sessionHash', userSession.sessionHash, {
      maxAge: userSession.expires.getTime(),
    });
    res.cookie('userId', user.userId, {
      maxAge: userSession.expires.getTime(),
    });

    return res.send({ message: 'Usuário logado com sucesso!' });
  } catch (err) {
    next(err);
  }
});

exports.authorize = asyncHandler(async (req, res, next) => {
  const sessionHash = req.cookies.sessionHash;

  if (sessionHash === undefined) {
    return res.status(403).send({ message: 'Autenticação necessária.' });
  }

  const userSession = new UserSession();
  await userSession.load('sessionHash', sessionHash);
  if (userSession.sessionHash === undefined || sessionHash != userSession.sessionHash ||
    req.cookies.userId != userSession.user.userId) {
    return res.status(403).send({ message: 'Autenticação inválida.' });
  }

  next();
});

exports.getDetails = asyncHandler(async (req, res, next) => {
  const user = new User();
  await user.load('userId', req.cookies.userId);
  return res.send({ email: user.email, name: user.name, birthDate: user.birthDate, gender: user.gender });
});

exports.saveProduct = asyncHandler(async (req, res, next) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty())
      return res.status(400).send({ error: validation.array() })

    const user = new User();
    await user.load('userId', req.cookies.userId);
    if (await user.saveProduct(req.params.id)) {
      return res.send({ message: 'Anúncio salvo com sucesso.' });
    } else {
      return res.status(500).send({ message: 'Falha ao salvar anúncio.' });
    }
  } catch (err) {
    if (err.errno == 1062) {
      return res.status(409).send({ message: 'Anúncio já foi salvo por usuário.' });
    } else {
      next(err);
    }
  }
});

exports.unsaveProduct = asyncHandler(async (req, res, next) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty())
      return res.status(400).send({ error: validation.array() })

    const user = new User();
    await user.load('userId', req.cookies.userId);
    if (await user.unsaveProduct(req.params.id)) {
      return res.send({ message: 'Anúncio retirado da lista de anúncios salvos com sucesso.' });
    } else {
      return res.status(404).send({ message: 'Usuário não tem este anúncio salvo.' });
    }
  } catch (err) {
    next(err);
  }
});

exports.hideProduct = asyncHandler(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty())
    return res.send({ error: validation.array() })

  try {
    const user = new User();
    await user.load('userId', req.cookies.userId);
    if (await user.hideProduct(req.params.id)) {
      return res.send({ message: 'Anúncio oculto com sucesso.' });
    } else {
      return res.status(500).send({ message: 'Falha ao ocultar anúncio.' });
    }
  } catch (err) {
    if (err.errno == 1062) {
      return res.status(409).send({ message: 'Este anúncio já está oculto.' });
    } else {
      next(err);
    }
  }
});

exports.unhideProduct = asyncHandler(async (req, res, next) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty())
      return res.status(400).send({ error: validation.array() })

    const user = new User();
    await user.load('userId', req.cookies.userId);
    if (await user.unhideProduct(req.params.id)) {
      return res.send({ message: 'Anúncio retirado da lista de anúncios ocultos com sucesso.' });
    } else {
      return res.status(404).send({ message: 'Este anúncio não está oculto.' });
    }
  } catch (err) {
    next(err);
  }
});

exports.requestPassChange = asyncHandler(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty())
    return res.send({ error: validation.array() })

  try {
    const code = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
    const user = new User()
    await user.load('email', req.body.email);
    if (user.userId === undefined) {
      return res.status(404).send({ message: 'Usuário com este e-mail não encontrado.' });
    }

    const passwordChangeRequest = new PasswordChangeRequest({
      requestCode: code,
      requestDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      userId: user.userId,
    });
    await passwordChangeRequest.save()

    sendMail(req.body.email,
      'Redefinição de Senha - Renovável Efetiva',
      `Aqui está seu código para redefinição de senha:\n${code}`);

    res.status(201).send({ message: 'Solicitação de troca de senha feita com sucesso.' });
  } catch (err) {
    next(err);
  }
});

exports.confirmCode = asyncHandler(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty())
    return res.send({ error: validation.array() })

  try {
    const passwordChangeRequest = new PasswordChangeRequest();
    if (!(await passwordChangeRequest.loadByUserEmail(req.body.email))) {
      return res.status(400).send({ message: 'Código incorreto' });
    }

    if (passwordChangeRequest.requestCode != req.body.code) {
      res.status(400).send({ message: 'Código incorreto' })
    }

    res.status(200).send({ message: 'Código correto' })

  } catch (err) {
    next(err);
  }
});

exports.confirmPassChange = asyncHandler(async (req, res, next) => {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty())
      return res.status(400).send({ error: validation.array() })

    const passwordChangeRequest = new PasswordChangeRequest();
    await passwordChangeRequest.loadByUserEmail(req.body.email);
    if (request.request_code != req.body.code) {
      return res.status(400).send({ message: 'Dados inválidos' });;
    }

    let dataRequisicao = new Date(passwordChangeRequest.requestDate);
    let dataExpiracao = new Date(dataRequisicao.setDate(dataRequisicao.getDate() + 1));
    if (passwordChangeRequest.used || dataExpiracao < Date.now() || isNaN(dataRequisicao)) {
      return res.status(409).send({ message: 'Solicitação já expirada' });
    }

    await db.query('UPDATE Users SET passwordHash = ? WHERE email = ?', [
      await bcrypt.hash(req.body.password, 10),
      req.body.email
    ])
    await db.query('CALL finishPasswordChangeRequest(?)', [
      passwordChangeRequest.requestId
    ])
    res.status(200).send({ message: 'Senha alterada com sucesso' })
    sendMail(req.body.email,
      'Senha Redefinida - Renovável Efetiva',
      'Sua senha foi redefinida com sucesso.');
  } catch (err) {
    next(err);
  }
});
