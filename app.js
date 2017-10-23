var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var cors = require('cors');
var jwt = require('jsonwebtoken');

var config = require('./config');

var index = require('./routes/index');
var login = require('./routes/login');
var users = require('./routes/users');
var organizations = require('./routes/organizations');

var app = express();

app.use(cors());
app.options('*', cors());

/*app.options("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});*/

/*app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.send(200);
  }
  else {
    //move on
    next();
  }
});*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('jwtSecret', config.jwtSecret);

var apiRoutes = express.Router();
// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  //console.log('req.headers', req.headers);
  //console.log('token', token);
  
	  // decode token
	  if (token) {
		// verifies secret and checks exp
		jwt.verify(token, app.get('jwtSecret'), function(err, decoded) {      
		  if (err) {
			return res.json({
				code: 403,
				message: 'Permission denied.',
				response: {
					msg: 'Permission denied.'
				}
			});    
		  } else {
			// if everything is good, save to request for use in other routes
			req.decoded = decoded;    
			next();
		  }
		});
	  } else {
		// if there is no token
		// return an error
		return res.status(403).json({
			code: 403,
			message: 'Permission denied.',
			response: {
				msg: 'Permission denied.'
			}
		});
	  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1/login', login);

// apply the routes to our application with the prefix /api
app.use('/api/v1/', apiRoutes);

app.use('/api/v1/users', users);
app.use('/api/v1/organizations', organizations);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
