const express = require("express");
const router = express.Router();
const pool = require("../psql-config").psqlPool;
const format = require("pg-format");

// TODO: ERRORS???
/**
 * get one friend by ID
 */
router.post("/query", function(req, res, next) {
    const objectDict = req.body.data;
    let query = "";
    Object.keys(objectDict).map(key => {
        const { currentOp, value, nextOp } = objectDict[key];
        const _nextOp = nextOp !== null ? nextOp + " " : "";
        query += key + " " + currentOp + `'${value}'` + _nextOp;
    });
    const sql = "Select gitusername_2 FROM friends WHERE " + query;
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * add new friend
 */
router.post("/", function(req, res, next) {
    const objectDict = req.body.data;
    const { gitusername_1, gitusername_2 } = objectDict;
    const sql1 = format(
        "insert into friends VALUES (%L,%L)",
        gitusername_1,
        gitusername_2
    );
    const sql2 = format(
        "insert into friends VALUES (%L,%L)",
        gitusername_2,
        gitusername_1
    );

    console.log("sql1: " + sql1);
    console.log("sql2: " + sql2);
    return pool.connect((err, client, done) => {
        // TODO: PUT INTO PSQL HELPER FILE
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
            client.query(sql1);
            client.query(sql2);
        });

        return client.query("COMMIT", err => {
            if (err) {
                console.error("Error committing transaction", err.stack);
            }
            done();
            res.send({ message: "success" });
        });
    });
});

/**
 * delete friend by ID
 */
router.delete("/", function(req, res, next) {
    const objectDict = req.body.data;
    const { gitusername_1, gitusername_2 } = objectDict;
    const sql1 = format(
        "DELETE FROM friends WHERE gitusername_1 = %L and gitusername_2 = %L",
        gitusername_1,
        gitusername_2
    );
    const sql2 = format(
        "DELETE FROM friends WHERE gitusername_1 = %L and gitusername_2 = %L",
        gitusername_2,
        gitusername_1
    );

    return pool.connect((err, client, done) => {
        // TODO: PUT INTO PSQL HELPER FILE
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
            client.query(sql1);
            client.query(sql2);
        });

        return client.query("COMMIT", err => {
            if (err) {
                console.error("Error committing transaction", err.stack);
            }
            done();
            res.send({ message: "success" });
        });
    });
});

module.exports = router;
