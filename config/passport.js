// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
// load up the user model
var User       = require('../app/models/OfficeJob/version_1/user.js');


// load the auth variables
// var configAuth = {

//     'facebookAuth' : {
//         'clientID'        : "703716803638325", // your App ID
//         'clientSecret'    : "1e97aa38ed03188ef3908a5bba405e97", // your App Secret
//         'callbackURL'     : "https://apivieclamvp.herokuapp.com/auth/facebook/callback",
//         'profileURL': 'https://graph.facebook.com/v11.0/me?fields=first_name,last_name,email',
//         'profileFields': "['id', 'displayName', 'photos', 'email']"
//     }
// }; // use this one for testing
// var configAuth = {

//     'facebookAuth' : {
//         'clientID'        : '703716803638325', // your App ID
//         'clientSecret'    : '1e97aa38ed03188ef3908a5bba405e97', // your App Secret
//         'callbackURL'     : 'http://localhost:8080/auth/facebook/callback',
//         'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
//         'profileFields'   : ['id', 'email', 'name'] // For requesting permissions from Facebook API
//     }
// }; 

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('iso-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);
               
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage','User không tồn tại.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage','Sai mật khẩu.'));
                if (user.iso == false || user.iso == "" || user.iso == null)
                    return done(null, false, req.flash('loginMessage','Bạn không có quyền truy cập'));
                else{
                    return done(null, user);
                }
            });
        });

    }));
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);
               
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage','User không tồn tại.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage','Sai mật khẩu.'));
                else{
                    return done(null, user);
                }
            });
        });

    }));
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase();

        process.nextTick(function() {
            
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'Email đã được đăng kí'));
                    } else {
                        let ts = Date.now();
                        let date_ob = new Date(ts);
                        let date = date_ob.getDate();
                        let month = date_ob.getMonth() + 1;
                        let year = date_ob.getFullYear();
                        let hours = date_ob.getHours();
                        let minutes = date_ob.getMinutes();
                        // create the user
                        var newUser            = new User();
                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.FiffterNgay=  date
                        newUser.local.FiffterThang= month
                        newUser.local.FillterNam=  year
                        newUser.local.CreateDate = date+"/"+month+"/"+year
                        if(email =="admin@vieclamvp.com"){
                        newUser.local.Type = 'Admin';
                        newUser.local.NameAdmin = req.body.nameuser;
                        }
                        else{
                            if(req.body.typee){
                                newUser.local.Type = req.body.typee;
                               }
                        }
                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            // if the user is logged in but has no local account...
            } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'Email không tồn tại'));
                        // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                        var user = req.user;
                        user.local.email = email;
                        user.local.password = user.generateHash(password);
                        user.local.Type = "0";
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            
                            return done(null,user);
                        });
                    }
                });
            } else {
                // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                return done(null, req.user);
            }

        });

    }));
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    // var fbStrategy = configAuth.facebookAuth;
    // fbStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    // passport.use(new FacebookStrategy(fbStrategy,
    // function(req, token, refreshToken, profile, done) {

    //     // asynchronous
    //     process.nextTick(function() {

    //         // check if the user is already logged in
    //         if (!req.user) {

    //             User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
    //                 if (err)
    //                     return done(err);

    //                 if (user) {

    //                     // if there is a user id already but no token (user was linked at one point and then removed)
    //                     if (!user.facebook.token) {
    //                         user.facebook.token = token;
    //                         user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
    //                         user.facebook.email = (profile.emails[0].value || '').toLowerCase();

    //                         user.save(function(err) {
    //                             if (err)
    //                                 return done(err);
                                    
    //                             return done(null, user);
    //                         });
    //                     }

    //                     return done(null, user); // user found, return that user
    //                 } else {
    //                     // if there is no user, create them
    //                     var newUser            = new User();

    //                     newUser.facebook.id    = profile.id;
    //                     newUser.facebook.token = token;
    //                     newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
    //                     newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

    //                     newUser.save(function(err) {
    //                         if (err)
    //                             return done(err);
                                
    //                         return done(null, newUser);
    //                     });
    //                 }
    //             });

    //         } else {
    //             // user already exists and is logged in, we have to link accounts
    //             var user            = req.user; // pull the user out of the session

    //             user.facebook.id    = profile.id;
    //             user.facebook.token = token;
    //             user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
    //             user.facebook.email = (profile.emails[0].value || '').toLowerCase();

    //             user.save(function(err) {
    //                 if (err)
    //                     return done(err);
                        
    //                 return done(null, user);
    //             });

    //         }
    //     });

    // }));

};
