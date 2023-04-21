// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var shareCVSchema = mongoose.Schema({
    TilteCV :String,
    TypeCV: String,
    DateUpload :String,
    FileCV : String,
    Area :String,
    DetailCV :String,
    EmailUngVien:String,
    PhoneUngVien:String,
    PassDelete :String,
    StatusChecking:String,
    url_short:String,
    more:{
        id_author:String,
        name_author:String,
        status_pending:false
    },
    clicks: {
        type : Number,
        require : true, 
        default: 0
    },
    Data_Interactive:[{
        Date:String,
        Detail_history_Interactive:[]
    }]
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('ShareCV', shareCVSchema);
