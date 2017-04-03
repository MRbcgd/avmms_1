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
  router.get('/list/:managerId/:avmId',function(req,res,next){
    var user=req.user;
    var managerId = req.params.managerId;
    var avmId = req.params.avmId;

    if(user === undefined){
      res.redirect('/vm/list');
    }
    if(user.managerId != managerId){
      res.redirect('/vm/list/'+user.managerId);
    }

    var sql = 'SELECT avm.avmId,avmLocation,avmInstallDate,avmCheckDate,avmFinancialCondition,avmPrice,productId,productName,stockTotal,stockPrice,productCost,stockProfits FROM avm LEFT OUTER JOIN (SELECT avmid,stock.productId,stockTotal,stockPrice,stockProfits,productName,productCost FROM stock LEFT OUTER JOIN product ON product.productId = stock.productId WHERE avmId = ?) A ON A.avmid = avm.avmId WHERE avm.avmId = ? ORDER BY productId';

    conn.query(sql, [ avmId,avmId ], function(err, results){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      if(results === undefined){
        console.log('SQL ERROR -> ', sql);
        res.redirect('/');
      }


      var avms = results[0];

      res.render('./vm/item',{
        title: 'VMMS',
        avm: avms,
        list: results,
        user
      });

    });
  });
  router.get('/list/:managerId/:avmId/updateDate',function(req,res,next){
    var user=req.user;
    var managerId = req.params.managerId;
    var avmId = req.params.avmId;

    if(user === undefined){
      res.redirect('/vm/list');
    }
    if(user.managerId != managerId){
      res.redirect('/vm/list/'+user.managerId);
    }

    var sql = 'UPDATE avm SET avmCheckDate = NOW() WHERE avmId = ?;';

    conn.query(sql, [ avmId ], function(err){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      else{
        res.redirect('/vm/list/'+user.managerId+'/'+avmId);
      }
    });
  });
  router.get('/list/:managerId/:avmId/earnIncome',function(req,res,next){

    var user=req.user;
    var managerId = req.params.managerId;
    var avmId = req.params.avmId;

    if(user === undefined){
      res.redirect('/vm/list');
    }
    if(user.managerId != managerId){
      res.redirect('/vm/list/'+user.managerId);
    }

    var sql = 'SET @description=""; CALL earnIncome(?,?,@description); SELECT @description';
    conn.query(sql, [ managerId,avmId], function(err,results){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      else{
        for (var i = 0; i < results.length; i++) {
            console.log(results[i]); // 여기에 전달받은 결과가 표시됨 @변수명으로...
        };
        res.redirect('/vm/list/'+user.managerId+'/'+avmId);
      }
    });
  });
  router.get('/list/:managerId/:avmId/:productId',function(req,res,next){

    var user=req.user;
    var managerId = req.params.managerId;
    var avmId = req.params.avmId;
    var productId = req.params.productId;

    if(user === undefined){
      res.redirect('/vm/list');
    }
    if(user.managerId != managerId){
      res.redirect('/vm/list/'+user.managerId);
    }

    var sql = 'SET @description=""; CALL purchaseProduct(?,?,?,@description); SELECT @description';

    conn.query(sql, [ managerId,avmId,productId], function(err,results){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      else{
        for (var i = 0; i < results.length; i++) {
            console.log(results[i]); // 여기에 전달받은 결과가 표시됨 @변수명으로...
        };
        res.redirect('/vm/list/'+user.managerId+'/'+avmId);
      }
    });
  });
  return router;
}
