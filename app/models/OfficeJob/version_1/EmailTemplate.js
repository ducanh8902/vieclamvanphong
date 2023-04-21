// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var EmailTemplateSchema = mongoose.Schema({
    TitleEmail:String,
    DetailEmail: String,
    imageEmail:String,
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('TemplateEmail', EmailTemplateSchema);
