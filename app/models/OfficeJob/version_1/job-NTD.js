// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var jobNTDSchema = mongoose.Schema({
    idjobpost :String,
    Daypost :String,
    _info_job:{
        _namejob:String,
        _company_name:String,
        _Salary :String,
        _Address:String,
        _Detailjob :String,
        _Area:String,
        _Field:String,
        _type_job:String,
    },
    _more_info:{
        _email_author:String,
        _authencation_password:String,
        _url_short:String,
        _job_active:false
    },
    filter:{
        hourpost:String,
        FiffterNgay:String,
        FiffterThang:String,
        FillterNam:String,
    },
    FileAttachs:{
        image:{
            url:String,
            contentType:String,
        },
        pdf:{
            url:String,
            contentType:String,
        }
    },
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('JobNTD', jobNTDSchema);
