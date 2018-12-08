const express = require("express");
const router = express.Router();
const pool = require("../psql-config").psqlPool;
const format = require("pg-format");
const redisClient = require("../redis-client").redisClient;

var socket = require('socket.io');
var http = require('http');

var server = http.createServer(express);
var io = socket.listen(server);
server.listen(8000);


// TODO: ERRORS???
// TODO: update returns with success / error

const sockets = new Set();

// for (const s of sockets) {
//         console.log(`Emitting msg`);
//         s.disconnect(true);
// }
    
/**
 * get all user's
 */
 router.get("/", function(req, res, next) {
    // for (const s of sockets) {
    //     console.log(`Emitting msg`);
    //     s.emit('new_local_user', { data: "msg" });
    // }

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
    console.log("newuser", objectDict);
    const str = Object.keys(objectDict)
        .sort()
        .map(key => {
            return objectDict[key];
        });
    const sql = format(
        "insert into users (bio, blog, company, current_location, email, git_username,\
                            latitude, longitude, looking_for, name, need_help, \
                            picture_url, skills, user_id, will_help, will_tutor) VALUES (%L)",
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
 * add new user expo token for notifications
 */
router.post("/expo-token", function(req, res, next) {
    console.log("expo-token");
    const { git_username, expo_token } = req.body.data;
    const key = `expo-token:${git_username}`;
    console.log("expo-token key: ", key);
    console.log("expo-token value: ", expo_token);
    // return redisClient.set('expo-token:nishchayagupta', 'ExponentPushToken[4I-dHCMDqlhBm9eZoO7syr]', function(error, result) {
    return redisClient.set(key, expoToken, function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log("SET result expo token-> " + result);
        res.send({ result: result });
    });
});

/**
 * add new user expo token for notifications
 */
router.post("/expo-token-ret", function(req, res, next) {
    const { git_username } = req.body.data;
    const key = `expo-token:${git_username}`;
    console.log(git_username);
    console.log(key);
    return redisClient.get(key, function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log("GET result -> " + result);
        res.send({ result: result });
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


io.on('connection', (socket) => {
    
    const user_id = socket.handshake.query["user_id"];
    socket.user_id = user_id;
    console.log(`Socket ${socket.id} added with user_id: ${socket.user_id}`);
    sockets.add(socket);
  
    socket.on('new_local_user', data => {
      console.log("sokcet channel data: ", data);
    });
  
    socket.on('disconnect', () => {
      console.log(`Deleting socket: ${socket.id}`);
      sockets.delete(socket);
      console.log(`Remaining sockets: ${sockets.size}`);
    });

});

/**
 * update one user by git_username
 */
router.put("/:git_username/update_location", function(req, res, next) {

    console.log("Update location");
    
    
    const git_username = req.params["git_username"];
    const objectDict = req.body.data;
    const { latitude, longitude } = objectDict;
    // console.log(latitude, longitude, objectDict);
    const query =
        "SET " +
        Object.keys(objectDict).map(key => {
            const value = objectDict[key];
            return key + " = " + `'${value}'`;
        });
    const sql =
        "UPDATE users " +
        query +
        " WHERE git_username = '" +
        git_username +
        "'";
    const sql2 = `UPDATE users SET current_location = ST_POINT(${latitude},${longitude}) \
        where git_username = '${git_username}'`;
    // console.log(sql2);
    // TODO: check this number
    const sql3 = `select * from users where git_username <> '${git_username}' \
        and ST_DWithin(current_location, ST_POINT(${latitude},${longitude}), 10000)`;
    // console.log(sql3);
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
            return client
                .query(sql3)
                .then(res => res.rows)
                .then(rows => {
                    return client.query(
                        "COMMIT",
                        err => {
                            if (err) {
                                console.error(
                                    "Error committing transaction",
                                    err.stack
                                );
                            }
                        },
                        result => {
                            done();
                            // console.log(rows);
                            res.send({ rows: rows });
                        }
                    );
                });
        });

        client.on('notification', function(msg) {
            // console.log('msg',  msg.payload);
            const { newUser, localUsers } = JSON.parse(msg.payload);
            console.log('msg', newUser, localUsers);
            // TODO: only in sockets where id in list of local users
            for (const s of sockets) {
                const user_id = s.user_id;
                // if (localUsers.indexOf(user_id) > -1) {
                console.log(`Emitting value: ${msg}`);
                s.emit('new_local_user', { data: newUser });
                // }
            }
        });

        client.query("LISTEN user_update_location");
    });
});

/**
 * ABHI::update one user by git_username
 */
router.put("/:git_username/update_location_new", function(req, res, next) {
    const git_username = req.params["git_username"];
    const objectDict = req.body.data;
    const { latitude, longitude } = objectDict;
    console.log(latitude, longitude, objectDict);

    const lookup = `${git_username}-received`;
    console.log("received");
    let friend_requests;
    redisClient.lrange(lookup, 0, -1, function(error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        friend_requests = result;
    });

    const query =
        "SET " +
        Object.keys(objectDict).map(key => {
            const value = objectDict[key];
            return key + " = " + `'${value}'`;
        });
    const sql =
        "UPDATE users " +
        query +
        " WHERE git_username = '" +
        git_username +
        "'";
    const sql2 = `UPDATE users SET current_location = ST_POINT(${latitude},${longitude}) \
        where git_username = '${git_username}'`;
    console.log(sql2);
    // TODO: check this number
    const sql3 = `select * from users where git_username <> '${git_username}' \
        and ST_DWithin(current_location, ST_POINT(${latitude},${longitude}), 10000)`;
    console.log(sql3);
    const sql4 = `select gitusername_2 from friends where gitusername_1='${git_username}'`;
    console.log(sql4);
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
            let nearby_users;
            client
                .query(sql3)
                .then(res => res.rows)
                .then(rows => {
                    nearby_users = rows;
                });
            //     return client.query(
            //         "COMMIT",
            //         err => {
            //             if (err) {
            //                 console.error(
            //                     "Error committing transaction",
            //                     err.stack
            //                 );
            //             }
            //         },
            //         result => {
            //             done();
            //             // console.log(rows);
            //             nearby_users = rows;
            //             // res.send({ rows: rows });
            //         }
            //     );
            // });

            if (shouldAbort(err)) return;
            return client
                .query(sql4)
                .then(res => res.rows)
                .then(rows => {
                    return client.query(
                        "COMMIT",
                        err => {
                            if (err) {
                                console.error(
                                    "Error committing transaction",
                                    err.stack
                                );
                            }
                        },
                        result => {
                            done();
                            nearby_users.map(user => {
                                user.isCurrentFriend = rows.some(
                                    friend =>
                                        friend["gitusername_2"] ===
                                        user.git_username
                                );
                                user.isFriendRequest = friend_requests.some(
                                    friend => friend.includes(user.git_username)
                                );
                            });
                            res.send({ rows: nearby_users });
                        }
                    );
                });
        });
    });
});

