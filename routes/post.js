var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

uri='mongodb+srv://sam:sam@cluster0.4ml1awv.mongodb.net/'

mongoose.connect(uri);

var postSchema = mongoose.Schema({
    postText: {
        type: String,

    },
    discription: {
        type: String,

    },
    posts: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});



module.exports = mongoose.model('Posts', postSchema);