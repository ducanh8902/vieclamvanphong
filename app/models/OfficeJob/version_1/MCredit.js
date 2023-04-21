// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var newapplicationSchema = mongoose.Schema({
    NameUT :String, // Done
    Avata:String,// Done
    Gioitinh :String, // Giới Tính
    Honnhan :String,// Tình Trạng Hôn nhân
    Ngaysinh :String,//Done
    Quequan :String, // Done
    Noisinh :String,// Done
    CMND :String,// Done
    NCCMND :String, //Done
    NgayCCMND :String,// Done
    PhoneUT :String,// Done
    EmailUT :String,// Done
    DCTT :String,// Done
    DCLL :String,// Done
    TrinhDoHocVan:String,
    Gioithieu :String,// Giới thiệu bản thân
    BMLV :String,// Mong muốn làm việc tại khu vực
    vitriungtuyen :String,// Ứng tuyển vị trí
    Noxau :String,// Có nợ xấu hay không 
    hoctap :String,// Trình độ học vấn
    Kinhnghiem :String,// Kinh Nghiệm làm việc
    Giadinh :String,// Thông tin gia đình
    DateTime :String,// Ngày Nộp hồ sơ
    Time :String,// Thời gian nộp hồ sơ
    FiffterNgay :String, //Lọc Theo ngày
    FiffterThang :String,//Lọc theo Tháng
    FillterNam :String,// Lọc theo Năm
    Interview:{
        Bophan:String,
        Nhom:String,
        NameInterviewer: String,
        ResultInterview: String,
        TrainingDay: String,
        CommentInterview :String,
    }
    ,fileAttach:{
        url:String,
        contentType:String,
    },QRcode:{
        LinkImage : String,
        TitleQRCode:String,
        ImageScanTTUV:{
            url:String,
            contentType:String,
        }
    }

 })

// create the model for users and expose it to our app
module.exports = mongoose.model('newAppyMCcredit', newapplicationSchema);
