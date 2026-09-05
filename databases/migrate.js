const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.conf');

const migrateFresh = async () => {
    let connection;
    try {
        console.log('🔄 Connecting to MySQL server...');
        connection = await mysql.createConnection({
            host: dbConfig.host || 'localhost',
            user: dbConfig.user || 'root',
            password: dbConfig.password || '',
            port: dbConfig.port || 3306,
            multipleStatements: true
        });

        const dbName = dbConfig.database || 'project_lomba_sdg11';
        console.log(`🔨 Creating database '${dbName}' if not exists...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.query(`USE \`${dbName}\`;`);

        console.log('📄 Reading schema.sql...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sqlSchema = fs.readFileSync(schemaPath, 'utf8');

        console.log('🚀 Running fresh database migration & seeding initial data...');
        await connection.query(sqlSchema);

        console.log('✅ Fresh database migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
};

migrateFresh();
