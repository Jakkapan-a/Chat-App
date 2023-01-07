const mysql = require('mysql2/promise');
require('dotenv').config();
const connection = async ()=>{
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB
    });
    return connection;
}

const query = async (sql, params) => {
    const conn = await connection();
    const [result] = await conn.execute(sql, params);
    // Destroy connection
    conn.end();
    return result;
}

module.exports = {
    query
}
