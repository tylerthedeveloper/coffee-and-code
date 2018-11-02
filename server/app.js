const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const bearerToken = require('express-bearer-token');

// const { Pool } = require('pg')
// const dotenv = require('dotenv');
// const postgresConfig = require('./psql-config').postgresConfig;
// dotenv.load();

// // TODO: PUT IN CONFIG + ENV VARIABLE
// const pool = new Pool(postgresConfig);
const pool = require('./psql-config').psqlPool;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
// app.use(bearerToken());

app.use(function(req, res, next) {
  console.log(req.query);
  // console.log(req.body);
  // console.log(req.params);
  if (!req.headers.access_token && !req.query.access_token) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  next();
});

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
