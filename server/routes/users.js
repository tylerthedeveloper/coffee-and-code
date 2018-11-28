const express = require("express");
const router = express.Router();
const pool = require("../psql-config").psqlPool;
const format = require("pg-format");
const redisClient = require("../redis-client").redisClient;

// TODO: ERRORS???
// TODO: update returns with success / error

/**
 * get all user's
 */
router.get("/", function(req, res, next) {
    const sql = format("SELECT * FROM users");
    console.log("Querying sql: " + sql);
    console.log("Users endpoint");
    // redisClient.get('my test key', function (error, result) {
    //     if (error) {
    //         console.log(error);
    //         throw error;
    //     }
    //     console.log('GET result -> ' + result);
    // });

    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * get one user by ID
 */
router.get("/:userID", function(req, res, next) {
    const userID = req.params["userID"];
    const sql = format("SELECT * FROM users WHERE user_id = %L", userID);
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * get one user by ID
 */
router.post("/query", function(req, res, next) {
    const objectDict = req.body.data;
    let query = "";
    Object.keys(objectDict).map(key => {
        const { currentOp, value, nextOp } = objectDict[key];
        const _nextOp = nextOp !== null ? nextOp + " " : "";
        query += key + " " + currentOp + `'${value}'` + _nextOp;
    });
    const sql = "Select * FROM users WHERE " + query;
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * add new user
 */
router.post("/", function(req, res, next) {
    const objectDict = req.body.data;
    const str = Object.keys(objectDict)
        .sort()
        .map(key => {
            return objectDict[key];
        });
    const sql = format(
        "insert into users (bio, current_latitude, current_location, current_longitude, \
        git_username, name, picture_url, user_id) VALUES (%L)",
        str
    );
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * delete user by ID
 */
router.delete("/:userID", function(req, res, next) {
    const userID = req.params["userID"];
    const sql = format("DELETE FROM users WHERE user_id = %L", userID);
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * update one user by ID
 */
router.put("/:userID", function(req, res, next) {
    const userID = req.params["userID"];
    const objectDict = req.body.data;
    const query =
        "SET " +
        Object.keys(objectDict).map(key => {
            const value = objectDict[key];
            return key + " = " + `'${value}'`;
        });
    const sql = "UPDATE users " + query + " WHERE user_ID = " + userID;
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

module.exports = router;
