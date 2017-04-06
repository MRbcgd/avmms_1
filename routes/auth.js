/*
auth.js
1. 관리자 로그인
2. 관리자 로그아웃
*****************************************************************************************************************

-auth/signin
-auth/signout

*/
module.exports = function(passport){
  var conn = require('../config/db.js')();
  var router = require('express').Router();

  router.get('/signin', function(req, res, next){//관리자 로그인
    var user = req.user;

    if(user){
      res.redirect('/');
    }
    else{
      res.render('./auth/signin', {
        title: 'VMMS',
      });
    }
  });
  router.post('/signin',//관리자 로그인
    passport.authenticate('local',{
      successRedirect: '/',
      failureRedirect: '/auth/signin',
      failureFlash: false
    })
  );
  router.get('/signout', function(req, res){//관리자 로그아웃
    var user = req.user;
    if(user){
      req.logout();
      req.session.save(function(){
        res.redirect('/');
      });
    }
    else{
      res.redirect('/');
    }
  });
  router.all('*', function(req, res){
    res.redirect('/auth/signin');
  });

  return router;
}
