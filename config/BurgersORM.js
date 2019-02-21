const Database = require("./DatabasePromise.js");

class BurgersORM {

    constructor() {
    }

    // Get burgers from DB and put in object var
    selectAll(aCallback) {
        let database = new Database();
        let burgers = [];
        database.query(`SELECT * FROM burger`)
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
                console.log(`error inserting into burgers ${err}`);
            });;
        database.close();
    }

    // Add
    insertOne(burger, aCallback) {
        let database = new Database();
        const query_cmd = `
            INSERT INTO burgers (name, isDevoured)
            VALUES ("${burger.name}", ${burger.isDevoured}");
            `;

        database.query(query_cmd)
            .then( rows => {
                aCallback(rows);
            })
            .catch(err => {
                console.log(`error updating into burgers ${err}`);
            });

        database.close();
    }

    // Update
    updateOne(burger, aCallback) {
        let database = new Database();
        const query_cmd = `
            UPDATE burgers
            SET name = "${burger.name}",
            SET isDevoured = ${burger.isDevoured}
            WHERE id = ${burger.id};
            `;

        database.query(query_cmd)
            .then(rows => {
                aCallback(rows);
            })
            .catch(err => {
                console.log(`error inserting into burgers ${err}`);
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