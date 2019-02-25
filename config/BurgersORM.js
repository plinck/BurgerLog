const Database = require("./DatabasePromise.js");
let database = new Database();
class BurgersORM {

    constructor() {}

    // Add quotes to a column value if it is a string
    // Froiufght with issues due to way objects are passed
    // typeof can be useless in javascript
    // Had to do this because typeof just does not work
    // object properties get pass like myBool: 'true' and it thinks that is a string
    // its ridiculous
    quoteMe(testVar) {
        if (typeof testVar == "boolean") {
            return testVar;
        }
        if (!isNaN(testVar)) {
            return testVar;
        }
        if (testVar == 'true' || testVar == 'false') {
            return testVar;
        };
        if (typeof (testVar) == "string") {
            return (`'${testVar}'`);
        }
        return testVar;
    }

    // Select 
    select(tableInput, col, aCallback) {
        var queryString = "SELECT ?? FROM ??";
        database.query(queryString, [col, tableInput])
            .then(rows => {
                aCallback(rows);
            })
            .catch(err => {
                console.log(`error selecting with where ${err}`);
            });
    }

    // select where
    selectWhere(tableInput, colToSearch, valOfCol, aCallback) {
        var queryString = "SELECT * FROM ?? WHERE ?? = ?";
        database.query(queryString, [tableInput, colToSearch, valOfCol])
            .then(rows => {
                aCallback(rows);
            })
            .catch(err => {
                console.log(`error selecting with where ${err}`);
            });
    }

    // selecty and order by
    selectAndOrder(whatToSelect, table, orderCol, aCallback) {
        var queryString = "SELECT ?? FROM ?? ORDER BY ?? DESC";
        console.log(queryString);
        database.query(queryString, [whatToSelect, table, orderCol])
            .then(rows => {
                aCallback(rows);
            })
            .catch(err => {
                console.log(`error selecting with where ${err}`);
            });
    }

    // update object has key/value pairs for column/value
    // where object has column / value for the where clause
    // sends back the row updated
    updateOne(table_name, updateObject, whereObject, aCallback) {
        const columns_values = [];
        const where_clause = [];

        // Build update set string
        for (let key in updateObject) {
            columns_values.push(`${key} = ${this.quoteMe(updateObject[key])}`);
        }

        // Build where clause string
        for (let key in whereObject) {
            where_clause.push(`${key} = ${this.quoteMe(whereObject[key])}`);
        }

        // The Update Query
        const queryString = `
        UPDATE ${table_name}
        SET ${columns_values.join(", ")}
        WHERE ${where_clause.join("AND ")};`;

        // Get the one updated for return
        const returnThisQueryString = `
        SELECT * FROM ${table_name}
        WHERE ${where_clause.join("AND ")};`;

        // First update the row and then get the row that was updated to send back
        database.query(queryString)
            .then(rows => {
                database.query(returnThisQueryString)
                    .then(rows => {
                        aCallback(rows);
                    })
                    .catch(err => {
                        console.log(`error selecting with where ${err}`);
                    });
            })
            .catch(err => {
                console.log(`error updating with where ${err}`);
            });
    }

    // insert object with key/value
    insertOne(table_name, insertObject, aCallback) {
        const columns = [];
        const column_values = [];

        // Build update set string
        for (let key in insertObject) {
            columns.push(`${key}`);
            column_values.push(`${this.quoteMe(insertObject[key])}`);
        }

        // The INSERT Query
        const queryString = `
        INSERT INTO ${table_name}
        (${columns.join(", ")})
        VALUES (${column_values.join(", ")});`;

        // Get the one INSERTED for return
        const returnThisQueryString = `
        SELECT * FROM ${table_name}
        WHERE id = ?;`;

        // First update the row and then get the row that was updated to send back
        database.query(queryString)
            .then(rows => {
                let insertId = rows.insertId;
                database.query(returnThisQueryString, [insertId])
                    .then(rows => {
                        aCallback(rows);
                    })
                    .catch(err => {
                        console.log(`error selecting with where ${err}`);
                    });
            })
            .catch(err => {
                console.log(`error updating with where ${err}`);
            });
    }

    // Delete
    deleteOne(table_name, whereObject, aCallback) {
        const where_clause = [];

        // Build where clause string
        for (let key in whereObject) {
            where_clause.push(`${key} = ${this.quoteMe(whereObject[key])}`);
        }

        // The DELETE Query
        const queryString = `
        DELETE FROM ${table_name}
        WHERE ${where_clause.join("AND ")};`;

        // First update the row and then get the row that was updated to send back
        database.query(queryString)
            .then(rows => {
                let affectedRows = rows.affectedRows;
            })
            .catch(err => {
                console.log(`error updating with where ${err}`);
            });
    }

    // just for tesrting, unused in final app
    // Get burgers from DB and put in object var
    selectAll(aCallback) {
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
    }

    // Insert - just for tesrting, unused in final app
    insertBurger(burger, aCallback) {
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
    }

    // just for tesrting, unused in final app
    // Change Devour Flag
    // TODO: Change update so it just updates fields passed in object
    //  Support for multiple statements is disabled for security reasons 
    // (it allows for SQL injection attacks if values are not properly escaped).
    // Multiple statement queries
    // To use this feature you have to enable it for your database:
    // var database = mysql.createdatabase({multipleStatements: true});
    devourOne(burger, aCallback) {
        console.log(burger);

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
    }

}

module.exports = BurgersORM;