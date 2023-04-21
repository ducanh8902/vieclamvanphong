// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var HotNTDSchema = mongoose.Schema({
    IdNTD :String,
    NameCompany:String,
    AvataJobNTD:String,
    Adrees:String,
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('HotNTD', HotNTDSchema);
