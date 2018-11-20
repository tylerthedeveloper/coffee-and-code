const redis = require('redis');
const dotenv = require('dotenv');
dotenv.load();

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    url: process.env.REDIS_URL,
    port: 6379,
    password: process.env.REDIS_PWD
});

// const client = redis.createClient(6380, 'cac.redis.cache.windows.net', {
//     auth_pass: process.env.REDIS_CACHE_PWD,
//     tls: { servername: 'cac.redis.cache.windows.net' }
// });

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

module.exports = {
    redisClient: client
}