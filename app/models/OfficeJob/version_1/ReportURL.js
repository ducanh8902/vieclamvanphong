// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var ReportURLsSchema = mongoose.Schema({
    RouteURL:String,
    TotalClicks : String,
    Data:[]
 })
module.exports = mongoose.model('ReportURLs', ReportURLsSchema);
