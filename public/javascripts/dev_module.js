var conn=require('../../config/db.js')();
var router=require('express').Router();

exports.checkAvm = function(avmId){
  var sql = 'UPDATE avm SET avmCheckDate = NOW() WHERE avmId = ?;';
  conn.query(sql, [ avmId ], function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    console.log("UPDATE AVM CHECKDATE.");
  });
}
