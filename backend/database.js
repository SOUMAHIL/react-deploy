const mysql = require("mysql2");
require('dotenv').config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

module.exports = {db};