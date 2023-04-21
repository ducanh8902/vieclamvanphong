// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var google_account_mail = mongoose.Schema({
  Email:String,
  Password:String,
  FillterDate:String,
  FillterMonth:String,
  FillterYear:String,
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('google_account_mail', google_account_mail);
