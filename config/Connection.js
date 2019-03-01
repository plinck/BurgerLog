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
            default:
                // get common stuff
                config = appConfig;
                // override env variable items for sensitve data
                config.user = process.env[appConfig.username];
                config.password = process.env[appConfig.password];
                config.database = process.env[appConfig.database];

                // If instance connection env var exists, use google cloud socket DB
                if (appConfig.INSTANCE_CONNECTION_NAME) {
                    console.log("Using GCP DB");
                    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
                } else {
                    console.log("Using Local DB");
                }
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