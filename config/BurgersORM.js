const Database = require("./DatabasePromise.js");

class BurgersORM {

    constructor() {}

    // Add quotes to a column value if it is a string
    addQuotesIfString(x) {
        return (typeof x === "string") ? `"${x}"` : x;
    }

    select(tableInput, cols, aCallback) {
        let connection = new Database();

        var queryString = "SELECT * FROM ??";
        connection.query(queryString, [cols, tableInput])
            .then(rows => {
                aCallback(rows);
            })
            .catch(err => {
                console.log(`error selecting with where ${err}`);
            });

        connection.close();
    }

    selectWhere(tableInput, colToSearch, valOfCol, aCallback) {
        let connection = new Database();

        var queryString = "SELECT * FROM ?? WHERE ?? = ?";
        connection.query(queryString, [tableInput, colToSearch, valOfCol])
            .then(rows => {
                aCallback(rows);
            })
            .catch(err => {
                console.log(`error selecting with where ${err}`);
            });

        connection.close();
    }

    selectAndOrder(whatToSelect, table, orderCol, aCallback) {
        let connection = new Database();

        var queryString = "SELECT ?? FROM ?? ORDER BY ?? DESC";
        console.log(queryString);
        connection.query(queryString, [whatToSelect, table, orderCol])
            .then(rows => {
                aCallback(rows);
            })
            .catch(err => {
                console.log(`error selecting with where ${err}`);
            });

        connection.close();
    }

    // update object has key/value pairs for column/value
    // where object has column / value for the where clause
    updateOne(table_name, updateObject, whereObject, aCallback) {
        let connection = new Database();
        const column_values = [];
        const where_clause = [];

        // Build update set string
        for (let key in updateObject) {
            column_values.push(`${key} = ${this.addQuotesIfString(updateObject[key])}`);
        }

        // Build where clause string
        for (let key in whereObject) {
            where_clause.push(`${key} = ${this.addQuotesIfString(whereObject[key])}`);
        }

        // The Update Query
        const queryString = `
        UPDATE ${table_name}
        SET ${column_values.join(", ")}
        WHERE ${where_clause.join("AND ")};`;

        // Get the one updated for return
        const returnThisQueryString = `
        SELECT * FROM ${table_name}
        WHERE ${where_clause.join("AND ")};`;

        console.log(queryString);
        console.log(returnThisQueryString);

        // First update the row and then get the row that was updated to send back
        connection.query(queryString)
            .then(rows => {
                let database = new Database();
                database.query(returnThisQueryString)
                    .then(rows => {
                        aCallback(rows);
                    });
                    
                database.close();
            })
            .catch(err => {
                console.log(`error selecting with where ${err}`);
            });

        connection.close();
    }

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
                    });

                database.close();
            })
            .catch(err => {
                console.log(`error devouring burgers ${err}`);
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