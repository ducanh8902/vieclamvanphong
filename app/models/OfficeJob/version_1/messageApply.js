// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var applyMessageSchema = mongoose.Schema({
    idTintuyendung :String,
    DayAplly :String,
    hourAplly :String,
    infoNTV:{
        TilteApply: String,
        NameUV : String,
        Email : String,
        Phone :String,
        Message:String,
        fileAttach:String,
    },
    infoNTD:{
            idNTD:String,
           
}
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('ApplyMessage', applyMessageSchema);
