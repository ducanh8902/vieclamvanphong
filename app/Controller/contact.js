module.exports = function (app,isLoggedIn) {
  app.get('/contact', function (req, res,next) {
    try{
    res.render('View-profile/profile.ejs');
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
};