module.exports=function(passport){
  var conn=require('../config/db.js')();
  var router=require('express').Router();

  router.get('/list',function(req, res, next){
    var user = req.user;

    var sql = 'SELECT avmId,avmLocation,avmCheckDate,avm.managerId,managerName,managerHP FROM avm LEFT OUTER JOIN manager ON avm.managerId = manager.managerId';
      conn.query(sql, function(err, results){
      if(err){
        console.log(err);
        return done('There Is No Data.');
      }
      // for (var i = 0; i < results.length; i++) {
      //   results[i].avmLocation
      // }
      res.render('./vm/list',{
        title: 'VMMS',
        list: results,
        user
      });
    });
  });

  return router;
}
