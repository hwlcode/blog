"use strict";
var mongoose = require('mongoose');
var ENV = require('../evn');

mongoose.connect('mongodb://127.0.0.1:27017/'+ENV.db, {useMongoClient: true}, function(err){
    if (err) {
        console.error('connect to %s error: ', 'mongodb://127.0.0.1:27017/'+ENV.db, err.message);
        process.exit(1);
    }
});

require('./schema/discuss');
require('./schema/label');
require('./schema/topic');
require('./schema/user');

module.exports = {
    DiscussModel: mongoose.model('Discuss'),
    LabelModel: mongoose.model('Label'),
    TopicModel: mongoose.model('Topic'),
    UserModel: mongoose.model('User')
}
