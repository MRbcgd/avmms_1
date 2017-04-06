var app = require('./config/express.js')();
var socketio = require('socket.io')
var passport = require('./config/passport.js')(app);
var index = require('./routes/index')(passport);//메인화면
var auth = require('./routes/auth')(passport);//인증
var vm = require('./routes/vm')(passport);//자판기 관리 및 사용
var dw = require('./routes/dw')(passport);//문서 다운로드

app.io=require('socket.io');

app.use('/', index);
app.use('/auth',auth);
app.use('/vm',vm);
app.use('/dw',dw);

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

/*socket.io*/
var io = socketio();
app.io = io;

io.on("connection",function(socket){
  socket.on('checkAvm',function(data){
    console.log(data)
    io.sockets.emit('checkAvmResult',data)
  })
  socket.on('earnIncome',function(data){
    io.sockets.emit('earnIncomeResult',data)
  })
  socket.on('purchaseProduct',function(data){
    console.log(data);
    io.sockets.emit('purchaseProductResult',data)
  })
  socket.on('sellProduct',function(data){
    console.log(data);
    io.sockets.emit('sellProductResult',data)
  })
})

module.exports = app;
