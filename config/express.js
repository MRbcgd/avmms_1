/*
express.js

-express 및 setting
*****************************************************************************************************************

*/
module.exports = function(){
  var express = require('express');//express 모듈
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session)
  var sessionStore = new MySQLStore({
      host: '127.0.0.1',
      user: 'crowneck',
      password: '',
      database: 'c9'
  });

  var app = express();

  app.set('views', './views');
  app.set('view engine', 'jade');

  app.use(session({
      key: 'session_Test-6355!!ky_+_',
      secret: 'fasfjlksd8521515zzykkkkk112',
      store: sessionStore,
      resave: false,
      saveUninitialized: true
  }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  return app;
}
