"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate')

var UserSchema = new Schema({
        username: { type:String},
        password: { type:String, default: null},
        avatar: {type: String},
        email: { type:String},
        isAdmin:{ type:Boolean, default: null},
        sourceType:{ type:String},
        sourceTypeId:{ type:String},
        posts : [{ type: Schema.Types.ObjectId, ref: 'Article' }], //has many
        discuss : [{ type: Schema.Types.ObjectId, ref: 'Discuss' }] //has many
    }, {
        timestamps: true
    }
);
//添加findorcreate插件
UserSchema.plugin(findOrCreate);
mongoose.model('User', UserSchema);