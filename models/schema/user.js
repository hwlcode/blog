"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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

mongoose.model('User', UserSchema);