"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TopicSchema = new Schema({
        cate: { type: String}, //类别
        subCate: {type: String}, //子类
        title: { type:String}, //标题
        post:{type:String}, //正文
        desc: {type: String, default:''}, //预留字段： 描述
        thumbnail: {type: String, default:''}, //预留字段：缩略图
        pv: { type:Number, default: 0}, // 阅读数
        poster: { type: Schema.Types.ObjectId, ref: 'User' }, //has one：发布者
        topics:[{ type: Schema.Types.ObjectId, ref: 'Label' }], //has many：标签
        discussNum: {type: Number, default: 0}, // 评论数
        discuss: [{ type: Schema.Types.ObjectId, ref: 'Discuss' }], //has many：评论
    }, {
        timestamps: true
    }
);

mongoose.model('Topic', TopicSchema);
