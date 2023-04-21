const form_request = require("../../models/Iso/form_request")

module.exports = function (app, isLoggedIn, iso_form_request, isLoggedInISO_next, User, TrainingClass, upload, getTime) {
  app.get("/test_data_iso",async function(req,res){
    const id_report = "624ddf8a175529d239fcd53b"
    
    var report = await iso_form_request.findOne({_id:id_report})
    res.render("iso/View_iso/report_new.ejs",{report:report})


    // var report = await iso_form_request.update({ _id: id_report },{$set:{"Report.final_report":"Đạt yêu cầu","Report.solution":"4 Nhân sự dư , được bổ sung cho yêu cầu tiếp theo của bộ phận yêu cầu."}})
    // res.send(report)
  })
  app.get("/iso/Show_List_Request", isLoggedInISO_next, async function (req, res, next) {
    try {
     var List_form = await iso_form_request.aggregate([
      { $unwind: "$Info_request" },
      {
        $group: {
          _id: { id: "$_id", Year: "$Fillter_Year", Group: "$Info_head.Center_send_request", Month: "$Fillter_Month", Dates: "$Info_head.Date_request", Info_confirm: "$Info_confirm", Purpose: "$Info_head.Purpose",number_request:"$Info_head._id_custom"},
          List: { $addToSet: { List: "$Info_request" } }
        }
      },
      {
        $group: {
          _id: { Year: "$_id.Year", Group: "$_id.Group", Month: "$_id.Month" },
          detail_request: { $push: { id: "$_id.id", Purpose: "$_id.Purpose",request_number:"$_id.number_request",Confirm: "$_id.Info_confirm", Date_Request: "$_id.Dates", List_Request: "$List"} }
        }
      },
      { $addFields: { month: { $toInt: "$_id.Month" } } },
      { $sort: { month: 1 } },
      {
        $group: {
          _id: { Year: "$_id.Year", Group: "$_id.Group" },
          Bophan: { $addToSet: "$_id.Group" },
          results: { $push: { Month: "$month", Requests: "$detail_request" } }
        }
      },
      { $addFields: { Years: { $toInt: "$_id.Year" } } },
      { $sort: { Years: -1 } },
      {
        $group: {
          _id: { year: "$_id.Year" },
          result: { $addToSet: { Center_counseling: "$_id.Group", Request_total: "$results" } },
        }
      }])
      var List_form_Scan = await iso_form_request.find()
      res.render("iso/View_iso/view_request.ejs", { List_form: List_form, user: req.user, List_form_Scan: List_form_Scan })
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/btn_Scan_request_form", isLoggedInISO_next, async function (req, res, next) {
    try {
      var List_form_Scan = await iso_form_request.find().sort({ _id: -1 })
      res.render("iso/View_iso/Scan_request.ejs", { user: req.user, List_form_Scan: List_form_Scan })
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/Scan_list_transfer", isLoggedInISO_next, async function (req, res, next) {
    try {
      var List_transfer_Scan = await TrainingClass.find().sort({ _id: -1 })
      res.render("iso/View_iso/Scan_tranfer.ejs", { user: req.user, List_transfer_Scan: List_transfer_Scan })
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/Scan_request_form_id=:id", isLoggedInISO_next, async function (req, res, next) {
    try {
      var form_request = await iso_form_request.findOne({ _id: req.params.id })
      res.render("iso/Scan/request.ejs", { form_request: form_request })
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/Scan_transfer_form_id=:id", isLoggedInISO_next, async function (req, res, next) {
    try {
      var form_transfer = await TrainingClass.findOne({ _id: req.params.id })
      res.render("iso/Scan/tranfer.ejs", { form_transfer: form_transfer })
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/request_BM", isLoggedInISO_next, async function (req, res, next) {
    try {
      res.render("iso/BieuMau/request.ejs")
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/print_request_center=:result-iduser=:iduser", isLoggedInISO_next, async function (req, res, next) {
    try {
      const UserRequest = await User.findOne({ _id: req.params.iduser })
      if (UserRequest.iso == true) {
        iso_form_request.findOne({ _id: req.params.result }).exec((err, List_form) => {
          res.render("iso/Print/yeu-cau-tuyen-dung.ejs", { Request_form: List_form })
        })
      } else {
        res.writeHead(301, {
          Location: `http://tuyendung.me/404`
        }).end();
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/create_request", isLoggedInISO_next, async function (req, res, next) {
    try {
      res.render("iso/View_iso/create_form/request.ejs")
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.post("/iso/create_form_request", isLoggedInISO_next, async function (req, res, next) {
    try {
      const time = getTime(Date.now())
      const Date_request = getTime(req.body.date_request)
      const date = Date_request.dateNew
      let result = date.replaceAll("/", "-");
      const row = req.body.count_row;
      const arrInfo_request = []
      if (row == 1) {
        form_request.create({
          Info_head: {
            Center_send_request: req.body.center_request,
            Date_request: result,
            Purpose: req.body.Purpose,
          },
          Info_request: [{
            Vacancies: req.body.Vacancies,
            Group_request: req.body.Group_request,
            Recruitment_requirements: req.body.Recruitment_requirements,
            Training_Day: req.body.Training_Day,
            Headcount: req.body.Headcount,
            Headcount_approve: req.body.Headcount_approve,
            Note_Status: req.body.Note_Status,
          }],
          Info_confirm: {
            Confirm_Request_Sender: req.body.person_request,
            Confirm_Director_Center: req.body.Confirm_Director_Center,
            Confirm_Recuitment_Teamleader: req.body.Confirm_Recuitment_Teamleader,
            Confirm_HR_Director: req.body.Director,
          },
          Fillter_Year: time.year,
          Fillter_Month: time.month,
          Fillter_Date: time.date
        })
      } else {
        var i = 0
        for (i; i < row; i++) {
          arrInfo_request.push({
            Group_request: req.body.Group_request[i],
            Recruitment_requirements: req.body.Recruitment_requirements[i],
            Vacancies: req.body.Vacancies[i],
            Training_Day: req.body.Training_Day[i],
            Headcount: req.body.Headcount[i],
            Headcount_approve: req.body.Headcount_approve[i],
            Note_Status: req.body.Note_Status[i],
          })
        }
        console.log(arrInfo_request)
        form_request.create({
          Info_head: {
            Center_send_request: req.body.center_request,
            Date_request: Date_request.dateNew,
            Purpose: req.body.Purpose,
          },
          Info_request: arrInfo_request,
          Info_confirm: {
            Confirm_Request_Sender: req.body.person_request,
            Confirm_Director_Center: req.body.Confirm_Director_Center,
            Confirm_Recuitment_Teamleader: req.body.Confirm_Recuitment_Teamleader,
            Confirm_HR_Director: req.body.Director,
          },
          Fillter_Year: time.year,
          Fillter_Month: time.month,
          Fillter_Date: time.date,
        })
      }
      res.render("iso/Scan/succes.ejs")
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/report_view_request_center=:id", isLoggedInISO_next, async function (req, res, next) {
    try {
      var report = await iso_form_request.findOne({ _id: req.params.id })
      res.render("iso/View_iso/Book2.ejs", { report: report })
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/print_report_view-request_center=:id-iduser=:iduser", isLoggedInISO_next, async function (req, res, next) {
    try {
      const UserRequest = await User.findOne({ _id: req.params.iduser })
      if (UserRequest.iso == true) {
        var report = await iso_form_request.findOne({ _id: req.params.id })
        res.render("iso/Print/report.ejs", { report: report })
      } else {
        res.writeHead(301, {
          Location: `http://tuyendung.me/404`
        }).end();
      }
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/report", isLoggedInISO_next, async function (req, res, next) {
    try {
      var List_form = await iso_form_request.aggregate([
        { $unwind: "$Info_request" },
        {
          $group: {
            _id: { id: "$_id", Year: "$Fillter_Year", Group: "$Info_head.Center_send_request", Month: "$Fillter_Month", Dates: "$Info_head.Date_request", Info_confirm: "$Info_confirm", Purpose: "$Info_head.Purpose" },
            List: { $addToSet: { List: "$Info_request" } }
          }
        },
        {
          $group: {
            _id: { Year: "$_id.Year", Group: "$_id.Group", Month: "$_id.Month" },
            detail_request: { $push: { id: "$_id.id", Purpose: "$_id.Purpose", Confirm: "$_id.Info_confirm", Date_Request: "$_id.Dates", List_Request: "$List", } }
          }
        },
        { $addFields: { month: { $toInt: "$_id.Month" } } },
        { $sort: { month: 1 } },
        {
          $group: {
            _id: { Year: "$_id.Year", Group: "$_id.Group" },
            Bophan: { $addToSet: "$_id.Group" },
            results: { $push: { Month: "$month", Requests: "$detail_request" } }
          }
        },
        { $addFields: { Years: { $toInt: "$_id.Year" } } },
        { $sort: { Years: -1 } },
        {
          $group: {
            _id: { year: "$_id.Year", },
            result: { $addToSet: { Center_counseling: "$_id.Group", Request_total: "$results" } },
          }
        }])
      res.render("iso/View_iso/report.ejs", { List_form: List_form, user: req.user })
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.post("/Scan-Request-idForm=:idForm", upload.single('ScanFile'), isLoggedInISO_next, async function (req, res, next) {
    try {
      iso_form_request.update(
        { _id: req.params.idForm },
        { $set: { "Scan.url": `https://tuyendung.me/files/${req.file.filename}` } },
      ).exec((err, Resultdone) => {
        console.log(Resultdone)
        res.render("iso/Scan/succes.ejs")
      });
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.post("/Scan-Transfer-idForm=:idForm", upload.single('ScanFile'), isLoggedInISO_next, async function (req, res, next) {
    try {
      TrainingClass.update(
        { _id: req.params.idForm },
        { $set: { "Scan.url": `https://tuyendung.me/files/${req.file.filename}` } },
      ).exec((err, Resultdone) => {
        console.log(Resultdone)
        res.render("iso/Scan/succes.ejs")
      });
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
}