DROP DATABASE IF EXISTS burger_db;
CREATE DATABASE burger_db;

USE burger_db;

DROP TABLE IF EXISTS burgers;

-- Store the answers as JSON string in database
CREATE TABLE burgers (
    id        INT NOT NULL AUTO_INCREMENT,
    name      VARCHAR(30) NOT NULL,
    isDevoured Boolean NOT NULL,
    primary key(id)
);
