const express = require("express");
const router = express.Router();
const pool = require("../psql-config").psqlPool;
const format = require("pg-format");

// TODO: ERRORS???

/**
 * get all repo's
 */
router.get("/", function(req, res, next) {
    const sql = format("SELECT * FROM repos");
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * get one repo by ID
 */
router.get("/:repoID", function(req, res, next) {
    const repoID = req.params["repoID"];
    const sql = format("SELECT * FROM repos WHERE repo_id = %L", repoID);
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * get one repo by ID
 */
router.post("/query", function(req, res, next) {
    const objectDict = req.body.data;
    let query = "";
    Object.keys(objectDict).map(key => {
        const { currentOp, value, nextOp } = objectDict[key];
        const _nextOp = nextOp !== null ? nextOp + " " : "";
        query += key + " " + currentOp + `'${value}'` + _nextOp;
    });
    const sql = "Select * FROM repos WHERE " + query;
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * add new repo
 */
router.post("/", function(req, res, next) {
    const repos = req.body.data;
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

            repos.map(repo => {
                const objectDict = repo;
                // TODO: changed
                const str = Object.keys(objectDict).sort().map(key => {
                    return objectDict[key];
                });
                console.log(str);
                const sql = format(
                    "insert into repos (creation_date, description, forks_count, language, \
                    repoID, repo_name, repo_url, stargazers_count, user_name ) \
                    VALUES (%L)",
                    str
                );
                client.query(sql);
            });
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
 * delete repo by ID
 */
router.delete("/:repoID", function(req, res, next) {
    const repoID = req.params["repoID"];
    const sql = format("DELETE FROM repos WHERE repo_id = %L", repoID);
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * update one repo by ID
 */
router.put("/:repoID", function(req, res, next) {
    const repoID = req.params["repoID"];
    const objectDict = req.body.data;
    const query =
        "SET " +
        Object.keys(objectDict).map(key => {
            const value = objectDict[key];
            return key + " = " + `'${value}'`;
        });
    const sql = "UPDATE repos " + query + " WHERE repo_ID = " + repoID;
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

module.exports = router;
