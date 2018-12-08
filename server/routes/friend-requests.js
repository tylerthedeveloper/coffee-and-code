const express = require("express");
const router = express.Router();
const pool = require("../psql-config").psqlPool;
const format = require("pg-format");
const redisClient = require("../redis-client").redisClient;
const axios = require('axios');

/**
 * get friend requests received by username
 */
router.get("/:git_username/received", function(req, res, next) {
    const git_username = req.params["git_username"];
    const lookup = `${git_username}-received`;
    console.log("received");
    return redisClient.lrange(lookup, 0, -1, function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log("GET result -> " + result);
        res.send({ result: result });
    });
});

/**
 * get friend requests sent sent by username
 */
router.get("/:git_username/sent", function(req, res, next) {
    console.log("sent");
    const git_username = req.params["git_username"];
    const lookup = `${git_username}-sent`;
    return redisClient.lrange(lookup, 0, -1, function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        result.map(data => {
            let buff = new Buffer(data, "base64");
            let text = buff.toString("ascii");
            console.log(text);
        });
        res.send({ result: result });
    });
});

/**
 * add new friend request for both sent and received
 */
router.post("/", function(req, res, next) {
    const data = req.body.data;
    const { git_username_from, picture_url_from } = data.fromUser;
    const { git_username_to, picture_url_to } = data.toUser;
    const fromLookup = `${git_username_from}-sent`;
    const toLookup = `${git_username_to}-received`;
    const multiClient = redisClient.multi();
    const notiKey = `expo-token:${git_username_to}`;
    console.log('notiKey', notiKey);
    multiClient.rpush(fromLookup, `${git_username_to}:${picture_url_to}`);
    multiClient.rpush(toLookup, `${git_username_from}:${picture_url_from}`);
    multiClient.get(notiKey);
    return multiClient.exec(function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log("set and get result -> " + result[2]);
        const expoToken = result[2];
        axios.post('https://exp.host/--/api/v2/push/send', {
            "to" : expoToken,
            "title" : "Coffee and Code",
            "body" : `${git_username_from} sent you a friend request!`,
            "sound" : "default",
            "badge" : 0
        }).then(() => res.send({ result: "res" }));
    });
});

/**
 * delete friend-request by username-picture_url
 */
router.delete("/", function(req, res, next) {
    const data = req.body.data;
    const { git_username_from, picture_url_from } = data.fromUser;
    const { git_username_to, picture_url_to } = data.toUser;
    const fromLookup = `${git_username_from}-sent`;
    const toLookup = `${git_username_to}-received`;
    const multiClient = redisClient.multi();
    multiClient.lrem(fromLookup, 1, `${git_username_to}:${picture_url_to}`);
    multiClient.lrem(toLookup, 1, `${git_username_from}:${picture_url_from}`);
    return multiClient.exec(function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log("SET result -> " + result);
        
        res.send({ result: "res" });
    });
});

/**
 * accept friend request
 */
router.post("/accept", function(req, res, next) {
    const data = req.body.data;
    const { git_username_from, picture_url_from } = data.fromUser;
    const { git_username_to, picture_url_to } = data.toUser;
    const fromLookup = `${git_username_from}-sent`;
    const toLookup = `${git_username_to}-received`;
    const multiClient = redisClient.multi();
    multiClient.lrem(fromLookup, 1, `${git_username_to}:${picture_url_to}`);
    multiClient.lrem(toLookup, 1, `${git_username_from}:${picture_url_from}`);

    multiClient.exec(function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log("SET result -> " + result);
        // res.send({ result: "res" });
    });

    const sql1 = format(
        "insert into friends VALUES (%L,%L)",
        git_username_from,
        git_username_to
    );
    const sql2 = format(
        "insert into friends VALUES (%L,%L)",
        git_username_to,
        git_username_from
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

module.exports = router;
