
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
process.env.TZ = 'Asia/Ho_Chi_Minh';
const http = require('http');
const cors = require('cors');
app.use(cors());
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 10000,
  max: 10000,
  message: `Vui lòng thử lại sau một khoảng thời gian sau`,
  handler: function (req, res /*, next*/) {
    res.render("View-profile/limit-request.ejs");
  }
})
app.use(limiter);
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
var session = require('express-session');
var nodeExcel = require('excel-export');
const User = require('./app/models/OfficeJob/version_1/user.js');
const UngTuyenNhanh = require('./app/models/OfficeJob/version_1/UngTuyenNhanh.js');
const interview = require('./app/models/OfficeJob/version_1/manager-interview.js');
const apply = require('./app/models/OfficeJob/version_1/apply.js');
const QRcode = require('./app/models/OfficeJob/version_1/QRcode.js');
const CreateForm = require('./app/models/OfficeJob/version_1/create-form-ungtuyen.js');
const MessageApplys = require('./app/models/OfficeJob/version_1/messageApply.js')
var tindang = require("./app/models/OfficeJob/version_1/tindang-tuyendung.js");
const newApplyUT = require('./app/models/OfficeJob/version_1/new-application.js');
const dataFillter = require('./app/models/OfficeJob/version_1/dataAll.js')
const newApplicant = require('./app/models/OfficeJob/version_1/applicant.js');
const JobNTD = require('./app/models/OfficeJob/version_1/job-NTD.js');
const HotJobNTD = require('./app/models/OfficeJob/version_1/Job-Hot-Home.js');
const HotNTD = require('./app/models/OfficeJob/version_1/NTD-Hot-Admin.js');
const ListViecLam = require('./app/models/OfficeJob/version_1/job-NTD.js');
const shareCV = require('./app/models/OfficeJob/version_1/sharecv.js');
const Logs = require('./app/models/OfficeJob/version_1/Logs.js');
const EmailMarketing = require('./app/models/OfficeJob/version_1/Email-Marketing.js');
const iso_form_request = require('./app/models/Iso/form_request.js');
const Email = require('./app/models/OfficeJob/version_1/TemplateEmail.js');
const EmailNTD = require('./app/models/OfficeJob/version_1/Email-sharecv.js');
const ShortUrl = require('./app/models/OfficeJob/version_1/shortURL.js');
const _ip_block_s = require('./app/models/Data/ip_block.js');
const socketio = require('socket.io');
var nodemailer = require('nodemailer');
const server = http.createServer(app);
const io = socketio(server);

var mongoDB = 'mongodb://u8lz2bavbziydgj2feg2:FttSmQny7wHBt5uYJ0ua@bn03ofbrcuny9efwro7r-mongodb.services.clever-cloud.com:2377/bn03ofbrcuny9efwro7r'
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB).then(() => {
  console.log("Connected to Database");
}).catch((err) => {
  console.log("Not Connected to Database! ", err);
});
const crypto = require('crypto');
var multer = require('multer');
const fs = require('fs');
const { GridFsStorage } = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
const conn = mongoose.connection
const storage = new GridFsStorage({
  url: mongoDB,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });
const storagee = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/fileExcel');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
const uploadtest = multer({ storage: storagee });

