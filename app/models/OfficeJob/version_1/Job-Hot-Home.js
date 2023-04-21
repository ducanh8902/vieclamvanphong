// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var jobHotNTDSchema = mongoose.Schema({
    IdJobNTD:String,
    NameJobNTD:String,
    DateJobNTD:String,
    NameCompany:String,
    TypeJobNTD:String,
    AvataJobNTD:String,
    Adrees:String,
    SalaryJobNTD:String,
    Recruitment_field:String,
    id_ntd:String,
    image_job:String,
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('JobHotNTD', jobHotNTDSchema);
