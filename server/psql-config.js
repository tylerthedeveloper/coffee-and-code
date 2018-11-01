const { Pool } = require('pg')
const dotenv = require('dotenv');
dotenv.load();

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: true,
    max: 20,
    idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000,
});

module.exports = {
    psqlPool: pool
}