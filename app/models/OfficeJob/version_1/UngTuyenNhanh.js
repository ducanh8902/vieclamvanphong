// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var UngTuyenNhanhSchema = mongoose.Schema({
    NameUngVien:String,
    Namsinh:String,
    Vitriungtuyen:String,
    Diachi:String,
    MucLuong:String,
    ChuyenNganh:String,
    Hinhthuc:String,
    fileAttach:{
        url:String,
        contentType:String
    },
    DateCreate:String,
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('UngTuyenNhanh', UngTuyenNhanhSchema);
