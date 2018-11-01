const express = require('express');
const router = express.Router();
const pool = require('../psql-config').psqlPool;
const format = require('pg-format');

// TODO: ERRORS???

/**
 * get all user's
 */
router.get('/', function(req, res, next) {
    const sql = format('SELECT * FROM users');
    return pool.query(sql, (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.send({ rows: result.rows });
    })
});

/**
 * get one user by ID
 */
router.get('/:userID', function(req, res, next) {
    const userID = req.params['userID'];
    const sql = format('SELECT * FROM users WHERE user_id = %L', userID);
    return pool.query(sql, (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.send({ rows: result.rows });
    })
});

/**
 * add new user
 */
router.post('/', function(req, res, next) {
  const objectDict = req.body.data;
  const str = Object.keys(objectDict).map(key => {
      return objectDict[key];
  });
  const sql = format('insert into users VALUES (%L)', str);
  return pool.query(sql, (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    res.send({ rows: result.rows });
  });
});

/**
* delete user by ID
*/
router.delete('/', function(req, res, next) {
  // query ...
  // get ID from req.params || req.body
  // delete DB
  // send succesS??
res.send('respond with a resource');

});

/**
* update one user by ID
*/
// TODO: This will be hard: write generic update function
router.put('/', function(req, res, next) {
  // query ...
  // get id then update
  // get new data from req.params || req.body
  // update DB
  // send succesS??
  res.send('respond with a resource');

});

// TODO: QUERY BODY?
// const sql = format('insert into users WHERE user_id = %L', userID);
  // str = str.substring(0, str.length - 5);

// Object.keys(objectDict).map(key => {
//   str += key +' = ' + objectDict[key] + ' and '
// });

module.exports = router;
