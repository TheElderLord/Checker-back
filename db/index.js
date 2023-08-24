const mysql = require('mysql');

const dotenv = require('dotenv');
dotenv.config();

const dbHost = process.env.NODE_ENV === 'production' ? process.env.PROD_MYSQL_HOST : process.env.MYSQL_HOST;
const  dbuser = process.env.NODE_ENV === 'production' ? process.env.PROD_MYSQL_USER : process.env.MYSQL_USER;
const dbPassword = process.env.NODE_ENV === 'production' ? process.env.PROD_MYSQL_PASSWORD : process.env.MYSQL_PASSWORD;
const dbDatabase = process.env.NODE_ENV === 'production' ? process.env.PROD_MYSQL_DB : process.env.MYSQL_DB;
const dbPort = process.env.NODE_ENV === 'production' ? process.env.PROD_MYSQL_PORT : process.env.MYSQL_PORT;


const connection = mysql.createConnection({
    host: dbHost,
    user: dbuser,
    password: dbPassword,
    database: dbDatabase,
    port: dbPort,
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

module.exports = connection;