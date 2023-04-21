const { urlencoded } = require('body-parser');
const { config } = require('process');
const { result, isEmpty } = require('underscore');
module.exports = function (app,passport,isLoggedIn) {
  app.get('/logout', function (req, res,next) {
    try{
    req.logout();
    res.redirect('/');
  }catch(err){
    res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
  }
  });
  app.get("/login",function(req,res,next){
    try{
    res.render("View-Client/Login/login.ejs")
    }catch(err){
      res.render("View-profile/404.ejs", { message: "Thao tác không hợp lệ" })
    }
  })
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true 
  }));
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
  }));
};