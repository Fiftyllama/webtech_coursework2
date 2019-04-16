var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dbPath = path.resolve(__dirname,'testing.db');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbPath);

db.serialize(function(){
	db.run("CREATE TABLE IF NOT EXISTS User('UsrID'	TEXT NOT NULL UNIQUE,'Pwd'	TEXT NOT NULL,'cookie'	TEXT )");
	db.run("CREATE TABLE IF NOT EXISTS Message('MessageID'	INTEGER PRIMARY KEY AUTOINCREMENT,'Sender'	TEXT NOT NULL,'Recipient'	TEXT NOT NULL,'MessageContent'	TEXT NOT NULL)");

	db.run("update User set cookie=null");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "FJ¤(F)¤(J#F)(¤J)()F¤(J)=F(J)",
  resave: false,
  saveUninitialized: true
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
