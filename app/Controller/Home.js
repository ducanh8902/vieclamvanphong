module.exports = function (app,isLoggedIn,getTime,HotJobNTD,HotNTD,shareCV,newApplyUT,shuffle,Email,ShortUrl,ListViecLam,interview,apply,MessageApplys,User,upload,CreateForm,newApplicant,io,dataFillter,JobNTD,SaveLog,Logs,crypto,path) {

  app.get("/=:shortUrl", async (req, res,next) => {
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
 
    app.get('/files-info/:filename',async (req, res,next) => {
    try{
    var filename = req.params.filename
    var urlimage = "CS_new.jpg";
    var link = "https://tuyendung.me/files-info/"+req.params.filename;
    const shorturl = await ShortUrl.findOne({ full:link})
    if(shorturl){
      var redirects = shorturl.full+"?shorturl="+shorturl.short
    var vitri = redirects.indexOf("?shorturl=")
    var kq = redirects.slice(vitri+10)
    var LinkShort = kq
    var Title = shorturl.body.Title
    var description = shorturl.body.Description
    var keywords = shorturl.body.Keywords
    var url_image = shorturl.body.url_image
    var image_alt = shorturl.body.image_alt
    res.render("View-Client/File/file.ejs",{filename:filename,urlimage:urlimage,Title:Title,description:description,image_alt:image_alt,keywords:keywords,link:LinkShort,linkmeta:link,url_image:url_image})
    }else{
      res.render("View-profile/404.ejs",{message:"Link không tồn tại"})
    }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
  
  app.post('/new-job-NTD/:id', isLoggedIn, upload.single('attachment'), (req, res,next) => {
    try{
    User.findOne({ _id: req.params.id }).exec((err, result) => {
      if (result._id == req.params.id) {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        Daypost = date + "-" + month + "-" + year
        hour = hours + ":" + minutes
        newJob = new JobNTD()
        newJob.idjobpost = req.user._id,
          newJob.Namejob = req.body.Namejob,
          newJob.Daypost = Daypost,
          newJob.chuyennganh = req.body.chuyennganh,
          newJob.NameUser = req.body.Nameuser,
          newJob.Salary = req.body.Salary,
          newJob.Address = req.body.Address,
          newJob.hourpost = hour;
        newJob.Detailjob = req.body.Detailjob
        newJob.typejob = req.body.typejob
        newJob.FileAttach = req.file.filename
        newJob.ImageJob = req.user.local.NTD.ImageLogo
        newJob.save(function (err) {
        })

        res.redirect('/profile')
      }
    })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.post('/shortURL', isLoggedIn, async (req, res,next) => {
    try{
      const time = getTime(Date.now())
      const Form = await CreateForm.findOne({_id:req.body._id})
      if(Form){
        const fullLink = "https://tuyendung.me/nop-don-ung-tuyen-nhatuyendung="+req.body.UrlForm
        await ShortUrl.create({ full:fullLink , createDate: time.dateNew, Titel: req.body.TitleForm })
        const LinkShort =  await ShortUrl.findOne({ full:fullLink})
        const shorturl = LinkShort.short
        CreateForm.update({_id:req.body._id},{$set:{UrlShort:shorturl}}).exec((err,done)=>{
          console.log(done)
        })
        res.redirect("profile?message=" + encodeURIComponent("CreateShortURL"))
      }else{
        res.render("View-profile/404.ejs")
      }
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/api/:version/api_officejob/:url_api/auth_token&token=:token&limit=:limited", async (req, res,next) => {
    try{
      const radomTime = getTime(Date.now())
      if(req.params.token == "share_cv_Officejob@2022" && req.params.url_api =="share_cv"){
        const limited = parseInt(req.params.limited)
        const result = await shareCV.find({}).limit(limited).sort({ _id: -1 })
        res.send(result)
      }
       if(req.params.token == "job_list_Officejob@2022" && req.params.url_api =="job_list"){
        const limited = parseInt(req.params.limited)
        const result = await HotJobNTD.find({}).limit(limited).sort({ _id: -1 })
        res.send(result)
      }
      
       if(req.params.token == "job_applicant_Officejob@2022" && req.params.url_api =="ungvien_list"){
        const limited = parseInt(req.params.limited)
        const result = await newApplyUT.find({FillterNam:radomTime.year,FiffterThang:radomTime.month,"trash.check":{$ne:true}}).limit(limited).sort({ _id: -1 })
        var Arr = []
        result.forEach(function(item){
            if(item.Avata == "https://img.icons8.com/bubbles/10000/000000/user-male.png" || item.Avata =="https://img.icons8.com/bubbles/10000/000000/brown-curly-hair-lady-with-red-glasses.png"){
              var none = ""
           }else{
            Arr.push({
              _id:item._id,
              Name:item.NameUT,
              Ngaysinh:item.Ngaysinh,
              Avata:item.Avata,
              DateTime:item.DateTime,
            })
           }
        })
        res.send(Arr)
      }
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.get('/', async (req, res,next)=> {
    try{
    const user = "";
    const dataJobAll =  await HotJobNTD.find({}).sort({ _id: -1 })
    const dataJobAllPage2 = await HotJobNTD.find({}).sort({ _id: 1 })
    const Spotlight = await HotJobNTD.find({}).limit(3).sort({ _id: -1 })
    const ShareCV = await shareCV.find({}).sort({ _id: -1 })
    const ArrListShareCV = []
    ShareCV.forEach(function(item){
      if(item.TilteCV != undefined){
        const avatashare =  Math.floor(Math.random() * 3);
        ArrListShareCV.push({name:item.DetailCV,file:item.FileCV,type:item.TypeCV,date:item.DateUpload,avatashare:avatashare})
      }
    });
      const newArrShareCv = shuffle(ArrListShareCV)
      HotNTD.find({}).sort({ _id: -1 }).exec((err, dataHotNTD) => {
        res.set()
        res.render('View-Client/Home/home.ejs', {
          newArrShareCv:newArrShareCv.splice(0,25),Spotlight:Spotlight,user: user, dataJobAll: dataJobAll,dataJobAllPage2:dataJobAllPage2,
          dataHotNTD:dataHotNTD, messagee: req.flash('loginMessage'), message: req.flash('signupMessage') });
      })
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  });
    app.get('/Home', isLoggedIn, async (req, res,next) =>{
      try{
      const user = "";
      const ArrListInfo = []
      const dataInfo = await dataFillter.find({}).limit(100).sort({ _id: -1 })
      dataInfo.forEach(function(item){
      ArrListInfo.push({ NameNhanSu :item.NameNhanSu,PhoneNhanSu :item.PhoneNhanSu,EmailNhanSu :item.EmailNhanSu,
        NguonNhanSu :item.NguonNhanSu,
        DiachiNhanSu :item.DiachiNhanSu})
      })
      const newArrInfo = shuffle(ArrListInfo)
      if (req.user == "") {
        const dataJobAll =  await HotJobNTD.find({}).sort({ _id: -1 })
    const dataJobAllPage2 = await HotJobNTD.find({}).sort({ _id: 1 })
    const Spotlight = await HotJobNTD.find({}).limit(3).sort({ _id: -1 })
    const ShareCV = await shareCV.find({}).sort({ _id: -1 })
    const newApplicant = await newApplyUT.find({}).sort({ _id: -1 })
    const ArrListApplicant = []
    const ArrListShareCV = []
    ShareCV.forEach(function(item){
      if(item.TilteCV != undefined){
        const avatashare =  Math.floor(Math.random() * 3);
        ArrListShareCV.push({name:item.DetailCV,file:item.FileCV,type:item.TypeCV,date:item.DateUpload,avatashare:avatashare})
      }
    });
    newApplicant.forEach(function(item){
      if(item.Avata != "https://img.icons8.com/bubbles/10000/000000/user-male.png" || item.Avata !="https://img.icons8.com/bubbles/10000/000000/brown-curly-hair-lady-with-red-glasses.png"){
        ArrListApplicant.push({id:item._id,name:item.NameUT,avata:item.Avata,file:item.fileAttach.url,date:item.DateTime,birthday:item.Ngaysinh})
      }
    });
      const newArrShareCv = shuffle(ArrListShareCV)
      const newListApplicant = shuffle(ArrListApplicant)
      HotNTD.find({}).sort({ _id: -1 }).exec((err, dataHotNTD) => {
        res.render('View-Client/Home/home.ejs', {newArrInfo:newArrInfo.splice(0,20),newListApplicant:newListApplicant.splice(0,10),newArrShareCv:newArrShareCv.splice(0,10),Spotlight:Spotlight,user: user, dataJobAll: dataJobAll,dataJobAllPage2:dataJobAllPage2,dataHotNTD:dataHotNTD, messagee: req.flash('loginMessage'), message: req.flash('signupMessage') });
      })
      }
      else {
        const dataJobAll =  await HotJobNTD.find({}).sort({ _id: -1 })
    const dataJobAllPage2 = await HotJobNTD.find({}).sort({ _id: 1 })
    const Spotlight = await HotJobNTD.find({}).limit(3).sort({ _id: -1 })
    const ShareCV = await shareCV.find({}).sort({ _id: -1 })
    const newApplicant = await newApplyUT.find({}).sort({ _id: -1 })
    const ArrListApplicant = []
    const ArrListShareCV = []
    ShareCV.forEach(function(item){
      if(item.TilteCV != undefined){
        const avatashare =  Math.floor(Math.random() * 3);
        ArrListShareCV.push({name:item.DetailCV,file:item.FileCV,type:item.TypeCV,date:item.DateUpload,avatashare:avatashare})
      }
    });
    newApplicant.forEach(function(item){
      if(item.Avata != "https://img.icons8.com/bubbles/10000/000000/user-male.png" || item.Avata !="https://img.icons8.com/bubbles/10000/000000/brown-curly-hair-lady-with-red-glasses.png"){
        ArrListApplicant.push({id:item._id,name:item.NameUT,avata:item.Avata,file:item.fileAttach.url,date:item.DateTime,birthday:item.Ngaysinh})
      }
    });
      const newArrShareCv = shuffle(ArrListShareCV)
      const newListApplicant = shuffle(ArrListApplicant)
      HotNTD.find({}).sort({ _id: -1 }).exec((err, dataHotNTD) => {
        res.render('View-Client/Home/home.ejs', {newArrInfo:newArrInfo.splice(0,20),newListApplicant:newListApplicant.splice(0,10),newArrShareCv:newArrShareCv.splice(0,10),Spotlight:Spotlight,user: req.user, dataJobAll: dataJobAll,dataJobAllPage2:dataJobAllPage2,dataHotNTD:dataHotNTD, messagee: req.flash('loginMessage'), message: req.flash('signupMessage') });
      })
       
      }}
      catch(err){
        res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
      }
    });
    app.get('/profile', isLoggedIn, async (req, res,next)=> {
      try{ 
      if (req.user.local.Type == 0) {
        if (!req.user.local.NTV.NameUser || !req.user.local.NTV.Phone || !req.user.local.NTV.Email) {
          var link = "edit-profile&id=" + req.user._id + "?message=" + encodeURIComponent('profileIsEmpty')
          res.redirect(link)
        } else {
          Job.find({ idjobpost: req.user._id }).sort({ _id: -1 }).exec((err, resulfjoblist) => {
            Job.count({ idjobpost: req.user._id }).exec((err, countJob) => {
              apply.find({ idNTV: req.user._id }).exec((err, resultt) => {
  
                apply.updateMany({ idNTV: req.user._id }, {
                  $set: {
                    "infoNTV.NameNTV": req.user.local.NTV.NameUser,
                    "infoNTV.EmailNTV": req.user.local.NTV.Email,
                    "infoNTV.AddressNTV": req.user.local.NTV.Address,
                    "infoNTV.PhoneNTV": req.user.local.NTV.Phone,
                    "infoNTV._idNTD": req.user._id
                  }
                }).exec((err, result) => {
                  console.log(result)
                })
              })
              apply.find({ idNTV: req.user._id }).exec((err, resultt) => {
                resultt.forEach(function (items) {
                  ListViecLam.find({ _id: items.idJobNTD }).exec((err, result) => {
                    result.forEach(function (itemss) {
                      apply.updateMany({ idJobNTD: itemss._id }, {
                        $set: {
                          "infoNTD.NamejobNTD": itemss.Namejob,
                          "infoNTD.NameUserNTD": itemss.NameUser,
                          "infoNTD.SalaryNTD": itemss.Salary,
                          "infoNTD.AddressNTD": itemss.Address,
                          "infoNTD.ImageJobNTD": itemss.ImageJob,
                          "infoNTD.typejobNTD": itemss.typejob,
                          "infoNTD.idjobpostNTD": itemss.idjobpost,
                          "infoNTD.DaypostNTD": itemss.Daypost,
                          "infoNTD._idNTD": itemss._id
                        }
                      }).exec((err, results) => {
                        console.log(results)
                      })
                    })
                  })
                })
              })
              apply.find({ idNTV: req.user._id }).exec((err, resultt) => {
                var pagesize = 1;
                var sltht = Math.ceil(countJob / pagesize)
                res.render('View-Client/TrangCaNhan/profile.ejs', {
                  user: req.user,
                  resulfjoblist: resulfjoblist,
                  resultt: resultt,
                  sltht: sltht,
                  countJob: countJob,
                  pagesize: pagesize,messagee: "", message: ""
                })
              })
            });
          });
        }
      }
      if (req.user.local.Type == 1) {
        if (!req.user.local.NTD.NameCompany || !req.user.local.NTD.Phone || !req.user.local.NTD.Email || !req.user.local.NTD.ImageLogo) {
          var link = 'edit-profile&id=' + req.user._id + '?message=' + encodeURIComponent('profileCompanyIsEmpty')
          res.redirect(link)
        } else {
          const sCreateForm = await CreateForm.find({IDUserCreate:req.user._id})
          ListViecLam.find({ idjobpost: req.user._id }).sort({ _id: -1 }).exec((err, resulfjoblistNTD) => {
            ListViecLam.count({ idjobpost: req.user._id }).exec((err, countJob) => {
              var pagesize = 1;
              var sltht = Math.ceil(countJob / pagesize)
                interview.find().exec((err, rel) => {
                  MessageApplys.find({ "infoNTD.idNTD": req.user._id }).exec((err, dataMessage) => {
                    res.render('View-Client/TrangCaNhan/profile.ejs', {
                      user: req.user,
                      rel: rel,
                      resulfjoblistNTD: resulfjoblistNTD,
                      sltht: sltht,
                      sCreateForm:sCreateForm,
                      dataMessage: dataMessage,
                      countJob: countJob,
                      pagesize: pagesize,messagee: "", message: ""
                    })
                  })
                });
            });
          });
        }
      }
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
    });
    app.post('/change-avata-NTD/:id', isLoggedIn, upload.single('fileUT'), (req, res,next) => {
      try{
      User.updateOne({ _id: req.params.id }, { $set: { "local.NTD.ImageLogo": req.file.filename } }).exec((err, result) => {
        res.redirect('/profile')
      })
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
    })
    app.get('/edit-profile&id=:id', isLoggedIn, function (req, res,next) {
      try{
      User.find({ _id: req.params.id }).exec((err, datauser) => {
        res.render('View-Client/TrangCaNhan/edit-profile', {
          user: req.user, datauser: datauser,messagee: "", message: ""
        });
      });
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
    });
    app.post('/edit-profile-NTD&id/:id', isLoggedIn, function (req, res,next) {
      try{
      User.updateOne({ _id: req.params.id }, {
        $set: {
          'local.NTD.NameCompany': req.body.namecompany,
          'local.NTD.LinkFB': req.body.LinkFBNTD,
          'local.NTD.LinkLinkedIn': req.body.LinkLinkedInNTD,
          'local.NTD.LinkTiwtter': req.body.LinkTiwtterNTD,
          'local.NTD.Phone': req.body.PhoneNTD,
          'local.NTD.Email': req.body.EmailNTD,
          'local.NTD.Establish': req.body.Establish,
          'local.NTD.Scale': req.body.Scale,
          'local.NTD.AddressCompany': req.body.AddressCompany,
          'local.NTD.DetailCompany': req.body.DetailCompany,
          'local.NTD.map': req.body.map,
          'local.NTD.NameUser': req.body.nameuser,
        }
      }, { upsert: true }).exec((err, result) => {
        res.redirect('/profile')
      })
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
    });
    app.post('/edit-profile-NTV&id/:id', isLoggedIn, function (req, res,next) {
      try{
      User.updateOne({ _id: req.params.id }, {
        $set: {
          'local.NTV.NameUser': req.body.usernameNTV,
          'local.NTV.Position': req.body.Position,
          'local.NTV.Address': req.body.Address,
          'local.NTV.LinkFB': req.body.LinkFB,
          'local.NTV.LinkLinkedIn': req.body.LinkLinkedIn,
          'local.NTV.LinkTiwtter': req.body.LinkTiwtter,
          'local.NTV.Phone': req.body.PhoneNTV,
          'local.NTV.Email': req.body.EmailNTV,
          'local.NTV.Academic': req.body.Academic,
          'local.NTV.Salary': req.body.Salary,
          'local.NTV.Gender': req.body.Gender,
          'local.NTV.Detail': req.body.Detail,
          'local.NTV.NameSchool ': req.body.NameSchool,
          'local.NTV.TitleEducation': req.body.TitleEducation,
          'local.NTV.TimeEducation': req.body.TimeEducation,
          'local.NTV.DetailEducation': req.body.DetailEducation,
          'local.NTV.NameSchool2': req.body.NameSchool2,
          'local.NTV.TitleEducation2': req.body.TitleEducation2,
          'local.NTV.TimeEducation2': req.body.TimeEducation2,
          'local.NTV.DetailEducation2': req.body.DetailEducation2,
          'local.NTV.TimeWork': req.body.TimeWork,
          'local.NTV.NameCompany': req.body.NameCompany,
          'local.NTV.TitleWork': req.body.TitleWork,
          'local.NTV.DetailWork': req.body.DetailWork,
          'local.NTV.NameCompany2': req.body.NameCompany2,
          'local.NTV.TitleWork2': req.body.TitleWork2,
          'local.NTV.TimeWork2': req.body.TimeWork2,
          'local.NTV.DetailWork2': req.body.DetailWork2,
        }
      }, { upsert: true }).exec((err, result) => {
        res.redirect('/profile')
      })
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
    });
    app.post("/delete-form-and-url=:UrlShort&id=:id",isLoggedIn,async(req,res,next)=>{
      try{
     const deleteCreateForm =  await CreateForm.remove({_id:req.params.id,IDUserCreate:req.user._id})
     const deleteShortUrl=  await ShortUrl.remove({short:req.params.UrlShort})
      if(deleteCreateForm && deleteShortUrl){
        res.redirect("profile?message=" + encodeURIComponent("DeleteDone"))
      }else{
        res.render("View-profile/404.ejs")
      }
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
    })
};
