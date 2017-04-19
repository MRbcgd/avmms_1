/*
vm.js
1. 관리자 자판기 관리
2. 고객 음료수 구매
*****************************************************************************************************************
-vm/list
-vm/list/managerId
-vm/list/managerId/avmId
-vm/list/managerId/avmId/updateDate
-vm/list/managerId/avmId/earnIncome
-vm/list/managerId/avmId/productId
-vm/client/avmId
-vm/client/avmId/productId
*/
module.exports = function(passport) {
  var conn = require('../config/db.js')();
  var router = require('express').Router();
  var http = require('http')

  router.get('/list', function(req, res, next) { //자판기 목록
    var user = req.user;
    var sql = 'SELECT avmId, avmLocation, avmCheckDate, avm.managerId, managerName, managerHP FROM avm LEFT OUTER JOIN manager ON avm.managerId = manager.managerId';
    //sql : 서버의 모든 자판기 데이터

    if (user) { //관리자 페이지 이동
      res.redirect('/vm/list/' + user.managerId);
    }
    else {
      conn.query(sql, function(err, results) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }

        if (results === undefined) {
          console.log("No Data");
          throw new Error("No Data");
        }
        else {
          res.render('./vm/list', {
            title: 'VMMS',
            list: results,
            user
          });
        }
      });
    }
  });

  router.get('/list/:managerId', function(req, res, next) { //접속 관리자 자판기 목록
    var user = req.user;
    var managerId = req.params.managerId;
    var sql = 'SELECT avmId,avmLocation,avmCheckDate,avm.managerId,managerName,managerHP FROM avm LEFT OUTER JOIN manager ON avm.managerId = manager.managerId WHERE avm.managerId = ?';
    //sql : 로그인 한 관리자의 자판기 데이터

    if (user === undefined) {
      // res.redirect('/vm/list');
      // return done(null, false, { message: 'SQL ERROR' });
      console.log("User Not Found");
      throw new Error("User Not Found");
    }
    else if (user.managerId != managerId) {
      console.log("ManagerId Not Correct")
      throw new Error("ManagerId Not Correct");
    }
    else {
      conn.query(sql, [managerId], function(err, results) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        // else if (results == undefined) {
        //   console.log('SQL ERROR -> ', sql);
        //   return done(null, false, {
        //     message: 'SQL ERROR'
        //   });
        // }
        else {
          res.render('./vm/list', {
            title: 'VMMS',
            list: results,
            user
          });
        }
      });
    }
  });
  router.get('/list/:managerId/:avmId', function(req, res, next) { //관리자가 선택한 자판기 정보
    var user = req.user;
    var managerId = req.params.managerId;
    var avmId = req.params.avmId;
    var sql = 'SELECT avm.avmId, avmLocation, avmInstallDate, avmCheckDate, avmFinancialCondition, avmPrice, productId, productName, stockTotal, stockPrice, productCost, stockProfits FROM avm LEFT OUTER JOIN (SELECT avmid,stock.productId,stockTotal,stockPrice,stockProfits,productName,productCost FROM stock LEFT OUTER JOIN product ON product.productId = stock.productId WHERE avmId = ?) A ON A.avmid = avm.avmId WHERE avm.avmId = ? ORDER BY productId';
    //sql : 자판기 및 재고 데이터

    if (user === undefined) { //고객
      console.log("User Not Found");
      throw new Error("User Not Found");
    }
    else if (req.url != '/list/css/navbar.css' && req.url != '/favicon.ico') { //request 2번 요청 방지
      req.session.managerId = managerId;
      req.session.avmId = avmId;
    }
    else { //request 2번 요청 방지
      managerId = req.session.managerId;
      avmId = req.session.avmId;
    }

    if (user.managerId != managerId) { //잘못된 managerId
      console.log("ManagerId Not Correct");
      throw new Error("ManagerId Not Correct");
    }
    else {
      conn.query(sql, [avmId, avmId], function(err, results) {
        var avms = results[0];

        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }

        if (avms === undefined) { //잘못된 avmId
          console.log('AvmId Not Correct');
          res.redirect('/vm/list');
        }
        else {
          res.render('./vm/item', {
            title: 'VMMS',
            avm: avms,
            list: results,
            user
          });
        }
      });
    }
  });
  router.get('/list/:managerId/:avmId/updateDate', function(req, res, next) { //자판기 점검시간 최신화
    var user = req.user;
    var managerId = req.params.managerId;
    var avmId = req.params.avmId;
    var sql = 'UPDATE avm SET avmCheckDate = NOW() WHERE avmId = ?;';
    //sql : 자판기 점검시간 최신화

    if (user === undefined) {
      console.log("User Not Found");
      throw new Error("User Not Found");
    }

    if (user.managerId != managerId) {
      console.log("ManagerId Not Correct");
      throw new Error("ManagerId Not Correct");
    }
    else {
      conn.query(sql, [avmId], function(err) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        else {
          res.redirect('/vm/list/' + user.managerId + '/' + avmId);
        }
      });
    }


  });
  router.get('/list/:managerId/:avmId/earnIncome', function(req, res, next) { //자판기 수익금 회수
    var user = req.user;
    var managerId = req.params.managerId;
    var avmId = req.params.avmId;
    var sql = 'SET @description=""; CALL earnIncome(?, ?, @description); SELECT @description';
    //sql : 자판기 수익금 관리자 수익금으로 회수
    console.log(managerId, avmId);
    if (user === undefined) {
      console.log("User Not Found");
      throw new Error("User Not Found");
    }

    if (user.managerId != managerId) {
      console.log("ManagerId Not Correct");
      throw new Error("ManagerId Not Correct");
    }
    else {
      conn.query(sql, [managerId, avmId], function(err, results) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        else {
          for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
          };
          res.redirect('/vm/list/' + user.managerId + '/' + avmId);
        }
      });
    }
  });
  router.get('/list/:managerId/:avmId/:productId', function(req, res, next) { //재고 구입
    var user = req.user;
    var managerId = req.params.managerId;
    var avmId = req.params.avmId;
    var productId = req.params.productId;
    var sql = 'SET @description=""; CALL purchaseProduct(?, ?, ?, @description); SELECT @description';
    //sql : 재고 구입

    if (user === undefined) {
      console.log("User Not Found");
      throw new Error("User Not Found");
    }

    if (user.managerId != managerId) {
      console.log("ManagerId Not Correct");
      throw new Error("ManagerId Not Correct");
    }
    else {
      conn.query(sql, [managerId, avmId, productId], function(err, results) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        else {
          for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
          };
          res.redirect('/vm/list/' + user.managerId + '/' + avmId);
        }
      });
    }
  });
  router.get('/client/:avmId', function(req, res, next) { //고객 자판기 상품 목록 보기
    var user = req.user;
    var avmId = req.params.avmId;
    var sql = 'SELECT stock.avmId,product.productId,stockTotal,stockPrice,productName FROM stock LEFT OUTER JOIN product ON product.productId = stock.productId WHERE avmId = ?;';
    //sql : 자판기 상품 목록, 상품 정보

    if (user != undefined) { //관리자
      res.redirect('/vm/list/' + user.managerId);
    }
    else {
      conn.query(sql, [avmId], function(err, results) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }

        if (results[0] === undefined) {
          console.log('AvmId Not Correct');
          res.redirect('/vm/list');
        }
        else {
          res.render('./vm/client', {
            title: 'VMMS',
            avmId: avmId,
            list: results
          });
        }
      });
    }
  });
  router.get('/client/:avmId/:productId', function(req, res, next) { //상품 구입
    var user = req.user;
    var avmId = req.params.avmId;
    var productId = req.params.productId;
    var sql = 'SET @description=""; CALL sellProduct(?, ?, @description); SELECT @description';
    //sql : 고객이 상품을 구입
    console.log(req.url)
    if (user != undefined) {
      res.redirect('/vm/list/' + user.managerId);
    }
    else if (req.url != '/client/css/navbar.css' && req.url != '/favicon.ico') { //request 2번 요청 방지
      req.session.avmId = avmId;
      req.session.productId = productId;

      conn.query(sql, [avmId, productId], function(err, results) {
        if (err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }

        if (results[0] === undefined) {
          console.log('AvmId Or ProductId Not Correct');
          throw new Error("AvmId Or ProductId Not Correct");
        }
        else {
          for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
          };
          res.redirect('/vm/client/' + avmId);
        }
      });
    }
    else { //request 2번 요청 방지
      // avmId = req.session.avmId;
      // productId = req.session.productId;
      res.redirect('/vm/client/' + req.session.avmId);

    }


  });

  return router;
}
