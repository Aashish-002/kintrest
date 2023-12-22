var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

uri='mongodb+srv://sam:sam@cluster0.4ml1awv.mongodb.net/'

mongoose.connect(uri);

const userSchema = mongoose.Schema({
    fullname: String,
    username: String,
    name: String,
    password: String,
    email: String,
    profileImage: String,
    contact: Number,
    dob: Date,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'

    }]

});

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);