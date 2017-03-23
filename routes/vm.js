module.exports=function(passport){
  var conn=require('../config/db.js')();
  var router=require('express').Router();

  router.get('/list',function(req, res, next){
    var user = req.user;
    if(user){
      res.redirect('/vm/list/'+user.managerId);
    }
    var sql = 'SELECT avmId,avmLocation,avmCheckDate,avm.managerId,managerName,managerHP FROM avm LEFT OUTER JOIN manager ON avm.managerId = manager.managerId';

    conn.query(sql, function(err, results){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }

    if(results === undefined){
      console.log('SQL ERROR ->', SQL);
      return done(null, false, { message: 'SQL ERROR' });
    }

    res.render('./vm/list',{
      title: 'VMMS',
      list: results,
      user
    });
  });
});

  router.get('/list/:managerId',function(req,res,next){
    var user=req.user;
    var managerId = req.params.managerId;

    if(user === undefined){
      res.redirect('/vm/list');
    }
    if(user.managerId != managerId){
      res.redirect('/vm/list/'+user.managerId);
    }

    var sql = 'SELECT avmId,avmLocation,avmCheckDate,avm.managerId,managerName,managerHP FROM avm LEFT OUTER JOIN manager ON avm.managerId = manager.managerId WHERE avm.managerId = ?';

    conn.query(sql, [ managerId ], function(err, results){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }

      if(results == undefined){
        console.log('SQL ERROR -> ', sql);
        return done(null, false, { message: 'SQL ERROR' });//정보가 틀리면 auth/login으로 이동
      }

      res.render('./vm/list',{
        title: 'VMMS',
        list: results,
        user
      });
    });
  });
  router.all('*',function(req,res){//반드시 마지막, 위의 조건이 아니면 무조건 이 페이지 호출
    res.redirect('/vm/list')
  });
  return router;
}
