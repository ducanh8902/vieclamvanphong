module.exports = function (app, isLoggedIn, newApplyUT, isLoggedInISO_next, User, TrainingClass) {

  app.get("/iso/Show_List_Interview", isLoggedInISO_next, async function (req, res,next) {
    try{
    var List_UV = await newApplyUT.aggregate([
      {
        $group: {
          _id: { Year: "$FillterNam", month: "$FiffterThang" },
          ListUV: { $push: { _id: "$_id", Name: "$NameUT", Ngaysinh: "$Ngaysinh", CMND: "$CMND", Phone: "$PhoneUT" }, }
        }
      },
      { $addFields: { months: { $toInt: "$_id.month" } } },
      { $sort: { months: -1 } },
      {
        $group: {
          _id: { year: "$_id.Year" },
          result: { $addToSet: { Month: "$months", ListUV: "$ListUV" } },
        }
      }])
    res.render("iso/View_iso/List_interview.ejs", { List_UV: List_UV, user: req.user })
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  })
  app.get("/iso/result_interview_list", isLoggedInISO_next, async function (req, res, next) {
    try {
      var Training = await TrainingClass.aggregate([
        { $addFields: { date: { $toDate: "$KhoaTrain" } } },
        { $sort: { date: -1 } },
        {
          $group: {
            _id: { Year: "$FillterNam", Group: "$Bophan", Month: "$FiffterThang" },
            Class: { $addToSet: { KhoaTrain: "$KhoaTrain", ListUV: "$DataTraining" } }
          }
        },
        { $addFields: { month: { $toInt: "$_id.Month" } } },
        { $sort: { month: -1 } },
        {
          $group: {
            _id: { Year: "$_id.Year", Group: "$_id.Group" }, Bophan: { $addToSet: "$_id.Group" },
            results: { $push: { Thang: "$month", Class: "$Class" } }
          }
        },
        { $addFields: { Years: { $toInt: "$_id.Year" } } },
        { $sort: { Years: -1 } },
        {
          $group: {
            _id: { year: "$_id.Year" },
            result: { $addToSet: { Group: "$_id.Group", info: "$results" } },
          }
        }])
      var Training_Fail = await newApplyUT.aggregate([
        { $match: { "Interview.ResultInterview": "Fail", "Interview.Bophan": { $ne: undefined } } },
        {
          $group: {
            _id: { Year: "$FillterNam", Group: "$Interview.Bophan", Month: "$FiffterThang" },
            Class: { $addToSet: { _id: "$_id", NameUT: "$NameUT", CMND: "$CMND", Ngaysinh: "$Ngaysinh" } }
          }
        },
        { $addFields: { month: { $toInt: "$_id.Month" } } },
        { $sort: { month: -1 } },
        {
          $group: {
            _id: { Year: "$_id.Year", Group: "$_id.Group" }, Bophan: { $addToSet: "$_id.Group" },
            results: { $push: { Thang: "$month", Class: "$Class" } }
          }
        },
        { $addFields: { Years: { $toInt: "$_id.Year" } } },
        { $sort: { Years: -1 } },
        {
          $group: {
            _id: { Year: "$_id.Year" },
            result: { $addToSet: { Group: "$_id.Group", info: "$results" } },
          }
        }])
      var Training_Pending = await newApplyUT.aggregate([
        { $match: { "Interview.ResultInterview": "Pending", "Interview.Bophan": { $ne: undefined } } },
        {
          $group: {
            _id: { Year: "$FillterNam", Group: "$Interview.Bophan", Month: "$FiffterThang" },
            Class: { $addToSet: { _id: "$_id", NameUT: "$NameUT", CMND: "$CMND", Ngaysinh: "$Ngaysinh" } }
          }
        },
        { $addFields: { month: { $toInt: "$_id.Month" } } },
        { $sort: { month: -1 } },
        {
          $group: {
            _id: { Year: "$_id.Year", Group: "$_id.Group" }, Bophan: { $addToSet: "$_id.Group" },
            results: { $push: { Thang: "$month", Class: "$Class" } }
          }
        },
        { $addFields: { Years: { $toInt: "$_id.Year" } } },
        { $sort: { Years: -1 } },
        {
          $group: {
            _id: { Year: "$_id.Year" },
            result: { $addToSet: { Group: "$_id.Group", info: "$results" } },
          }
        }])
      res.render("iso/View_iso/result_interview.ejs", { Training_Fail: Training_Fail, Training_Pending: Training_Pending, Training: Training, user: req.user })
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
  app.get("/iso/detail_candidate_information=:result", isLoggedInISO_next, async function (req, res, next) {
    try {
      newApplyUT.findOne({ _id: req.params.result }).exec((err, infoUser) => {
        res.render("iso/View_iso/Letter/candidate_information.ejs", { infoUser: infoUser })
      })
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/detail_result_interview=:result-iduser=:iduser", isLoggedInISO_next, async function (req, res, next) {
    try {
      const UserRequest = await User.findOne({ _id: req.params.iduser })
      if (UserRequest.iso == true) {
        newApplyUT.findOne({ _id: req.params.result }).exec((err, infoUser) => {
          res.render("iso/View_iso/Letter/result_interview.ejs", { infoUser: infoUser })
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
  app.get("/iso/print_detail_result_interview=:result-iduser=:iduser", isLoggedInISO_next, async function (req, res, next) {
    try {
      const UserRequest = await User.findOne({ _id: req.params.iduser })
      if (UserRequest.iso == true) {
        newApplyUT.findOne({ _id: req.params.result }).exec((err, infoUser) => {
          res.render("iso/Print/danh-gia-ket-qua-phong-van.ejs", { infoUser: infoUser })
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
  app.get("/iso/print-hosoungvien-id=:idungvien-iduser=:iduser", isLoggedInISO_next, async function (req, res, next) {
    try {
      const UserRequest = await User.findOne({ _id: req.params.iduser })
      if (UserRequest.iso == true) {
        newApplyUT.findOne({ _id: req.params.idungvien }).exec((err, infoUser) => {
          if (infoUser) {
            res.render("iso/Print/thong_tin_ung_vien.ejs", { infoUser: infoUser })
          } else {
            res.writeHead(301, {
              Location: `http://tuyendung.me/404`
            }).end();
          }
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

  app.get("/iso/Form_transfer", isLoggedInISO_next, async function (req, res, next) {
    try {
      var Training = await TrainingClass.aggregate([
        { $addFields: { date: { $toDate: "$KhoaTrain" } } },
        { $sort: { date: -1 } },
        {
          $group: {
            _id: { Year: "$FillterNam", Group: "$Bophan", Month: "$FiffterThang" },
            Class: { $addToSet: { id: "$_id", KhoaTrain: "$KhoaTrain", ListUV: "$DataTraining" } }
          }
        },
        { $addFields: { month: { $toInt: "$_id.Month" } } },
        { $sort: { month: -1 } },
        {
          $group: {
            _id: { Year: "$_id.Year", Group: "$_id.Group" }, Bophan: { $addToSet: "$_id.Group" },
            results: { $push: { Thang: "$month", Class: "$Class" } }
          }
        },
        { $addFields: { Years: { $toInt: "$_id.Year" } } },
        { $sort: { Years: -1 } },
        {
          $group: {
            _id: { year: "$_id.Year" },
            result: { $addToSet: { Group: "$_id.Group", info: "$results" } },
          }
        }])
      res.render("iso/View_iso/Form_transfer", { Training: Training, user: req.user })
    } catch (err) {
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.get("/iso/print-List-transfer-training-idclass=:training-user=:iduser", isLoggedInISO_next, async function (req, res, next) {
    try {
      const UserRequest = await User.findOne({ _id: req.params.iduser })
      if (UserRequest.iso == true) {
        TrainingClass.findOne({ _id: req.params.training }).exec((err, infoClass) => {
          if (infoClass) {
            res.render("iso/Print/danh-sach-ban-giao.ejs", { infoClass: infoClass })
          } else {
            res.writeHead(301, {
              Location: `http://tuyendung.me/404`
            }).end();
          }
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
}