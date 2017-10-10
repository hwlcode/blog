var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var qqStrategy = require('passport-qq').Strategy;
var ENV = require('./evn');
var User = require('./models').UserModel;

passport.serializeUser(function(user, done){
    //把passport返回的user的id存入session当中
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    //当需要用到user时，使用ID查出数据当中的用户信息,sourceTypeId是数据当中存储的字段名
    //取的时候用：req.session.passport = { user: '****' }
    //serializeUser与deserializeUser是专门用来处理session的，其他地方无需要再处理session
    User.findOne({sourceTypeId: id}, function(err, user){
        done(err, user)
    })
})

/**
 * github API
 */
passport.use(new GitHubStrategy({
        clientID: ENV.passport.github.GITHUB_CLIENT_ID,
        clientSecret: ENV.passport.github.GITHUB_CLIENT_SECRET,
        callbackURL: "/users/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

/**
 * QQ API
 */
passport.use(new qqStrategy({
        clientID: ENV.passport.qq.clientID,
        clientSecret: ENV.passport.qq.clientSecret,
        callbackURL: "/users/auth/qq/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

module.exports = passport;