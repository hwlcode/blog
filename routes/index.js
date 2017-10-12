var express = require('express');
var router = express.Router();
var Models = require('../models');
var TopicModel  = Models.TopicModel;
var UserModel = Models.UserModel;
var LabelModel = Models.LabelModel;
var DiscussModel = Models.DiscussModel;
var ObjectId = require('mongodb').ObjectID;
var marked = require('marked');
var moment = require('moment');
const co = require('co');
moment.locale('zh-cn');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/users/login')
}

router.get('/', function (req, res, next) {
    co(function *() {
        var user  = yield UserModel.findOne({sourceTypeId: req.session.passport && req.session.passport.user}).exec();
        var tags = yield LabelModel.find().exec();

        let total = yield TopicModel.count(); //总条数
        let limit = 15;
        let page = parseInt(req.query.p) || 1;
        let skip = (page - 1) * limit;
        let pageNum = Math.floor(total/limit) > 1 ? Math.floor(total/limit) : 1;

        let opts = [{
            path   : 'poster', //关联的字段
            select : 'username' //需要取得的字段
        },{
            path   : 'topics',
            select : 'label'
        }];

        yield TopicModel.find().populate(opts).skip( skip ).limit( limit ).sort({createdAt: -1}).exec(function(err,populatedDoc) {
            for(var i = 0; i < populatedDoc.length; i++){
                populatedDoc[i].created = moment(new Date(populatedDoc[i].createdAt)).fromNow();
                populatedDoc[i].post = populatedDoc[i].post.split('<!--more-->')[0];
            }

            var pageList = function () {
                var pageList = [];
                for (i = 1; i <= pageNum; i++) {
                    pageList.push(i);
                }
                return pageList;
            }

            var isFirst = function () {
                return page - 1 == 0 ? true : false;
            }

            var isLast = function () {
                return ((page - 1) * 10 + populatedDoc.length) == total ? true : false;
            }

            var prev = function () {
                return page > 1 ? page - 1 : 1;
            }

            var next = function () {
                return page < pageNum ? page + 1 : pageNum;
            }
             res.render('index', {
                 user: user,
                 tags: tags,
                 articles: populatedDoc,
                 latest: populatedDoc.slice(0,5),
                 total: total,
                 current: page,
                 pageNum: limit,
                 page: pageList(),
                 first: isFirst(),
                 last: isLast(),
                 prev: prev(),
                 next: next()
            });
        });

    });
});

router.get('/post', ensureAuthenticated, function (req, res, next) {
    co(function *() {
        var user  = yield UserModel.findOne({sourceTypeId: req.session.passport && req.session.passport.user}).exec();
        yield res.render('post', {
            user: user
        });
    });
});

router.post('/post', ensureAuthenticated, function (req, res, next) {
    var body = JSON.parse(req.body.data);
    body.post = marked(body.post);

    co(function *() {
        //保存用户ID
        var user = yield UserModel.findOne({sourceTypeId: req.session.passport.user}).exec();
        body.poster = user._id;
        var post = yield TopicModel.create(body);

        //保存tags
        var topics = body.tags;
        for(var i = 0; i < topics.length; i++){
            var obj = {
                label: topics[i].tag
            }
            var topic = yield LabelModel.findOrCreate(obj);
            topic.doc.articleId.push(post._id);
            yield topic.doc.save();

            post.topics.push(topic.doc._id);
            yield post.save();
        }
        yield res.json({
            code:0,
            msg: 'success'
        });
    })
});

router.get('/article/:id', function (req, res, next) {
    var id = new ObjectId(req.params.id);

    co(function *() {
        var user  = yield UserModel.findOne({sourceTypeId: req.session.passport && req.session.passport.user}).exec();
        var tags = yield LabelModel.find().exec();
        var latest = yield TopicModel.find().limit( 5 ).sort({createdAt: -1}).exec();
        latest.map(function (item) {
            item.created = moment(new Date(item.createdAt)).fromNow();
        });

        let article = yield TopicModel.findOne({_id: id}).exec(function(err,doc){

            var opts = [{
                path   : 'poster',
                select : 'username'
            },{
                path   : 'topics',
                select : 'label'
            },{
                path   : 'discuss',
                options: {sort: {createdAt: -1}},
                populate: {
                    path: 'user'
                }
            }];

            doc.populate(opts, function(err, populatedDoc) {
                console.log(populatedDoc);
                populatedDoc.created = moment(new Date(populatedDoc.createdAt)).fromNow();

                populatedDoc.discuss.map(function (item, index) {
                    item.created = moment(new Date(item.createdAt)).fromNow();
                    item.floor = populatedDoc.discuss.length - index;
                });
                res.render('article', {
                    article: populatedDoc,
                    user: user,
                    tags: tags,
                    latest: latest
                });
            });
        });

        //变更pv
        TopicModel.findByIdAndUpdate({_id: id}, {
            $inc: {pv: 1}
        }).exec();
    });
});

