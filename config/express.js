module.exports=function(){
  var express=require('express');//express 사용하기 위해

  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');//req.body. 이용하기 위해
  var session = require('express-session');//session 사용하기 위해
  var MySQLStore = require('express-mysql-session')(session)//mysql과 session 연동
  var sessionStore = new MySQLStore({//mysql과 session 연동
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'qkrcjfgud12',
      database: 'avmms'
  });

  var app=express();//express 사용하기 위해

  app.set('views','./views');//jade 사용하기 위해
  app.set('view engine','jade');//jade 사용하기 위해

  app.use(session({//session 사용
      key: 'session_Test-6355!!ky_+_',
      secret: 'fasfjlksd8521515zzykkkkk112',
      store: sessionStore,
      resave: false,
      saveUninitialized: true
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));//req.body. 이용하기 위해
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  return app;
}

//
// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//
// var index = require('./routes/index');
// var users = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', index);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
