var express = require('express');
var router = express.Router();
var TopicModel  = require('../models').TopicModel;
var UserModel = require('../models').UserModel;
var ObjectId = require('mongodb').ObjectID;
var marked = require('marked');
var moment = require('moment');
const co = require('co');
moment.locale('zh-cn');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

router.get('/', function (req, res, next) {
    co(function *() {
        var user  = yield UserModel.findOne({sourceTypeId: req.session.passport && req.session.passport.user}).exec();
        yield res.render('index', {
            user: user
        });
    });
});

router.get('/post', ensureAuthenticated, function (req, res, next) {
    res.render('post', {
        user: req.session.passport && req.session.passport.user || null
    });
});

router.post('/post', ensureAuthenticated, function (req, res, next) {
    var body = req.body;
    body.post = marked(body.post);
    body.poster = req.session.user._id;
    co(function *() {
        var post = yield TopicModel.create(body);
        yield res.redirect('/');
    })
});

router.get('/article/1', function (req, res, next) {
    res.render('article', {title: 'Express'});
});

router.get('/article/edit/1', function (req, res, next) {
    res.render('edit', {title: 'Express'});
});



module.exports = router;
