// load the things we need
var mongoose = require('mongoose');
const shortId = require('shortid')
// define the schema for our user model
var shortURLSchema = mongoose.Schema({
  Titel:String,
  ImageQR:String,
  createDate:String,
   full: {
    type : String,
    require : true, 
   },
   short: {
    type : String,
    require : true, 
    default:  shortId.generate
   },
   clicks: {
    type : String,
    require : true, 
    default: 0
   },
   Soluong : Number,
   body:{
    Title:String,
    Description:String,
    Keywords:String,
    url_image:String,
    image_alt:String,
   },
   meta_tag:{
      code_center:String,
      code_url:String,
      Title:String,
      Description:String,
      Keywords:String,
      url_image:String,
      image_alt:String,
   },
   Data_Interactive:[{
    Date:String,
    Detail_history_Interactive:[]
  }],
  type_url:{
    share_cv:false,
    applicant:false,
    project_job:false,
  },
  _author:{
    _string_code:String,
    _email_author:String,
  }
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('shortUrl', shortURLSchema);
