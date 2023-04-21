
module.exports = function (app, isLoggedIn, shareCV, getTime, upload, Email, EmailNTD, crypto, path, SaveLog, Logs, User, Send_Email, ShortUrl, QRcode, conn, mongoose, Grid, ListViecLam, _ip_block_s,ListViecLam) {
  // User.findOne({"local.email":"admin@vieclamvp.com"},{$set:{"permission.share_cv":true}}).exec((err,done)=>{
  //   console.log(done)
  // })

  var gfs;
  conn.once('open', function () {
    gfs = Grid(conn, mongoose.mongo);
    gfs.collection('uploads');
    console.log("opend")
  });
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
      user: 'trannguyet.ttv@gmail.com',
      pass: 'pdefoymddspjmvsq'
    }
  });
  app.get("/2023", async function (req, res) {
    try {
     
      res.render("View-profile/new-year-2023.ejs")
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  
  shareCV.updateMany({"more.status_pending":false},{$set:{"more.status_pending":true,DateUpload:"10/02/2023"}}).exec((err,done)=>{
      console.log(done)
    })

  // shareCV.find({"more.status_pending":false}).exec((err,done)=>{
  //     console.log(done)
  //   })
  // shareCV.remove({_id:"63a9450f82b2f1000492d2b7"}).exec((err,done)=>{
  //   ShortUrl.remove({short:"NCRb4dn3Q"}).exec((err,done)=>{  console.log(done)
  //   })
  //   console.log(done)
  // })

  app.get("/cv-ung-vien/:id", async function (req, res) {

    var result_radom = await random_share_cv(9)
    var filename = req.params.id
    gfs.files.findOne({ filename: filename }, (err, file) => {
      if (file) {
        var link = `files/${filename}`
        res.render("View-client-v2/share/public-cv.ejs", { link: link, user: "", result_radom: result_radom })
      }
      else {
        res.render("View-profile/sucssce.ejs", { message: "File Không Tồn Tại", code: 404 })
      }
    })

  })
  app.get("/upload-share-cv", async (req, res) => {
    res.render("View-client-v2/share/upload-cv.ejs")
  })
  app.post("/upload-sharecv", upload.single('file-sharecv'), async (req, res, next) => {
    try {
      if (req.file) {
        const Time = getTime(Date.now())
        newshareCV = new shareCV()
        var mykey = crypto.createCipher('aes-128-cbc', req.body.EmailUngVien + Time.dateNew + Time.minutes);
        var mystr = mykey.update('abc', 'utf8', 'hex')
        mystr += mykey.final('hex');
        newshareCV.PassDelete = mystr
        newshareCV.PhoneUngVien = req.body.PhoneUngVien
        newshareCV.EmailUngVien = req.body.EmailUngVien
        newshareCV.TilteCV = req.body.Title
        newshareCV.TypeCV = req.body.TypeCV
        newshareCV.Area = req.body.Area
        newshareCV.DateUpload = Time.dateNew
        newshareCV.FileCV = req.file.filename
        newshareCV.more.id_author = req.body.nguon
        newshareCV.more.name_author = "Đang Cập Nhật"
        newshareCV.more.status_pending = false
        if (req.body.Note == "") {
          newshareCV.DetailCV = "Đang cập nhật"
        } else {
          newshareCV.DetailCV = req.body.Note
        }
        newshareCV.save(async function (err, done) {
          if (err) {
            return err
          }
          else {
            var body = `
            <head>
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
        <body style="color: transparent;
        background-image: linear-gradient( to right bottom, #FFA2DD, #00aefd );">
            <div style="color: transparent;
            background-image: linear-gradient( to right bottom, #FFA2DD, #00aefd );">
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
                                    <td>
                                        <div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix"
                                            style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;">
                                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                                    <tbody>
                                                        
                                                        <tr>
                                                            <td align="center"><img style="width:50%;border-radius:10px;margin-top: 5%;" src="https://tuyendung.me/logo_vlvp_new_2022.png" alt="" class="em_img2"></td>
                                                        </tr>
                                                        <tr>
                                                      <td valign="top" align="center"><table align="center" border="0" cellspacing="0" cellpadding="0"  class="em_wrapper">
                                                          <tbody>
                                                            <tr>
                                                                <td height="10" style="font-size:0px; line-height:0px; height:10px;">&nbsp;</td>
                                                                </tr>
                                                          <tr>
                                                            <td class="em_text2" align="center" valign="top" style="margin-top: 5%;font-family:'Open Sans', Arial, sans-serif; font-size:20px; line-height:24px; color:#000000;"><h3 style="top:10px">Dear ${done.DetailCV}</strong></h3></td>
                                                          </tr>
                                                          <tr>
                                                            <td class="em_text2" align="left" valign="top" style="font-family:'Open Sans', Arial, sans-serif; font-size:14px; line-height:24px; color:#000000;">
                                                              <li>Curriculum Vitae của Bạn đã được chia sẻ đến Nhà Tuyển Dụng tại OfficeJob</li>
                                                              <li>Hồ sơ của bạn được lưu tại :<a href="https://tuyendung.me/detail-sharecv-ung-vien-tim-viec=${done._id}">Xem hồ sơ</a> </li>
                                                            </td>
                                                            <td height="10" style="font-size:0px; line-height:0px; height:10px;">&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td height="15" style="font-size:0px; line-height:0px; height:15px;">&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td class="em_text4" align="center" valign="top" style="font-family:'Open Sans', Arial, sans-serif; font-size:15px; line-height:22px; color:#000000; font-weight:600; padding:0px 30px;">
                                                                 Bạn đã tìm được công việc phù hợp?<br>Bạn muốn gỡ CV của bạn trên hệ thống OfficeJob
                                                            </td>
                                                          </tr>
                                                         
                                                          <tr>
                                                            <td height="15" style="font-size:10px; line-height:0px; height:15px;">&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td style="color: #000" height="15" class="em_text4" align="center">Mật khẩu gỡ thông tin</td>
                                                          </tr>
                                                          <tr>
                                                            <td height="15" style="font-size:10px; line-height:0px; height:15px;">&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td valign="top" align="center" class="em_wrapperA"><table align="center"  border="0" cellspacing="0" cellpadding="0" style="width:100%; border-radius:3px;" bgcolor="#cd4628" class="em_wrapper">
                                                                <tbody><tr>
                                                
                                                                  <td valign="top" align="center"><table align="center" border="0" cellspacing="0" cellpadding="0" style="width:100%; border-radius:3px" bgcolor="#cd4628" class="em_wrapper">
                                                                      <tbody><tr>
                                                                     
                                                                        <td style="color: #000;font-weight: 400;" class="em_cta em_white" height="43" align="center" valign="middle">${done.PassDelete}</a></td>
                                                                      </tr>
                                                                    </tbody></table></td>
                                                                </tr>
                                                              </tbody></table></td>
                                                          </tr>
                                                          <tr>
                                                            <td height="15" style="font-size:0px; line-height:0px; height:15px;">&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td align="center">
                                                              <a  href="https://tuyendung.me/Delete-Cv-ungvien=${done._id}" target="_blank" style="    width: 100%;
                                                            background-color: var(--primary) !important;
                                                            border-color: var(--primary) !important;
                                                            display: inline-block;
                                                            font-weight: 600;
                                                            text-align: center;
                                                            vertical-align: middle;
                                                            user-select: none;
                                                            border: 1px solid transparent;
                                                            height: 40px;
                                                            font-size: 1rem;
                                                            line-height: 2.5;
                                                            border-radius: 15px;
                                                            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                                                            cursor: pointer;" >
                                                                Gỡ thông tin của bạn
                                                            </a>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td height="15" style="font-size:0px; line-height:0px; height:15px;">&nbsp;</td>
                                                          </tr>
                                                          <tr>
                                                            <td height="40" style="font-size:0px; line-height:0px; height:40px;">&nbsp;</td>
                                                          </tr>
                                                       
                                                        </tbody></table></td>
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
                <div  style="margin:0 auto;max-width:640px;background:#ffffff;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden;">
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
                                                                                                <div style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                                                                     <h2 style="color: #99aab5;
                                                                                                     font-family: Rubik, sans-serif;
                                                                                                     font-size: 20px;
                                                                                                     letter-spacing: 1px;">OfficeJob Hỗ Trợ Tuyển Dụng</h2>
                                                                                                </div>
                                                                                                <br>
                                                                                                <div
                                                                                                style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                                                                <img style="height:20px;width:20px" src="https://img.icons8.com/ios/50/000000/email-open.png" class="CToWUd">Email   : anh.le@tuyendung.me <br>
                                                                                                <img style="height:20px;width:20px" src="https://img.icons8.com/ios/50/000000/phone.png" class="CToWUd">Hotline : 093.18.666.98 Đức Anh <br>
                                                                                                <img style="height:20px;width:20px" src="https://img.icons8.com/ios/50/000000/bank-card-front-side.png" class="CToWUd">Donate  : 123530427 - Ngân Hàng Việt Nam Thịnh Vượng VP BANK<br>
                                                                                            </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td style="word-break:break-word;font-size:0px;padding:0px;"
                                                                                                align="center">
                                                                                                <div
                                                                                                    style="cursor:auto;color:#99AAB5;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:12px;line-height:24px;text-align:center;">
                                                                                                    <img style="height:20px;width:20px" src="https://ci6.googleusercontent.com/proxy/yKYMQ9kO0bvzvCZHS1JaO-_XcjhtKcWS6Im04EbuVcvaMqqhr-i6neAsL0FSTkoEc978DvUKyGB6JFkntHA65FA6p1JhIAVQaFuq1tZL_q4=s0-d-e1-ft#https://img.icons8.com/material-rounded/50/000000/address.png" class="CToWUd">Số 5 Đường D1 Tòa nhà PVL Linh Tây P.Linh Tây TP.Thủ Đức TP.HCM VietNam
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
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
            </div>
        </body>
            `
            var new_create = await create_new_short_url(done._id, req.body.Title, req.body.Note, req.body.Area, Time.dateNew)
            Send_Email("vieclamvphcm@gmail.com", "zzhazydimvwgjknr", body, req.body.EmailUngVien, `OfficeJob Share CV: ${req.body.Note}`, "")
            res.render("View-profile/sucssce.ejs", { message: "Đã Chia Sẻ Ứng Viên(Upload Success)", code: 200 })
          }
        })
      } else {
        res.render("View-profile/sucssce.ejs", { message: "Bạn chưa có file đính kèm", code: 404 })
      }
    } catch (err) {
      res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
    }

  })
  async function create_new_short_url(_id, Title, Note, Area, Time) {
    console.log(_id)
    var newUrl = new ShortUrl()
    newUrl.full = "https://tuyendung.me/detail-sharecv-ung-vien-tim-viec=" + _id
    newUrl.createDate = Time
    newUrl.Titel = "Ứng viên : " + Note
    newUrl.meta_tag.code_center = "Share-cv"
    newUrl.meta_tag.code_url = "Share-cv"
    newUrl.meta_tag.Title = "Ứng viên : " + Note
    newUrl.meta_tag.Description = "Ứng tuyển vị trí :" + Title
    newUrl.meta_tag.Keywords = Area
    newUrl.meta_tag.url_image = "https://tuyendung.me/icon_officejob/2.png"
    newUrl.meta_tag.image_alt = "share_cv"
    newUrl.type_url.share_cv = true,
      newUrl.type_url.applicant = false,
      newUrl.type_url.project_job = false,
      newUrl.save(async function (err, done) {
        if (err) {
          return err
        }
        ShortUrl.update({ _id: done._id }, { $set: { ImageQR: "https://tuyendung.me/icon_officejob/2.png" } }).exec((err, result) => {
          console.log(result)
        })
        shareCV.update({ _id: _id }, { $set: { url_short: done.short } }).exec((err, results) => {
          console.log("Create short succes")
          return "Create short succes"
        })
      })
  }
  // app.get("/block-ip/:ip", async function (req, res) {
  //   var _ip_blocks = new _ip_block_s()
  //   _ip_blocks._ip_block = req.params.ip
  //   _ip_blocks.save(function (err, done) {
  //     var ip = req.params.ip
  //     var change = ip.replaceAll("-",'.')
  //     res.render('View-profile/404.ejs', { message: `Succes : ${change}` })
  //   })
  // })
  // _ip_block_s.remove({}).exec((err,done)=>{console.log(done)})
  const DeviceDetector = require('node-device-detector');
  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });

  const requestIp = require('request-ip')
  app.get("/radom/:type_radom",async (req, res, next) => {
    if(req.params.type_radom == "share_cv"){
      var element_radom = getRandomInt_1()
      var url_ =  await ShortUrl.findOne({"type_url.share_cv":true}).skip(element_radom).sort({_id:-1})
      res.send({short:url_.full+"?page=1"})
    }
    if(req.params.type_radom == "jobs"){
      var element_radom = getRandomInt_job()
      var url_ =  await ListViecLam.findOne({}).skip(element_radom).sort({_id:-1})
      res.send({short:"https://tuyendung.me/detail-job&idjob="+url_._id+"?page=1"})
    }
  })
  function getRandomInt_1() {
    return Math.floor((Math.random() * 30) + 1);
  }
  function getRandomInt_job() {
    return Math.floor((Math.random() * 20) + 1);
  }
  app.get("/detail-sharecv-ung-vien-tim-viec=:id", async (req, res, next) => {
    try {
      var page = req.query.page
      var user = req.user
      var id = req.params.id
      const result = await shareCV.findOne({ _id: id })
      var _time = getTime(Date.now())
      const userAgent = req.useragent.source;
      var clientIp = requestIp.getClientIp(req)
      const results = detector.detect(userAgent);
      var result_radom = await random_share_cv(6)
      var result_radom_s = await random_share_cv(10)
      if(page){
        if (!req.user) {
          if (result) {
            result.clicks++
            result.save()
            res.render("View-client-v2/share/detail-cv.ejs", { result: result, user: "", message: "", messagee: "", check_render_phone: false, result_radom: result_radom, result_radom_s: result_radom_s,google:"google_adsense"})
          } else {
            var element_radom = getRandomInt_1()
            var url_ =  await shareCV.findOne().skip(element_radom).sort({_id:-1})
            res.redirect(`/detail-sharecv-ung-vien-tim-viec=${url_._id}?page=1`)
          }
        } else {
          if (result) {
            result.clicks++
            result.save()
            if (req.user.permission.share_cv == true) {
              res.render("View-client-v2/share/detail-cv.ejs", { result: result, user: user, message: "", messagee: "", check_render_phone: true, result_radom: result_radom, result_radom_s: result_radom_s ,google:"google_adsense"})
            } else {
              res.render("View-client-v2/share/detail-cv.ejs", { result: result, user: user, message: "", messagee: "", check_render_phone: false, result_radom: result_radom, result_radom_s: result_radom_s ,google:"google_adsense"})
            }
          } else {
            var element_radom = getRandomInt_1()
            var url_ =  await shareCV.findOne().skip(element_radom).sort({_id:-1})
            res.redirect(`/detail-sharecv-ung-vien-tim-viec=${url_._id}?page=1`)
          }
        }
      }else{
        if (!req.user) {
          if (result) {
            result.clicks++
            result.save()
            res.render("View-client-v2/share/detail-cv.ejs", { result: result, user: "", message: "", messagee: "", check_render_phone: false, result_radom: result_radom, result_radom_s: result_radom_s,google:""})
          } else {
            res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
          }
        } else {
          if (result) {
            result.clicks++
            result.save()
            if (req.user.permission.share_cv == true) {
              res.render("View-client-v2/share/detail-cv.ejs", { result: result, user: user, message: "", messagee: "", check_render_phone: true, result_radom: result_radom, result_radom_s: result_radom_s,google:"" })
            } else {
              res.render("View-client-v2/share/detail-cv.ejs", { result: result, user: user, message: "", messagee: "", check_render_phone: false, result_radom: result_radom, result_radom_s: result_radom_s,google:"" })
            }
          } else {
            res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
          }
        }
      }
         
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/Delete-Cv-ungvien=:id", async (req, res, next) => {
    try {
      var id = req.params.id
      const result = await shareCV.findOne({ _id: id })
      if (result) {
        res.render("View-Client/ShareCV/Delete-CV-UngVien.ejs", { result: result })
      } else {
        res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.post("/UngVien-DeleteCV=:idsharecv", (req, res, next) => {
    try {
      shareCV.update({ _id: req.params.idsharecv, PassDelete: req.body.passDelete }, { $set: { StatusChecking: "off" } }).exec((err, done) => {
        res.redirect('/Share-cv?message=' + encodeURIComponent('applysussces'))
      })
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
 
  var rp = require('request-promise');
  app.get('/share-cv', async (req, res, next) => {
    var fullUrl_query = req.protocol + '://' + req.get('host') + req.originalUrl;
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    var path = url.split('?')[0]
    var fullUrl = path
    try {
      var google = req.query.reload 
        var time_s = getTime(Date.now())
        var top_5 = await top5()
        var report_count = await reportcount()
        var report_area = await reportarea()
        if (!req.user) {
          var page = req.query.page
          if (page) {
            if (page < 0) {
              page = 18;
            }
            page = parseInt(page)
            pagesize = parseInt(req.query.pagesize)
            if (pagesize < 0) {
              pagesize = 18;
            }
            const skip = (page - 1) * pagesize
            const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } })
            const sltht = Math.ceil(resultcount / pagesize)
            const result = await shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).sort({ _id: -1 }).skip(skip).limit(pagesize)
            res.render('View-client-v2/share/share-cv.ejs', {google:google, fullUrl: fullUrl,fullUrl_query: fullUrl_query, page_start: parseInt(page),
              check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: "",
              result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
          }
          else {
            const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } })
            const result = await shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).limit(18).sort({ _id: -1 })
            const pagesize = 18
            const sltht = Math.ceil(resultcount / pagesize)
            res.render('View-client-v2/share/share-cv.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: false,
              top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result,
              pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
          }
        }
        else {
          var page = req.query.page
          if (page) {
            if (page < 1) {
              page = 1;
            }
            page = parseInt(page)
            pagesize = parseInt(req.query.pagesize)
            if (pagesize < 1) {
              pagesize = 18;
            }
            var skip = (page - 1) * pagesize
            const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } })
            var sltht = Math.ceil(resultcount / pagesize)
            shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).sort({ _id: -1 }).skip(skip).limit(pagesize).exec((err, result) => {
              if (req.user.permission.share_cv == true) {
                res.render('View-client-v2/share/share-cv.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: true, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });

              } else {
                res.render('View-client-v2/share/share-cv.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
              }
            })
          }
          else {
            const resultcount = await shareCV.count()
            const result = await shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).limit(18).sort({ _id: -1 })
            var pagesize = 18
            var sltht = Math.ceil(resultcount / pagesize)
            if (req.user.permission.share_cv == true) {
              res.render('View-client-v2/share/share-cv.ejs', { fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: true, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
            } else {
              res.render('View-client-v2/share/share-cv.ejs', { fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
            }
          }
        }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  });
  var useragent = require('express-useragent');
  app.use(useragent.express());
  app.get('/cv', async (req, res, next) => {
    var google = req.query.reload 
    const userAgent = req.useragent.source;
    var _time = getTime(Date.now())
    var fullUrl_query = req.protocol + '://' + req.get('host') + req.originalUrl;
    var host = "https://" + req.get('host')
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    var path = url.split('?')[0]
    var fullUrl = path
    try {
      var time_s = getTime(Date.now())
      var top_5 = await top5()
      var report_count = await reportcount()
      var report_area = await reportarea()
      if (!req.user) {
        var page = req.query.page
        if (page) {
          if (page < 0) {
            page = 18;
          }
          page = parseInt(page)
          pagesize = parseInt(req.query.pagesize)
          if (pagesize < 0) {
            pagesize = 18;
          }
          const skip = (page - 1) * pagesize
          const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } })
          const sltht = Math.ceil(resultcount / pagesize)
          const result = await shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).sort({ _id: -1 }).skip(skip).limit(pagesize)
          res.render('View-client-v2/share/cv.ejs', {google:google,fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: "", result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
        }
        else {
          const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } })
          const result = await shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).limit(18).sort({ _id: -1 })
          const pagesize = 18
          const sltht = Math.ceil(resultcount / pagesize)
          res.render('View-client-v2/share/cv.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
        }
      }
      else {
        var page = req.query.page
        if (page) {
          if (page < 1) {
            page = 1;
          }
          page = parseInt(page)
          pagesize = parseInt(req.query.pagesize)
          if (pagesize < 1) {
            pagesize = 18;
          }
          var skip = (page - 1) * pagesize
          const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } })
          var sltht = Math.ceil(resultcount / pagesize)
          shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).sort({ _id: -1 }).skip(skip).limit(pagesize).exec((err, result) => {
            if (req.user.permission.share_cv == true) {
              res.render('View-client-v2/share/cv.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: true, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });

            } else {
              res.render('View-client-v2/share/cv.ejs', { google:google,fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
            }
          })
        }
        else {
          const resultcount = await shareCV.count()
          const result = await shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).limit(18).sort({ _id: -1 })
          var pagesize = 18
          var sltht = Math.ceil(resultcount / pagesize)
          if (req.user.permission.share_cv == true) {
            res.render('View-client-v2/share/cv.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: true, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
          } else {
            res.render('View-client-v2/share/cv.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
          }
        }
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  });
  app.get('/qa', async (req, res, next) => {
    const userAgent = req.useragent.source;
    var _time = getTime(Date.now())
    var fullUrl_query = req.protocol + '://' + req.get('host') + req.originalUrl;
    var host = "https://" + req.get('host')
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    var path = url.split('?')[0]
    var fullUrl = path
    try {
      var google = req.query.reload 
      var time_s = getTime(Date.now())
      var top_5 = await top5()
      var report_count = await reportcount()
      var report_area = await reportarea()
      if (!req.user) {
        var page = req.query.page
        if (page) {
          if (page < 0) {
            page = 18;
          }
          page = parseInt(page)
          pagesize = parseInt(req.query.pagesize)
          if (pagesize < 0) {
            pagesize = 18;
          }
          const skip = (page - 1) * pagesize
          const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } })
          const sltht = Math.ceil(resultcount / pagesize)
          const result = await shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).sort({ _id: -1 }).skip(skip).limit(pagesize)
          res.render('View-client-v2/share/qa.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: "", result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
        }
        else {
          const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } })
          const result = await shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).limit(18).sort({ _id: -1 })
          const pagesize = 18
          const sltht = Math.ceil(resultcount / pagesize)
          res.render('View-client-v2/share/qa.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
        }
      }
      else {
        var page = req.query.page
        if (page) {
          if (page < 1) {
            page = 1;
          }
          page = parseInt(page)
          pagesize = parseInt(req.query.pagesize)
          if (pagesize < 1) {
            pagesize = 18;
          }
          var skip = (page - 1) * pagesize
          const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } })
          var sltht = Math.ceil(resultcount / pagesize)
          shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).sort({ _id: -1 }).skip(skip).limit(pagesize).exec((err, result) => {
            if (req.user.permission.share_cv == true) {
              res.render('View-client-v2/share/qa.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: true, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });

            } else {
              res.render('View-client-v2/share/qa.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
            }
          })
        }
        else {
          const resultcount = await shareCV.count()
          const result = await shareCV.find({ StatusChecking: { $ne: "off" }, "more.status_pending": { $ne: false } }).limit(18).sort({ _id: -1 })
          var pagesize = 18
          var sltht = Math.ceil(resultcount / pagesize)
          if (req.user.permission.share_cv == true) {
            res.render('View-client-v2/share/qa.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: true, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
          } else {
            res.render('View-client-v2/share/qa.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
          }
        }
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  });
  // app.get("/search-cv",async (req, res, next) => {
  //   var top_5 = await top5()
  //   var report_count = await reportcount()
  //   var report_area = await reportarea()
  //   var data = await shareCV.find().limit(100).sort({_id:-1})
  //   res.render("View-client-v2/share/seach-share-cv.ejs",{data_s:data,top_5: top_5, report_count: report_count, report_area: report_area})
  // })
  app.get("/search-cv-type=:type&area=:area", async (req, res, next) => {
    var type = req.params.type
    var area = req.params.area
    if (type == "0" && area == "0") {
      var data = await shareCV.find().limit(18).sort({ _id: -1 })
      res.send(data)
    } else {
      if (type == "0" && area != "0") {
        var data = await shareCV.find({ Area: area }).limit(100).sort({ _id: -1 })
        res.send(data)
      }
      if (area == "0" && type != "0") {
        var data = await shareCV.find({ TypeCV: type }).limit(100).sort({ _id: -1 })
        res.send(data)
      }
      if (area != "0" && type != "0") {
        var data = await shareCV.find({ TypeCV: type, Area: area }).limit(100).sort({ _id: -1 })
        res.send(data)
      }
    }
  })
  async function top5() {
    const top_5 = await shareCV.find({ StatusChecking: { $ne: "off" } }).sort({ clicks: -1 }).limit(5)
    return top_5
  }
  async function reportcount() {
    const report_count = await shareCV.aggregate([
      {
        "$group": {
          "_id": "$TypeCV",
          "total": { "$sum": 1 },
        }
      },
      {
        "$project": {
          "total": 1
        }
      },
      { "$sort": { "total": -1 } }
    ])
    return report_count
  }
  async function reportarea() {
    const report_area = await shareCV.aggregate([
      {
        "$group": {
          "_id": "$Area",
          "total": { "$sum": 1 },
        }
      },
      {
        "$project": {
          "total": 1
        }
      },
      { "$sort": { "total": -1 } }
    ])
    return report_area
  }
  app.get("/api/v1/api_officejob/share_cv/auth_token&token=:token&limit=:limited", async (req, res, next) => {
    try {
      if (req.params.token == "share_cv_Officejob@2022") {
        const limited = parseInt(req.params.limited)
        const result = await shareCV.find({}).limit(limited).sort({ _id: -1 })
        res.send(result)
      } else {
        res.render('View-profile/404.ejs', { status: 404, message: "Lỗi xác thực,token không tồn tại" })
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get('/search-candidate', async (req, res, next) => {
    try {
      const user = ""
      if (!req.user) {
        const result = await shareCV.find({ TypeCV: req.query.search }).limit(60).sort({ _id: -1 })
        if (result == "") {
          res.render('View-Client/ShareCV/search_sharecv.ejs', { user: user, result: "nodata", messagee: "", message: "" });
        }
        else {
          res.render('View-Client/ShareCV/search_sharecv.ejs', { user: user, result: result, messagee: "", message: "" });
        }

      }
      else {
        const result = await shareCV.find({ TypeCV: req.query.search }).limit(60).sort({ _id: -1 })
        res.render('View-Client/ShareCV/search_sharecv.ejs', { result: result, user: req.user, messagee: "", message: "" });
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  });
  app.get('/utilities', isLoggedIn, async (req, res, next) => {
    try {
      if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
        const resultshare = await shareCV.find().sort({ _id: -1 })
        res.render('View-Client/ShareCV/utilities.ejs', { user: req.user, resultshare: resultshare, message: "", messagee: "" })

      } else {
        res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.post('/upload-sharecv', isLoggedIn, upload.single('file-sharecv'), async (req, res, next) => {
    try {
      if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
        const EmailTemplate = await EmailNTD.findOne({ _id: "61ae3b2b1f4927dd40fced26" })
        const Time = getTime(Date.now())
        newshareCV = new shareCV()
        var mykey = crypto.createCipher('aes-128-cbc', req.body.EmailUngVien + Time.dateNew + Time.minutes);
        var mystr = mykey.update('abc', 'utf8', 'hex')
        mystr += mykey.final('hex');
        newshareCV.PassDelete = mystr
        newshareCV.EmailUngVien = req.body.EmailUngVien
        newshareCV.TilteCV = req.body.Title
        newshareCV.TypeCV = req.body.TypeCV
        newshareCV.Area = req.body.Area
        newshareCV.DateUpload = Time.dateNew
        newshareCV.FileCV = req.file.filename
        if (req.body.Note == "") {
          newshareCV.DetailCV = "Đang cập nhật"
        } else {
          newshareCV.DetailCV = req.body.Note}
        newshareCV.save((err, done) => {
          if (err) {
            return err
          }
          else {
            const header = EmailTemplate.header
            const footer = EmailTemplate.footer
            var body = `
          <table align="center" width="677" border="0" cellspacing="0" cellpadding="0" style="width:677px;" class="em_wrapper">
          <tbody><tr>
            <td width="100" style="width:100px;" class="em_side">&nbsp;</td>
            <td valign="top" align="center"><table align="center" width="440" border="0" cellspacing="0" cellpadding="0" style="width:440px;" class="em_wrapper">
                <tbody><tr>
                  <td valign="middle" height="60" class="em_h200" style="font-size:0px; line-height:0px; height:60px;font-family:'Open Sans', Arial, sans-serif; font-size:12px; line-height:15px; color:#000000; text-align:center;"></td>
                </tr>
                <tr>
                  <td class="em_text2" align="center" valign="top" style="font-family:'Open Sans', Arial, sans-serif; font-size:14px; line-height:24px; color:#000000;"><h3 style="top:10px">Dear ${done.DetailCV} ,</strong></h3></td>
                 
                </tr>
                <tr>
                  <td class="em_text2" align="left" valign="top" style="font-family:'Open Sans', Arial, sans-serif; font-size:14px; line-height:24px; color:#000000;">
                    <li>Admin VLVP được chia sẽ thông tin của bạn</li>
                    <li>Admin xin phép được công khai thông tin tìm việc của bạn đến các nhà tuyển dụng thuộc đối tác VLVP . </li>
                    <li>Hồ sơ của bạn được lưu tại :<a href="https://tuyendung.me/detail-sharecv-ung-vien-tim-viec=${done._id}">Xem hồ sơ</a> </li>
                  </td>
                  <td height="10" style="font-size:0px; line-height:0px; height:10px;">&nbsp;</td>
                </tr>
                <tr>
                  <td height="15" style="font-size:0px; line-height:0px; height:15px;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="em_text4" align="center" valign="top" style="font-family:'Open Sans', Arial, sans-serif; font-size:15px; line-height:22px; color:#000000; font-weight:600; padding:0px 30px;">
                    Bạn muốn không muốn lưu thông tin ?<br>Admin  sẽ gỡ CV của bạn trên hệ thống
                     </td>
                </tr>
               
                <tr>
                  <td height="15" style="font-size:0px; line-height:0px; height:15px;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="em_text4" align="center">Mật khẩu để gỡ thông tin</td>
                </tr>
                <tr>
                  <td valign="top" align="center" class="em_wrapperA"><table align="center" width="365" border="0" cellspacing="0" cellpadding="0" style="width:365px; border-radius:3px; max-width:365px;" bgcolor="#cd4628" class="em_wrapper">
                      <tbody><tr>
      
                        <td valign="top" align="center"><table align="center" width="365" border="0" cellspacing="0" cellpadding="0" style="width:365px; border-radius:3px; max-width:365px;" bgcolor="#cd4628" class="em_wrapper">
                            <tbody><tr>
                           
                              <td style="width:auto" class="em_cta em_white" height="43" align="center" valign="middle" style="font-family:'Open Sans', Arial, sans-serif; font-size:15px; color:#ffffff; font-weight:bold;">${done.PassDelete}</a></td>
                            </tr>
                          </tbody></table></td>
                      </tr>
                    </tbody></table></td>
                </tr>
                <tr>
                  <td height="15" style="font-size:0px; line-height:0px; height:15px;">&nbsp;</td>
                </tr>
                <tr>
                  <td align="center">
                    <a  href="https://tuyendung.me/Delete-Cv-ungvien=${done._id}" target="_blank" class="contact-me" >
                      Gỡ thông tin của bạn
                  </a>
                  </td>
                </tr>
                <tr>
                  <td height="15" style="font-size:0px; line-height:0px; height:15px;">&nbsp;</td>
                </tr>
                
                <tr>
                <td valign="top" align="center"><img style="width:100%;border-radius:10px" src="https://tuyendung.me/gif/Officesjob.gif" alt="" class="em_img2"></td>
              </tr>
                <tr>
                  <td height="40" style="font-size:0px; line-height:0px; height:40px;">&nbsp;</td>
                </tr>
             
              </tbody></table></td>
            <td width="137" style="width:137px;" class="em_side">&nbsp;</td>
          </tr>
        </tbody>
      </table>
          `
            const htmlTemplate = header + body + footer
            var mailOptions = {
              from: 'trannguyet13122000@gmail.com',
              to: req.body.EmailUngVien,
              subject: 'Việc Làm Văn Phòng Share CV  : ' + req.body.Note,
              html: htmlTemplate,
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                if (error.responseCode == 550) {
                  res.redirect('/utilities?message=' + encodeURIComponent("Error Code:" + " " + error.responseCode + " " + "Message: Đã đạt giới hạn gửi thư"))
                }
                if (error.responseCode == 553) {
                  res.redirect('/utilities?message=' + encodeURIComponent(result + "Email không hợp lệ :" + error.recipient))
                }
              } else {
                res.redirect('/utilities?message=' + encodeURIComponent("Email :" + info.envelope.from))
              }
            })

          }
        })
      } else {
        res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get('/deleteShareCV=:id', isLoggedIn, (req, res, next) => {
    try {
      if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
        shareCV.remove({ _id: req.params.id }).exec((err, done) => {
          res.redirect('/utilities?message=' + encodeURIComponent('applysussces'))
        })
      } else {
        res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get('/deleteShareCV-ntd=:id&email=:EmailAdress', isLoggedIn, async (req, res, next) => {
    try {
      if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
        EmailNTD.update(
          { _id: req.params.id },
          { $pull: { ListNTD: { EmailAdress: req.params.EmailAdress } } }
        ).exec((err, done) => {
          res.redirect('/Spam-Email-NTD?message=' + encodeURIComponent('applysussces'))
        })
      } else {
        res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  const data_sharecv = require("../models/Data/Email_sharecv.js")
  app.get("/Send_email_marketing_data_all", async (req, res) => {
    const time_now = getTime(Date.now())
    var Quantitative = await data_sharecv.find({ "FillterMonth": "6", "History_send.Date": { $ne: time_now.dateNew } }).count();
    var i = 1
    var time_out = 1000
    var interval = 25000;
    for (i; i <= 100; i++) {
      const listEmail = await data_sharecv.findOne({ "FillterMonth": "6", "History_send.Date": { $ne: time_now.dateNew } }).limit(1).skip(i - 1)
      if (listEmail != "") {
        var result = await shareCV.find({}).limit(30).sort({ _id: -1 })
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
                  <td class="content" align="left" style="border-radius:15px;background-color:#ffffff">
                  <table width="600" border="0" cellpadding="0" cellspacing="0" class="force-row" style="width: 600px;">
                   
                    <tr>
                    <td class="content-wrapper" style="padding-left:24px;padding-right:24px;">
                  
                      <div class="sideber2">
                      <div style="margin-top: 20px;" class="widghet">`
        const footer = ` </div>
      </div>
  </td>
  </tr>
  
  </table>
  </td>
  </tr>
  </table>
  <br>
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
        var kq = []
        result.forEach(function (item) {
          const listUV = `
        <div style="margin-top: 10px;margin-bottom:5px; border: 1px solid #cbcbcb;
        margin: 0 0 30px;
        padding: 30px;
        -webkit-transition: 0 5px 10px rgba(0, 0, 0, 0.1);
        -moz-transition: 0 5px 10px rgba(0, 0, 0, 0.1);
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        -ms-border-radius: 5px;
        border-radius: 5px;">
        <li>Ứng Viên : <b>`+ item.DetailCV + `</b></li><li>Vị trí : <b>` + item.TilteCV + `</b></li>
        <li>Chuyên Ngành : <b>`+ item.TypeCV + `</b></li>
        <li>Khu Vực : <b> `+ item.Area + `</b></li>
        <li>Link CV( File PDF ): <a href="https://tuyendung.me/detail-sharecv-ung-vien-tim-viec=`+ item._id + `"><b>Xem chi tiết</b></a></li>
        </div>`
          kq.push(listUV)
        })
        let text = kq.toString();
        var previewlist = ` <div style="margin-bottom:10px" class="row">
        <div style="text-align: center;" class="col-md-12"> <img style="width: 30%;marin-top: 10px;border-radius:50%"
                src="https://tuyendung.me/logo_new.jpg" /></br>
            <h3 style="top:10px;text-align: left">Chào Bạn,</strong></h3>
            <h4 style="text-align: left">OfficeJob chia sẻ cho bạn hồ sơ ứng Viên tìm việc bạn xem qua nhé. 
            Hy vọng sẽ giúp cho bạn trong công việc 
            Nguồn do mình tổng hợp từ nhiều nguồn và cá nhân
            Chúc Bạn Hợp Tác Ứng Viên Ưng Ý. 
            </h4>
        </div> 
        `+
          text.replaceAll(",", "<br>")
          + `
      <div style="text-align: left;" class="col-md-12">
        <div class="sideber2">
          <div style="margin-top: 10px;text-align: center;"  class="widghet">
              <a  href="https://tuyendung.me/share-cv"><b>Xem thêm</b></a>
          </div>
        </div>
              <img style="width: 100%;height:auto;border-radius: 15px;margin-top: 20px;" src="https://tuyendung.me/sharecv.JPG">
              <p>Để Việc Làm Văn Phòng có chi phí duy trì, hãy giúp chúng tôi click 1 quảng cáo bất kì</p>
              <p>Xây dựng cộng đồng ShareCV,Chia sẻ hồ sơ tại link:<a href="https://tuyendung.me/nop-don-ung-tuyen"><b>Chia sẻ ứng viên</b></a> 
                <p>Thank you and Best regards,</p>
            </div>
        </div>
        <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%;" class="em_wrapper">
        <tbody>
        <tr>
        <td valign="top" align="center"><img style="width:100%;border-radius:10px" src="https://tuyendung.me/gif/Officesjob.gif" alt="" class="em_img2" ></td>
      </tr>
      <tr>
        <td height="40" style="font-size:0px; line-height:0px; height:40px;">&nbsp;</td>
      </tr>
        </tbody></table>
    </div>
      </div>`
        const htmlTemplate = header + previewlist + footer
        const History = listEmail.History_send
        const resultt = await History.filter(function (value) { return value.Date == time_now.dateNew; })
        const count_result = resultt.length
        if (count_result == 0) {
          setTimeout(async function () {
            data_sharecv.updateMany({ Email: listEmail.Email }, {
              $push: {
                History_send: {
                  Date: time_now.dateNew,
                  Hours: time_now.timeNew
                }
              }
            }).exec((err, reult) => {
              Send_Email("share.officejob.com@gmail.com", "fyxwtzwtglrjggxl", htmlTemplate, listEmail.Email, `OfficeJob Chia sẻ hồ sơ Ứng Viên ${time_now.dateNew}`, "")
              console.log("Email được gửi thành công id_mail: office_jobs_send_email_" + i + "/" + Quantitative)
            })

          }, i * interval);
        }
        else {
          setTimeout(async function () {
            timeLeft = 1;
            function countdown() {
              timeLeft--;
              console.log("Next--->Send_Mail--->After :" + timeLeft + "s")
              if (timeLeft > 0) {
                setTimeout(countdown, 1000);
              }
            };
            setTimeout(countdown, 1000);
            console.log("Mail_id:" + i + " Đã gửi Email cho địa chỉ :" + listEmail.Email)
          }, i * time_out);
        }


      }
      else {
        setTimeout(async function () {
          timeLeft = 5;
          function countdown() {
            timeLeft--;
            console.log("Next--->Send_Mail--->After :" + timeLeft + "s")
            if (timeLeft > 0) {
              setTimeout(countdown, 1000);
            }
          };
          setTimeout(countdown, 1000);
        }, i * time_out);
      }
      Quantitative--
    }
  })
  app.get("/Send_email_marketing_data_account", async (req, res) => {
    const time_now = getTime(Date.now())
    var Quantitative = await User.find({ "local.Type": "1" }).count();
    var i = 1
    var interval = 20000;
    for (i; i < Quantitative; i++) {
      const account = await User.findOne({ "local.Type": "1" }).sort({ _id: -1 }).limit(1).skip(i)
      const result = await shareCV.find({}).limit(30).sort({ _id: -1 })
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
                  <td class="content" align="left" style="border-radius:15px;background-color:#ffffff">
                  <table width="600" border="0" cellpadding="0" cellspacing="0" class="force-row" style="width: 600px;">
                   
                    <tr>
                    <td class="content-wrapper" style="padding-left:24px;padding-right:24px;">
                  
                      <div class="sideber2">
                      <div style="margin-top: 20px;" class="widghet">`
      const footer = ` </div>
      </div>
  </td>
  <br>
  </tr>
  </table>
  </td>
  </tr>
  </table><br>
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
      var kq = []
      result.forEach(function (item) {
        const listUV = `
  <div style="margin-top: 10px;margin-bottom:5px; border: 1px solid #cbcbcb;
  margin: 0 0 30px;
  padding: 30px;
  -webkit-transition: 0 5px 10px rgba(0, 0, 0, 0.1);
  -moz-transition: 0 5px 10px rgba(0, 0, 0, 0.1);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  border-radius: 5px;">
  <li>Ứng Viên : <b>`+ item.DetailCV + `</b></li><li>Vị trí : <b>` + item.TilteCV + `</b></li>
  <li>Chuyên Ngành : <b>`+ item.TypeCV + `</b></li>
  <li>Khu Vực : <b> `+ item.Area + `</b></li>
  <li>Link CV( File PDF ): <a href="https://tuyendung.me/detail-sharecv-ung-vien-tim-viec=`+ item._id + `"><b>Xem chi tiết</b></a></li>
  </div>`
        kq.push(listUV)
      })
      let text = kq.toString();
      var previewlist = ` <div style="margin-bottom:10px" class="row">
        <div style="text-align: center;" class="col-md-12"> <img style="width: 30%;marin-top: 10px;border-radius:50%"
                src="https://tuyendung.me/logo_new.jpg" /></br>
            <h3 style="top:10px;text-align: left">Chào Bạn,</strong></h3>
            <h4 style="text-align: left">OfficeJob chia sẻ cho bạn hồ sơ ứng viên tìm việc bạn xem qua nhé. 
            Nguồn ứng viên: do Office tổng hợp từ Facebook, LinkedIn,Nội bộ OfficeJobs....
            <br>
            Chúc Bạn hợp tác  với Ứng Viên ưng ý,và một ngày làm việc đầy năng lượng 
            </h4>
         </div>
        `+
        text.replaceAll(",", "<br>")
        + `
      <div style="text-align: left;" class="col-md-12">
        <div class="sideber2">
          <div style="margin-top: 10px;text-align: center;"  class="widghet">
              <a  href="https://tuyendung.me/share-cv"><b>Xem thêm</b></a>
          </div>
        </div>
              <img style="width: 100%;height:auto;border-radius: 15px;margin-top: 20px;" src="https://tuyendung.me/sharecv.JPG">
              <p>Để Việc Làm Văn Phòng có chi phí duy trì, hãy giúp chúng tôi click 1 quảng cáo bất kì</p>
              <p>Xây dựng cộng đồng ShareCV,Chia sẻ hồ sơ tại link:<a href="https://tuyendung.me/nop-don-ung-tuyen"><b>Chia sẻ ứng viên</b></a> 
                <p>Thank you and Best regards,</p>
            </div>
        </div>
        <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%;" class="em_wrapper">
        <tbody>
        <tr>
        <td valign="top" align="center"><img style="width:100%;border-radius:10px" src="https://tuyendung.me/gif/Officesjob.gif" alt="" class="em_img2" ></td>
      </tr>
      <tr>limit(30)
        <td height="40" style="font-size:0px; line-height:0px; height:40px;">&nbsp;</td>
      </tr>
        </tbody></table>
    </div>
      </div>`
      const htmlTemplate = header + previewlist + footer
      setTimeout(function () {
        Send_Email("trannguyet13122000@gmail.com", "zfezlwjubpalzoyb", htmlTemplate, account.local.email, `OfficeJob Share CV Ứng Viên tìm việc ${time_now.dateNew}`, "")
      }, i * interval);
    }
  })
  app.post("/add-sharecv-company", isLoggedIn, async (req, res, next) => {
    try {
      if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
        const Name = req.body.Name
        const NameCompany = req.body.NameCompany
        const EmailAdress = req.body.EmailAdress
        const Specialized = req.body.Specialized
        const Adress = req.body.Adress
        const arrinfoNTD = [];
        arrinfoNTD.push({ Name: Name, NameCompany: NameCompany, EmailAdress: EmailAdress, Specialized: Specialized, Adress: Adress })
        arrinfoNTD.forEach(function (item) {
          EmailNTD.update(
            { _id: "619d5195dddec47ae38745dc" },
            { $push: { ListNTD: item } },
          ).exec((err, Resultdone) => {
            res.redirect('/Spam-Email-NTD?message=' + encodeURIComponent('applysussces'))
          });
        })
      } else {
        res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/Spam-Email-NTD", isLoggedIn, async (req, res, next) => {
    try {
      if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
        const ListEmail = await EmailNTD.findOne({ _id: "619d5195dddec47ae38745dc" })

        res.render("View-Client/ShareCV/spam-email-ntd.ejs", { user: req.user, message: "", messagee: "", ListEmail: ListEmail })
      } else {
        res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/ung-vien-tim-viec", async (req, res, next) => {
    try {
      var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      const shorturl = await ShortUrl.findOne({ full: fullUrl })
      if (shorturl) {
        var Title = shorturl.body.Title
        var description = shorturl.body.Description
        var keywords = shorturl.body.Keywords
        var url_image = shorturl.body.url_image
        var image_alt = shorturl.body.image_alt
        res.render("View-Client/ShareCV/sign_up_share_cv/form_sign_up.ejs", {
          Title: Title,
          description: description,
          image_alt: image_alt,
          keywords: keywords,
          linkmeta: link,
          url_image: url_image,
          message: ""
        })
      } else {
        res.render("View-Client/ShareCV/sign_up_share_cv/form_sign_up.ejs", {
          message: "", Title: "Xem hồ sơ Ứng Viên Đang Tìm Việc",
          description: "Xem tại link: https://tuyendung.me/=nqf3BC5L4",
          image_alt: "image_sharecv",
          keywords: "ShareCV",
          linkmeta: "https://tuyendung.me/=nqf3BC5L4",
          url_image: "https://tuyendung.me/gif/sharecv.gif",
        })
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.post("/sign_up_share_cv", async (req, res, next) => {
    try {
      const time_now = getTime(Date.now())
      var array_name = []
      const input_email = req.body.email_share_cv
      const convert_email = input_email.replaceAll(" ", "")
      const result = await data_sharecv.find({ Email: convert_email })
      if (result == "") {
        data_sharecv.create({
          Email: req.body.email_share_cv,
          Date_time: time_now.dateNew,
          FillterDate: time_now.date,
          FillterMonth: time_now.month,
          FillterYear: time_now.year,
          History_send: {
            Date: time_now.dateNew,
            Hours: time_now.timeNew
          }
        })
        const result = await shareCV.find({}).limit(30).sort({ _id: -1 })
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
                  <td class="content" align="left" style="border-radius:15px;background-color:#ffffff">
                  <table width="600" border="0" cellpadding="0" cellspacing="0" class="force-row" style="width: 600px;">
                   
                    <tr>
                    <td class="content-wrapper" style="padding-left:24px;padding-right:24px;">
                  
                      <div class="sideber2">
                      <div style="margin-top: 20px;" class="widghet">`
        const footer = ` </div>
      </div>
    
        
  
  
    
  </td>
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
        var kq = []
        result.forEach(function (item) {
          const listUV = `
  <div style="margin-top: 10px;margin-bottom:5px; border: 1px solid #cbcbcb;
  margin: 0 0 30px;
  padding: 30px;
  -webkit-transition: 0 5px 10px rgba(0, 0, 0, 0.1);
  -moz-transition: 0 5px 10px rgba(0, 0, 0, 0.1);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -ms-border-radius: 5px;
  border-radius: 5px;">
  <li>Ứng Viên : <b>`+ item.DetailCV + `</b></li><li>Vị trí : <b>` + item.TilteCV + `</b></li>
  <li>Chuyên Ngành : <b>`+ item.TypeCV + `</b></li>
  <li>Khu Vực : <b> `+ item.Area + `</b></li>
  <li>Link CV( File PDF ): <a href="https://tuyendung.me/detail-sharecv-ung-vien-tim-viec=`+ item._id + `"><b>Xem chi tiết</b></a></li>
  </div>`
          array_name.push({ name: item.DetailCV, TilteCV: item.TilteCV })
          kq.push(listUV)
        })
        let text = kq.toString();

        var previewlist = ` <div style="margin-bottom:10px" class="row">
        <div style="text-align: center;" class="col-md-12"> <img style="width: 30%;
        border-radius: 50%;
        margin-top: 10px;
        background-color: antiquewhite;"
                src="https://tuyendung.me/logo_new.jpg" /></br>
            <h3 style="top:10px;text-align: left">Chào Bạn,</strong></h3>
            <h4 style="text-align: left">OfficeJob chia sẻ cho bạn hồ sơ ứng viên tìm việc bạn xem qua nhé. 
            Hy vọng sẽ giúp cho bạn trong công việc 
            Nguồn do mình tổng hợp từ nhiều nguồn và cá nhân
            Chúc Bạn Hợp Tác Ứng Viên Ưng Ý. 
            </h4>
        </div> 
        `+
          text.replaceAll(",", "<br>")
          + `
      <div style="text-align: left;" class="col-md-12">
        <div class="sideber2">
          <div style="margin-top: 10px;text-align: center;"  class="widghet">
              <a  href="https://tuyendung.me/share-cv"><b>Xem thêm</b></a>
          </div>
        </div>
      
              <p>Để Việc Làm Văn Phòng có chi phí duy trì, hãy giúp chúng tôi click 1 quảng cáo bất kì</p>
              <p>Xây dựng cộng đồng ShareCV,Chia sẻ hồ sơ tại link:<a href="https://tuyendung.me/nop-don-ung-tuyen"><b>Chia sẻ ứng viên</b></a> 
                <p>Thank you and Best regards,</p>
            </div>
        </div>
        <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%;" class="em_wrapper">
        <tbody>
        <tr>
       
        <td valign="top" align="center"><img style="width:100%;border-radius:10px" src="https://tuyendung.me/gif/Officesjob.gif" alt="" class="em_img2" ></td>
     
      </tr>

      
      <tr>
        <td height="40" style="font-size:0px; line-height:0px; height:40px;">&nbsp;</td>
      </tr>
        </tbody></table>
    </div>
      </div>`
        const names = array_name;
        const random = Math.floor(Math.random() * names.length);
        var Name_Ung_Vien = names[random].name
        var titel_detail = names[random].TilteCV
        const htmlTemplate = header + previewlist + footer
        var mailOptions = {
          from: 'trannguyet.ttv@gmail.com',
          to: req.body.email_share_cv,
          subject: `Ứng Viên ${Name_Ung_Vien} - Ứng Tuyển Vị Trí :${titel_detail} - ${time_now.dateNew}`,
          html: htmlTemplate,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            if (error.responseCode == 550) {
              res.render("View-Client/ShareCV/sign_up_share_cv/form_sign_up.ejs", {
                message: error.responseCode + "Đã đạt giới hạn gửi thư", Title: "Xem hồ sơ Ứng Viên Đang Tìm Việc",
                description: "Xem tại link: https://tuyendung.me/=nqf3BC5L4",
                image_alt: "image_sharecv",
                keywords: "ShareCV",
                linkmeta: "https://tuyendung.me/=nqf3BC5L4",
                url_image: "https://tuyendung.me/gif/sharecv.gif",
              })
            } else {
              res.render("View-Client/ShareCV/sign_up_share_cv/form_sign_up.ejs", {
                message: error.response, Title: "Xem hồ sơ Ứng Viên Đang Tìm Việc",
                description: "Xem tại link: https://tuyendung.me/=nqf3BC5L4",
                image_alt: "image_sharecv",
                keywords: "ShareCV",
                linkmeta: "https://tuyendung.me/=nqf3BC5L4",
                url_image: "https://tuyendung.me/gif/sharecv.gif",
              })
            }
          } else {
            res.render("View-Client/ShareCV/sign_up_share_cv/form_sign_up.ejs", {
              message: "Đăng ký thành công, OfficeJob đã gửi thông tin qua Email.", Title: "Xem hồ sơ Ứng Viên Đang Tìm Việc",
              description: "Xem tại link: https://tuyendung.me/=nqf3BC5L4",
              image_alt: "image_sharecv",
              keywords: "ShareCV",
              linkmeta: "https://tuyendung.me/=nqf3BC5L4",
              url_image: "https://tuyendung.me/gif/sharecv.gif",
            })
          }
        })
      } else {
        res.render("View-Client/ShareCV/sign_up_share_cv/form_sign_up.ejs", {
          message: "Bạn đã đăng ký", Title: "Xem hồ sơ Ứng Viên Đang Tìm Việc",
          description: "Xem tại link: https://tuyendung.me/=nqf3BC5L4",
          image_alt: "image_sharecv",
          keywords: "ShareCV",
          linkmeta: "https://tuyendung.me/=nqf3BC5L4",
          url_image: "https://tuyendung.me/gif/sharecv.gif",
        })
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })

  function update_rank_top_share_cv() {
    shareCV.find().exec((err, done) => {
      done.forEach(function (item) {
        shareCV.update({ _id: item._id }, { $set: { clicks: parseInt(item.clicks) } }).exec((err, result) => {
          console.log(result)
        })
      })
    })
  }
  async function random_share_cv(Type_cv) {
    var radom = await shareCV.aggregate([
      { $sample: { size: Type_cv } } // You want to get 5 docs
    ]);
    return radom
  }
};