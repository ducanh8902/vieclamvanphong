// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var ip_block = mongoose.Schema({
  _ip_block:String,
 })
// create the model for users and expose it to our app
module.exports = mongoose.model('ip_block', ip_block);
