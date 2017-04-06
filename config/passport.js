/*
passport.js

-사용자 인증
*****************************************************************************************************************

*/
module.exports = function(app){
  var conn = require('./db.js')();
  var passport = require('passport');//passport 모듈
  var LocalStrategy = require('passport-local').Strategy;//passport-local 모듈

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user.managerUsername);
  });
  passport.deserializeUser(function(id, done) {
    var sql = 'SELECT * FROM manager WHERE managerUsername = ?';

    conn.query(sql, [ id ], function(err, results){
      if(err){
        console.log(err);
        return done('There Is No User.');
      }
      else{
        return done(null, results[0]);
      }
    })
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      var uname = username;
      var pwd = password;
      var sql = 'SELECT * FROM manager WHERE managerUsername = ?';

      conn.query(sql, [ uname ], function(err, results){
        var user = results[0];

        if(err){
          console.log(err);
          return done('There Is No User.');
        }

        if(user == undefined){
          console.log('Wrong User, Try Again!');
          return done(null, false, { message: 'Incorrect username.' });
        }
        if(uname === user.managerUsername && pwd === user.managerPassword){
          return done(null, user);
        }
        else{
          console.log('Wrong User, Try Again!');
          return done(null, false, { message: 'Incorrect Password.' });
        }
      })
    })
  );

  return passport;
}
