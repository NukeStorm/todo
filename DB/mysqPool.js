const mysql = require('mysql2/promise');
const dbsecret = require('../.env/db.json');
const pool = mysql.createPool(dbsecret);
console.log('mysql connection pool created');

module.exports = pool;
