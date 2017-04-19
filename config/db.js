/*
db.js

-db 연동
*****************************************************************************************************************

*/
module.exports = function() {
  var mysql = require('mysql');

  // var conn = mysql.createConnection({ //TIMEOUT 에러로 인해서 재작성
  //     host: '127.0.0.1',
  //     user: 'crowneck',
  //     port: 3306,
  //     password: '',
  //     database: 'c9',
  //     multipleStatements: true
  // });
  // conn.connect(function(err) {
  //   if (err) {
  //     console.error('error connecting: ' + err.stack);
  //     return;
  //   }
  //   console.log('connected as id ' + conn.threadId);
  // });

  // return conn;
  var db_config = {
    host: '127.0.0.1',
    user: 'crowneck',
    port: 3306,
    password: '',
    database: 'c9',
    multipleStatements: true
  };

  var conn;

  function handleDisconnect() {
    conn = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    conn.connect(function(err) { // The server is either down
      if (err) { // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    
    conn.on('error', function(err) {
      console.log('db error', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect(); // lost due to either server restart, or a
      }
      else { // connnection idle timeout (the wait_timeout
        throw err; // server variable configures this)
      }
    });
  }
  
  handleDisconnect();
  return conn;
}
