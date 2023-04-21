// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var CreateFormSchema = mongoose.Schema({
    IDUserCreate:String,
    TitleForm :String,
    LogoForm:{
        url:String,
        contentType:String,
    },
    TypeForm:String,
    UrlForm:String,
    UrlShort:String,
    VitriUngTuyen:[{
        NameJob:String,
        JD_Url:String,
        contentType:String,
        infomation:String
    }],
    TypeJob:[{
        titleType:String,
    }],
    DataCreate:String,
    Source :String,
    History:[{
        Title:String,
        Message:String,
        DateHistory:String,
    }],
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('CreateForm', CreateFormSchema);
