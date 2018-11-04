const redis = require('redis');
const dotenv = require('dotenv');
dotenv.load();

const client = redis.createClient({
    host: 'redis_server',
    port: 6379
    // TODO: 
    // password: process.env.REDIS_PWD
});

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

module.exports = {
    redisClient: client
}