// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var InterviewTNDSchema = mongoose.Schema({
            Vitriungtuyen:String,
            NgayPhongVan: String,
            DateNhanViec:String,
            KetQuaPhongVan:String,
            KetQuaNhanViec:String,
            Comment:String,
            NameUngVienPhongVan: String,
            NgaySinh :String,
            SoCMND :String,
            Email :String,
            SoDienThoai:String,
            DiacChiUngVien:String,
            NguonTuyenDung :String,
            ImageUngVien:String,
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('InterviewTND', InterviewTNDSchema);
