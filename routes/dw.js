/*
dw.js
1. 구입, 판매, 점검기록 파일 다운로드
*****************************************************************************************************************

-dw/dwname

*/
module.exports = function(passport){
  var conn = require('../config/db.js')();
  var router = require('express').Router();
  var fs = require('fs');
  var mime = require('mime');//파일 다운로드 모듈

  router.get('/:dwname', function(req, res, next){
    var user = req.user;
    var dwname = req.params.dwname;//파일 이름
    var sql = '';

    if(user == undefined){
      res.redirect('/vm/list')
    }
    if(dwname != 'purchaseList' && dwname != 'sellList' && dwname != 'checkDateList'){//다운로드 목록 확인
      res.redirect('/vm/list');
    }

    if(dwname == 'purchaseList'){//구입내역부
      sql = 'SELECT * FROM purchase;'
    }
    else if(dwname =='sellList'){//판매내역부
      sql = 'SELECT * FROM sell;'
    }
    else{//점검기록부
      sql = 'SELECT * FROM avmCheckDateLog;'
    }


    conn.query(sql, function(err, results){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }

      if(results[0] == undefined){
        res.redirect('/vm/list');
      }
      else{
        var fileName = dwname + '.txt';//파일 이름
        var savedPath = './data';//저장된 파일 경로
        var file = savedPath + '/' + fileName;
        var data = '';

        for (var i = 0; i < results.length; i++) {//출력 데이터 문자화
          for(var property in results[i]) {
            data = data.concat(property + "=" + results[i][property] + ' ');
          }
          data = data.concat("\n");
        }

        fs.writeFile(file, data, function(error){//새로 파일에 쓰기
           console.log('download ' + dwname + '.txt');
        });

        mimetype = mime.lookup(fileName);

        res.setHeader('Content-disposition', 'attachment; filename = ' + fileName);
        res.setHeader('Content-Type', mimetype);
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
      }
    })
  });

  return router;
}
