
var mongoose = require('mongoose');
var newappliSchema = mongoose.Schema({
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
    FillterNam :String, 
    Interview:{
        Bophan:String,
        Nhom:String,
        NameInterviewer: String,
        ResultInterview: String,
        TrainingDay: String,
        CommentInterview :String,
        point_interview:{
            point_major:Number,
            point_creation:Number,
            point_mission:Number,
            point_learning:Number,
            point_positive:Number,
        }
    },
    Hoso:{
        tangca:String,
        CheckStatus :String,
    },
    Nguoithan:{
        hovaten: String,
        sodienthoai:String,
        Quanhe:String,
        Diachi:String,
    },
    hosonhanluong:{
        DiachiCMND:String,
        SotaikhoanVPBank:String,
        ChinhanhVPbank:String,
        SoBHXH:String,
        CMNDcu:String,
        SoSoHoKhau:String,
        SoCMNDChuHo:String,
        MaSoThue:String,
        chukydientu:String,
    },fileAttach:{
        url:String,
        contentType:String,
    },QRcode:{
        LinkuploadScanTTUV:String,
        LinkImage : String,
        TitleQRCode:String,
        ImageScanTTUV :[]
    },
    iso:{
        Form_interview_letter:[{
            url:String,
            contentType:String,
        }],
        Form_Thanks_letter:[{
            url:String,
            contentType:String,
        }],
        Form_result_interview:[{
            url:String,
            contentType:String,
        }]
    },
    authencation:{
        token:String,
        Password:String,
    },
    system :{
        Detect_system : String,
        header:String,
        url_employer:String,
    }

 })

// create the model for users and expose it to our app
module.exports = mongoose.model('newAppy', newappliSchema);
