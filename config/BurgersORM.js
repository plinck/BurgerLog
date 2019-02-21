const Database = require("./DatabasePromise.js");

class BurgersORM {

    constructor() {}

    // Get burgers from DB and put in object var
    selectAll(aCallback) {
        let database = new Database();
        let burgers = [];
        database.query(`SELECT * FROM burgers`)
            .then(rows => {
                if (rows != undefined) {
                    // map the rows into the array of objects
                    burgers = rows.map(r => ({
                        "id": r.id,
                        "name": r.name,
                        "isDevoured": r.isDevoured
                    }));
                    // Send it back to requestor in completion handler callback
                    aCallback(burgers);
                }
            })
            .catch(err => {
                console.log(`error selecting burgers ${err}`);
            });;
        database.close();
    }

    // Add
    insertOne(burger, aCallback) {
        let database = new Database();
        const query_cmd = `
            INSERT INTO burgers (name, isDevoured)
            VALUES ("${burger.name}", ${burger.isDevoured});
            `;

        database.query(query_cmd)
            .then(rows => {
                let insertedBurger = burger;
                insertedBurger.id = rows.insertId;
                console.log(insertedBurger);
                aCallback(insertedBurger);
            })
            .catch(err => {
                console.log(`error inserting into burgers ${err}`);
            });

        database.close();
    }

    // Change Devour Flag
    // TODO: Change update so it just updates fields passed in object
    //  Support for multiple statements is disabled for security reasons 
    // (it allows for SQL injection attacks if values are not properly escaped).
    // Multiple statement queries
    // To use this feature you have to enable it for your connection:
    // var connection = mysql.createConnection({multipleStatements: true});
    devourOne(burger, aCallback) {
        let database = new Database();
        const query_cmd = `
            UPDATE burgers
            SET isDevoured = ${burger.isDevoured}
            WHERE id = ${burger.id};
            `;

        database.query(query_cmd)
            .then(rows => {
                let database = new Database();
                const query_cmd = `
                SELECT id, name, isDevoured FROM burgers
                WHERE id = ${burger.id};
                `;
                database.query(query_cmd)
                    .then(rows => {
                        let updatedBurger = {};
                        updatedBurger.id = rows[0].id;
                        updatedBurger.name = rows[0].name;
                        updatedBurger.isDevoured = rows[0].isDevoured;
                        aCallback(updatedBurger);
                    })
                    .catch(err => {
                        console.log(`error selecting devoured burgers ${err}`);
                    });
                database.close();
            })
            .catch(err => {
                console.log(`error devouring burgers ${err}`);
            });
        database.close();
    }

    // Update
    updateOne(burger, aCallback) {
        let database = new Database();
        const query_cmd = `
                UPDATE burgers
                SET name = "${burger.name}",
                isDevoured = ${burger.isDevoured}
                WHERE id = ${burger.id};
                SELECT id, name, isDevoured FROM burgers
                WHERE id = ${burger.id};    
                `;

        database.query(query_cmd)
            .then(rows => {
                aCallback(rows[0]);
            })
            .catch(err => {
                console.log(`error updating burgers ${err}`);
            });

        database.close();
    }



    // Delete
    deleteOne(burger, aCallback) {
        let database = new Database();
        const query_cmd = `
            DELETE FROM burgers
            WHERE id = ${burger.id};
            `;

        database.query(query_cmd)
            .then(rows => {
                aCallback(rows);
            })
            .catch(err => {
                console.log(`error deleting into burgers ${err}`);
            });

        database.close();
    }
}

module.exports = BurgersORM;