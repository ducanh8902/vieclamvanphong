// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var tindangtuyendungSchema = mongoose.Schema({
    Title :String,
    NameCompany :String,
    FileJD:String,
    Detail :String,
    DetailInterview:String,
    FiffterNgay:String,
    FiffterThang:String,
    FillterNam:String,
    meta_tag:{
        code_center:String,
     }
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('TinDang', tindangtuyendungSchema);
