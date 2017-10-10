var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var qqStrategy = require('passport-qq').Strategy;
var ENV = require('./evn');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

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
        done(null, profile);
    }
));

module.exports = passport;