require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect("/?message=" + encodeURIComponent("loginFail"))
}
function isLoggedInISO(req, res, next) {
  if (req.isAuthenticated() && req.user.iso == true)
    return next();
  res.redirect("/?message=" + encodeURIComponent("iso_loginFail"))
}
function isLoggedInISO_next(req, res, next) {
  if (req.isAuthenticated() && req.user.iso == true)
    return next();
    res.render("View-profile/404.ejs",{ status:404, message: "Không có quyền truy cập" })
}
function isLogged_profile_next(req, res, next) {
  if (req.isAuthenticated())
    return next();
    res.render("View-profile/404.ejs",{ status:404, message: "Không có quyền truy cập" })
}
function getTime(time) {
  let date_ob = new Date(time);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  var d_s = new Date(month+"-"+date+"-"+year);
  const dayname = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];;
  if(dayname[d_s.getDay()] == "Friday"){
    const dayname_s = ['CN','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
    const new_date = date_ob.getDate()+3
    var d = new Date(month+"-"+new_date+"-"+year);
    const date_name = dayname_s[d.getDay()]
    const date_interview = date_name + " Ngày: "+new_date+"/"+month+"/"+year
    return resusltTime = {
      dayname_next:date_interview,
      date: date,
      month: month,
      year: year,
      hours: hours,
      minutes: minutes,
      dateNew: date + "/" + month + "/" + year,
      timeNew: hours + ':' + minutes
    }
  }
  if(dayname[d_s.getDay()] == "Saturday"){
    const dayname_s = ['CN','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
    const new_date = date_ob.getDate()+2
    var d = new Date(month+"-"+new_date+"-"+year);
    const date_name = dayname_s[d.getDay()]
    const date_interview = date_name+ " Ngày: "+new_date+"/"+month+"/"+year
    return resusltTime = {
      dayname_next:date_interview,
      date: date,
      month: month,
      year: year,
      hours: hours,
      minutes: minutes,
      dateNew: date + "/" + month + "/" + year,
      timeNew: hours + ':' + minutes
    }
  }
  if(dayname[d_s.getDay()] == "Sunday"){
    let date_new = date_ob.getDate()+1;
    const date_interview = "Thứ 2"+ " Ngày: "+date_new+"/"+month+"/"+year
    return resusltTime = {
      dayname_next:date_interview,
      date: date,
      month: month,
      year: year,
      hours: hours,
      minutes: minutes,
      dateNew: date + "/" + month + "/" + year,
      timeNew: hours + ':' + minutes
    }
  }
  if(dayname[d_s.getDay()] == "Monday"|| dayname[d_s.getDay()] == "Tuesday"||dayname[d_s.getDay()] == "Wednesday"||dayname[d_s.getDay()] == "Thursday"){
    const dayname_s = ['CN','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
    const new_date = date_ob.getDate()+1
    var d = new Date(month+"-"+new_date+"-"+year);
    const date_name = dayname_s[d.getDay()]
    const date_interview = date_name+ " Ngày: "+new_date+"/"+month+"/"+year
    return resusltTime = {
      dayname_next:date_interview,
      date: date,
      month: month,
      year: year,
      hours: hours,
      minutes: minutes,
      dateNew: date + "/" + month + "/" + year,
      timeNew: hours + ':' + minutes
    }
  }
}
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

async function SaveLog(Link, getT, response, Latitude, Longitude) {
  const token = crypto.randomBytes(64).toString('hex');
  const done = await Logs.findOne({ RouteURL: Link })
  const QRcodenew = require('qrcode')
  if (Latitude == "none" && Longitude == "none") {
    var ImageMap = `https://img.icons8.com/bubbles/100/000000/map-marker.png`
  } else {
    var ImageMap = await QRcodenew.toDataURL(`https://google.com/maps/place/${Latitude}+${Longitude}`)
  }
  if (!done) {
    const NewLog = new Logs()
    NewLog.RouteURL = Link;
    NewLog.Data._id = token,
      NewLog.Data.Time = getT.dateNew,
      NewLog.Data.Date = getT.timeNew,
      NewLog.Data.Khunggio = getT.hours,
      NewLog.Data.Thang = getT.month,
      NewLog.Data.Nam = getT.year,
      NewLog.Data.ip = response.ip,
      NewLog.Data.city = response.city,
      NewLog.Data.region = response.region,
      NewLog.Data.country = response.country,
      NewLog.Data.loc = response.loc,
      NewLog.Data.org = response.org,
      NewLog.Data.postal = response.postal,
      NewLog.Data.timezone = response.timezone,
      NewLog.Data.countryCode = response.countryCode
    NewLog.save()
    return ("Succes create and plus clicks")
  } else {
    Logs.update({ RouteURL: Link }, {
      $push: {
        Data: {
          _id: token,
          Time: getT.dateNew,
          Date: getT.timeNew,
          Khunggio: getT.hours,
          Thang: getT.month,
          Nam: getT.year,
          ip: response.ip,
          city: response.city,
          region: response.region,
          country: response.country,
          loc: response.loc,
          detailloc: {
            Latitude: Latitude,
            Longitude: Longitude
          },
          imageQR: ImageMap,
          org: response.org,
          postal: response.postal,
          timezone: response.timezone,
          countryCode: response.countryCode
        }
      }
    }).exec((err, done) => {
      console.log("Update thành công")
    })
    done.clicks++
    done.save()
    return ("Succes plus clicks")
  }
}
function upTocCase(value) {
  let line = value.toLowerCase().split(' ');
  for (let i = 0; i < line.length; i += 1) {
    line[i] = line[i].slice(0, 1).toUpperCase() + line[i].slice(1);
  }
  return line.join(' ');
}
async function Send_Email(Email,Password,htmlTemplate,ArrlistEmail,subject,attachments){
  var transporters = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
      user: Email,
      pass: Password
    }
  });
  var mailOptions = {
    from: Email,
    to: ArrlistEmail,
    subject: subject,
    html: htmlTemplate,
    attachments:attachments
  };
   transporters.sendMail(mailOptions,function (error, info) {
    if (error) {
      if(error.responseCode == 550 ){
        console.log("Error Code:"+" "+error.responseCode+" "+"Message: Đã đạt giới hạn gửi thư") 
      }
      if(error.responseCode == 553){
        data_sharecv.remove({email:error.recipient}).exec((err,result)=>{
          console.log(result + "Email không hợp lệ :"+ error.recipient)
        });
      }
    } else {
        console.log("Email :"+info.envelope.to)
       timeLeft = 25;
      function countdown() {
        timeLeft--;
        console.log("Next--->Send_Mail--->After :"+timeLeft+"s")
        if (timeLeft > 0) {
          setTimeout(countdown, 1000);
        }
      };

      setTimeout(countdown, 1000);
    }
  })
  
} 
const Save_CV = require('./app/models/OfficeJob/version_1/cv_ung_vien.js')
app.get("/view-log", isLoggedIn, async function (req, res) {
  if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
    Logs.find({}).sort({ _id: -1 }).exec((err, done) => {
      res.render("View-Client/New-Application/log_view.ejs", { data: done })
    })
  } else {
    res.render("View-profile/404.ejs")
  }
})
app.get("/log", async function (req, res) {
  Logs.find().sort({ _id: -1 }).exec((err, done) => {
   
    res.render("View-Client/New-Application/log_view.ejs", { data: done })
  })
})