router.get('/article/edit/:id', function (req, res, next) {
    co(function *() {
        var user  = yield UserModel.findOne({sourceTypeId: req.session.passport && req.session.passport.user}).exec();
        var tags = yield LabelModel.find().exec();
        var latest = yield TopicModel.find().limit( 5 ).sort({createdAt: -1}).exec();

        yield res.render('edit', {
            user: user,
            tags: tags,
            latest: latest
        });
    });
});

router.get('/tag/:id', function (req, res, next) {
    var id = new ObjectId(req.params.id);

    co(function *() {
        var user  = yield UserModel.findOne({sourceTypeId: req.session.passport && req.session.passport.user}).exec();
        var tags = yield LabelModel.find().exec();
        var latest = yield TopicModel.find().limit( 5 ).sort({createdAt: -1}).exec();
        latest.map(function (item) {
            item.created = moment(new Date(item.createdAt)).fromNow();
        });

        yield  LabelModel.findOne({_id: id}).populate({
            path: 'articleId',
            populate: [{
                path   : 'poster'
            },{
                path   : 'topics'
            }]
        }).exec(function (err, docPopulate) {
            console.log(docPopulate);
            docPopulate.articleId.map(function (item) {
                item.post = item.post.split('<!--more-->')[0];
                item.created = moment(new Date(item.createdAt)).fromNow();
            });
            res.render('index', {
                title: docPopulate.label+' 列表页面',
                user: user,
                tags: tags,
                latest: latest,
                articles: docPopulate.articleId
            });
        });
    });
});

router.get('/topic/:name', function (req, res, next) {
    var id = req.params.name;

    co(function *() {
        var user  = yield UserModel.findOne({sourceTypeId: req.session.passport && req.session.passport.user}).exec();
        var tags = yield LabelModel.find().exec();
        var latest = yield TopicModel.find().limit( 5 ).sort({createdAt: -1}).exec();
        latest.map(function (item) {
            item.created = moment(new Date(item.createdAt)).fromNow();
        });

        var opts = [{
            path   : 'poster',
            select : 'username'
        },{
            path   : 'topics',
            select : 'label'
        }];

        yield TopicModel.find({cate: id}).populate(opts).sort({createdAt: -1}).exec(function(err, populatedDoc) {
            populatedDoc.map(function (item) {
                item.post = item.post.split('<!--more-->')[0];
                item.created = moment(new Date(item.createdAt)).fromNow();
            });

            res.render('index', {
                articles: populatedDoc,
                user: user,
                tags: tags,
                latest: latest
            });
        });
    });
});

router.get('/topic/s/:name', function (req, res, next) {
    var id = req.params.name;

    co(function *() {
        var user  = yield UserModel.findOne({sourceTypeId: req.session.passport && req.session.passport.user}).exec();
        var tags = yield LabelModel.find().exec();
        var latest = yield TopicModel.find().limit( 5 ).sort({createdAt: -1}).exec();
        latest.map(function (item) {
            item.created = moment(new Date(item.createdAt)).fromNow();
        });

        var opts = [{
            path   : 'poster',
            select : 'username'
        },{
            path   : 'topics',
            select : 'label'
        }];

        yield TopicModel.find({subCate: id}).populate(opts).sort({createdAt: -1}).exec(function(err, populatedDoc) {
            populatedDoc.map(function (item) {
                item.post = item.post.split('<!--more-->')[0];
                item.created = moment(new Date(item.createdAt)).fromNow();
            });

            res.render('index', {
                articles: populatedDoc,
                user: user,
                tags: tags,
                latest: latest
            });
        });
    });
});

router.get('/about', function (req, res, next) {
    res.render('about',{});
});

router.post('/discuss', function (req, res, next) {
    var body = req.body;
    var discussMsg = marked(body.discuss);
    var articleId = body.id;

    co(function *() {
        var user = yield UserModel.findOne({sourceTypeId: req.session.passport.user}).exec();
        var discuss = yield DiscussModel.create({
            post: discussMsg,
            topics: articleId,
            user: user._id
        });

        user.discuss.push(discuss._id);
        user.save();

        var article = yield TopicModel.findOne({_id: new ObjectId(articleId)}).exec();
        article.discuss.push(discuss._id);
        article.discussNum += 1;
        article.save();

        yield res.json({
            code: 0,
            msg: 'success'
        });
    })
});

module.exports = router;
