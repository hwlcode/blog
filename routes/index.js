var express = require('express');
var router = express.Router();
var Models  = require('../models');

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/post', function (req, res, next) {
    res.render('post', {title: 'Express'});
});

router.get('/article/1', function (req, res, next) {
    res.render('article', {title: 'Express'});
});

router.get('/article/edit/1', function (req, res, next) {
    res.render('edit', {title: 'Express'});
});

module.exports = router;
