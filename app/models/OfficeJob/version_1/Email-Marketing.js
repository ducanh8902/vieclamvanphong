// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var EmailTemplateMarketingSchema = mongoose.Schema({
    DataTemplateEmailMarketing:{
            DataMarketing:String,
            data:[],
    },
    
    History_UserUseds:[{
            EmailUser:String,
            PassWordApplicant:String,
            DateUsed:String,
            DataUserUsed:String,
    }],
    clicks: {
        type : String,
        require : true, 
        default: 0
    },
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('EmailTemplateMarketingSchema', EmailTemplateMarketingSchema);
