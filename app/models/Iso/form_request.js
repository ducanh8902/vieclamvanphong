
var mongoose = require('mongoose');
var Iso_form_recuitment = mongoose.Schema({
    Info_head:{
        _id_custom:String,
        Center_send_request:String,
        Date_request:String,
        Purpose: String,
        Vacancies:String,
        Project_new:String,
    },
    Info_request:[{
        Group_request:String,
        Recruitment_requirements:String,
        Vacancies:String,
        Training_Day:String,
        Headcount:Number,
        Headcount_approve:Number,
        Note_Status:String,
        sort:String
    }],
    Info_confirm:{
        Confirm_Request_Sender:String,
        Confirm_Director_Center:String,
        Confirm_Recuitment_Teamleader:String,
        Confirm_HR_Director:String,
    },
    Fillter_Year:String,
    Fillter_Month:String,
    Fillter_Date:String,
    Report:{
        Date_report:String,
        Title:String,
        Plan:[],
        final_report:String,
        solution:String,
    },
    Scan:{
        url:String,
    }
 })
module.exports = mongoose.model('Iso_form_recuitments',Iso_form_recuitment);
