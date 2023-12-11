const mysql = require("mysql2");
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
});

// Vous n'avez pas besoin de gérer manuellement la connexion et la déconnexion

module.exports = { pool };