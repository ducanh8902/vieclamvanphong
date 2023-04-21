module.exports = function (app,passport,isLoggedInISO) {
    app.get('/logout_iso', function (req, res) {
        req.logout();
        res.redirect('/iso/login');
      });
      app.get("/iso/login",function(req,res,next){
    try{  
        res.render("iso/Authencation/iso_login.ejs",{ message: req.flash('loginMessage') })
      }catch(err){
        res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
      }
      })
      app.post('/login_iso', passport.authenticate('iso-login', {
        successRedirect: "/iso/home",
        failureRedirect: "/iso/login"+"/?message=" + encodeURIComponent("iso_loginFail"),
        failureFlash: true 
      }));
}