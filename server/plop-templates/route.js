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
 * get one {{dashCase name}} by ID
 */
router.post('/query', function(req, res, next) {
  const objectDict = req.body.data;
  let query = '';
  Object.keys(objectDict).map(key => {
    const { currentOp, value, nextOp } = objectDict[key];
    const _nextOp = (nextOp !== null) ? nextOp + " " : "";
    query += key + ' ' + currentOp + `'${value}'` + _nextOp;
  });
  const sql = 'Select * FROM {{snakeCase name}}s WHERE ' + query;
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
  const str = Object.keys(objectDict).map(key => {
      return objectDict[key];
  });
  const sql = format('insert into {{ snakeCase name }}s VALUES (%L)', str);
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
router.delete('/:{{camelCase name}}ID', function(req, res, next) {
  const {{camelCase name}}ID = req.params['{{camelCase name}}ID'];
  const sql = format('DELETE FROM {{snakeCase name}}s WHERE {{snakeCase name}}_id = %L', {{camelCase name}}ID);
  return pool.query(sql, (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    res.send({ rows: result.rows });
  });
});

/**
* update one {{dashCase name}} by ID
*/
router.put('/:{{camelCase name}}ID', function(req, res, next) {
  const {{camelCase name}}ID = req.params['{{camelCase name}}ID'];
  const objectDict = req.body.data;
  const query = 'SET ' + Object.keys(objectDict).map(key => {
    const value = objectDict[key];
    return key + ' = ' +  `'${value}'`;
  });
  const sql = 'UPDATE {{snakeCase name}}s ' + query + ' WHERE {{camelCase name}}_ID = ' + {{camelCase name}}ID;
  return pool.query(sql, (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    res.send({ rows: result.rows });
  });
});


module.exports = router;
