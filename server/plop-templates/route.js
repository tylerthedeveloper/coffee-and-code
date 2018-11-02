const express = require('express');
const router = express.Router();
const pool = require('../psql-config').psqlPool;
const format = require('pg-format');

// TODO: ERRORS???

/**
 * get all {{dashCase name}}'s
 */
router.get('/', function(req, res, next) {
    const sql = format('SELECT * FROM {{snakeCase name}}s');
    return pool.query(sql, (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.send({ rows: result.rows });
    })
});

/**
 * get one {{dashCase name}} by ID
 */
router.get('/:{{camelCase name}}ID', function(req, res, next) {
    const {{camelCase name}}ID = req.params['{{camelCase name}}ID'];
    const sql = format('SELECT * FROM {{snakeCase name}}s WHERE {{snakeCase name}}_id = %L', {{camelCase name}}ID);
    return pool.query(sql, (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      res.send({ rows: result.rows });
    });
});

/**
 * add new {{dashCase name}}
 */
router.post('/', function(req, res, next) {
  const objectDict = req.body.data;
  // TODO: TEST NOT TYPE ARRAY BUT STRING
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
* delete {{dashCase name}} by ID
*/
router.delete('/', function(req, res, next) {
  // query ...
  // get ID from req.params || req.body
  // delete DB
  // send succesS??
res.send('respond with a resource');

});

/**
* update one {{dashCase name}} by ID
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
