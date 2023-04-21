const { replaceOne } = require('mongoose/lib/model');

module.exports = function (app, isLoggedIn, ListViecLam, shuffle, User, upload, MessageApplys, Email, dataFillter, UngTuyenNhanh, getTime, ShortUrl, Send_Email, JobNTD,shareCV) {
    // JobNTD.find().exec((err,done)=>{
    //     done.forEach(async function(item){
    //         var get_email = await User.findOne({_id:item.idjobpost})
    //         if(get_email){
    //             JobNTD.update({idjobpost:item.idjobpost},{$set:{"_more_info._email_author":get_email.local.NTD.Email}}).exec((err,done_s)=>{
    //                 console.log(done_s)
    //             })
    //         }
            
    //     })
    // })
    var rp = require('request-promise');
    app.get("/url_analyst_id=:url",async function(req,res){
        try{
            const Url_analyst = await ShortUrl.findOne({_id:req.params.url})
            const arr_history = Url_analyst.Data_Interactive
            var arrDate =[]
            var arrClicks =[]
            arr_history.slice(-10).forEach( function(item){
                 arrDate.push(item.Date)
                 arrClicks.push(item.Detail_history_Interactive.length)
            })
            res.json({
                Title:Url_analyst.Titel,
                Day:arrDate,
                clicks:arrClicks
            })
        }
        catch (err) {
            res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
        }
    })
    app.get("/job-chart/:email",async (req, res, next) => {
        try {
        var _email  = req.params.email
            const social = await Url_Analyst_social(_email)
            const result_social = await forEach_Url_Analyst_social(social)
            const Url_ = await ShortUrl.find({"type_url.project_job":true,"_author._email_author":_email})
            res.render("View-client-v2/Job/job-chart.ejs",{Url_analyst:Url_,result_social:result_social})
    } catch (err) {
        res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
    }
    })
    app.get("/json_detail_job/:id", async (req, res, next) => {
        try {
            const data = await ListViecLam.findOne({ _id: req.params.id })
            res.send(data)
        } catch (err) {
            res.send({
                code: 404,
                message: "Dư liệu không tồn tại"
            })
        }
    })
    app.get("/create-job", async (req, res, next) => {
        try {
            res.render("View-client-v2/Job/create-job.ejs")
        } catch (err) {
            res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
        }
    })
    app.post("/new-create-job", upload.fields([{ name: 'fileImage' }, { name: 'fileJD' }]), async (req, res) => {
        try {
            var _email_nha_tuyen_dung = req.body._email_nha_tuyen_dung
            var _name_company = req.body._name_company
            var _vi_tri_tuyen_dung = req.body._vi_tri_tuyen_dung
            var _salary = req.body._salary
            var _type_job = req.body._type_job
            var _address = req.body._address
            var _area = req.body._area
            var _filed = req.body._filed
            var _detail = req.body._detail
            if (req.files['fileImage'] && req.files['fileJD']) {
                var _fileImage_filename = req.files['fileImage'][0].filename
                var _fileImage_contentType = req.files['fileImage'][0].contentType
                var _fileJD_filename = req.files['fileJD'][0].filename
                var _fileJD_contentType = req.files['fileJD'][0].contentType
                var created = await create_job(_email_nha_tuyen_dung, _name_company, _vi_tri_tuyen_dung, _salary, _type_job, _address, _area, _filed, _detail, _fileImage_filename, _fileImage_contentType, _fileJD_filename, _fileJD_contentType)
                res.render("View-profile/sucssce.ejs", { message: "Đã tạo tin tuyển dụng - Trạng thái: Đang Xét Duyệt" })
            } else {
                if (!req.files['fileImage'] && !req.files['fileJD']) {
                    var _fileImage_filename = ""
                    var _fileImage_contentType = ""
                    var _fileJD_filename = ""
                    var _fileJD_contentType = ""
                    var created = await create_job(_email_nha_tuyen_dung, _name_company, _vi_tri_tuyen_dung, _salary, _type_job, _address, _area, _filed, _detail, _fileImage_filename, _fileImage_contentType, _fileJD_filename, _fileJD_contentType)
                    res.render("View-profile/sucssce.ejs", { message: "Đã tạo tin tuyển dụng - Trạng thái: Đang Xét Duyệt" })
                }
                if (req.files['fileImage'] && !req.files['fileJD']) {
                    var _fileImage_filename = req.files['fileImage'][0].filename
                    var _fileImage_contentType = req.files['fileImage'][0].contentType
                    var _fileJD_filename = ""
                    var _fileJD_contentType = ""
                    var created = await create_job(_email_nha_tuyen_dung, _name_company, _vi_tri_tuyen_dung, _salary, _type_job, _address, _area, _filed, _detail, _fileImage_filename, _fileImage_contentType, _fileJD_filename, _fileJD_contentType)
                    res.render("View-profile/sucssce.ejs", { message: "Đã tạo tin tuyển dụng - Trạng thái: Đang Xét Duyệt" })
                }
                if (req.files['fileJD'] && !req.files['fileImage']) {
                    var _fileJD_filename = req.files['fileJD'][0].filename
                    var _fileJD_contentType = req.files['fileJD'][0].contentType
                    var _fileImage_filename = ""
                    var _fileImage_contentType = ""
                    var created = await create_job(_email_nha_tuyen_dung, _name_company, _vi_tri_tuyen_dung, _salary, _type_job, _address, _area, _filed, _detail, _fileImage_filename, _fileImage_contentType, _fileJD_filename, _fileJD_contentType)
                    res.render("View-profile/sucssce.ejs", { message: "Đã tạo tin tuyển dụng - Trạng thái: Đang Xét Duyệt" })
                }
            }

        } catch (err) {
            res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
        }
    })
    async function create_job(_email_nha_tuyen_dung, _name_company, _vi_tri_tuyen_dung, _salary, _type_job, _address, _area, _filed, _detail, _fileImage_filename, _fileImage_contentType, _fileJD_filename, _fileJD_contentType) {
        var get_time = getTime(Date.now())
        var new_job = new JobNTD()
        new_job.Daypost = get_time.dateNew
        new_job._more_info._email_author = _email_nha_tuyen_dung
        new_job._info_job._namejob = _vi_tri_tuyen_dung
        new_job._info_job._company_name = _name_company
        new_job._info_job._Salary = _salary
        new_job._info_job._Address = _address
        new_job._info_job._Detailjob = _detail
        new_job._info_job._Area = _area
        new_job._info_job._Field = _filed
        new_job._info_job._type_job = _type_job
        new_job._more_info._job_active = false
        new_job.filter.hourpost = get_time.timeNew
        new_job.filter.FiffterNgay = get_time.date
        new_job.filter.FiffterThang = get_time.month
        new_job.filter.FillterNam = get_time.year
        new_job.FileAttachs.image.url = _fileImage_filename
        new_job.FileAttachs.image.contentType = _fileImage_contentType
        new_job.FileAttachs.pdf.url = _fileJD_filename
        new_job.FileAttachs.pdf.contentType = _fileJD_contentType
        new_job.save(async function (err, done) {
            if (err) {
                res.render('View-profile/404.ejs', { message: `${err}` })
            }
            var create_short = await create_new_short_url(new_job._id, _vi_tri_tuyen_dung, _salary, _area, get_time.dateNew, _fileImage_filename,_email_nha_tuyen_dung)
            console.log(create_short)
        })

    }
    // var FroalaEditor = require('wysiwyg-editor-node-sdk/lib/froalaEditor.js');
    // app.post('/upload_image', function (req, res) {
    //     FroalaEditor.Image.upload(req, 'public/uploads/', function(err, data) {
    //       if (err) {
    //         console.log(JSON.stringify(err))
    //         return res.send(JSON.stringify(err));
    //       }
    //       res.send(data);
    //     });
    //   });
    // app.get("/update-job",async (req, res,next)=> {
    //     ListViecLam.find({}).exec((err,data)=>{
    //         data.forEach(element => {
    //             ListViecLam.update({_id:element._id},{
    //                 $set:{
    //                     "_info_job._namejob": element.Namejob,
    //                     "_info_job._company_name": element.NameUser,
    //                     "_info_job._Salary":element.Salary,
    //                     "_info_job._Address":element.Address,
    //                     "_info_job._Detailjob":element.Detailjob,
    //                     "_info_job._Area":"",
    //                     "_info_job._Field":element.chuyennganh,
    //                     "_info_job._type_job":element.typejob,
    //                     "filter.hourpost":element.hourpost,
    //                     "filter.FiffterNgay":element.FiffterNgay,
    //                     "filter.FiffterThang":element.FiffterThang,
    //                     "filter.FillterNam":element.FillterNam,
    //                     "FileAttachs.image.url":element.ImageJob,
    //                     "FileAttachs.image.contentType":"image/png",
    //                 }
    //             }).exec((err,done)=>{
    //                 console.log(done)
    //             })
    //         });
    //     })
    // })
    app.get("/job", async (req, res, next) => {
        var google = req.query.reload 
        var fullUrl_query = req.protocol + '://' + req.get('host') + req.originalUrl;
        var host = "https://" + req.get('host')
        var url = req.protocol + '://' + req.get('host') + req.originalUrl;
        var path = url.split('?')[0]
        var fullUrl = path
        var time_s = getTime(Date.now())
        try {
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
                const resultcount = await ListViecLam.count({ "_more_info._job_active": { $ne: false } })
                const sltht = Math.ceil(resultcount / pagesize)
                const result = await ListViecLam.find({ "_more_info._job_active": { $ne: false } }).sort({ _id: -1 }).skip(skip).limit(pagesize)
                res.render('View-client-v2/Job/Job-manager.ejs', {google:google,fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), time_s: time_s.dateNew, user: "", result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
            }
            else {
                const resultcount = await ListViecLam.count({ "_more_info._job_active": { $ne: false } })
                const result = await ListViecLam.find({ "_more_info._job_active": { $ne: false } }).limit(18).sort({ _id: -1 })
                const pagesize = 18
                const sltht = Math.ceil(resultcount / pagesize)
                res.render('View-client-v2/Job/Job-manager.ejs', {google:google, fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: "", messagee: "", message: "" });
            }
        } catch (err) {
            res.render('View-profile/404.ejs', { message: "Liên kết không tồn tại" })
        }
    })
    app.get('/danh-sach-viec-lam-all', async (req, res, next) => {
        try {
            const user = "";
            var page = req.query.page
            if (page) {
                if (page < 1) {
                    page = 1;
                }
                page = parseInt(page)
                pagesize = parseInt(req.query.pagesize)
                if (pagesize < 1) {
                    pagesize = 16;
                }
                var skip = (page - 1) * pagesize
                var sl = await ListViecLam.count({})
                var sltht = Math.ceil(sl / pagesize)
                const DataJob = await ListViecLam.find({}).skip(skip).limit(pagesize).sort({ _id: -1 })
                res.render('View-Client/ViecLam/Vieclam.ejs', { pagesize: pagesize, sl: sl, sltht: sltht, DataJob: DataJob, user: user, messagee: "", message: "" });
            }
            else {
                var pagesize = 16
                const DataJob = await ListViecLam.find({}).limit(pagesize).sort({ _id: -1 })
                var sl = await ListViecLam.count({})
                var sltht = Math.ceil(sl / pagesize)
                res.render('View-Client/ViecLam/Vieclam.ejs', { pagesize: pagesize, sl: sl, sltht: sltht, DataJob: DataJob, user: user, messagee: "", message: "" });
            }
        } catch (err) {
            res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
        }
    })
 // const result = await ShortUrl.findOne({full:`https://tuyendung.me/detail-job&idjob=${req.params.id}`})
            // if(result){
            //     rp(`https://tuyendung.me/${result.short}`)
            //     .then(function (htmlString) {
            //         console.log("ok")
            //     })
            //     .catch(function (err) {
            //         console.log("not ok")
            //     });
            // }
    app.get('/detail-job&idjob=:id', async (req, res, next) => {
        var page = req.query.page
        try {
            var fullUrl_query = "https://" + "tuyendung.me" + req.originalUrl;
           
           
            const meta_tag = await find_meta_tag(fullUrl_query)
            const resultjobNTD = await ListViecLam.findOne({ _id: req.params.id })
            const resultuser = await User.findOne({ _id: resultjobNTD.idjobpost })
            const ArrNewJob = await ListViecLam.find({ _id: { $ne: req.params.id } }).sort({ _id: -1 })
            const resultjobmore = ArrNewJob
            if(page){
                if (req.user) {
                    if (meta_tag != "") {
                        res.render('View-Client/ViecLam/Vieclam-single.ejs', {page:page, fullUrl_query: fullUrl_query, meta_tag: meta_tag, user: req.user, resultuser: resultuser, resultjobNTD: resultjobNTD, messagee: "", message: "", resultjobmore: resultjobmore.splice(0, 6),google:"google_adsense"});
                    } else {
                        res.render('View-Client/ViecLam/Vieclam-single.ejs', {page:page, fullUrl_query: fullUrl_query,meta_tag: meta_tag,user: req.user, resultuser: resultuser, resultjobNTD: resultjobNTD, messagee: "", message: "", resultjobmore: resultjobmore.splice(0, 6),google:"google_adsense"});
                    }
                }
                else {
                    const user = ""
                    if (meta_tag != "") {
                        res.render('View-Client/ViecLam/Vieclam-single.ejs', {page:page, fullUrl_query: fullUrl_query, meta_tag: meta_tag, user: user, resultuser: resultuser, resultjobNTD: resultjobNTD, messagee: "", message: "", resultjobmore: resultjobmore.splice(0, 6) ,google:"google_adsense"});
                    } else {
                        res.render('View-Client/ViecLam/Vieclam-single.ejs', {page:page, fullUrl_query: fullUrl_query,meta_tag: meta_tag, user: user, resultuser: resultuser, resultjobNTD: resultjobNTD, messagee: "", message: "", resultjobmore: resultjobmore.splice(0, 6),google:"google_adsense" });
                    }
                }
            }else{
                if (req.user) {
                    if (meta_tag != "") {
                        res.render('View-Client/ViecLam/Vieclam-single.ejs', {page:page, fullUrl_query: fullUrl_query, meta_tag: meta_tag, user: req.user, resultuser: resultuser, resultjobNTD: resultjobNTD, messagee: "", message: "", resultjobmore: resultjobmore.splice(0, 6),google:"" });
                    } else {
                        res.render('View-Client/ViecLam/Vieclam-single.ejs', {page:page, fullUrl_query: fullUrl_query,meta_tag: meta_tag, user: req.user, resultuser: resultuser, resultjobNTD: resultjobNTD, messagee: "", message: "", resultjobmore: resultjobmore.splice(0, 6) ,google:""});
                    }
                }
                else {
                    const user = ""
                    if (meta_tag != "") {
                        res.render('View-Client/ViecLam/Vieclam-single.ejs', {page:page, fullUrl_query: fullUrl_query, meta_tag: meta_tag, user: user, resultuser: resultuser, resultjobNTD: resultjobNTD, messagee: "", message: "", resultjobmore: resultjobmore.splice(0, 6) ,google:""});
                    } else {
                        res.render('View-Client/ViecLam/Vieclam-single.ejs', {page:page, fullUrl_query: fullUrl_query,meta_tag: meta_tag, user: user, resultuser: resultuser, resultjobNTD: resultjobNTD, messagee: "", message: "", resultjobmore: resultjobmore.splice(0, 6),google:"" });
                    }
                }
            }
        } catch (err) {
                res.render("View-profile/404.ejs", { message: "Công việc không tồn tại " })
   
        }
    });
    function getRandomInt_1() {
        return Math.floor((Math.random() * 30) + 1);
      }
    const MessageApplyss = require("../models/OfficeJob/version_1/messageApply")
    const htmlToFormattedText = require("html-to-formatted-text");
    app.post('/MessageApply&:idjobpost', upload.single('attachment'), async (req, res, next) => {
        try {
            const time = getTime(Date.now())
            const InfoTTD = await JobNTD.findOne({ _id: req.params.idjobpost })
            const newMessageApply = new MessageApplyss()
            newMessageApply.DayAplly = time.dateNew;
            newMessageApply.hourAplly = time.timeNew;
            newMessageApply.infoNTV.TilteApply = req.body.TitleMess;
            newMessageApply.infoNTV.NameUV = req.body.nameMess;
            newMessageApply.infoNTV.Email = req.body.emailMess;
            newMessageApply.infoNTV.Phone = req.body.PhoneMess;
            newMessageApply.infoNTV.Message = req.body.Mess;
            newMessageApply.infoNTD.idNTD = req.params.iduserposd;
            newMessageApply.idTintuyendung = req.params.idpost
            if (req.file) {
                newMessageApply.infoNTV.fileAttach = req.file.filename
                const attachments = [
                    {
                        filename: "Ung_Vien_Ung_Tuyen",
                        path: 'http://tuyendung.me/files/' + req.file.filename,
                        contentType: req.file.contentType
                    }
                ]
                newMessageApply.save(async function (err) {
                    const send_email_ntd = await send_email_NTD(InfoTTD._more_info._email_author, req.body.nameMess, req.body.emailMess, req.body.PhoneMess, req.body.TitleMess, attachments)
                    console.log(send_email_ntd)
                    var link = "detail-job&idjob=" + req.params.idjobpost + "?message=" + encodeURIComponent('applysusscesDone')
                    res.redirect(link)
                })
            } else {
                newMessageApply.save(async function (err) {
                    const send_email_ntd = await send_email_NTD(InfoTTD._more_info._email_author, req.body.nameMess, req.body.emailMess, req.body.PhoneMess, req.body.TitleMess, "")
                    console.log(send_email_ntd)
                    var link = "detail-job&idjob=" + req.params.idjobpost + "?message=" + encodeURIComponent('applysusscesDone')
                    res.redirect(link)
                })
            }

        } catch (err) {
            res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
        }
    })
  
    app.get("/khodata", function (req, res, next) {
        try {
            const user = "";
            var page = req.query.page
            if (page) {
                if (page < 1) {
                    page = 1;
                }
                page = parseInt(page)
                pagesize = parseInt(req.query.pagesize)
                if (pagesize < 1) {
                    pagesize = 48;
                }
                var skip = (page - 1) * pagesize
                dataFillter.count({}, function (err, resultcount) {
                    var sl = resultcount
                    var sltht = Math.ceil(resultcount / pagesize)
                    dataFillter.find({}).sort({ _id: -1 }).skip(skip).limit(pagesize).exec((err, result) => {
                        res.render('View-Client/Home/KhoData.ejs', { user: "", result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
                    })
                })
            }
            else {
                dataFillter.find({}).limit(48).sort({ _id: -1 }).exec((err, result) => {
                    dataFillter.count({}, function (err, resultcount) {
                        var pagesize = 48
                        var sltht = Math.ceil(resultcount / pagesize)
                        res.render('View-Client/Home/KhoData.ejs', { result: result, pagesize: pagesize, sltht: sltht, user: "", messagee: "", message: "" });

                    })
                })
            }
        } catch (err) {
            res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
        }
    })
    app.post("/create-ung-tuyen-nhanh", upload.single('fileCV'), async (req, res, next) => {
        try {
            var NameUngVien = req.body.NameUngVien
            var Namsinh = req.body.Namsinh
            var Vitriungtuyen = req.body.Vitriungtuyen
            var Diachi = req.body.Address
            var MucLuong = req.body.salary
            var ChuyenNganh = req.body.chuyennganh
            var Hinhthuc = req.body.typejob
            var newUngTuyenNhanh = new UngTuyenNhanh()
            newUngTuyenNhanh.NameUngVien = NameUngVien
            var DateNS = getTime(NameUngVien)
            newUngTuyenNhanh.Namsinh = DateNS.dateNew
            var date = getTime(Date.now())
            newUngTuyenNhanh.DateCreate = date.dateNew
            newUngTuyenNhanh.Vitriungtuyen = Vitriungtuyen
            newUngTuyenNhanh.Diachi = Diachi
            newUngTuyenNhanh.MucLuong = MucLuong
            newUngTuyenNhanh.ChuyenNganh = ChuyenNganh
            newUngTuyenNhanh.Hinhthuc = Hinhthuc
            if (req.file) {
                newUngTuyenNhanh.fileAttach.url = req.file.filename
                newUngTuyenNhanh.fileAttach.contentType = req.file.contentType
            }
            newUngTuyenNhanh.save((err, done) => {
                if (err) {
                    return err
                } else {
                    res.redirect("danh-sach-viec-lam-all?message=" + encodeURIComponent("Create-Don-Ung-Tuyen-Done"))
                }
            })
        } catch (err) {
            res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
        }
    })
    async function create_new_short_url(_id, _name_job, Salaxy, Area, Time, link_image,_email_author_s) {
        var newUrl = new ShortUrl()
        newUrl.full = "https://tuyendung.me/detail-job&idjob=" + _id
        newUrl.createDate = Time
        newUrl.Titel = _name_job
        newUrl.meta_tag.code_center = "project-job"
        newUrl.meta_tag.code_url = "project-job"
        newUrl.meta_tag.Title = _name_job
        newUrl.meta_tag.Description = Salaxy
        newUrl.meta_tag.Keywords = 'Khu vực :' + Area
        newUrl.meta_tag.url_image = `https://tuyendung.me/image/${link_image}`
        newUrl.meta_tag.image_alt = "project-job"
        newUrl._author._string_code = _id
        newUrl._author._email_author = _email_author_s
        newUrl.type_url.share_cv = false,
            newUrl.type_url.applicant = false,
            newUrl.type_url.project_job = true,
            newUrl.save(async function (err, done) {
                if (err) {
                    return err
                }
                ListViecLam.update({ _id: _id }, { $set: { "_more_info._url_short": done.short } }).exec((err, results) => {
                    console.log("Create short succes" + results)
                    return "Create short succes"
                })
            })
    }
    async function find_meta_tag(url) {
        const urls = await ShortUrl.findOne({ full: url })
        if (urls) {
            return urls.meta_tag
        }
    }
    function send_email_NTD(email_ntd, _name_uv, _email, _phone, _position, fileAttach) {
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
                                                                                <td style="width:138px;text-align:center">
                                                                                    <a href="https://tuyendung.me"
                                                                                        target="_blank">
                                                                                        <img alt="" title=""
                                                                                        src="https://tuyendung.me/logo_vlvp_new_2022.png"
                                                                                        style="width:60%;border-radius:9px;margin-bottom:2%;outline:none;text-decoration:none">
                                                                                    </a>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td align="left" valign="top"
                                                                                    style="padding: 30px 30px 20px 30px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
                                                                                    <h1
                                                                                        style="font-size: 25px; font-weight: 400; margin: 0;color: #000;text-align:center">
                                                                                        Thông Tin Ứng Viên</h1>
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
                                                                                            style="padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 400; line-height: 25px;color: #000">
                                                                                            Ứng Viên:</th>
                                                                                        <td align="left" valign="top" style="padding-bottom:10px;font-family: Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 400; line-height: 25px;color: #000">${_name_uv}</td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                    <th align="left" valign="top"
                                                                                        style="padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 400; line-height: 25px;color: #000">
                                                                                      Phone :</th>
                                                                                    <td align="left" valign="top" style="padding-bottom:10px;font-family: Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 400; line-height: 25px;color: #000">
                                                                                        ${_phone}</td>
                                                                                </tr>
                                                                                        <tr>
                                                                                            <th align="left" valign="top"
                                                                                                style="padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 400; line-height: 25px;color: #000">
                                                                                                E-Mail :</th>
                                                                                            <td align="left" valign="top"
                                                                                                style="padding-bottom:10px;font-family: Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 400; line-height: 25px;color: #000">
                                                                                                ${_email}</td>
                                                                                        </tr>
                                                                                       
                                                                                        <tr>
                                                                                            <th align="left" valign="top"
                                                                                                style="padding-bottom:10px; font-family: Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 400; line-height: 25px;color: #000">
                                                                                                Vị trí :</th>
                                                                                            <td align="left" valign="top"  style ="padding-bottom:10px;font-family: Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 400; line-height: 25px;color: #000">
                                                                                                ${_position}</td>
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
                                                                                            <img style="height:20px;width:20px" src="https://img.icons8.com/ios/50/000000/phone.png" class="CToWUd">Hotline : 093.9.666.98 Đức Anh <br>
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
    </body>`
        Send_Email("vieclamvphcm@gmail.com", "zzhazydimvwgjknr", EmailBody, email_ntd, `Ứng Viên ${_name_uv} ứng tuyển ${_position}`, fileAttach)
    }
    
    async function Url_Analyst_social(_email){
        const Url = await ShortUrl.aggregate([
            {$match:{"_author._email_author":_email}},
            {$sort: { "createDate": -1 } },
            {$unwind:"$Data_Interactive"},
            {$unwind:"$Data_Interactive.Detail_history_Interactive"},
            {$group:{"_id":"$_id","History":{$push:"$Data_Interactive.Detail_history_Interactive"}}},
        ])
        return Url
    }
    async function forEach_Url_Analyst_social(arr){
        const result = []
            arr.forEach(async function(item){
            var Arr_history = item.History
            const count_history = Arr_history.length
            var count_fbs = []
            var count_zalos = []
            Arr_history.forEach(function(item_history){
                        var text = item_history.fullUrl;
                        if(text !=undefined){
                            var count_fb = text.match("fbclid");
                            if(count_fb != null){
                                count_fbs.push(count_fb)
                            }
                            var count_zalo = text.match("zarsrc");
                            if(count_zalo != null){
                                count_zalos.push(count_zalo)
                            }
                        }
                        })
            var redirects  =  parseInt(count_history) - (parseInt(count_fbs.length)+parseInt(count_zalos.length))
            result.push({
                URL:item._id,
                count_fbs:count_fbs.length,
                count_zalos:count_zalos.length,
                redirects:redirects
            })
    })
    return result
    }
};