// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var EmailSchema = mongoose.Schema({
    header:String,
    footer:String,
    NameEmail:String,
    CreateDate:String,
    AttachFile:{
        url:String,
        contenType:String,
    }
 })
module.exports = mongoose.model('Email', EmailSchema);
