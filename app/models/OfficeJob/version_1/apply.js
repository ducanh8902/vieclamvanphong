// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var applySchema = mongoose.Schema({
    idJobNTD:String,
    idNTV:String,
    idNTD:String,
    DayAplly :String,
    hourAplly :String,
    infoNTV:{
            NameNTV :String,
            PhoneNTV :String,
            EmailNTV :String,
            AddressNTV :String,
            _idNTV :String,
    },
    infoNTD:{
            NamejobNTD :String,
            NameUserNTD :String,
            SalaryNTD :String,
            AddressNTD :String,
            ImageJobNTD :String,
            idjobpostNTD :String,
            DaypostNTD :String,
            typejobNTD:String,
            _idNTD :String,
}
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('Apply', applySchema);
