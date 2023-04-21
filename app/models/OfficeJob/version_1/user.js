// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    token:String,
    local            : {
        email        : String,
        password     : String,
        Type :String,
        NameAdmin :String,
        FiffterNgay:String,
        FiffterThang:String,
        FillterNam:String,
        CreateDate :String,
        NTD :{
            NameCompany :String,
            Establish   :String,
            Scale       :String,
            AddressCompany :String,
            NameUser :String,
            Phone :String,
            Email :String,
            map :String,
            DetailCompany:String,
            ImageLogo :String,
            SeenApplicant:String,
            EndDayActive:String,
            DayActive:String,
            SeenApplicant2:String,
            EndDayActive2:String,
            DayActive2:String,
            LinkFB:String,
            LinkLinkedIn :String,
            LinkTiwtter :String,
        },
        NTV :{
            NameUser :String,
            Position:String,
            Phone :String,
            Email :String,
            Address:String,
            Salary:String,
            Academic :String,
            Detail:String,
            TimeEducation :String,
            TitleEducation :String,
            NameSchool :String,
            NameSchool2 :String,
            DetailEducation :String,
            TimeEducation2 :String,
            TitleEducation2:String,
            DetailEducation2 :String,
            TimeWork :String,
            NameCompany :String,
            NameCompany2 :String,
            TitleWork :String,
            DetailWork :String,
            TimeWork2 :String,
            TitleWork2 :String,
            DetailWork2 :String,
            ImageAvata :String,
            ImageMore :String,
            LinkFB :String,
            LinkLinkedIn :String,
            LinkTiwtter :String,
        }
    },
    iso:false,
    Image:{
        url:"",
        contentType:""
    },
    permission:{
        share_cv:false
    }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('User', userSchema);
