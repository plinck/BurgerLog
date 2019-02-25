const mysql = require('mysql');
require("dotenv").config();

class Database {
    constructor() {
        let config;
        if (process.env.JAWSDB_URL) {
            // Database is JawsDB on Heroku
            console.log("Using JAWSDB");
            config = process.env.JAWSDB_URL;
            // Google Cloud Platform Connection
        } else if (process.env.INSTANCE_CONNECTION_NAME) {
            console.log("Using GCP DB");
            config = {
                socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
                user: process.env.SQL_USER,
                password: process.env.SQL_PASSWORD,
                database: process.env.SQL_DATABASE
            };
            // Local DB Connection
        } else {
            // Database is local
            console.log("Using Local DB");
            config = {
                host: "localhost",
                port: 3306,
                user: "plinck",
                password: "password",
                database: "burger_db"
            };
        }

        this.startConnection(config);
    }

    startConnection(config) {
        console.error('CONNECTING');

        this.connection = mysql.createConnection(config);
        this.connection.connect(function (err) {
            if (err) {
                console.error('CONNECT FAILED', err.code);
                this.startConnection();
            } else
                console.error('CONNECTED');
        });
        this.connection.on('error', function (err) {
            if (err.fatal)
                startConnection();
        });

    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                return resolve(rows);
            });
        });
    }

    close() {
        this.connection.end();
    }
}

module.exports = Database;