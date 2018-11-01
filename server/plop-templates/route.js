const express = require('express');
const router = express.Router();

/**
 * get all {{dashCase name}}'s
 */
router.get('/{{dashCase name}}', function(req, res, next) {
    // query ...
    // send rows
  res.send('respond with a resource');

});

/**
 * get one {{dashCase name}} by ID
 */
router.get('/{{dashCase name}}', function(req, res, next) {
    // query ...
    // get ID from req.params || req.body
    // send rows
  res.send('respond with a resource');

});

/**
 * add new {{dashCase name}}
 */
router.post('/{{dashCase name}}', function(req, res, next) {
    // query ...
    // get object from req.params || req.body
    // send rows
    // post to DB
    // send succesS??
  res.send('respond with a resource');

});

/**
 * delete {{dashCase name}} by ID
 */
router.delete('/{{dashCase name}}', function(req, res, next) {
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
router.put('/{{dashCase name}}', function(req, res, next) {
    // query ...
    // get id then update
    // get new data from req.params || req.body
    // update DB
    // send succesS??
  res.send('respond with a resource');

});


module.exports = router;
