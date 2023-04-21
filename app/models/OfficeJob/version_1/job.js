// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var jobSchema = mongoose.Schema({
    idjobpost :String,
    Namejob  :String,
    Daypost :String,
    typejob:String,
    chuyennganh:String,
    NameUser :String,
    Salary :String,
    Address:String,
    Detailjob :String,
    ImageJob :String,
    hourpost:String,
    FiffterNgay:String,
    FiffterThang:String,
    FillterNam:String,
    _more_info:{
        _email_author:String,
        _authencation_password:String,
        _url_short:String,
    }
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('Job', jobSchema);
