var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var restoraniRouter = require('./routes/restorani');
var artikalRouter = require('./routes/artikal');
var administratorRouter = require('./routes/administrator');
var administratorRestoranRouter = require('./routes/administrator-restoran');
var kupacRouter = require('./routes/kupac');
//const initializePassport = require("./passportConfig");

//initializePassport(passport);


var app = express();

app.use(require('serve-static')(__dirname + '/../../public'));
app.use('/public', express.static(__dirname + '/public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', maxAge: 3600000, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/restorani', restoraniRouter);
app.use('/artikal', artikalRouter);
app.use('/administrator', administratorRouter);
app.use('/administrator-restoran',administratorRestoranRouter);
app.use('/kupac', kupacRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
