// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var EmailTemplateSharecvSchema = mongoose.Schema({
    header:String,
    footer:String,
    NameEmail:String,
    CreateDate:String,
    ListNTD:[{
        Name:String,
        NameCompany:String,
        EmailAdress:String,
        Specialized:String,
        Adress:String,
    }]
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('EmailTemplateSharecvSchema', EmailTemplateSharecvSchema);
