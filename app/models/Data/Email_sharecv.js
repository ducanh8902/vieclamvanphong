// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var share_cv = mongoose.Schema({
  Email:String,
  Date_time:String,
  FillterDate:String,
  FillterMonth:String,
  FillterYear:String,
  History_send:[]
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('share_cv', share_cv);
