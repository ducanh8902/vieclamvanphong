// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var TrainingSchema = mongoose.Schema({
    KhoaTrain :String,
    DataTraining:[],
    Bophan:String,
    DateTime:String,
    FiffterNgay :String,
    FiffterThang :String,
    FillterNam :String,
    Scan:{
        url:String,
    }
 })

// create the model for users and expose it to our app
module.exports = mongoose.model('TrainingClass', TrainingSchema);
