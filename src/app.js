var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var webRouter = require('./routes/web');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', webRouter);
app.use('/api/users/', usersRouter);
app.use('/api/products/', productsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.message = err.message;
  res.error = err;

  res.status(500);
  res.send(err);
});

module.exports = app;
