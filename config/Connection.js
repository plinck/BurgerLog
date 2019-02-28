const mysql = require('mysql');
require("dotenv").config();

class Connection {
    constructor() {
        let config;
        if (process.env.JAWSDB_URL) {
            // Connection is JawsDB on Heroku
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
            // Connection is local
            console.log("Using Local DB");
            config = {
                host: "localhost",
                port: 3306,
                user: process.env.SQL_USER,
                password: process.env.SQL_PASSWORD,
                database: process.env.SQL_DATABASE
            };
        }
        this.logConnection(config);
        this.startConnection(config);
    }

    logConnection(config) {
        console.log(`Connection: ${JSON.stringify(config)}`);
    }

    // This method restarts the connection when it fals.  The connectionn GCP got corrupted
    // a couple times and so I wrote thisto restart the connection if it fails
    startConnection(config) {
        console.error('CONNECTING');

        this.connection = mysql.createConnection(config);
        this.connection.connect(function (err) {
            if (err) {
                console.error('CONNECT FAILED', err.code);
                this.startConnection(config);
            } else
                console.error('CONNECTED');
        });
        this.connection.on('error', function (err) {
            if (err.fatal)
                this.startConnection(config);
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

module.exports = Connection;