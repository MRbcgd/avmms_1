module.exports=function(passport){
  var conn=require('../config/db.js')();
  var router=require('express').Router();

  router.get('/signin',function(req, res, next){
    var user=req.user;
    if(user){
      res.redirect('/');
    }
    res.render('./auth/signin',{
      title: 'VMMS',
    });
  });
  router.post('/signin',//passport
    passport.authenticate('local',{
      successRedirect: '/',
      failureRedirect: '/auth/signin',//검증에서 false를 done했다면
      failureFlash: false
    })
  );
  router.get('/signout',function(req,res){
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
  router.all('*',function(req,res){//반드시 마지막, 위의 조건이 아니면 무조건 이 페이지 호출
    res.redirect('/auth/signin');
  });
  return router;
}
