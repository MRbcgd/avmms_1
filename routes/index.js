/*
index.js
1. 사이트 메인 화면
*****************************************************************************************************************

-/

*/
module.exports = function(passport){
  var router = require('express').Router();

  router.get('/', function(req, res, next){
    var user = req.user;
    res.render('index',{
      title: 'VMMS',
      user
    });
  });

  return router;
}
