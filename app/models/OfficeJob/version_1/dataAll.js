// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var galaxydrDataFillterSchema = mongoose.Schema({
    NameNhanSu :String,
    PhoneNhanSu :String,
    EmailNhanSu :String,
    NguonNhanSu :String,
    DiachiNhanSu :String
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('DataFillter', galaxydrDataFillterSchema);
