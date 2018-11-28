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
 * update one user by git_username
 */
router.put("/:git_username", function(req, res, next) {
    const git_username = req.params["git_username"];
    const objectDict = req.body.data;
    const { current_latitude, current_longitude } = objectDict;
    const query =
        "SET " +
        Object.keys(objectDict).map(key => {
            const value = objectDict[key];
            return key + " = " + `'${value}'`;
        });
    const sql = "UPDATE users " + query + " WHERE git_username = '" + git_username + "'";
    const sql2 = `UPDATE users SET current_location = ST_POINT(${current_latitude},${current_longitude}) \
        where git_username = '${git_username}'`;
    console.log(sql2);
    const sql3 = `select * from users where git_username <> '${git_username}' \
        and ST_DWithin(current_location, ST_POINT(${current_latitude},${current_longitude}), 1000000)`;
    console.log(sql3);
    return pool.connect((err, client, done) => {
        const shouldAbort = err => {
            if (err) {
                console.error("Error in transaction", err.stack);
                client.query("ROLLBACK", err => {
                    if (err) {
                        console.error("Error rolling back client", err.stack);
                    }
                    // release the client back to the pool
                    done();
                });
            }
            return !!err;
        };

        client.query("BEGIN", err => {
            if (shouldAbort(err)) return;
            client.query(sql);
            if (shouldAbort(err)) return;
            client.query(sql2);
            if (shouldAbort(err)) return;
            return client.query(sql3)
                .then(res => res.rows)
                .then(rows => {
                    return client.query("COMMIT", 
                        err => {
                            if (err) {
                                console.error("Error committing transaction", err.stack);
                            }
                        },
                        result => {
                            done();
                            console.log(rows);
                            res.send({ rows: rows });
                        });
                });
            });
    });
});

module.exports = router;
