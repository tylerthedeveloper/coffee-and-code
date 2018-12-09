const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// TODO: Setup morgan logger
const logger = require('morgan');
const pool = require('./psql-config').psqlPool;
const pgClient = require('./psql-config').pgClient;
const redisClient = require("./redis-client").redisClient;
const HashMap = require('hashmap');

var socket = require('socket.io');
var http = require('http');

var app = express();

var server = http.createServer(app);

var io = socket.listen(server);
server.listen(9023);

const sockets = new Set();
app.users = new HashMap(); // Array with connected user
console.log("Number of users: " + sockets.size);
// start listen with socket.io
// setInterval(() => {
//     io.emit("new_local_user", { data: 'interval' });
// }, 1000);

io.on('connection', function(socket) {

  console.log('Connected');
  const user_id = socket.handshake.query["user_id"];
  socket.user_id = user_id;

  console.log(`Socket ${socket.id} added with user_id: ${socket.user_id}`);
  // app.users.set(user_id, socket);
  sockets.add(socket);
  console.log("Number of users: " + sockets.size);

  socket.on('disconnect', function() {
      console.log('User ' + app.users.get(socket) + ' DISCONNECTED');
      sockets.remove(socket);
      console.log("Number of users: " + sockets.size);
      // app.io.emit('connection on off', (app.users.count()));
  });
});

pgClient.on("notification", function(msg) {
  console.log("msg", msg);
  const { newUser, localUsers } = JSON.parse(msg.payload);
  console.log("Number of users on notification: " + sockets.size);
  for (const s of sockets) {
  // Object.keys(app.users).map(key => {
    console.log(`Emitting value: ${msg}`);
    // const s = app.users[key];
    // console.log(s);
    s.emit("new_local_user", { data: newUser });
  }
});
pgClient.query("LISTEN user_update_location");


// TODO: Dele
redisClient.set('my test key', 'my test value');

// TODO: Dynamically add route
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const reposRouter = require('./routes/repos');
const friendsRouter = require('./routes/friends');

const friendRequestsRouter = require('./routes/friend-requests');

// const app = express();

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
    for (const s of sockets) {
        // console.log(`Emitting value: ${msg}`);
        s.emit('new_local_user', { data: "working" });
    }
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

// const sockets = new Set();

// io.on('connection', socket => {

//     console.log(`Socket ${socket.id} added`);
//     sockets.add(socket);
  
//     socket.on('new_local_user', data => {
//       console.log(data);
//     });
  
//     socket.on('disconnect', () => {
//       console.log(`Deleting socket: ${socket.id}`);
//       sockets.delete(socket);
//       console.log(`Remaining sockets: ${sockets.size}`);
//     });
  
// });

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
