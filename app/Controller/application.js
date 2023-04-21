const { compose } = require('html-to-formatted-text/dist/utils');
module.exports = function (app, isLoggedIn, tindang, newApplyUT, upload, getTime, Email, CreateForm, User, crypto, path, newApplicant, EmailNTD, shareCV, SaveLog, Logs, io, Save_CV, http, upTocCase, ShortUrl, Send_Email) {
  const TelegramBot = require('node-telegram-bot-api');
var token = "5257101960:AAGg0mpJu_E_SC_2yAf2rCfwsxaCbn6-okQ"
var token_cs = "5246676620:AAEPlB8ewxxYzUAZvcJN1s2DXUI5K6ExN-E"
  app.get("/review_jd=:name", async function (req, res) {
    var jd = await tindang.findOne({  $or: [{ Title: req.params.name}, {FileJD:  req.params.name}] })
    res.render("review_jd.ejs", { jd: jd })
  })
  app.get("/review_telesale", async function (req, res) {
    res.render("View-Client/New-Application/telesale/jd_telesales.ejs")
  })
  app.get("/cv_manager", isLoggedIn, async function (req, res,next) {
    try{
    if (req.user) {
      if (req.user.local.email == "galaxydr@galaxydr.com.vn" || req.user.iso == true) {
        var result = await Save_CV.find().sort({ _id: -1 })
        res.render("iso/cv/cv_manager.ejs", { result: result })
      } else {
        res.render("View-profile/404.ejs", { message: "" })
      }
    } else {
      res.render("View-profile/404.ejs", { message: "" })
    }
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  var useragent = require('express-useragent');
  app.use(useragent.express());
  const QRcode = require('qrcode')
 
  const fs = require("fs")
  app.get("/galaxydr_ung_vien_ung_tuyen=:id", async (req, res,next) => {
    try{
    const http = require('https');
    const saves_cv = await Save_CV.findOne({ _id: req.params.id })
    const radomname = crypto.randomBytes(8).toString('hex');
    const filename = await radomname + saves_cv.result.file_path
    const final_filename = filename.replace("/", "")
    const file = await fs.createWriteStream(`public/Ung_Vien/${final_filename}`);
    const request = await http.get(`https://api.telegram.org/file/bot${saves_cv.url_public}/${saves_cv.result.file_path}`, function (response) {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        res.render("View-profile/review_cv.ejs", { link_response: `${final_filename}`, message: "message" })
      });
    });
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  
  app.get("/update_cv_id=:ids&Name=:Names&Phone=:Phones&Email=:Emails&note=:note", async (req, res,next) => {
    try{
    if (req.user) {
      if (req.user.local.email == "galaxydr@galaxydr.com.vn" || req.user.iso == true) {
        const result = await Save_CV.update({ _id: req.params.ids }, { $set: { "info_file.Name_UngVien": req.params.Names, "info_file.Email": req.params.Emails, "info_file.Phone": req.params.Phones, "info_file.Note": req.params.note } })
        res.json({
          result: 'Done'
        })
      } else {
        res.json({
          result: 'err'
        })
      }
    } else {
      res.json({
        result: 'err'
      })
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.get("/delete_cv_id=:ids", async (req, res,next) => {
    try{
    if (req.user) {
      if (req.user.local.email == "galaxydr@galaxydr.com.vn" || req.user.iso == true) {
        const result = await Save_CV.remove({ _id: req.params.ids })
        res.json({
          result: 'Done'
        })
      } else {
        res.json({
          result: 'err'
        })
      }
    }
    else {
      res.json({
        result: 'err'
      })
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  const bot = new TelegramBot(token, { polling: true });
  const bot_cs = new TelegramBot(token_cs, { polling: true });
  var Roombot = "1258641137" // Bot Tuyển Dụng
  var chatid = "-1001467174178" // Nhóm Tuyển Dụng GalaxyDR
  var chatidcs = "-1001759835564" // Nhóm Phỏng Vấn CS
  var chatidlgl = "-1001778082692" // Nhóm Phỏng Vấn lgl
  var rp = require('request-promise');
  bot_cs.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (chatId != chatid) {
      if (msg.document) {
        const options = {
          method: 'GET',
          uri: `https://api.telegram.org/bot${token_cs}/getFile?file_id=${msg.document.file_id}`,
        };
        rp(options)
          .then(ApiRes => {
            var a = JSON.parse(ApiRes)
            var option = {
              parse_mode: "markdown",
              reply_markup: {
                inline_keyboard: [
                  [{
                    text: "Thông tin ứng viên",
                    url: `https://api.telegram.org/file/bot${token_cs}/${a.result.file_path}`
                  }]
                ]
              }
            }
            bot_cs.sendMessage(chatid, "Ứng Viên Mới Ứng Tuyển.Vui lòng liên hệ ứng viên sắp xếp thời gian phỏng vấn", option)
            var name_bot = "Bot_cs"
            const newCV = new Save_CV()
            newCV.result.file_id = a.result.file_id
            newCV.result.file_unique_id = a.result.file_unique_id
            newCV.result.file_size = a.result.file_size
            newCV.result.file_path = a.result.file_path
            newCV.url_public = token_cs
            newCV.info_file.Name_UngVien = a.result.file_path
            newCV.bot = name_bot
            newCV.date = Date.now()
            newCV.save((err, done) => {
              console.log("Đã lưu thông tin")
            })
          })
      }
    }
  });
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (chatId != chatid) {
      if (msg.document) {
        const options = {
          method: 'GET',
          uri: `https://api.telegram.org/bot${token}/getFile?file_id=${msg.document.file_id}`,
        };
        rp(options)
          .then(ApiRes => {
            var a = JSON.parse(ApiRes)
            var option = {
              parse_mode: "markdown",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Thông tin ứng viên",
                      url: `https://api.telegram.org/file/bot${token}/${a.result.file_path}`
                    }
                  ]
                ]
              }
            }
            bot.sendMessage(chatid, "Ứng Viên Mới Ứng Tuyển.Vui lòng liên hệ ứng viên sắp xếp thời gian phỏng vấn.", option)
            var name_bot = "Bot_td"
            const newCV = new Save_CV()
            newCV.result.file_id = a.result.file_id
            newCV.result.file_unique_id = a.result.file_unique_id
            newCV.result.file_size = a.result.file_size
            newCV.result.file_path = a.result.file_path
            newCV.url_public = token
            newCV.bot = name_bot
            newCV.info_file.Name_UngVien = a.result.file_path
            newCV.date = Date.now()
            newCV.save((err, done) => {
              console.log("Đã lưu thông tin")
            })

          })
      }
    }
  });
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
      user: 'sp.bi.fell@gmail.com',
      pass: 'cficdtpwxlfvqbfj'
    }
  });
  app.get('/nop-don-ung-tuyen', async (req, res,next) => {
    var _time = getTime(Date.now())
    var text = `Lượt truy cập mới tại Nộp Đơn Ứng Tuyển
Thời gian :${_time.timeNew} -${_time.dateNew}
Hệ điều hành : ${req.useragent.os}
Thiết Bị : ${req.useragent.platform}
Trình duyệt:${req.useragent.browser}
Mã truy cập :${req.useragent.source} `
bot.sendMessage(Roombot, text);
    try{
    var os = require('os');
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const time = getTime(Date.now())
    const date = time.dateNew
    const detail_time = time.timeNew
    const frames_time = time.hours
    const element_arrData = {
      fullUrl: fullUrl,
      frames_time: frames_time,
      time_click: detail_time,
      system: {
        type: os.type(),
        platform: os.platform(),
        release: os.release()
      }
    }
    const arrData = {
      Date: date,
      Detail_history_Interactive: [{
        fullUrl: fullUrl,
        frames_time: frames_time,
        time_click: detail_time,
        system: {
          type: os.type(),
          platform: os.platform(),
          release: os.release()
        }
      }]
    }
    const edit_Data_Interactives = await ShortUrl.findOne({ short: "ung-tuyen", "Data_Interactive.Date": date })
    if (edit_Data_Interactives) {
      const Set_Data_Interactives = await ShortUrl.update({ short: "ung-tuyen", "Data_Interactive.Date": date }, { $push: { "Data_Interactive.$.Detail_history_Interactive": element_arrData } })
      
    } else {
      const Push_Data_Interactives = await ShortUrl.update({ short: "ung-tuyen" }, { $push: { Data_Interactive: arrData } })
    
    }
    var code_url = req.query.code_url
    var result_tindang = await tindang.find({}).sort({ _id: -1 })
    var count_result_tindang = await tindang.count({})
    const user = "";
    if (code_url) {
      const shorturl = await ShortUrl.findOne({ "meta_tag.code_url": code_url })
      if (shorturl) {
        var Title = shorturl.meta_tag.Title
        var description = shorturl.meta_tag.Description
        var keywords = shorturl.meta_tag.Keywords
        var url_image = shorturl.meta_tag.url_image
        var image_alt = shorturl.meta_tag.image_alt
        res.render('View-Client/New-Application/application.ejs', {
          fullUrl: fullUrl,
          user: user,
          linkmeta: "https://tuyendung.me/nop-don-ung-tuyen",
          Title: Title,
          description: description,
          image_alt: image_alt,
          keywords: keywords,
          url_image: url_image,
          resultTinDang: result_tindang,
          messagee: "",
          message: ""
        });
      } else {
        var Title = "Nộp Đơn Ứng Tuyển"
        var description = "Liên Hệ : 093.18.666.98 Đức Anh"
        var keywords = "Applicant"
        var url_image = "https://tuyendung.me/galaxydr-logo.jpg"
        var image_alt = "Image_applicantion"
        res.render('View-Client/New-Application/application.ejs', {
          fullUrl: fullUrl,
          linkmeta: "https://tuyendung.me/nop-don-ung-tuyen", Title: Title,
          description: description,
          image_alt: image_alt,
          keywords: keywords,
          url_image: url_image,
          user: user, resultTinDang: result_tindang,count_result_tindang:count_result_tindang, messagee: "", message: ""
        });
      }
    } else {
      var Title = "Nộp Đơn Ứng Tuyển"
      var description = "Liên Hệ : 093.18.666.98 Đức Anh"
      var keywords = "Applicant"
      var url_image = "https://tuyendung.me/galaxydr-logo.jpg"
      var image_alt = "Image_applicantion"
      res.render('View-Client/New-Application/application.ejs', {
        linkmeta: "https://tuyendung.me/nop-don-ung-tuyen", Title: Title,
        fullUrl: fullUrl,
        description: description,
        image_alt: image_alt,
        keywords: keywords,
        url_image: url_image,
        user: user, resultTinDang: result_tindang,count_result_tindang:count_result_tindang,messagee: "", message: ""
      });

    }
    }catch(err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  });
  app.get('/ung-tuyen', async (req, res,next) => {
    try{
    var os = require('os');
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const time = getTime(Date.now())
    const date = time.dateNew
    const detail_time = time.timeNew
    const frames_time = time.hours
    const element_arrData = {
      fullUrl: fullUrl,
      frames_time: frames_time,
      time_click: detail_time,
      system: {
        type: os.type(),
        platform: os.platform(),
        release: os.release()
      }
    }
    const arrData = {
      Date: date,
      Detail_history_Interactive: [{
        fullUrl: fullUrl,
        frames_time: frames_time,
        time_click: detail_time,
        system: {
          type: os.type(),
          platform: os.platform(),
          release: os.release()
        }
      }]
    }
    const edit_Data_Interactives = await ShortUrl.findOne({ short: "ung-tuyen", "Data_Interactive.Date": date })
    if (edit_Data_Interactives) {
      const Set_Data_Interactives = await ShortUrl.update({ short: "ung-tuyen", "Data_Interactive.Date": date }, { $push: { "Data_Interactive.$.Detail_history_Interactive": element_arrData } })
      
    } else {
      const Push_Data_Interactives = await ShortUrl.update({ short: "ung-tuyen" }, { $push: { Data_Interactive: arrData } })
    }
    var code_url = req.query.code_url
    const user = "";
    if (code_url) {
      const shorturl = await ShortUrl.findOne({ "meta_tag.code_url": code_url })
      if (shorturl) {
        var Title = shorturl.meta_tag.Title
        var description = shorturl.meta_tag.Description
        var keywords = shorturl.meta_tag.Keywords
        var url_image = shorturl.meta_tag.url_image
        var image_alt = shorturl.meta_tag.image_alt
        res.render('View-Client/New-Application/telesale/ung-tuyen.ejs', {
          fullUrl: fullUrl,
          user: user,
          linkmeta: "https://tuyendung.me/ung-tuyen",
          Title: Title,
          description: description,
          image_alt: image_alt,
          keywords: keywords,
          url_image: url_image,
          messagee: "",
          message: ""
        });
      } else {
        var Title = "Nộp Đơn Ứng Tuyển"
        var description = "Liên Hệ : 093.18.666.98 Đức Anh"
        var keywords = "Applicant"
        var url_image = "https://tuyendung.me/galaxydr-logo.jpg"
        var image_alt = "Image_applicantion"
        res.render('View-Client/New-Application/telesale/ung-tuyen.ejs', {
          fullUrl: fullUrl,
          linkmeta: "https://tuyendung.me/ung-tuyen", Title: Title,
          description: description,
          image_alt: image_alt,
          keywords: keywords,
          url_image: url_image,
          user: user, messagee: "", message: ""
        });
      }
    } else {
      var Title = "Nộp Đơn Ứng Tuyển"
      var description = "Liên Hệ : 093.18.666.98 Đức Anh"
      var keywords = "Applicant"
      var url_image = "https://tuyendung.me/galaxydr-logo.jpg"
      var image_alt = "Image_applicantion"
      res.render('View-Client/New-Application/telesale/ung-tuyen.ejs', {
        linkmeta: "https://tuyendung.me/ung-tuyen", Title: Title,
        fullUrl: fullUrl,
        description: description,
        image_alt: image_alt,
        keywords: keywords,
        url_image: url_image,
        user: user,messagee: "", message: ""
      });

    }
    }catch(err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  });
  app.get('/nop-don-ung-tuyen&:code_url', async (req, res,next) => {
    var _time = getTime(Date.now())
    var text = `Lượt truy cập mới tại URL ${req.params.code_url}
Thời gian :${_time.timeNew} -${_time.dateNew}
Hệ điều hành : ${req.useragent.os}
Thiết Bị : ${req.useragent.platform}
Trình duyệt:${req.useragent.browser}
Mã truy cập :${req.useragent.source} `
bot.sendMessage(Roombot, text);
    try{
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const time = getTime(Date.now())
    const date = time.dateNew
    const detail_time = time.timeNew
    const frames_time = time.hours
    const element_arrData = {
      fullUrl: fullUrl,
      frames_time: frames_time,
      time_click: detail_time
    }
    const arrData = {
      Date: date,
      Detail_history_Interactive: [{
        fullUrl: fullUrl,
        frames_time: frames_time,
        time_click: detail_time
      }]
    }
    const edit_Data_Interactives = await ShortUrl.findOne({ short: "ung-tuyen", "Data_Interactive.Date": date })
    if (edit_Data_Interactives) {
      const Set_Data_Interactives = await ShortUrl.update({ short: "ung-tuyen", "Data_Interactive.Date": date }, { $push: { "Data_Interactive.$.Detail_history_Interactive": element_arrData } })

    } else {
      const Push_Data_Interactives = await ShortUrl.update({ short: "ung-tuyen" }, { $push: { Data_Interactive: arrData } })
     
    }
    var code_url = req.params.code_url
    var result_tindang = await tindang.find({}).sort({ _id: -1 })
    var count_result_tindang = await tindang.count({})
    const user = "";
    if (code_url) {
      const shorturl = await ShortUrl.findOne({ "meta_tag.code_url": code_url })
      if (shorturl) {
        var Title = shorturl.meta_tag.Title
        var description = shorturl.meta_tag.Description
        var keywords = shorturl.meta_tag.Keywords
        var url_image = shorturl.meta_tag.url_image
        var image_alt = shorturl.meta_tag.image_alt
        res.render('View-Client/New-Application/application.ejs', {
          fullUrl: fullUrl,
          user: user,
          linkmeta: shorturl.full,
          Title: Title,
          description: description,
          image_alt: image_alt,
          keywords: keywords,
          url_image: url_image,
          resultTinDang: result_tindang,
          count_result_tindang:count_result_tindang,
          messagee: "",
          message: ""
        });
      } else {
        res.redirect("/ung-tuyen")
      }
    } else {
      res.redirect("/ung-tuyen")
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
  app.get('/ung-tuyen&:code_url', async (req, res,next) => {
    try{
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const time = getTime(Date.now())
    const date = time.dateNew
    const detail_time = time.timeNew
    const frames_time = time.hours
    const element_arrData = {
      fullUrl: fullUrl,
      frames_time: frames_time,
      time_click: detail_time
    }
    const arrData = {
      Date: date,
      Detail_history_Interactive: [{
        fullUrl: fullUrl,
        frames_time: frames_time,
        time_click: detail_time
      }]
    }
    const edit_Data_Interactives = await ShortUrl.findOne({ short: "ung-tuyen", "Data_Interactive.Date": date })
    if (edit_Data_Interactives) {
      const Set_Data_Interactives = await ShortUrl.update({ short: "ung-tuyen", "Data_Interactive.Date": date }, { $push: { "Data_Interactive.$.Detail_history_Interactive": element_arrData } })

    } else {
      const Push_Data_Interactives = await ShortUrl.update({ short: "ung-tuyen" }, { $push: { Data_Interactive: arrData } })
     
    }
    var code_url = req.params.code_url
    const user = "";
    if (code_url) {
      const shorturl = await ShortUrl.findOne({ "meta_tag.code_url": code_url })
      if (shorturl) {
        var Title = shorturl.meta_tag.Title
        var description = shorturl.meta_tag.Description
        var keywords = shorturl.meta_tag.Keywords
        var url_image = shorturl.meta_tag.url_image
        var image_alt = shorturl.meta_tag.image_alt
        res.render('View-Client/New-Application/telesale/ung-tuyen.ejs', {
          fullUrl: fullUrl,
          user: user,
          linkmeta: shorturl.full,
          Title: Title,
          description: description,
          image_alt: image_alt,
          keywords: keywords,
          url_image: url_image,
          messagee: "",
          message: ""
        });
      } else {
        res.redirect("/ung-tuyen")
      }
    } else {
      res.redirect("/ung-tuyen")
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
  app.get("/nop-don-ung-tuyen-nhatuyendung=:link", async (req, res,next) => {
    try{
    const user = "";
    const FormApplicant = await CreateForm.findOne({ UrlForm: req.params.link })
    if (FormApplicant) {
      const vitrituyendung = FormApplicant.VitriUngTuyen
      const typejob = FormApplicant.TypeJob
      res.render('View-Client/New-Application/form-ung-tuyen.ejs', { FormApplicant: FormApplicant, user: user, resultTinDang: vitrituyendung, typejob: typejob, messagee: "", message: "" })
    } else {
      res.render("View-profile/404.ejs")
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.post("/create-form-applicant", upload.single('fileUT'), isLoggedIn, async (req, res,next) => {
    try{
    const user = await User.findOne({ _id: req.user._id })
    const time = getTime(Date.now())
    if (user) {
      if (req.file) {
        newCreateForm = new CreateForm()
        newCreateForm.IDUserCreate = req.user._id
        newCreateForm.TitleForm = req.body.titleForm
        newCreateForm.LogoForm.url = req.file.filename
        newCreateForm.DataCreate = time.dateNew
        newCreateForm.Source = req.user.local.NTD.NameUser
        newCreateForm.TypeForm = req.body.plan
        newCreateForm.UrlForm = req.user._id + time.date + "-" + time.month + "-" + time.year + "-" + time.hours + "-" + time.minutes
        newCreateForm.LogoForm.contentType = req.file.contentType
        newCreateForm.save((err, done) => {
          if (err) {
            return err
          } else {

            res.redirect("profile?message=" + encodeURIComponent("FormIsCreated"))
          }
        })
      } else {
        res.redirect("profile?message=" + encodeURIComponent("LogoIsEmpty"))
      }
    } else {
      res.render("View-profile/404.ejs")
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.get('/new-form-applications&owerlink=:ownerlink', async (req, res,next) => {
    try{
    if (req.user) {
      const resultTinDang = ""
      var nameUT = "";
      res.render('View-Client/New-Application/form-applicant-done.ejs', { user: req.user, resultTinDang: resultTinDang, nameUT: req.body.NameUT, messagee: req.flash('loginMessage'), message: req.flash('signupMessage') })
    } else {
      const resultTinDang = ""
      var nameUT = "";
      const user = ""
      res.render('View-Client/New-Application/form-applicant-done.ejs', { user: user, resultTinDang: resultTinDang, nameUT: nameUT, messagee: req.flash('loginMessage'), message: req.flash('signupMessage') })
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
 
  bot.onText(/\/sendcs (.+)/, (msg, match) => {
    const chatIds = msg.chat.id;
    const resp = match[1];
    newApplyUT.findOne({ $or: [{ CMND: resp }, { PhoneUT: resp }] }).exec((err, UngVien) => {
      if (!UngVien) {
        bot.sendMessage(chatid, `Ứng viên không tồn tại`)
      } else {
        bot.sendMessage(chatIds, `Ứng viên ${UngVien.NameUT} đã gửi tới CS_TTTV&CSKH 2`)
        var option = {
          parse_mode: "markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Thông tin ứng viên",
                  url: `https://tuyendung.me/thong-tin-ung-vien=${UngVien._id}?token=${UngVien.authencation.token}`
                }
              ]
            ]
          }
        }
        var noti_cs = `Thông Tin Ứng Viên
- Ứng viên: ${UngVien.NameUT}
- Năm Sinh: ${UngVien.Ngaysinh}
- Điện Thoại:${UngVien.PhoneUT} 
- Ngày :${UngVien.DateTime} Thời gian: ${UngVien.Time} 
- Trình Độ : ${UngVien.TrinhDoHocVan}
- Vị trí ứng tuyển : Nhân viên Chăm Sóc Khách Hàng
- Nguồn :${UngVien.Gioithieu}
- Mật khẩu:TuyenDungGalaxyDR@2022`
        bot_cs.sendMessage(chatidcs, noti_cs, option);
      }
    })
  });
  bot.onText(/\/finduv (.+)/, (msg, match) => {
    const chatIds = msg.chat.id;
    const resp = match[1];
    newApplyUT.findOne({ PhoneUT: resp }).exec((err, UngVien) => {
      if (!UngVien) {
        bot.sendMessage(chatid, `Ứng viên không tồn tại`)
      } else {
        var option = {
          parse_mode: "markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Thông tin ứng viên",
                  url: `https://tuyendung.me/thong-tin-ung-vien=${UngVien._id}?token=${UngVien.authencation.token}`
                }
              ]
            ]
          }
        }
        var noti_info = `Thông Tin Ứng Viên
    - Ứng viên: ${upTocCase(UngVien.NameUT)}
    - Năm Sinh: ${UngVien.Ngaysinh}
    - Điện Thoại:${UngVien.PhoneUT}
    - Ngày :${UngVien.DateTime} Thời gian: ${UngVien.Time} 
    - Trình Độ : ${UngVien.TrinhDoHocVan}
    - Vị trí ứng tuyển : ${UngVien.vitriungtuyen}
    - Nguồn :${UngVien.Gioithieu}
    - Mật khẩu: TuyenDungGalaxyDR@2022`
        bot.sendMessage(chatIds, noti_info, option)
      }
    })
  });
  bot.onText(/\/sendlgl (.+)/, (msg, match) => {
    const chatIds = msg.chat.id;
    const resp = match[1];
    newApplyUT.findOne({ PhoneUT: resp }).exec((err, UngVien) => {
      if (!UngVien) {
        bot.sendMessage(chatid, `Ứng viên không tồn tại`)
      } else {
        var option = {
          parse_mode: "markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Thông tin ứng viên",
                  url: `https://tuyendung.me/thong-tin-ung-vien=${UngVien._id}?token=${UngVien.authencation.token}`
                }
              ]
            ]
          }
        }
        bot.sendMessage(chatIds, `Ứng viên ${UngVien.NameUT} đã gửi tới LGL_TTTV&CSKH 2`)
        var noti_cs = `Thông Tin Ứng Viên
- Ứng viên: ${UngVien.NameUT}
- Năm Sinh: ${UngVien.Ngaysinh}
- Điện Thoại:${UngVien.PhoneUT} 
- Ngày :${UngVien.DateTime} Thời gian: ${UngVien.Time} 
- Trình Độ : ${UngVien.TrinhDoHocVan}
- Vị trí ứng tuyển : Nhân viên Tư Vấn Pháp Lý
- Nguồn :${UngVien.Gioithieu}
- Mật khẩu: TuyenDungGalaxyDR@2022`
        bot_cs.sendMessage(chatidlgl, noti_cs, option);
      }
    })
  });
  function get_info_url(full_url){
    var fullUrl = full_url
    var vitri_url = fullUrl.indexOf("?")
    if(vitri_url == "-1"){
      console.log(fullUrl)
      return fullUrl
    }else{
      var new_fullUrl = fullUrl.slice(0, vitri_url)
      console.log(new_fullUrl)
      return new_fullUrl
    }
  }
  app.post('/new-applications', upload.fields([{ name: 'fileUT' }, { name: 'fileCV' }]), async (req, res, next) => {
    try{
      var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
     
      const emailToValidate = req.body.EmailUT;
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (emailRegexp.test(emailToValidate) == true && req.body.EmailUT!= "") {
        const user_token = new User()
        let date_ob1 = new Date(req.body.Ngaysinh);
        const time = getTime(Date.now())
        let dateNgaysinh = date_ob1.getDate();
        let monthNgaysinh = date_ob1.getMonth() + 1;
        let yearNgaysinh = date_ob1.getFullYear();
        const EmailTemplate = await Email.findOne({ _id: "6148a80d1efd4b39b1cfd15a" })
        var noti = `- Ứng viên: ${upTocCase(req.body.NameUT)}
- Năm Sinh: ${dateNgaysinh + "/" + monthNgaysinh + "/" + yearNgaysinh}
- Số Liên Hệ:${req.body.PhoneUT}
- Trình Độ : ${req.body.TrinhDoHocVan}
- Vào lúc ${time.hours}:${time.minutes} Ngày ${time.dateNew},
- Vị trí ứng tuyển : ${req.body.vitriungtuyen}
- Hình thức phỏng vấn : ${req.body.BMLV}
- Nguồn :${req.body.Gioithieu}
- Nền tảng:${get_info_url(req.body.url_employer)}
`
        bot.sendMessage(chatid, noti);
        newApplys = new newApplyUT()
        const token_authencation = user_token.generateHash(newApplys._id);
        if (req.files['fileUT'] || req.files['fileCV']) {
          newApplys.NameUT = upTocCase(req.body.NameUT)
          newApplys.Gioitinh = req.body.Gioitinh
          if (req.files['fileUT']) {
            // var image_url = "https://tuyendung.me/image/"+req.files['fileUT'][0].filename
            // bot.sendPhoto(chatid,image_url)
            newApplys.Avata = req.files['fileUT'][0].filename
          } else {
            if (req.body.Gioitinh == "Nam") {
              newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/user-male.png"
            }
            if (req.body.Gioitinh == "Nữ") {
              newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/brown-curly-hair-lady-with-red-glasses.png"
            }
          }
          if (req.files['fileCV']) {
            var file_url = "https://tuyendung.me/files/" + req.files['fileCV'][0].filename
            bot.sendDocument(chatid, file_url);
            newApplys.fileAttach.url = req.files['fileCV'][0].filename
            newApplys.fileAttach.contentType = req.files['fileCV'][0].contentType
          }
          newApplys.Honnhan = req.body.Honnhan
          newApplys.Ngaysinh = dateNgaysinh + "/" + monthNgaysinh + "/" + yearNgaysinh
          newApplys.Quequan = req.body.Quequan
          newApplys.TrinhDoHocVan = req.body.TrinhDoHocVan
          newApplys.Noisinh = req.body.Noisinh
          newApplys.CMND = req.body.CMND
          newApplys.NCCMND = req.body.NCCMND
          let date_ob2 = new Date(req.body.NgayCCMND);
          let dateNgayCCMND = date_ob2.getDate();
          let monthNgayCCMND = date_ob2.getMonth() + 1;
          let yearNgayCCMND = date_ob2.getFullYear();
          newApplys.NgayCCMND = dateNgayCCMND + "/" + monthNgayCCMND + "/" + yearNgayCCMND
          newApplys.PhoneUT = req.body.PhoneUT
          newApplys.EmailUT = req.body.EmailUT
          newApplys.DCTT = req.body.DCTT
          newApplys.DCLL = req.body.DCLL
          newApplys.Gioithieu = req.body.Gioithieu
          newApplys.BMLV = req.body.BMLV
          newApplys.vitriungtuyen = req.body.vitriungtuyen
          newApplys.Noxau = req.body.Noxau
          newApplys.hoctap = req.body.hoctap
          newApplys.Kinhnghiem = req.body.Kinhnghiem
          newApplys.Giadinh = req.body.Giadinh
          newApplys.FiffterNgay = time.date
          newApplys.FiffterThang = time.month
          newApplys.FillterNam = time.year
          newApplys.DateTime = time.dateNew
          newApplys.Time = time.timeNew
          newApplys.authencation.token = token_authencation
          newApplys.system.Detect_system = req.body.Detect_the_OS
          newApplys.system.header = fullUrl
          newApplys.system.url_employer = req.body.url_employer
          newApplys.authencation.Password = "TuyenDungGalaxyDR@2022"
          var data = await QRcode.toDataURL("https://tuyendung.me/Scan-thong-tin-ung-vien=" + newApplys._id)
          newApplys.QRcode.LinkImage = data
          newApplys.save((err, done) => {
            if (req.body.vitriungtuyen == "null") {
              notication_applicant(upTocCase(req.body.NameUT), req.body.EmailUT, req.body.PhoneUT, req.body.vitriungtuyen, req.body.TrinhDoHocVan)
              res.render('View-Client/New-Application/form-TMPV.ejs', { user: "", resultTinDang: "", nameUT: upTocCase(req.body.NameUT), messagee: "", message: "" })
            } else {
              tindang.find({ Title: req.body.vitriungtuyen }).exec((err, resultTinDang) => {
                resultTinDang.forEach(function (item) {
                  const texts = item.DetailInterview;
                  const textss = item.Detail;
                  const replace2 = texts.replace("<script>", "</script>", '"-"')
                  const Message2 = replace2.replace(/(?:\r\n|\r|\n)/g, '<br>')
                  const replace = textss.replace("<script>", "</script>", '"-"')
                  const Message = replace.replace(/(?:\r\n|\r|\n)/g, '<br>')

                  const EmailBody = `
                        <h4>Chào bạn ${upTocCase(req.body.NameUT)} ,</h4>
                        
                              <h3>Nội dung</h3>
                              <div  style="width:100%;height:250px"  id="myTextArea" name="introduction">
                                  ${Message2}
                              </div>
                              </div>
                      </div>
                    <div style="margin-top: 10px;margin-bottom: 10px;" class="sideber2">
                                <div class="widghet">
                                  <h3>Chi tiết công việc</h3></br>
                                    <div  width:100%;height:350px"  id="myTextArea" name="introduction">
                                    ${Message}
                                    </div>
                                  </div>
                          </div>
                      <div style="margin-top: 10px;margin-bottom: 10px;text-align: center;" class="sideber2">
                                  <div class="widghet"> 
                        <a href="https://tuyendung.me" target="_blank">VIỆC LÀM VĂN PHÒNG.</a><br>
                        
                      `
                  const htmlTemplate = EmailTemplate.header + EmailBody + EmailTemplate.footer
                  var mailOptions = {
                    from: 'sp.bi.fell@gmail.com',
                    to: req.body.EmailUT,
                    subject: 'Thư Mời Phỏng Vấn GalaxyDR - Vị trí ứng tuyển :' + " " + req.body.vitriungtuyen,
                    html: htmlTemplate,
                    attachments: [
                      {
                        filename: item.FileJD,
                        content: "Chi tiết công việc",
                        path: 'https://tuyendung.me/files/' + item.FileJD,
                        contentType: 'application/pdf'
                      },
                      {
                        filename: 'logo.png',
                        path: './public/logo_new.jpg',
                        cid: 'logos'
                      }
                    ],
                  };
                  notication_applicant(upTocCase(req.body.NameUT), req.body.EmailUT, req.body.PhoneUT, req.body.vitriungtuyen, req.body.TrinhDoHocVan)
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      res.render('View-Client/New-Application/form-TMPV.ejs', { user: "", resultTinDang: resultTinDang, nameUT: upTocCase(req.body.NameUT), messagee: "", message: "" })
                    } else {
                      res.render('View-Client/New-Application/form-TMPV.ejs', { user: "", resultTinDang: resultTinDang, nameUT: upTocCase(req.body.NameUT), messagee: "", message: "" })
                    }
                  });
                })
              })
            }
          })
        }
        else {
          newApplys.NameUT = upTocCase(req.body.NameUT)
          newApplys.Gioitinh = req.body.Gioitinh
          if (req.body.Gioitinh == "Nam") {
            newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/user-male.png"
          }
          if (req.body.Gioitinh == "Nữ") {
            newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/brown-curly-hair-lady-with-red-glasses.png"
          }
          newApplys.Honnhan = req.body.Honnhan
          let date_ob1 = new Date(req.body.Ngaysinh);
          let dateNgaysinh = date_ob1.getDate();
          let monthNgaysinh = date_ob1.getMonth() + 1;
          let yearNgaysinh = date_ob1.getFullYear();
          newApplys.Ngaysinh = dateNgaysinh + "/" + monthNgaysinh + "/" + yearNgaysinh
          newApplys.Quequan = req.body.Quequan
          newApplys.TrinhDoHocVan = req.body.TrinhDoHocVan
          newApplys.Noisinh = req.body.Noisinh
          newApplys.CMND = req.body.CMND
          newApplys.NCCMND = req.body.NCCMND
          let date_ob2 = new Date(req.body.NgayCCMND);
          let dateNgayCCMND = date_ob2.getDate();
          let monthNgayCCMND = date_ob2.getMonth() + 1;
          let yearNgayCCMND = date_ob2.getFullYear();
          newApplys.NgayCCMND = dateNgayCCMND + "/" + monthNgayCCMND + "/" + yearNgayCCMND
          newApplys.PhoneUT = req.body.PhoneUT
          newApplys.EmailUT = req.body.EmailUT
          newApplys.DCTT = req.body.DCTT
          newApplys.DCLL = req.body.DCLL
          newApplys.Gioithieu = req.body.Gioithieu
          newApplys.BMLV = req.body.BMLV
          newApplys.vitriungtuyen = req.body.vitriungtuyen
          newApplys.Noxau = req.body.Noxau
          newApplys.hoctap = req.body.hoctap
          newApplys.Kinhnghiem = req.body.Kinhnghiem
          newApplys.Giadinh = req.body.Giadinh
          newApplys.FiffterNgay = time.date
          newApplys.FiffterThang = time.month
          newApplys.FillterNam = time.year
          newApplys.DateTime = time.dateNew
          newApplys.Time = time.timeNew
          newApplys.system.Detect_system = req.body.Detect_the_OS
          newApplys.system.header = fullUrl
          newApplys.system.url_employer = req.body.url_employer
          newApplys.authencation.token = token_authencation
          newApplys.authencation.Password = "TuyenDungGalaxyDR@2022"
          var data = await QRcode.toDataURL("https://tuyendung.me/Scan-thong-tin-ung-vien=" + newApplys._id)
          newApplys.QRcode.LinkImage = data
          newApplys.save((err, done) => {
            if (req.body.vitriungtuyen == "null") {
              notication_applicant(upTocCase(req.body.NameUT), req.body.EmailUT, req.body.PhoneUT, req.body.vitriungtuyen, req.body.TrinhDoHocVan)
              res.render('View-Client/New-Application/form-TMPV.ejs', { user: "", resultTinDang: "", nameUT: upTocCase(req.body.NameUT), messagee: "", message: "" })
            } else {
              tindang.find({ Title: req.body.vitriungtuyen }).exec((err, resultTinDang) => {
                resultTinDang.forEach(function (item) {
                  const texts = item.DetailInterview;
                  const textss = item.Detail;
                  const replace2 = texts.replace("<script>", "</script>", '"-"')
                  const Message2 = replace2.replace(/(?:\r\n|\r|\n)/g, '<br>')
                  const replace = textss.replace("<script>", "</script>", '"-"')
                  const Message = replace.replace(/(?:\r\n|\r|\n)/g, '<br>')
                  const EmailBody = `
                    <h4>Chào bạn ${upTocCase(req.body.NameUT)} ,</h4>
                          <h3>Nội dung</h3>
                          <div  style="width:100%;height:250px"  id="myTextArea" name="introduction">
                              ${Message2}
                          </div>
                          </div>
                  </div>
                <div style="margin-top: 10px;margin-bottom: 10px;" class="sideber2">
                            <div class="widghet">
                              <h3>Chi tiết công việc</h3></br>
                                <div  width:100%;height:350px"  id="myTextArea" name="introduction">
                                ${Message}
                                </div>
                              </div>
                      </div>
                  <div style="margin-top: 10px;margin-bottom: 10px;text-align: center;" class="sideber2">
                              <div class="widghet"> 
                    <a href="https://tuyendung.me" target="_blank">VIỆC LÀM VĂN PHÒNG.</a><br>
                   
                  `
                  const htmlTemplate = EmailTemplate.header + EmailBody + EmailTemplate.footer
                  var mailOptions = {
                    from: 'sp.bi.fell@gmail.com',
                    to: req.body.EmailUT,
                    subject: 'Thư Mời Phỏng Vấn GalaxyDR - Vị trí ứng tuyển :' + " " + req.body.vitriungtuyen,
                    html: htmlTemplate,
                    attachments: [
                      {
                        filename: item.FileJD,
                        path: 'https://tuyendung.me/files/' + item.FileJD,
                        contentType: 'application/pdf'
                      },
                      {
                        filename: 'logo.png',
                        path: './public/logo_new.jpg',
                        cid: 'logos'
                      }
                    ],
                  };
                  notication_applicant(upTocCase(req.body.NameUT), req.body.EmailUT, req.body.PhoneUT, req.body.vitriungtuyen, req.body.TrinhDoHocVan)
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      res.render('View-Client/New-Application/form-TMPV.ejs', { user: "", resultTinDang: resultTinDang, nameUT: upTocCase(req.body.NameUT), messagee: "", message: "" })
                    } else {
                      res.render('View-Client/New-Application/form-TMPV.ejs', { user: "", resultTinDang: resultTinDang, nameUT: upTocCase(req.body.NameUT), messagee: "", message: "" })
                    }
                  });
                })
              })
            }

          })

        }
      } else {
        res.render("View-profile/404.ejs", { message: "Email không hợp lệ" })
      }
    } catch(err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.post('/apply-telesale', upload.fields([{ name: 'fileUT' }, { name: 'fileCV' }]), async (req, res, next) => {
    try{
      var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      const emailToValidate = req.body.EmailUT;
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (emailRegexp.test(emailToValidate) == true && req.body.EmailUT!= "") {
        const user_token = new User()
        let date_ob1 = new Date(req.body.Ngaysinh);
        const time = getTime(Date.now())
        let dateNgaysinh = date_ob1.getDate();
        let monthNgaysinh = date_ob1.getMonth() + 1;
        let yearNgaysinh = date_ob1.getFullYear();
        var noti = `- Ứng viên: ${upTocCase(req.body.NameUT)}
- Năm Sinh: ${dateNgaysinh + "/" + monthNgaysinh + "/" + yearNgaysinh}
- Số Liên Hệ:${req.body.PhoneUT}
- Trình Độ : ${req.body.TrinhDoHocVan}
- Vào lúc ${time.hours}:${time.minutes} Ngày ${time.dateNew},
- Vị trí ứng tuyển : ${req.body.vitriungtuyen}
- Hình thức phỏng vấn : ${req.body.BMLV}
- Nguồn :${req.body.Gioithieu}
- Nền tảng:${get_info_url(req.body.url_employer)}
`
        bot.sendMessage(chatid, noti);
        newApplys = new newApplyUT()
        const token_authencation = user_token.generateHash(newApplys._id);
        const EmailTemplate = await Email.findOne({ _id: "6148a80d1efd4b39b1cfd15a" })
        const EmailBody = `
        <h4>Chào bạn ${upTocCase(req.body.NameUT)} ,</h4>
        
              <h3>Nội dung</h3>
              <div  style="width:100%;height:250px"  id="myTextArea" name="introduction">
                  ⭕️Ứng viên ứng tuyển tham gia trực tiếp tại văn phòng GALAXYDR ⭕️ <br>
                  ⏰Thời gian : 9:00 đến 11:00 hoặc 14:00-16:00 <br>
                  Từ thứ 2 Đến Thứ 6 hằng tuần <br>
                  ☎️Liên Hệ : 093.18.666.98 <br>
                  ⭕️Địa chỉ : Số 5 Đường D1 Tầng 1&2 Tòa nhà PVL Linh Tây Tower, P.Linh Tây , TP Thủ Đức.
              </div>
              </div>
      </div>
    <div style="margin-top: 10px;margin-bottom: 10px;" class="sideber2">
                <div class="widghet">
                  <h3>Chi tiết công việc</h3></br>
                    <div  width:100%;height:350px"  id="myTextArea" name="introduction">
                    - Nhân viên nhận danh sách khách hàng được phân bổ từ phần mềm tự động hoặc từ quản lý hằng ngày.<br>
                    - Nhân viên tư vấn và xác nhận các khoản vay mà khách hàng đước phía ngân hàng duyệt vay.<br>
                    - Nhân viên báo cáo kết quả làm việc hằng ngày về quản lý bộ phận.<br>
                    Chi tiết theo file được đính kèm
                    </div>
                  </div>
          </div>
      <div style="margin-top: 10px;margin-bottom: 10px;text-align: center;" class="sideber2">
                  <div class="widghet"> 
        <a href="https://tuyendung.me" target="_blank">VIỆC LÀM VĂN PHÒNG.</a><br>
        
      `
      const htmlTemplate = EmailTemplate.header + EmailBody + EmailTemplate.footer

    var mailOptions = {
      from: 'sp.bi.fell@gmail.com',
      to: req.body.EmailUT,
      subject: 'Thư Mời Phỏng Vấn GalaxyDR - Vị trí ứng tuyển :' + " " + req.body.vitriungtuyen,
      html: htmlTemplate,
      attachments: [
        {
          filename: "Mô tả công việc",
          path: 'https://tuyendung.me/Telesales-GLX.pdf',
          contentType: 'application/pdf'
        },
        {
          filename: 'logo.png',
          path: './public/logo_new.jpg',
          cid: 'logos'
        }
      ],
    };
        if (req.files['fileUT'] || req.files['fileCV']) {
          newApplys.NameUT = upTocCase(req.body.NameUT)
          newApplys.Gioitinh = req.body.Gioitinh
          if (req.files['fileUT']) {
            newApplys.Avata = req.files['fileUT'][0].filename
          } else {
            if (req.body.Gioitinh == "Nam") {
              newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/user-male.png"
            }
            if (req.body.Gioitinh == "Nữ") {
              newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/brown-curly-hair-lady-with-red-glasses.png"
            }
          }
          if (req.files['fileCV']) {
            var file_url = "https://tuyendung.me/files/" + req.files['fileCV'][0].filename
            bot.sendDocument(chatid, file_url);
            newApplys.fileAttach.url = req.files['fileCV'][0].filename
            newApplys.fileAttach.contentType = req.files['fileCV'][0].contentType
          }
          newApplys.Honnhan = req.body.Honnhan
          newApplys.Ngaysinh = dateNgaysinh + "/" + monthNgaysinh + "/" + yearNgaysinh
          newApplys.Quequan = req.body.Quequan
          newApplys.TrinhDoHocVan = req.body.TrinhDoHocVan
          newApplys.Noisinh = req.body.Noisinh
          newApplys.CMND = req.body.CMND
          newApplys.NCCMND = req.body.NCCMND
          let date_ob2 = new Date(req.body.NgayCCMND);
          let dateNgayCCMND = date_ob2.getDate();
          let monthNgayCCMND = date_ob2.getMonth() + 1;
          let yearNgayCCMND = date_ob2.getFullYear();
          newApplys.NgayCCMND = dateNgayCCMND + "/" + monthNgayCCMND + "/" + yearNgayCCMND
          newApplys.PhoneUT = req.body.PhoneUT
          newApplys.EmailUT = req.body.EmailUT
          newApplys.DCTT = req.body.DCTT
          newApplys.DCLL = req.body.DCLL
          newApplys.Gioithieu = req.body.Gioithieu
          newApplys.BMLV = req.body.BMLV
          newApplys.vitriungtuyen = req.body.vitriungtuyen
          newApplys.Noxau = req.body.Noxau
          newApplys.hoctap = req.body.hoctap
          newApplys.Kinhnghiem = req.body.Kinhnghiem
          newApplys.Giadinh = req.body.Giadinh
          newApplys.FiffterNgay = time.date
          newApplys.FiffterThang = time.month
          newApplys.FillterNam = time.year
          newApplys.DateTime = time.dateNew
          newApplys.Time = time.timeNew
          newApplys.authencation.token = token_authencation
          newApplys.system.Detect_system = req.body.Detect_the_OS
          newApplys.system.header = fullUrl
          newApplys.system.url_employer = req.body.url_employer
          newApplys.authencation.Password = "TuyenDungGalaxyDR@2022"
          var data = await QRcode.toDataURL("https://tuyendung.me/Scan-thong-tin-ung-vien=" + newApplys._id)
          newApplys.QRcode.LinkImage = data
          newApplys.save((err, done) => {
            notication_applicant(upTocCase(req.body.NameUT), req.body.EmailUT, req.body.PhoneUT, req.body.vitriungtuyen, req.body.TrinhDoHocVan)
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.render("View-Client/New-Application/telesale/telesales.ejs", { user: "",  nameUT: upTocCase(req.body.NameUT), messagee: "", message: "" })
              } else {
                res.render('View-Client/New-Application/telesale/telesales.ejs', { user: "",  nameUT: upTocCase(req.body.NameUT), messagee: "", message: "" })
              }
            });
          })
        }
        else {
          newApplys.NameUT = upTocCase(req.body.NameUT)
          newApplys.Gioitinh = req.body.Gioitinh
          if (req.body.Gioitinh == "Nam") {
            newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/user-male.png"
          }
          if (req.body.Gioitinh == "Nữ") {
            newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/brown-curly-hair-lady-with-red-glasses.png"
          }
          newApplys.Honnhan = req.body.Honnhan
          let date_ob1 = new Date(req.body.Ngaysinh);
          let dateNgaysinh = date_ob1.getDate();
          let monthNgaysinh = date_ob1.getMonth() + 1;
          let yearNgaysinh = date_ob1.getFullYear();
          newApplys.Ngaysinh = dateNgaysinh + "/" + monthNgaysinh + "/" + yearNgaysinh
          newApplys.Quequan = req.body.Quequan
          newApplys.TrinhDoHocVan = req.body.TrinhDoHocVan
          newApplys.Noisinh = req.body.Noisinh
          newApplys.CMND = req.body.CMND
          newApplys.NCCMND = req.body.NCCMND
          let date_ob2 = new Date(req.body.NgayCCMND);
          let dateNgayCCMND = date_ob2.getDate();
          let monthNgayCCMND = date_ob2.getMonth() + 1;
          let yearNgayCCMND = date_ob2.getFullYear();
          newApplys.NgayCCMND = dateNgayCCMND + "/" + monthNgayCCMND + "/" + yearNgayCCMND
          newApplys.PhoneUT = req.body.PhoneUT
          newApplys.EmailUT = req.body.EmailUT
          newApplys.DCTT = req.body.DCTT
          newApplys.DCLL = req.body.DCLL
          newApplys.Gioithieu = req.body.Gioithieu
          newApplys.BMLV = req.body.BMLV
          newApplys.vitriungtuyen = req.body.vitriungtuyen
          newApplys.Noxau = req.body.Noxau
          newApplys.hoctap = req.body.hoctap
          newApplys.Kinhnghiem = req.body.Kinhnghiem
          newApplys.Giadinh = req.body.Giadinh
          newApplys.FiffterNgay = time.date
          newApplys.FiffterThang = time.month
          newApplys.FillterNam = time.year
          newApplys.DateTime = time.dateNew
          newApplys.Time = time.timeNew
          newApplys.system.Detect_system = req.body.Detect_the_OS
          newApplys.system.header = fullUrl
          newApplys.system.url_employer = req.body.url_employer
          newApplys.authencation.token = token_authencation
          newApplys.authencation.Password = "TuyenDungGalaxyDR@2022"
          var data = await QRcode.toDataURL("https://tuyendung.me/Scan-thong-tin-ung-vien=" + newApplys._id)
          newApplys.QRcode.LinkImage = data
          newApplys.save((err, done) => {
            notication_applicant(upTocCase(req.body.NameUT), req.body.EmailUT, req.body.PhoneUT, req.body.vitriungtuyen, req.body.TrinhDoHocVan)
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.render('View-Client/New-Application/telesale/telesales.ejs', { user: "",nameUT: upTocCase(req.body.NameUT), messagee: "", message: "" })
              } else {
                res.render('View-Client/New-Application/telesale/telesales.ejs', { user: "",nameUT: upTocCase(req.body.NameUT), messagee: "", message: "" })
              }
            });
          })

        }
      } else {
        res.render("View-profile/404.ejs", { message: "Email không hợp lệ" })
      }
    } catch(err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.post('/new-form-applications&owerlink=:ownerlink&urlform=:UrlForm', upload.fields([{ name: 'fileUT' }, { name: 'fileCV' }]), async (req, res,next) => {
    try{
    CreateForm.findOne({ UrlForm: req.params.UrlForm }).exec((err, done) => {
      var arr = done.VitriUngTuyen
      const header = `
    
    <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
      <meta name="format-detection" content="telephone=no"> <!-- disable auto telephone linking in iOS -->
      <title>Việc Làm Văn Phòng</title>
      <link rel="shortcut icon" type="image/x-icon" href="favicon.png">
      <link rel="apple-touch-icon" href="favicon.png">
      <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    
    table {
      border-spacing: 0;
    }
    
    table td {
      border-collapse: collapse;
    }
    
    .ExternalClass {
      width: 100%;
    }
    
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 100%;
    }
    
    .ReadMsgBody {
      width: 100%;
      background-color: #ebebeb;
    }
    
    table {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      -ms-interpolation-mode: bicubic;
    }
    
    .yshortcuts a {
      border-bottom: none !important;
    }
    
    @media only screen and (max-width: 600px) {
      *[class="gmail-fix"] {
        display: none !important;
      }
    }
    @media screen and (max-width: 599px) {
      table[class="force-row"],
      table[class="container"] {
        width: 100% !important;
        max-width: 100% !important;
      }
      
      table[class="force-row two"] {
        width: 50% !important;
        max-width: 50% !important;
      }
    }
    @media screen and (max-width: 400px) {
      td[class*="container-padding"] {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
    }
    .ios-footer a {
      color: #aaaaaa !important;
      text-decoration: underline;
    }
    
    @media screen and (max-width: 599px) {
      td[class="col"] {
        width: 50% !important;
        text-align: center;
      }
    
      td[class="cols-wrapper"] {
        padding-top: 18px;
      }
      
      img[class="image"] {
        padding-bottom: 10px;
      }
    
      /*
    img[class="image"] {
        float: right;
        max-width: 40% !important;
        height: auto !important;
        margin-left: 12px;
      }
    */
    
      div[class="subtitle"] {
        margin-top: 0 !important;
      }
    }
    @media screen and (max-width: 400px) {
      td[class="cols-wrapper"] {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    
      td[class="content-wrapper"] {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
    }
    </style>
    
    </head>
    <body style="margin:0; padding:0;" bgcolor="#e1e1e1" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
    
    <!-- 100% background wrapper (grey background) -->
    <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#e1e1e1">
      <tr>
        <td align="center" valign="top" bgcolor="#e1e1e1" style="background-color: #e1e1e1;">
    
          <br>
    
          <!-- 600px container (white background) -->
          <table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px">
            <tr>
              <td class="content" align="left" style="background-color:#ffffff">
              <table width="600" border="0" cellpadding="0" cellspacing="0" class="force-row" style="width: 600px;">
               
                <tr>
                <td class="content-wrapper" style="padding-left:24px;padding-right:24px;">`
      const footer = ` </td>
      </tr>
      <tr>
        <td style="background:#fff;text-align:center;width:100%;height:15px;"></td>  
      </tr>
      <tr>
        <td class="content-wrapper" style="padding-left:24px;padding-right:24px;text-align: center;" align="center">
          <hr style="border-bottom: solid 1px #000; border-top: 0;">
      
        </td>
      </tr>
      <tr>
        <td style="background:#fff;text-align:center;width:100%;height:25px;"></td>  
      </tr>
      <tr>
        <td style="background:#e1e1e1;text-align:center;width:100%;height:15px;"></td>  
      </tr>
      </table>
      </td>
      </tr>
      </table><br><br><br><br>
      </td>
      </tr>
      </table>
      <style>
      @media only screen and (max-width: 992px) {
      .sideber2.mr-r {
      margin-top: 50px;
      }
      }
      
      .sideber2 .widghet {
      border: 1px solid #cbcbcb;
      margin: 0 0 30px;
      padding: 30px;
      -webkit-transition: 0 5px 10px rgba(0, 0, 0, 0.1);
      -moz-transition: 0 5px 10px rgba(0, 0, 0, 0.1);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      border-radius: 5px;
      }
      
      .sideber2 .widghet.clearw {
      padding: 0;
      border: 0;
      box-shadow: none;
      }
      
      .sideber2 .widghet:last-child {
      margin: -5px;
      }
      
      .sideber2 .widghet h3 {
      font-size: 22px;
      text-transform: uppercase;
      color: #3c3c3c;
      font-weight: 500;
      }
      
      .sideber2 .widghet .contact-form form fieldset {
      display: block;
      margin: 0 0 20px;
      }
      
      .sideber2 .widghet .contact-form form fieldset input {
      width: 100%;
      line-height: 50px;
      height: 50px;
      border: 1px solid #cbcbcb;
      background: #fff;
      padding: 0 15px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      border-radius: 5px;
      -webkit-transition: all 0.5s ease;
      -moz-transition: all 0.5s ease;
      -ms-transition: all 0.5s ease;
      -o-transition: all 0.5s ease;
      transition: all 0.5s ease;
      }
      
      .sideber2 .widghet .contact-form form fieldset input:focus {
      border: 1px solid #ff8707;
      }
      
      .sideber2 .widghet .contact-form form fieldset textarea {
      width: 100%;
      height: 100px;
      border: 1px solid #cbcbcb;
      background: #fff;
      padding: 10px 15px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      border-radius: 5px;
      -webkit-transition: all 0.5s ease;
      -moz-transition: all 0.5s ease;
      -ms-transition: all 0.5s ease;
      -o-transition: all 0.5s ease;
      transition: all 0.5s ease;
      }
      
      .sideber2 .widghet .contact-form form fieldset textarea:focus {
      border: 1px solid #ff8707;
      }
      
      .sideber2 .widghet .contact-form form button {
      display: block;
      width: 100%;
      }
      
      .sideber2 .widghet .contact-form p {
      margin: 10px 0 0;
      color: #c3c3c3;
      }
      
      .sideber2 .widghet .contact-form p a {
      color: #ff8707;
      }
      
      .sideber2 .widghet .user_profle {
      text-align: center;
      display: block;
      }
      
      .sideber2 .widghet .user_profle figure {
      width: 128px;
      height: 128px;
      overflow: hidden;
      vertical-align: middle;
      margin: 0 auto 18px;
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;
      -ms-border-radius: 100%;
      border-radius: 100%;
      }
      
      .sideber2 .widghet .user_profle figure img {
      width: 100%;
      -webkit-transition: all 0.5s ease;
      -moz-transition: all 0.5s ease;
      -ms-transition: all 0.5s ease;
      -o-transition: all 0.5s ease;
      transition: all 0.5s ease;
      }
      
      .sideber2 .widghet .user_profle .contents {
      display: block;
      }
      
      .sideber2 .widghet .user_profle .contents h4 {
      display: block;
      margin: 0 0 10px;
      font-weight: 500;
      text-transform: uppercase;
      }
      
      .sideber2 .widghet .user_profle .contents h4 a {
      color: #ff8707;
      }
      
      .sideber2 .widghet .user_profle .contents em {
      color: #3c3c3c;
      font-weight: 500;
      font-size: 15px;
      }
      
      .sideber2 .widghet .user_profle .contents p {
      margin: 0 0 15px;
      font-size: 13px;
      }
      
      .sideber2 .widghet .user_profle .contents ul {
      display: block;
      margin: 0 0 25px;
      }
      
      .sideber2 .widghet .user_profle .contents ul li {
      display: inline-block;
      padding: 0 4px;
      }
      
      .sideber2 .widghet .user_profle .contents ul li a {
      display: block;
      width: 40px;
      height: 40px;
      line-height: 38px;
      font-size: 24px;
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;
      -ms-border-radius: 100%;
      border-radius: 100%;
      }
      
      .sideber2 .widghet .user_profle .contents ul li:first-child {
      padding-left: 0;
      }
      
      .sideber2 .widghet .user_profle .contents ul li:last-child {
      padding-right: 0;
      }
      
      .sideber2 .widghet .user_profle .contents ul li:nth-child(1) a {
      border: 1px solid #375d93;
      color: #375d93;
      }
      
      .sideber2 .widghet .user_profle .contents ul li:nth-child(2) a {
      border: 1px solid #43afe9;
      color: #43afe9;
      }
      
      .sideber2 .widghet .user_profle .contents ul li:nth-child(3) a {
      border: 1px solid #007eb3;
      color: #007eb3;
      }
      
      .sideber2 .widghet .user_profle .contents .dnr {
      display: inline-block;
      padding: 0 15px;
      line-height: 44px;
      height: 46px;
      font-size: 16px;
      color: #82d808;
      border: 1px solid #82d808;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      border-radius: 5px;
      }
      
      .sideber2 .widghet .user_profle .contents .dnr:hover {
      background: #82d808;
      color: #fff;
      }
      
      .sideber2 .widghet.frd {
      box-shadow: none;
      background: #f1f1f1;
      }
      
      .sideber2 .widghet.frd .featureds {
      display: block;
      position: relative;
      }
      
      .sideber2 .widghet.frd .featureds .list-arc {
      overflow: hidden;
      vertical-align: middle;
      margin: 0 0 28px;
      }
      
      .sideber2 .widghet.frd .featureds .list-arc .ico {
      float: left;
      width: 36px;
      font-size: 18px;
      }
      
      .sideber2 .widghet.frd .featureds .list-arc .con {
      float: right;
      width: calc(100% - 36px);
      }
      
      .sideber2 .widghet.frd .featureds .list-arc .con h4 {
      font-size: 15px;
      color: #3c3c3c;
      margin: 0 0 5px;
      font-weight: 500;
      }
      
      .sideber2 .widghet.frd .featureds .list-arc .con p {
      margin: 0;
      color: #848484;
      font-size: 15px;
      }
      
      .sideber2 .widghet.frd .featureds .list-arc:nth-child(1) .ico {
      color: #237be7;
      }
      
      .sideber2 .widghet.frd .featureds .list-arc:nth-child(2) .ico {
      color: #08c478;
      }
      
      .sideber2 .widghet.frd .featureds .list-arc:nth-child(3) .ico {
      color: #ff8707;
      }
      
      .sideber2 .widghet.frd .featureds .list-arc:nth-child(4) .ico {
      color: #f9a718;
      }
      
      .sideber2 .widghet.frd .featureds .list-arc:nth-child(5) .ico {
      color: #6dd8ad;
      }
      
      .sideber2 .widghet.frd .featureds button {
      display: block;
      width: 100%;
      }
      </style>   
      </body>
      </html>  
                  
               
  
  
  `
      arr.forEach(function (item) {
        User.findOne({ _id: req.params.ownerlink }).exec((err, done) => {
          var emailUser = done.local.NTD.Email
          var body = `
      <div class="sideber2">
                      <div style="margin-top: 20px;text-align: left;" class="widghet">
                        <center>
                          <img style="width: 40%; border-radius: 15px;" src="https://tuyendung.me/logo_new.jpg" alt="">
                        </center>
                          <h3>Chào Bạn ${upTocCase(req.body.NameUT)},</h3>
                          <h4>Admin đã nhận được thông tin ứng tuyển của bạn</h4>
                        </div>
                      </div>
                      <div class="sideber2">
                      <div style="margin-top: 20px;text-align: center;" class="widghet">

                          <h2>Admin gửi bạn JD công Việc</h2>
                          <h2>Xem tại file đình kèm</h2>
                          <h4>Cám ơn Bạn dã quan tâm công việc và ứng tuyển</h4>
                          <img style="width: 100%; border-radius: 15px;" src="https://static.vecteezy.com/system/resources/previews/003/030/926/non_2x/happy-chinese-new-year-2022-cartoon-cute-tiger-holding-big-gold-ingot-vector.jpg" alt="">
      </div>
                    </div>
      `
          var body2 = `
      <div class="sideber2">
                      <div style="margin-top: 20px;text-align: left;" class="widghet">
                        <center>
                          <img style="width: 40%; border-radius: 15px;" src="https://tuyendung.me/logo_new.jpg" alt="">
                        </center>
                          <h3>Bạn nhận được CV ứng tuyển ${upTocCase(req.body.NameUT)},</h3>
                          <h4>Vui lòng kiểm tra thông tin ứng viên ứng tuyển</h4>
                        </div>
                      </div>
                      
      `
          var mailOptions = {
            from: 'sp.bi.fell@gmail.com',
            to: req.body.EmailUT,
            subject: 'Ứng Tuyển Thành Công Vị Trí' + req.body.vitriungtuyen,
            html: header + body + footer,
            attachments: [
              {
                filename: item.JD_Url,
                content: "File JD Công Việc" + req.body.vitriungtuyen,
                path: 'https://tuyendung.me/files/' + item.JD_Url,
                contentType: item.contentType
              }
            ],
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log(info)
            }
          })
          var mailOptions2 = {
            from: 'sp.bi.fell@gmail.com',
            to: emailUser,
            subject: 'Thông báo ứng viên ứng tuyển' + req.body.vitriungtuyen,
            html: header + body2 + footer,
          };
          transporter.sendMail(mailOptions2, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log(info)
            }
          })
        })

      })
    })
    const time = getTime(Date.now())
    if (req.files['fileUT'] || req.files['fileCV']) {
      newApplys = new newApplicant()
      newApplys.OwnerLink = req.params.ownerlink
      newApplys.NameUT = upTocCase(req.body.NameUT)
      if (req.body.Gioitinh == "Nam") {
        newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/user-male.png"
      }
      if (req.body.Gioitinh == "Nữ") {

        newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/brown-curly-hair-lady-with-red-glasses.png"
      }
      if (req.files['fileUT']) {
        newApplys.Avata = req.files['fileUT'][0].filename
      }
      if (req.files['fileCV']) {
        newApplys.fileAttach.url = req.files['fileCV'][0].filename
        newApplys.fileAttach.contentType = req.files['fileCV'][0].contentType
      }
      newApplys.Honnhan = req.body.Honnhan
      let date_ob1 = new Date(req.body.Ngaysinh);
      let dateNgaysinh = date_ob1.getDate();
      let monthNgaysinh = date_ob1.getMonth() + 1;
      let yearNgaysinh = date_ob1.getFullYear();
      newApplys.Ngaysinh = dateNgaysinh + "/" + monthNgaysinh + "/" + yearNgaysinh
      newApplys.Quequan = req.body.Quequan
      newApplys.Noisinh = req.body.Noisinh
      newApplys.CMND = req.body.CMND
      newApplys.NCCMND = req.body.NCCMND
      let date_ob2 = new Date(req.body.NgayCCMND);
      let dateNgayCCMND = date_ob2.getDate();
      let monthNgayCCMND = date_ob2.getMonth() + 1;
      let yearNgayCCMND = date_ob2.getFullYear();
      newApplys.NgayCCMND = dateNgayCCMND + "/" + monthNgayCCMND + "/" + yearNgayCCMND
      newApplys.PhoneUT = req.body.PhoneUT
      newApplys.EmailUT = req.body.EmailUT
      newApplys.DCTT = req.body.DCTT
      newApplys.DCLL = req.body.DCLL
      newApplys.Gioithieu = req.body.Gioithieu
      newApplys.BMLV = req.body.BMLV
      newApplys.vitriungtuyen = req.body.vitriungtuyen
      newApplys.Noxau = req.body.Noxau
      newApplys.hoctap = req.body.hoctap
      newApplys.Kinhnghiem = req.body.Kinhnghiem
      newApplys.Giadinh = req.body.Giadinh
      newApplys.FiffterNgay = time.date
      newApplys.FiffterThang = time.month
      newApplys.FillterNam = time.year
      newApplys.DateTime = time.dateNew
      newApplys.Time = time.timeNew
      newApplys.BonusGTNS.StatusCheck = "Processing"
      newApplys.BonusGTNS.Step1.Title = "Tìm ứng viên"
      newApplys.BonusGTNS.Step1.Message = "Đã gửi thông tin phỏng vấn .Chờ kết quả"
      newApplys.BonusGTNS.Step2.Title = "Kết quả phỏng Vấn"
      newApplys.BonusGTNS.Step2.Message = "Thông báo kết quả phỏng vấn ứng viên"
      newApplys.BonusGTNS.Step3.Title = "Check Lần 1"
      newApplys.BonusGTNS.Step3.Message = "Kiểm tra quá trình làm việc ứng viên trong tháng đầu tiên"
      newApplys.BonusGTNS.Step4.Title = "Check Lần 2"
      newApplys.BonusGTNS.Step4.Message = "Kiểm tra quá trình làm việc ứng viên trong tháng thứ 2"
      newApplys.BonusGTNS.Step5.Title = "Kết quả"
      newApplys.BonusGTNS.Step5.Message = "Kết quả Bonus giới thiệu nhân sự"
      newApplys.save((err, done) => {
        res.redirect("/new-form-applications&owerlink=" + req.params.ownerlink + "?message=Ung-Tuyen-Thanh-Cong")

      })
    }
    else {
      newApplys = new newApplicant()
      newApplys.OwnerLink = req.params.ownerlink
      newApplys.NameUT = upTocCase(req.body.NameUT)
      newApplys.Gioitinh = req.body.Gioitinh
      if (req.body.Gioitinh == "Nam") {
        newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/user-male.png"
      }
      if (req.body.Gioitinh == "Nữ") {

        newApplys.Avata = "https://img.icons8.com/bubbles/10000/000000/brown-curly-hair-lady-with-red-glasses.png"
      }
      newApplys.Honnhan = req.body.Honnhan
      let date_ob1 = new Date(req.body.Ngaysinh);
      let dateNgaysinh = date_ob1.getDate();
      let monthNgaysinh = date_ob1.getMonth() + 1;
      let yearNgaysinh = date_ob1.getFullYear();
      newApplys.Ngaysinh = dateNgaysinh + "/" + monthNgaysinh + "/" + yearNgaysinh
      newApplys.Quequan = req.body.Quequan
      newApplys.Noisinh = req.body.Noisinh
      newApplys.CMND = req.body.CMND
      newApplys.NCCMND = req.body.NCCMND
      let date_ob2 = new Date(req.body.NgayCCMND);
      let dateNgayCCMND = date_ob2.getDate();
      let monthNgayCCMND = date_ob2.getMonth() + 1;
      let yearNgayCCMND = date_ob2.getFullYear();
      newApplys.NgayCCMND = dateNgayCCMND + "/" + monthNgayCCMND + "/" + yearNgayCCMND
      newApplys.PhoneUT = req.body.PhoneUT
      newApplys.EmailUT = req.body.EmailUT
      newApplys.DCTT = req.body.DCTT
      newApplys.DCLL = req.body.DCLL
      newApplys.Gioithieu = req.body.Gioithieu
      newApplys.BMLV = req.body.BMLV
      newApplys.vitriungtuyen = req.body.vitriungtuyen
      newApplys.Noxau = req.body.Noxau
      newApplys.hoctap = req.body.hoctap
      newApplys.Kinhnghiem = req.body.Kinhnghiem
      newApplys.Giadinh = req.body.Giadinh
      newApplys.FiffterNgay = time.date
      newApplys.FiffterThang = time.month
      newApplys.FillterNam = time.year
      newApplys.DateTime = time.dateNew
      newApplys.Time = time.timeNew
      newApplys.BonusGTNS.StatusCheck = "Processing"
      newApplys.BonusGTNS.Step1.Title = "Tìm ứng viên"
      newApplys.BonusGTNS.Step1.Message = "Đã gửi thông tin phỏng vấn .Chờ kết quả"
      newApplys.BonusGTNS.Step2.Title = "Kết quả phỏng Vấn"
      newApplys.BonusGTNS.Step2.Message = "Thông báo kết quả phỏng vấn ứng viên"
      newApplys.BonusGTNS.Step3.Title = "Check Lần 1"
      newApplys.BonusGTNS.Step3.Message = "Kiểm tra quá trình làm việc ứng viên trong tháng đầu tiên"
      newApplys.BonusGTNS.Step4.Title = "Check Lần 2"
      newApplys.BonusGTNS.Step4.Message = "Kiểm tra quá trình làm việc ứng viên trong tháng thứ 2"
      newApplys.BonusGTNS.Step5.Title = "Kết quả"
      newApplys.BonusGTNS.Step5.Message = "Kết quả qúa trình hoàn thành của ứng viên"
      newApplys.save((err, done) => {

        res.redirect("/new-form-applications&owerlink=" + req.params.ownerlink + "?message=Ung-Tuyen-Thanh-Cong")

      })
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.post("/create-vitrituyendung", isLoggedIn, upload.single("FileJD"), async (req, res,next) => {
    try{
    const arrVitri = []
    const arrTypeJob = []
    const arr = req.body.selectmultiple
    arr.forEach(function (item) { arrTypeJob.push({ "titleType": item }) })
    arrVitri.push({ JD_Url: req.file.filename, contentType: req.file.contentType, NameJob: req.body.titleVitrituyendung, infomation: req.body.Form })
    await CreateForm.update({ _id: req.body.chooseForm, IDUserCreate: req.user._id }, {
      $set: {
        "VitriUngTuyen": arrVitri,
        "TypeJob": arrTypeJob
      }
    }).exec((err, done) => {
      if (err) {
        res.render("View-profile/404.ejs")
      }
      res.redirect("profile?message=" + encodeURIComponent("CreatteFileJD"))
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.post("/create-new-vitrituyendung", upload.single("FileJD"), isLoggedIn, function (req, res,next) {
    try{
    var newtindang = new tindang()
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    if (req.file) {
      newtindang.Title = req.body.Title
      newtindang.NameCompany = req.body.NameCompany
      newtindang.FileJD = req.file.filename
      newtindang.Detail = req.body.Detail
      newtindang.DetailInterview = req.body.DetailInterview
      newtindang.FiffterNgay = date
      newtindang.FiffterThang = month
      newtindang.FillterNam = year
      newtindang.save((err, done) => {
        if (err) {
          return err
        }
        else {
          res.redirect('/tindang-tuyendung?message=' + encodeURIComponent('applysussces'))
        }
      })
    }
    else {
      newtindang.Title = req.body.Title
      newtindang.NameCompany = req.body.NameCompany
      newtindang.Detail = req.body.Detail
      newtindang.FiffterNgay = date
      newtindang.FiffterThang = month
      newtindang.FillterNam = year
      newtindang.save((err, done) => {
        if (err) {
          return err
        }
        else {
          res.redirect('/tindang-tuyendung?message=' + encodeURIComponent('applysussces'))
        }
      })
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.get("/delete-tin-dang-Admin&idpost=:idhcns", isLoggedIn, function (req, res,next) {
    try{
    tindang.remove({ _id: req.params.idhcns }).exec((err, result) => {
      res.redirect('/tindang-tuyendung?message=' + encodeURIComponent('applysussces'))
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.get('/tindang-tuyendung', isLoggedIn, function (req, res,next) {
    try{
    if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
      User.find({ "local.Type": 1 }).exec((err, resultCompany) => {
        tindang.find({}).sort({ _id: -1 }).exec((err, result) => {
          res.render('View-Client/New-Application/create-new.ejs', { user: req.user, resultCompany: resultCompany, result: result, message: "", messagee: "" });
        })
      })
    } else {
      res.render("View-profile/404.ejs")
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })

  
  function notication_applicant(_name_uv, _email, _phone, _position, _academic_level) {
    const time = getTime(Date.now())
    const smsbody = `GALAXYDR%0D%0ATHƯ MỜI PHỎNG VẤN.%0D%0A Gửi bạn:${_name_uv}%0D%0A Vị trí:${_position}%0D%0AThời gian 9:00 hoặc 14:00-${time.dayname_next}%0D%0A Tại: Số 5 Đường D1 PVL Linh Tây Tower,P.Linh Tây Thủ Đức.` + `%0D%0A` + `Liên hệ:093.18.666.98 Đức Anh`
    const EmailBody = `<head>
    <title>Ứng Viên Ứng Tuyển</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
        #outlook a {
            padding: 0;
        }
        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass {
            width: 100%;
        }

        .ExternalClass * {
            line-height: 100%;
        }

        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        p {
            display: block;
            margin: 13px 0;
        }
    </style>
    <!--[if !mso]><!-->
    <style type="text/css">
        @media only screen and (max-width:480px) {
            @-ms-viewport {
                width: 320px;
            }

            @viewport {
                width: 320px;
            }
        }
    </style>
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
    <style type="text/css">
        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
    </style>
    <style type="text/css">
        @media only screen and (min-width:480px) {

            .mj-column-per-100,
            * [aria-labelledby="mj-column-per-100"] {
                width: 100% !important;
            }
        }
    </style>
</head>

<body style="background: #F9F9F9;">
    <div style="background-color:#F9F9F9;">
        <style type="text/css">
            html,
            body,
            * {
                -webkit-text-size-adjust: none;
                text-size-adjust: none;
            }

            a {
                color: #1EB0F4;
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        </style>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px;">
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:0px;" align="center">
                                                <table role="presentation" cellpadding="0" cellspacing="0"
                                                    style="border-collapse:collapse;border-spacing:0px;" align="center"
                                                    border="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="width:138px;text-align:center"><a href="https://tuyendung.me"
                                                                    target="_blank">
                                                                    </a><img alt="" title=""
                                                                        src="https://tuyendung.me/logo_vlvp_new_2022.png"
                                                                        style="width:60%;border-radius:15px;margin-bottom:2%;outline:none;text-decoration:none;></a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div  style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden">
            <div style="margin:0px auto;max-width:640px;background:#ffffff;">
                <table role="presentation" cellpadding="0" cellspacing="0"
                    style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0">
                    <tbody>
                        <tr>
                            <td
                                style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;">
                                <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                    style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                        <tbody>
                                            <tr>
                                                <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;"
                                                    align="left">
                                                    <div
                                                        style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">

                                                            <tr>
                                                                <td align="center" style="padding: 0px 10px 0px 10px;">
                                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                                        width="480">
                                                                        <tr>
                                                                            <td align="left" valign="top"
                                                                                style="padding: 30px 30px 20px 30px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
                                                                                <h1
                                                                                    style="font-size: 32px; font-weight: 400; margin: 0;color: #000;text-align:center">
                                                                                    Ứng Viên Ứng Tuyển</h1>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                                        width="480">
                                                                        <tr>
                                                                            <td align="left">
                                                                                <table width="100%" border="0"
                                                                                    cellspacing="0" cellpadding="0">
                                                                                    
                                                                                    <tr>
                                                                                    <th align="left" valign="top"
                                                                                        style="padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;color: #000">
                                                                                        Ứng Viên:</th>
                                                                                    <td align="left" valign="top" style=";padding-bottom:10px;font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;color: #000">${_name_uv}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                <th align="left" valign="top"
                                                                                    style="padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;color: #000">
                                                                                  Phone :</th>
                                                                                <td align="left" valign="top"
                                                                                    style=";padding-bottom:10px;font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;color: #000">
                                                                                    <a href="sms://${_phone}/&body=${smsbody}" target="_blank">${_phone}</a></td>
                                                                            </tr>
                                                                                    <tr>
                                                                                        <th align="left" valign="top"
                                                                                            style="padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;color: #000">
                                                                                            E-Mail :</th>
                                                                                        <td align="left" valign="top"
                                                                                            style=";padding-bottom:10px;font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;color: #000">
                                                                                            ${_email}</td>
                                                                                    </tr>
                                                                                   
                                                                                    <tr>
                                                                                        <th align="left" valign="top"
                                                                                            style="padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;color: #000">
                                                                                            Vị trí :</th>
                                                                                        <td align="left" valign="top"
                                                                                            style=";padding-bottom:10px;font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;color: #000">
                                                                                            ${_position}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <th align="left" valign="top"
                                                                                            style="padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;color: #000">
                                                                                            Học Vấn :</th>
                                                                                        <td align="left" valign="top"
                                                                                            style=";padding-bottom:10px;font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;color: #000">
                                                                                            ${_academic_level}</td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>

                                                        </table>

                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="word-break:break-word;font-size:0px;padding:10px 25px;"
                                                    align="center">
                                                    
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div style="margin:0px auto;max-width:640px;background:transparent;">
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="font-size:0px;width:100%;background:transparent;" align="center" border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:0px;">
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;">
                                                <div style="font-size:1px;line-height:12px;">&nbsp;</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div
            style="margin:0 auto;max-width:640px;background:#ffffff;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden;">
            <table cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center"
                border="0">
                <tbody>
                    <tr>
                        <td style="text-align:center;vertical-align:top;font-size:0px;padding:0px;">
                            <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                        <tr>
                                            <td style="word-break:break-word;font-size:0px;padding:30px 70px 0px 70px;"
                                                align="center">
                                                <div style="margin:0px auto;max-width:640px;background:transparent;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0"
                                                        style="font-size:0px;width:100%;background:transparent;"
                                                        align="center" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:20px 0px;">
                                                                    <div aria-labelledby="mj-column-per-100"
                                                                        class="mj-column-per-100 outlook-group-fix"
                                                                        style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                                                        <table role="presentation" cellpadding="0"
                                                                            cellspacing="0" width="100%" border="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td style="word-break:break-word;font-size:0px;padding:0px;"
                                                                                        align="center">
                                                                                        <div
                                                                                            style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                                                            Được gửi từ OfficeJob
                                                                                        </div>
                                                                                        <br>
                                                                                        <div
                                                                                        style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                                                        Hotline : 093.18.666.98
                                                                                    </div>
                                                                                    </td>
                                                                                    
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style="word-break:break-word;font-size:0px;padding:0px;"
                                                                                        align="center">
                                                                                        <div
                                                                                            style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                                                            Số 5 Đường D1 Tòa nhà PVL Linh Tây P.Linh Tây TP.Thủ Đức TP.HCM VietNam
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                            </div>

</body>`
    Send_Email("sp.bi.fell@gmail.com", "cficdtpwxlfvqbfj", EmailBody, "anh.le@galaxydr.com.vn", `Ứng Viên ${_name_uv} ứng tuyển ${_position}`, "")
  }
};
