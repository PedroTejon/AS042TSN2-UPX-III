const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.sendFile('index.html', { root: './src/public/templates' });
});

router.get('/catalogue', function (req, res, next) {
  res.sendFile('catalogue.html', { root: './src/public/templates' });
});

router.get('/FAQ', function (req, res, next) {
  res.sendFile('FAQ.html', { root: './src/public/templates' });
});

router.get('/about', function (req, res, next) {
  res.sendFile('about.html', { root: './src/public/templates' });
});

router.get('/profile', function (req, res, next) {
  res.sendFile('profile.html', { root: './src/public/templates' });
});

router.get('/login', function (req, res, next) {
  res.sendFile('login.html', { root: './src/public/templates' });
});

router.get('/signup', function (req, res, next) {
  res.sendFile('signup.html', { root: './src/public/templates' });
});

module.exports = router;
