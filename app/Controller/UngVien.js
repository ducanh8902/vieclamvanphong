module.exports = function (app, isLoggedIn, newApplyUT, newApplicant, getTime, nodeExcel, conn, Grid, mongoose, dataFillter, limiter, upload,User) {
  var gfs;
  conn.once('open', function () {
    gfs = Grid(conn, mongoose.mongo);
    gfs.collection('uploads');
  });
  app.get('/candidates', isLoggedIn, async (req, res,next) => {
    try{
    const user = ""
    if (!req.user) {
      var page = req.query.page
      if (page) {
        if (page < 1) {
          page = 1;
        }
        page = parseInt(page)
        pagesize = parseInt(req.query.pagesize)
        if (pagesize < 1) {
          pagesize = 20;
        }
        const skip = (page - 1) * pagesize
        const resultcount = await newApplyUT.count()
        const sltht = Math.ceil(resultcount / pagesize)
        const result = await newApplyUT.find({}).sort({ _id: -1 }).skip(skip).limit(pagesize)
        res.render('View-Client/UngVien/Ungvien.ejs', { user: user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
      }
      else {
        const resultcount = await newApplyUT.count()
        const result = await newApplyUT.find({}).limit(20).sort({ _id: -1 })
        const pagesize = 20
        const sltht = Math.ceil(resultcount / pagesize)
        res.render('View-Client/UngVien/Ungvien.ejs', { user: user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
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
          pagesize = 20;
        }
        var skip = (page - 1) * pagesize
        const resultcount = await newApplyUT.count()
        var sltht = Math.ceil(resultcount / pagesize)
        newApplyUT.find({}).sort({ _id: -1 }).skip(skip).limit(pagesize).exec((err, result) => {
          res.render('View-Client/UngVien/Ungvien.ejs', { user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });

        })
      }
      else {
        const resultcount = await newApplyUT.count()
        const result = await newApplyUT.find({}).limit(20).sort({ _id: -1 })
        var pagesize = 20
        var sltht = Math.ceil(resultcount / pagesize)
        res.render('View-Client/UngVien/Ungvien.ejs', { result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
      }
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
  app.get('/thong-tin-ung-vien=:id', function (req, res,next) {
    try{
    const id_user = req.params.id
    const infoUser = ""
    const xacminh = ""
    const token = req.query.token
    res.render('View-Client/UngVien/candidates-details.ejs', { user: id_user, infoUser: infoUser, xacminh: xacminh,token:token});
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
  app.post("/Xac-minh-danh-tinh&id=:id", function (req, res,next) {
    try{
    const id_user = req.params.id
    if(req.query.token) {
        newApplyUT.findOne({ _id:id_user,"authencation.Password":req.body.xacminh,"authencation.token":req.query.token}).exec((err, infoUser) => {
          if(err){
            res.redirect("/thong-tin-ung-vien=" + req.params.id + "?message=" + encodeURIComponent('false'))
          }
            res.render('View-Client/UngVien/candidates-details.ejs', {user: id_user, infoUser: infoUser, xacminh: "Done" });
        })
      }else{
        res.redirect("/thong-tin-ung-vien=" + req.params.id + "?message=" + encodeURIComponent('false'))
      }
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get('/ung-vien-ung-tuyen', isLoggedIn, async (req, res,next) => {
    try{
    const dataInterviewSeach = await newApplicant.find({ OwnerLink: req.user._id }).sort({ _id: -1 })
    var page = req.query.page
    if (page) {
      if (page < 1) {
        page = 1;
      }
      page = parseInt(page)
      pagesize = parseInt(req.query.pagesize)
      if (pagesize < 1) {
        pagesize = 20;
      }
      var skip = (page - 1) * pagesize
      const resultcount = await newApplicant.count({ OwnerLink: req.user._id })
      var sltht = Math.ceil(resultcount / pagesize)
      newApplicant.find({ OwnerLink: req.user._id }).sort({ _id: -1 }).skip(skip).limit(pagesize).exec((err, result) => {
        res.render('View-Client/UngVien/Ung-vien-Ung-Tuyen.ejs', { dataInterviewSeach: dataInterviewSeach, user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
      })
    }
    else {
      const resultcount = await newApplicant.count({ OwnerLink: req.user._id })
      const result = await newApplicant.find({ OwnerLink: req.user._id }).limit(20).sort({ _id: -1 })
      var pagesize = 20
      var sltht = Math.ceil(resultcount / pagesize)
      res.render('View-Client/UngVien/Ung-vien-Ung-Tuyen.ejs', { dataInterviewSeach: dataInterviewSeach, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
  app.get('/thong-tin-ung-vien-ung-tuyen=:id', isLoggedIn, function (req, res,next) {
    try{
    newApplicant.findOne({ _id: req.params.id, OwnerLink: req.user._id }).exec((err, infoUser) => {
      if (infoUser) {
        res.render('View-Client/UngVien/Chi-tiet-ung-vien.ejs', { infoUser: infoUser, xacminh: "Done" });
      } else {
        res.render("View-profile/404.ejs")
      }
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
  app.get('/deleteApply-Admin&idpost=:idApply', isLoggedIn, function (req, res,next) {
    try{
    newApplicant.remove({ _id: req.params.idApply, OwnerLink: req.user._id }).exec((err, result) => {
      if (result) {

        res.redirect('/ung-vien-ung-tuyen?message=' + encodeURIComponent('applysussces'))
      } else {
        res.render('View-profile/404.ejs',{message:"Liên kết không tồn tại"})
      }
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.post('/Update-InterView&id=:id', isLoggedIn, async (req, res,next) =>{
    try{
    const time = getTime(req.body.TrainingDay)
    var datenew = time.dateNew
    await newApplicant.updateOne({ _id: req.params.id, OwnerLink: req.user._id }, { $set: { "Interview.NameInterviewer": req.body.NameInterviewer, "Interview.ResultInterview": req.body.ResultInterview, "Interview.TrainingDay": datenew, "Interview.CommentInterview": req.body.CommentInterview } }).exec((err, done) => {
      if (err) {
        res.render('View-profile/404.ejs',{message:"Liên kết không tồn tại"})
      } else {
        var redirects = req.body.link
        var vitri = redirects.indexOf("?message=applysussces")
        if (vitri == "-1") {
          res.redirect(redirects + "?message=" + encodeURIComponent('applysussces'))
        }
        if (vitri > -1) {
          var kq = redirects.slice(0, vitri)

          res.redirect(kq + "?message=" + encodeURIComponent('applysussces'))
        }
      }


    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.get('/export-excel-UVUT', isLoggedIn, function (req, res,next) {
    try{
    var conf = {}
    conf.cols = [{
      caption: 'Link',
      type: 'text'
    },
    {
      caption: 'Tên Ứng Viên',
      type: 'text'
    },
    {
      caption: 'Hình Ứng Viên',
      type: 'text'
    },
    {
      caption: 'Giới Tính',
      type: 'text'
    },
    {
      caption: 'Tình trạng hôn nhân',
      type: 'text'
    },
    {
      caption: 'Ngày Sinh',
      type: 'text'
    },
    {
      caption: 'Quê Quán',
      type: 'text'
    },
    {
      caption: 'Nơi Sinh',
      type: 'text'
    },
    {
      caption: 'Chứng Minh Nhân Dân',
      type: 'text'
    },
    {
      caption: 'Nơi Cấp',
      type: 'text'
    },
    {
      caption: 'Ngày Cấp',
      type: 'text'
    },
    {
      caption: 'Số Điện Thoại',
      type: 'text'
    }, {
      caption: 'Email', type: 'text'
    }, { caption: 'Địa Chỉ Thường Trú', type: 'text' },
    { caption: 'Địa Chỉ Liên Lạc', type: 'text' },
    { caption: 'Nguồn Giới Thiệu', type: 'text' },
    { caption: 'Detail', type: 'text' }, { caption: 'Hình Thức', type: 'text' },
    {
      caption: 'Ứng Tuyển Vị Trí', type: 'text'
    }, { caption: 'Nợ Xấu', type: 'text' }, { caption: 'Học Vấn', type: 'text' },
    { caption: 'Kinh Nghiệm Làm Việc', type: 'text' },
    {
      caption: 'Thông Tin Gia Đình', type: 'text'
    }, {
      caption: 'Ngày Ứng Tuyển', type: 'text'
    }, { caption: 'Thời Gian', type: 'text' },
    {
      caption: 'Ngày', type: 'text'
    },
    {
      caption: 'Tháng',
      type: 'text'
    },
    {
      caption: 'Năm',
      type: 'text'
    },
    {
      caption: 'Người Phỏng Vấn',
      type: 'text'
    },
    {
      caption: 'Kết Qủa',
      type: 'text'
    },
    {
      caption: 'Ngày Nhận Việc',
      type: 'text'
    },
    {
      caption: 'Nhóm Làm Việc',
      type: 'text'
    },
    {
      caption: 'Ghi chú',
      type: 'text'
    }, { caption: 'Tình trạng hồ sơ', type: 'text' }
    ];
    var arr = [];
    newApplicant.find({ OwnerLink: req.user._id }).sort({ _id: -1 }).exec((err, resultdata) => {
      resultdata.forEach(function (items) {
        arr.push([
          "https://tuyendung.me/thong-tin-ung-vien-ung-tuyen=" + items._id,
          items.NameUT, items.Avata, items.Gioitinh, items.Honnhan, items.Ngaysinh, items.Quequan, items.Noisinh, items.CMND, items.NCCMND,
          items.NgayCCMND,
          items.PhoneUT,
          items.EmailUT,
          items.DCTT,
          items.DCLL,
          items.Gioithieu,
          items.Detail,
          items.BMLV,
          items.vitriungtuyen,
          items.Noxau,
          items.hoctap,
          items.Kinhnghiem,
          items.Giadinh,
          items.DateTime,
          items.Time,
          items.FiffterNgay,
          items.FiffterThang,
          items.FillterNam,
          items.Interview.NameInterviewer,
          items.Interview.ResultInterview,
          items.Interview.TrainingDay,
          items.Interview.Bophan,
          items.Interview.CommentInterview,
          items.Hoso.CheckStatus,
        ]);
        conf.rows = arr;
      })
      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "Applicant.xlsx");
      res.writeHead(200);
      res.end(result, 'binary');
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });

  app.get('/export-excel-dataAll', function (req, res) {
    try{
    var conf = {}
    conf.cols = [{
      caption: 'Ứng Viên',
      type: 'text'
    },
    {
      caption: 'Email',
      type: 'text'
    },
    {
      caption: 'Phone',
      type: 'text'
    },
    {
      caption: 'Nguồn',
      type: 'text'
    },
    {
      caption: 'Địa Chỉ',
      type: 'text'
    }
    ];
    var arr = [];
    dataFillter.find().sort({ _id: -1 }).exec((err, resultdata) => {
      resultdata.forEach(function (items) {
        arr.push([
          items.NameNhanSu,
          items.EmailNhanSu,
          items.PhoneNhanSu,
          items.NguonNhanSu,
          items.DiachiNhanSu,
        ]);
        conf.rows = arr;
      })
      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "DataAll.xlsx");
      res.writeHead(200);
      res.end(result, 'binary');
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
  app.get("/Scan-thong-tin-ung-vien=:idUngVien", async (req, res,next) =>{
    try{
    newApplyUT.findOne({ _id: req.params.idUngVien }).exec((err, result) => {
      if (!result) {
        res.render("View-profile/404.ejs",{message:"Ứng Viên chưa ứng tuyển"})
      } else {
        var infoUser = req.params.idUngVien
        res.render("View-Client/QRcode/Authencation-QRcode.ejs", { infoUser: infoUser })
      }
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.post("/Authencation-Scan-&id=:id", async (req, res,next) =>{
    try{
    newApplyUT.findOne({ _id: req.params.id, CMND: req.body.password }).exec((err, result) => {
      if (result) {
        var infoUser = {
          id: req.params.id,
          CMND: req.body.password
        }
        res.render("View-Client/QRcode/upload-TTUV.ejs", { infoUser: infoUser })
      } else {
        res.render("View-profile/404.ejs",{message:"Lỗi xác thực"})
      }
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  
  app.post("/update-scan-TTUV&idUser=:id&CMND=:cmnd", upload.fields([{ name: 'TTUV' }]), function (req, res,next) {
    try{
    const arrTTUV = [];
    let a = 0;
    while (a < req.files['TTUV'].length) {
      arrTTUV.push({ filename: req.files['TTUV'][a].filename, contentType: req.files['TTUV'][a].contentType })
      a++;
    }
    newApplyUT.update({
      _id: req.params.id,
      CMND: req.params.cmnd
    }, { $set: { "QRcode.ImageScanTTUV": arrTTUV } }).exec((err, done) => {
      if (err) {
        res.render("View-profile/404.ejs")
      }
      newApplyUT.findOne({CMND:req.params.cmnd}).exec((err,done)=>{
       console.log(done)
      })
     res.render("View-Client/QRcode/update-done.ejs")
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
};