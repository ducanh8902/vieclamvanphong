module.exports = function (app,isLoggedInISO) {
    app.get("/iso/home",function (req, res,next) {
        try{
        res.render("iso/Home/Home.ejs",{user:req.user})
    }catch(err){
        res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
      }
    })
  };

 