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

var pg = require ('pg');
var pgConnectionString = "postgres://" + 
                         process.env.PGUSER + ":" +
                         process.env.PGPASSWORD + "@" +
                         process.env.PGHOST + "/" +
                         process.env.PGDATABASE;


var pgClient = new pg.Client(pgConnectionString);
pgClient.connect();

module.exports = {
    psqlPool: pool,
    pgClient: pgClient
}