/**
 * get users near me by git_username
 */
router.post("/:git_username/near-me", function(req, res, next) {
    const git_username = req.params["git_username"];
    const objectDict = req.body.data;
    const { latitude, longitude } = objectDict;
    console.log(latitude, longitude, objectDict);
    // TODO: check this number
    const sql = `select * from users where git_username <> '${git_username}' \
                and ST_DWithin(current_location, ST_POINT(${latitude},${longitude}), 10000)`;
    console.log(sql);
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
    const objectDict = req.body.data.preferences;
    console.log(objectDict);
    const query =
        "SET " +
        Object.keys(objectDict).map(key => {
            const value = objectDict[key];
            return key + " = " + `'${JSON.stringify(value)}'`;
        });
        // const sql = "UPDATE users " + query + " WHERE git_username = " + git_username;
    const sql = `UPDATE users ${query} WHERE git_username = '${git_username}'`;
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * update skills by git_username
 */
router.put("/:git_username/skills", function(req, res, next) {
    const git_username = req.params["git_username"];
    const objectDict = req.body.data;
    const { skills } = objectDict;
    console.log(skills, objectDict);
    const sql = `UPDATE users SET skills = $1 \
                WHERE git_username = '${git_username}'`;
    console.log(sql);
    return pool.query(sql, [skills], (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});

/**
 * update one user by git_username
 */
router.post("/:git_username/near-me", function(req, res, next) {
    const git_username = req.params["git_username"];
    const objectDict = req.body.data;
    const { latitude, longitude } = objectDict;
    console.log(latitude, longitude, objectDict);
    // TODO: check this number
    const sql = `select * from users where git_username <> '${git_username}' \
        and ST_DWithin(current_location, ST_POINT(${latitude},${longitude}), 10000)`;
    console.log(sql);
    return pool.query(sql, (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }
        res.send({ rows: result.rows });
    });
});


//////////////////////
// TEMPPPPPPPP
///////////////////////
  

// FOR UPDATE USER SET LOGIN
router.get("/noti", function(req, res, next) {
    
    pool.connect(function(err, client) {
        if(err) {
          console.log(err);
        }
        client.on('notification', function(msg) {
          console.log('msg', msg);
            for (const s of sockets) {
                console.log(`Emitting value: ${msg}`);
                s.emit('new_local_user', { data: msg });
            }
        });
        client.query("LISTEN user_update_location");
      });
    // subject.subscribe(args => res.send(args));
    res.send('connected')

});

module.exports = router;

