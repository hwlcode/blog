"use strict";
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog', {useMongoClient: true}, function(err){
    if (err) {
        console.error('connect to %s error: ', 'mongodb://localhost:27017/blog', err.message);
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
