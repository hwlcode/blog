var express = require('express');
var co = require('co');
var userModel = require('../models').UserModel;
var router = express.Router();

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

module.exports = function (passport) {
    router.get('/profile', ensureAuthenticated, function(req, res){
        // res.render('account', { user: req.user });
    });

    router.get('/login', function(req, res){
        res.render('login', { user: req.user });
    });

    router.get('/auth/github',
        passport.authenticate('github', { scope: [ 'user' ] }),
        function(req, res){

        });

    router.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function(req, res) {
            if(res && res.req.user){
                var userObj = res.req.user._json;
                var blogUser = {}

                blogUser.username = userObj.name;
                blogUser.avatar = userObj.avatar_url;
                blogUser.email = userObj.email;

                if(userObj.name == '尚学'){
                    blogUser.isAdmin = true;
                }else{
                    blogUser.isAdmin = false;
                }
                blogUser.sourceType = 'github';
                blogUser.sourceTypeId = userObj.id;
                co(function *() {
                    var user = yield userModel.findOne({sourceTypeId: userObj.id}).exec();

                    if(user == null){
                        var userMsg = yield userModel.create(blogUser);

                        req.session.user = userMsg;
                        yield res.redirect('/');
                    }else{
                        req.session.user = user;
                        yield res.redirect('/');
                    }
                });
            }
        });

    router.get('/auth/qq',
        passport.authenticate('qq' ,{session: false}),
        function(req, res){
            // The request will be redirected to qq for authentication, so this
            // function will not be called.
        });

    router.get('/auth/qq/callback',
        passport.authenticate('qq', {
            failureRedirect: '/login',
            session: false
        }), function(req, res) {
            if(res && res.req.user){
                var userObj = res.req.user._json;
                var blogUser = {}

                blogUser.username = userObj.nickname;
                blogUser.avatar = userObj.figureurl_qq_2;
                blogUser.email = '';

                if(userObj.nickname == '勇敢的心'){
                    blogUser.isAdmin = true;
                }else{
                    blogUser.isAdmin = false;
                }
                blogUser.sourceType = 'qq';
                blogUser.sourceTypeId = res.req.user.id;
                co(function *() {
                    var user = yield userModel.findOne({sourceTypeId: res.req.user.id}).exec();
                    if(user == null){
                        var userMsg = yield userModel.create(blogUser);
                        req.session.user = userMsg;
                        yield res.redirect('/');
                    }else{
                        req.session.user = user;
                        yield res.redirect('/');
                    }
                });
            }
        });

    router.get('/logout', function(req, res){
        req.session.user = null;
        req.logout();
        res.redirect('/');
    });

    return router;
};

