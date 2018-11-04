const redis = require('redis');
const client = redis.createClient({
    // host: "172.19.0.2",
    host: 'redis_server',
    port: 6379,
    // url: 'redis://redis:6379'
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