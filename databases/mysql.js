const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.conf');

// Membuat connection pool
const pool = mysql.createPool({
    host: dbConfig.host || 'localhost',
    user: dbConfig.user || 'root',
    password: dbConfig.password || '',
    database: dbConfig.database || 'myapp_db',
    port: dbConfig.port || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL connected successfully');
        connection.release();
    } catch (error) {
        console.error('MySQL connection error:', error.message);
        process.exit(1);
    }
};

module.exports = {
    pool,
    testConnection
};