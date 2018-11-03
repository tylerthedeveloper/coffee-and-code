const express = require("express");
const router = express.Router();
const pool = require("../psql-config").psqlPool;
const format = require("pg-format");
const redisClient = require("../redis-client").redisClient;

/**
 * get friend requests received by username
 */
router.get("/:git_username/received", function(req, res, next) {
    const git_username = req.params["git_username"];
    const lookup = `${git_username}-received`;
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
    const git_username = req.params["git_username"];
    const lookup = `${git_username}-sent`;
    return redisClient.lrange(lookup, 0, -1, function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log("GET result -> " + result);
        res.send({ result: result });
    });
});

router.post("/:git_username_from/:git_username_to", function(req, res, next) {
    const git_username_from = req.params["git_username_from"];
    const git_username_to = req.params["git_username_to"];
    const fromLookup = `${git_username_from}-sent`;
    const toLookup = `${git_username_to}-received`;
    console.log("SET result -> ");
    const multiClient = redisClient.multi();
    multiClient.rpush(fromLookup, git_username_to);
    multiClient.rpush(toLookup, git_username_from);
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
 * delete friend-request by ID
 */
router.delete("/:git_username_from/:git_username_to", function(req, res, next) {
    const git_username_from = req.params["git_username_from"];
    const git_username_to = req.params["git_username_to"];
    const fromLookup = `${git_username_from}-sent`;
    const toLookup = `${git_username_to}-received`;
    const multiClient = redisClient.multi();
    multiClient.lrem(fromLookup, 1, git_username_to);
    multiClient.lrem(toLookup, 1, git_username_from);
    return multiClient.exec(function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log("DEL result -> " + result);
        res.send({ result: "res" });
    });
});

module.exports = router;
