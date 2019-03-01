module.exports = {
    "development": {
        "username": process.env.SQL_USER,
        "password": process.env.SQL_PASSWORD,
        "database": process.env.SQL_DATABASE,
        "host": "localhost",
        "port": 3306,
        "dialect": "mysql"
    },
    "test": {
        "username": process.env.SQL_USER,
        "password": process.env.SQL_PASSWORD,
        "database": process.env.SQL_DATABASE,
        "host": "localhost",
        "port": 3306,
        "dialect": "mysql"
    },
    "staging": {
        "use_env_variable": "JAWSDB_URL",
        "dialect": "mysql"
    },
    "production": {
        "use_env_variable": "INSTANCE_CONNECTION_NAME",
        "socketPath": `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
        "username": process.env.SQL_USER,
        "password": process.env.SQL_PASSWORD,
        "database": process.env.SQL_DATABASE,
        "dialect": "mysql"
    }
};