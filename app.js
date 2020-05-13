var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var csrf = require('csurf')
var session = require('express-session')
const MongoStore = require("connect-mongo")(session);
var passport = require("passport");
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var toastr = require('express-toastr');
var eflash = require('express-flash-messages')
var logger = require('morgan');
var debug = require('debug')('http')
  , http = require('http')
  , name = 'My App';
const nodemon = require('nodemon');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var accountRouter = require('./routes/index');
// var loginRouter = require("./routes/users");
// var profileRouter = require("./routes/users")
// var logoutRoute = require("./routes/users")
// var registerRoute = require("./routes/users")

var csrfProtection = csrf({ cookie: true })
var app = express();
require("./config/passport")(passport)
// require('./auth/auth')(passport);

// packages middleware
mongoose.connect('mongodb://localhost/shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("layout extractScripts", true)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1)
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge : 180 * 60 * 1000 }
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(toastr());
app.use(eflash())

app.use((req, res, next)=>{
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/account', indexRouter);
app.use('/login', usersRouter);
app.use('/profile', usersRouter);
app.use('/register', usersRouter);
app.use('/logout', usersRouter);



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
