module.exports = function (app,isLogged_profile_next,getTime,HotJobNTD,HotNTD,shareCV,newApplyUT,shuffle,Email,ShortUrl,ListViecLam,interview,apply,MessageApplys,User,upload,CreateForm,newApplicant,io,dataFillter,JobNTD,SaveLog,Logs,crypto,path) {
    app.get("/profile_v2",isLogged_profile_next,async function(req,res,next){
        try{
            res.render("View-client-v2/profile/profile.ejs",{user:req.user})
        }catch(err){
            res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
        }
    }) 
    app.get("/banner_profile",isLogged_profile_next,async function (req, res) {
        try{
            res.render('View-client-v2/Banner/Profile.ejs')
        }catch(err){
            res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
        }
    })
    app.get("/profile_share_cv",isLogged_profile_next,async function (req, res) {
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
              const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" } })
              const sltht = Math.ceil(resultcount / pagesize)
              const result = await shareCV.find({ StatusChecking: { $ne: "off" } }).sort({ _id: -1 }).skip(skip).limit(pagesize)
              res.render('View-client-v2/profile/share-cv/share-cv.ejs', { fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: "", result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
            }
            else {
              const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" } })
              const result = await shareCV.find({ StatusChecking: { $ne: "off" } }).limit(18).sort({ _id: -1 })
              const pagesize = 18
              const sltht = Math.ceil(resultcount / pagesize)
              res.render('View-client-v2/profile/share-cv/share-cv.ejs', { fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
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
              const resultcount = await shareCV.count({ StatusChecking: { $ne: "off" } })
              var sltht = Math.ceil(resultcount / pagesize)
              shareCV.find({ StatusChecking: { $ne: "off" } }).sort({ _id: -1 }).skip(skip).limit(pagesize).exec((err, result) => {
                if (req.user.permission.share_cv == true) {
                  res.render('View-client-v2/profile/share-cv/share-cv.ejs', { fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: true, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
    
                } else {
                  res.render('View-client-v2/profile/share-cv/share-cv.ejs', { fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(page), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, user: req.user, result: result, pagesize: pagesize, sltht: sltht, messagee: "", message: "" });
                }
              })
            }
            else {
              const resultcount = await shareCV.count()
              const result = await shareCV.find({ StatusChecking: { $ne: "off" } }).limit(18).sort({ _id: -1 })
              var pagesize = 18
              var sltht = Math.ceil(resultcount / pagesize)
              if (req.user.permission.share_cv == true) {
                res.render('View-client-v2/profile/share-cv/share-cv.ejs', { fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: true, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
              } else {
                res.render('View-client-v2/profile/share-cv/share-cv.ejs', { fullUrl: fullUrl, fullUrl_query: fullUrl_query, page_start: parseInt(1), check_render_phone: false, top_5: top_5, report_count: report_count, report_area: report_area, time_s: time_s.dateNew, result: result, pagesize: pagesize, sltht: sltht, user: req.user, messagee: "", message: "" });
              }
            }
          }
        } catch (err) {
          res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
        }
    })
    app.get('/edit_profile_v2/:id', isLogged_profile_next, function (req, res,next) {
        try{
        User.find({ _id: req.params.id }).exec((err, datauser) => {
          res.render('View-client-v2/profile/edit-profile.ejs', {
            user: req.user, datauser: datauser,messagee: "", message: ""
          });
        });
      }catch(err){
        res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
      }
      });
      app.post('/edit-profile-NTD/:id', isLogged_profile_next, function (req, res,next) {
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
          res.redirect(`/edit_profile_v2/${req.params.id}`)
        })
      }catch(err){
        res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
      }
      });
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
}