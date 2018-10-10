/******************** Basic Express Stuff ***************/
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
/*********************************************************/

/******************** Express Session ********************/
var expressSession = require('express-session');
/*********************************************************/

/******************** Configure Mongo(ose) ***************/
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(expressSession);
/*********************************************************/

/******************** Passport ***************************/
var passport = require('passport');
var flash = require("connect-flash");
/*********************************************************/

/** ********************** FS *****************************/
var fs = require('fs');
var FileStreamRotator = require('file-stream-rotator');
/** *******************************************************/

var config = require('./config')

// Routes
var index = require('./routes');

var app = express();

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// LOGGING
var logDirectory = config.morgan.logDirectory;
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: config.morgan.date_format,
  filename: logDirectory + '/access-%DATE%.log',
  frequency: config.morgan.frequency,
  verbose: false
});
// setup the logger
app.use(morgan(config.morgan.format));
app.use(morgan(config.morgan.format, { stream: accessLogStream }));

// App setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'secret',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', index);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function(req, res, next) {
  return res.status(err.status || 500).send({
    message: err.message,
    error: err
  })

})

module.exports = app;
