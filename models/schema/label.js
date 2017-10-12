"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var labelSchema = new Schema({
        articleId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}], //has many
        label: {type: String}
    }, {
        timestamps: true
    }
);
labelSchema.plugin(findOrCreate);
mongoose.model('Label', labelSchema);