app.get("/404", function (req, res) {
  res.render("View-profile/404.ejs")
})
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);


app.get("/openai",async(req,res)=>{
  res.render("View-client-v2/Job/openai.ejs")
})


function get_question(){
  const runPrompt = async()=>{
    const prompt = "Tôi tên là gì ?"
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt ,
      max_tokens: 2048,
      temperature: 1,
    })
    console.log(response.data)
  }
  runPrompt()
}
/////////////////////////////////////////////////\\\\
////////////////////////////////////////////////\\\\\\
///////////////////////////////////////////////\\\\\\\\
/////////////////// Cloud Video //////////////////////\\\\\\\\\\

/////////////////////////////////////////////////\\\\
////////////////////////////////////////////////\\\\\\
///////////////////////////////////////////////\\\\\\\\
/////////////////// ISO //////////////////////\\\\\\\\\\

const TrainingClass = require('./app/models/OfficeJob/version_1/TrainingClass.js');

require('./app/ISO/iso_Home/iso_Home.js')(app,isLoggedInISO,);
require('./app/ISO/route/route_request.js')(app,isLoggedIn,iso_form_request,isLoggedInISO_next,User,TrainingClass,upload,getTime);
require('./app/ISO/route/route_interview_letter.js')(app,isLoggedIn,newApplyUT,isLoggedInISO_next,User);
require('./app/ISO/route/route_interview.js')(app,isLoggedIn,newApplyUT,isLoggedInISO_next,User,TrainingClass);
require('./app/ISO/route/route_Thanks_Letter.js')(app,isLoggedIn,newApplyUT,isLoggedInISO_next,getTime,User);
require('./app/ISO/iso_Login/route_login.js')(app,passport,isLoggedInISO);
/////////////////// ISO ////////////////////\\\\\\\\\\\\\\\
///////////////////////////////////////////\\\\\\\\\\\\\\\\\
//////////////////////////////////////////\\\\\\\\\\\\\\\\\\\
/////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\

require("dotenv").config()
const compression = require('compression')
app.use(compression({
  level: 9,
}))

