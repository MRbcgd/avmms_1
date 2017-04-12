/*
db.js

-db 연동
*****************************************************************************************************************

*/
module.exports = function(){
  var mysql = require('mysql');

  var conn = mysql.createConnection({
      host: '127.0.0.1',
      user: 'crowneck',
      port: 3306,
      password: '',
      database: 'c9',
      multipleStatements: true
  });
  conn.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + conn.threadId);
  });

  return conn;
}
