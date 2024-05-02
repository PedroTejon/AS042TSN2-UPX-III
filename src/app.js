const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const webRouter = require('./routes/web');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.all('/*', webRouter);
app.use('/api/users/', usersRouter);
app.use('/api/products/', productsRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(500).send({ message: err.message, error: err });
});

module.exports = app;
