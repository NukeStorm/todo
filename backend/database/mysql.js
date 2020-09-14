const mysql = require('mysql2');

const connection = mysql.createPool({
    host : '101.101.217.250',
    user : 'boostuser',
    password : 'boostcamp123!@#',
    port : 3306,
    database : 'todoDb',
    insecureAuth: true,
    connectionLimit : 10
});

module.exports = { connection };