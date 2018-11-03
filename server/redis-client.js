const redis = require('redis');
const client = redis.createClient({
    port: 6379,
    url: 'redis://redis:6739'
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