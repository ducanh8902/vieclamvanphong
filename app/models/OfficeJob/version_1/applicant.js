// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var newAppyFormSchema = mongoose.Schema({
    OwnerLink:String,
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
    TrinhDoHocVan:String,
    DCLL :String,// Done
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
    },BonusGTNS:{
        StatusCheck:String,
        Step1:{
            Title:String,
            Message:String,
        },
        Step2:{
            FeeApplicant:String,
            StartDay:String,
            DateCheckBonus:String, 
            Title:String,
            Message:String,
        },
        Step3:{
            Title:String,
            Message:String,
            Status:String,
            DateCheckingLan1:String,
        },
        Step4:{
            Title:String,
            Message:String,
            Status:String,
            DateCheckingLan2:String,
        },
        Step5:{
            Title:String,
            Message:String,
            FeeApplicant:String,
            Status:String,
            DateChecking:String,
        },
    }
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('newAppyForm', newAppyFormSchema);
