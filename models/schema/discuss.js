"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DiscussSchema = new Schema({
        poster: { type:String}, //发布者
        avatar: {type: String}, //发布者头像
        post: {type: String}, // 正文
        topics: {type: Schema.Types.ObjectId, ref: 'Topic'}, //has one: 文章ID
        user: {type: Schema.Types.ObjectId, ref: 'User'}, //has one: 用户ID
    }, {
        timestamps: true
    }
);

mongoose.model('Discuss', DiscussSchema);