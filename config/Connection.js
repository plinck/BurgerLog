const mysql = require('mysql');
require("dotenv").config();
let env = process.env.NODE_ENV || 'development';
// All configurations
let appConfigs = require(__dirname + '/config.json');

class Connection {
    constructor() {
        // get specific config sections from all configs
        const appConfig = appConfigs[env];
        let config;

        // test if env var is used for part of config
        switch (appConfig.use_env_variable) {
            // Jaws DB on Heroku only needs config var
            case "JAWSDB_URL":
                config = process.env[appConfig.use_env_variable];
                console.log("Using JAWSDB");
                break;
                // GCP DB on Google Cloud
            case "INSTANCE_CONNECTION_NAME":
                console.log("Using GCP DB");
                config = {
                    socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
                    user: process.env[appConfig.username],
                    password: process.env[appConfig.password],
                    database: process.env[appConfig.database]
                };
                break;
                // Local
            default:
                console.log("Using Local DB");
                config = {
                    host: appConfig.host,
                    port: appConfig.port,
                    user: process.env[appConfig.username],
                    password: process.env[appConfig.password],
                    database: process.env[appConfig.database]
                };
                break;
        }
        
        this.logConnection(config);
        this.startConnection(config);
    }

    logConnection(config) {
        console.log(`Config: ${JSON.stringify(config)}`);
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