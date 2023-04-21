// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var employee_data = mongoose.Schema({
    result:[{
        Name_data :String,
        dob_data:String,
        phone_data:String,
        email_data:String,
        address_data:String,
        date_data:String,
        sort_month:Number,
        sort_year:Number
    }],
    Report:[],
    head :{
        Data_Name:String,
        Count_element :Number,
        Date_create:String,
    }
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('employee_data', employee_data);
