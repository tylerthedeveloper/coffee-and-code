const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// TODO: Setup morgan logger
const logger = require('morgan');
const pool = require('./psql-config').psqlPool;
const redisClient = require("./redis-client").redisClient;

// TODO: Dele
redisClient.set('my test key', 'my test value');

// TODO: Dynamically add route
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const reposRouter = require('./routes/repos');
const friendsRouter = require('./routes/friends');

const friendRequestsRouter = require('./routes/friend-requests');

const app = express();

/*
app.use(function(req, res, next) {
  if (!req.headers.access_token && !req.query.access_token) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  next();
});
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/friend-requests', friendRequestsRouter);
app.use('/repos', reposRouter);
app.use('/friends', friendsRouter);
app.use('/test', function(req, res, next) {
    console.log('in test')
    return pool.query('SELECT NOW()', (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log('in query')
      console.log(result.rows)
      res.send({ rows: result.rows });
    })
})
app.use('/test2', function(req, res, next) {
  console.log('test2');
  return redisClient.get('my test key', function(error, reply) {
    console.log(error);
    console.log(reply);
    res.send( { test2: reply })
  });
});

// TODO: catch 404 and forward to error handler
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
