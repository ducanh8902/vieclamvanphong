// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var CV_UngVienSchema = mongoose.Schema({
  Name :String,
  result: {
    file_id: String,
    file_unique_id: String,
    file_size: String,
    file_path: String
  },
  token_id:String,
  url_public:String,
  bot:String,
  date:String,
  info_file:{
    Name_UngVien:String,
    Phone:String,
    Email:String,
    ShareCV:String,
    Note:String,
  }
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('CV_UngVien', CV_UngVienSchema);
