// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var QRCODESchema = mongoose.Schema({
  Titel:String,
  Link:String,
  dataImageQRcode :String,
  createDate:String,
   clicks: {
    type : String,
    require : true, 
    default: 0
   }
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('QRcode', QRCODESchema);
