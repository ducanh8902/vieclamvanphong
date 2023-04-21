// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var LogsURLSchema = mongoose.Schema({
  RouteURL:String,
  Title:String,
  Data:[],
  clicks: {
    type : String,
    require : true, 
    default: 0
   }
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('Logs', LogsURLSchema);
