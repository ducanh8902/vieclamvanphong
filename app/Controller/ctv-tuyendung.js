module.exports = function (app, isLoggedIn, newApplyUT, newApplicant, getTime, nodeExcel, conn, Grid, mongoose) {
    var gfs;
    conn.once('open', function () {
        gfs = Grid(conn, mongoose.mongo);
        gfs.collection('uploads');
    });
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure: false,
        auth: {
            user: 'new.vieclamvp.01@gmail.com',
            pass: 'ofqsfgmoekbdvkek'
        }
    });
    app.get('/ung-vien-ung-tuyen-ctv', isLoggedIn, async (req, res,next) => {
        try{
        if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
            const dataInterviewSeach = await newApplicant.find().sort({ _id: -1 })
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
                const resultcount = await newApplicant.count({})
                var sltht = Math.ceil(resultcount / pagesize)
                newApplicant.find({}).sort({ _id: -1 }).skip(skip).limit(pagesize).exec((err, result) => {
                    res.render('View-Client/UngVien/ctv-tuyendung.ejs', { dataInterviewSeach: dataInterviewSeach, user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
                })
            }
            else {
                const resultcount = await newApplicant.count({})
                const result = await newApplicant.find({}).limit(20).sort({ _id: -1 })
                var pagesize = 20
                var sltht = Math.ceil(resultcount / pagesize)
                res.render('View-Client/UngVien/ctv-tuyendung.ejs', { dataInterviewSeach: dataInterviewSeach, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
            }
        } else {
            res.render("View-profile/404.ejs")
        }
    }catch(err){
        res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
      }
    });
    app.post('/Update-InterView&id-CTV=:id', isLoggedIn, async (req, res,next) => {
        try{
        if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
            const time = getTime(req.body.TrainingDay)
            var datenew = time.dateNew

            await newApplicant.updateOne({ _id: req.params.id }, {
                $set: {
                    "Interview.Nhom": req.body.Nhom,
                    "Interview.Bophan": req.body.Bophan,
                    "Interview.NameInterviewer": req.body.NameInterviewer,
                    "Interview.ResultInterview": req.body.ResultInterview,
                    "Interview.TrainingDay": datenew,
                    "Interview.CommentInterview": req.body.CommentInterview,
                    "BonusGTNS.StatusCheck": "Checking",
                    "BonusGTNS.Step2.FeeApplicant": "Đang Cập Nhật",
                    "BonusGTNS.Step2.StartDay": "Đang Cập Nhật",
                    "BonusGTNS.Step2.DateCheckBonus": "Đang Cập Nhật",
                    "BonusGTNS.Step3.Status": "Đang kiểm tra",
                    "BonusGTNS.Step3.DateCheckingLan1": "Chưa cập nhật",
                    "BonusGTNS.Step4.Status": "Đang kiểm tra",
                    "BonusGTNS.Step4.DateCheckingLan2": "Chưa cập nhật",
                    "BonusGTNS.Step5.Status": "Đang kiểm tra",
                    "BonusGTNS.Step5.DateChecking": "Đang kiểm tra",
                }
            }).exec((err, done) => {
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
        } else {
            res.render("View-profile/404.ejs")
        }
    }catch(err){
        res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
      }
    })
    app.post('/Update-InterView-Info&id=:id', isLoggedIn, async (req, res,next) => {
        try{
        if (req.user.local.email == "galaxydr@galaxydr.com.vn") {
           
            await newApplicant.updateOne({ _id: req.params.id }, {
                $set: {
                    "Interview.Nhom": req.body.UpdateNhom,
                    "Interview.Bophan": req.body.UpdateBophan,
                    "Interview.NameInterviewer": req.body.UpdateNameInterviewer,
                    "Interview.ResultInterview": req.body.UpdateResultInterview,
                    "Interview.TrainingDay": req.body.UpdateTrainingDay,
                    "Interview.CommentInterview": req.body.UpdateCommentInterview,
                    "BonusGTNS.StatusCheck": "Checking",
                    "BonusGTNS.Step2.FeeApplicant": req.body.UpdateFeeApplicant,
                    "BonusGTNS.Step2.StartDay": req.body.UpdateStartDay,
                    "BonusGTNS.Step2.DateCheckBonus": req.body.UpdateDateCheckBonus,
                    "BonusGTNS.Step3.Status": req.body.UpdateStatusStep3,
                    "BonusGTNS.Step3.DateCheckingLan1": req.body.UpdateDateCheckingLan1,
                    "BonusGTNS.Step4.Status": req.body.UpdateStatusStep4,
                    "BonusGTNS.Step4.DateCheckingLan2": req.body.UpdateDateCheckingLan2,
                    "BonusGTNS.Step5.Status": req.body.UpdateStatusStep5,
                    "BonusGTNS.Step5.DateChecking": req.body.UpdateDateChecking,
                }
            }).exec((err, done) => {
                if (err) {
                    res.render('View-profile/404.ejs',{message:"Liên kết không tồn tại"})
                } else {

                    res.redirect("/ung-vien-ung-tuyen-ctv?message=" + encodeURIComponent('applysussces'))

                }
            })
        } else {
            res.render("View-profile/404.ejs")
        }
    }catch(err){
        res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
      }
    })
    function getTimeNew(time) {
        let ts = time
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        return resusltTime = {
            date: date,
            month: month,
            year: year,
            hours: hours,
            minutes: minutes,
            dateNew: date + "-" + month + "-" + year,
            timeNew: hours + ':' + minutes
        }
    }
};
