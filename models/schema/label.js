"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var labelSchema = new Schema({
        articleId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Article'}], //has many
        label: {type: String}
    }, {
        timestamps: true
    }
);

mongoose.model('Label', labelSchema);