// var token = "5363746487:AAFUZkoC9VGGUyUvNP7Sy2nNL0ELfJgO33A"
// var token_cs = "5360552219:AAE7k3EsWZ6DRjyKZGEQFDfINLqLadj3PLc"
require('./app/Controller/login.js')(app, passport, isLoggedIn);
require('./app/Controller/contact.js')(app, isLoggedIn,);
require('./app/Controller/application.js')(app, isLoggedIn, tindang, newApplyUT, upload, getTime, Email, CreateForm, User, crypto, path, newApplicant, EmailNTD, shareCV, SaveLog, Logs, io,Save_CV,http,upTocCase,ShortUrl,Send_Email);
require('./app/Controller/QRcode.js')(app, isLoggedIn, newApplyUT);
require('./app/Controller/UngVien.js')(app, isLoggedIn, newApplyUT, newApplicant, getTime, nodeExcel, conn, Grid, mongoose, dataFillter, limiter, upload,User);
require('./app/Controller/ShareCV.js')(app, isLoggedIn, shareCV, getTime, upload, Email, EmailNTD, crypto, path, SaveLog, Logs,User,Send_Email,ShortUrl,QRcode,conn, mongoose, Grid,ListViecLam,_ip_block_s,ListViecLam);
require('./app/Controller/EmailMarketing.js')(app, isLoggedIn, shareCV, getTime, upload, Email, EmailNTD, crypto, path, EmailMarketing,Send_Email);
require('./app/Controller/vieclam.js')(app, isLoggedIn, ListViecLam, shuffle, User, upload, MessageApplys, Email, dataFillter, UngTuyenNhanh, getTime,ShortUrl,Send_Email,JobNTD,shareCV);
require('./app/Controller/ctv-tuyendung.js')(app, isLoggedIn, newApplyUT, newApplicant, getTime, nodeExcel, conn, Grid, mongoose);

require('./app/Controller/Home.js')(app, isLoggedIn, getTime, HotJobNTD, HotNTD, shareCV, newApplyUT, shuffle, Email, ShortUrl, ListViecLam, interview, apply, MessageApplys, User, upload, CreateForm, newApplicant, io, dataFillter, JobNTD, SaveLog, Logs, crypto, path);
require('./app/Route/Profile/profile.js')(app, isLogged_profile_next, getTime, HotJobNTD, HotNTD, shareCV, newApplyUT, shuffle, Email, ShortUrl, ListViecLam, interview, apply, MessageApplys, User, upload, CreateForm, newApplicant, io, dataFillter, JobNTD, SaveLog, Logs, crypto, path);

require('./app/Controller/file.js')(app, conn, mongoose, Grid, upload, isLoggedIn);
app.get("/:shortUrl", async (req, res,next) => {
  try{
  var os = require('os');
  var opsys = process.platform;
  const time = getTime(Date.now())
  const shorturl = await ShortUrl.findOne({ short: req.params.shortUrl })
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (shorturl == null) {
    return res.render("View-profile/404.ejs",{message:"Trang không tồn tại"})
  } else {
    const date = time.dateNew
    const detail_time = time.timeNew
    const frames_time = time.hours
    const element_arrData = {
      fullUrl:fullUrl,
      frames_time : frames_time,
      time_click :detail_time,
      system:{
        os:opsys,
        type:os.type(),
        platform:os.platform(),
        release:os.release()
      }
    }
    const arrData = {
      Date:date,
      Detail_history_Interactive:[{
        fullUrl:fullUrl,
        frames_time : frames_time,
        time_click :detail_time,
        system:{
          os:opsys,
          type:os.type(),
          platform:os.platform(),
          release:os.release()
        }
      }]
    }
    const edit_Data_Interactives = await ShortUrl.findOne({short:req.params.shortUrl,"Data_Interactive.Date":date})
    if(edit_Data_Interactives){
      const Set_Data_Interactives = await ShortUrl.update({short:req.params.shortUrl,"Data_Interactive.Date":date},{$push:{"Data_Interactive.$.Detail_history_Interactive":element_arrData}})
      console.log(Set_Data_Interactives)
    }else{
      const Push_Data_Interactives = await ShortUrl.update({short:req.params.shortUrl},{$push:{Data_Interactive:arrData}})
      console.log(Push_Data_Interactives)
    }
    shorturl.clicks++
    shorturl.save()
    res.redirect(shorturl.full)
  }
}catch(err){
  res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
}
})

app.use((req, res, next) => {
  const err = new Error('Trang truy cập không tồn tại hoặc đã quá hạn')
  err.status = 500
  next(err)
})
app.use((err, req, res, next) => {
  res.render('View-profile/404.ejs', { status: err.status || 500, message: err.message })
})


server.listen(port, () => console.log(` ${port}`));
