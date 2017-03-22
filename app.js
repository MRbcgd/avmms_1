var app = require('./config/express.js')();
var passport =require('./config/passport.js')(app);

var index = require('./routes/index')(passport);
var auth = require('./routes/auth')(passport);
var vm = require('./routes/vm')(passport);
var setting = require('./routes/setting')(passport);
var users = require('./routes/users');

app.use('/', index);
app.use('/auth',auth);
app.use('/vm',vm);
app.use('/setting',setting)
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
