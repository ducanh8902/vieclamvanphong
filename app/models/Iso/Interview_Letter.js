// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var Interview_Letter_Schema = mongoose.Schema({
    HoVaTen:String,
    Vacancies:String,
    Time_Interview :String,
    Date_Interview :String,
    Address_Company:String,
    Contact:{
        Hotline:String,
        Email:String,
        Name:String,
    },
    Date_time_short:Date,
 })
 
    
module.exports = mongoose.model('interview_letter', Interview_Letter_Schema);

