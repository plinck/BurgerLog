const path = require('path');

// This *model* contains data and business logic for the app 
// controller calls this after getting correct route

// Create an instance of Orm
const Orm = require(path.join(__dirname, `/../config/Orm.js`));
const orm = new Orm();

class Burger {

    constructor() {}

    getBurgers(aCallback) {
        orm.select("burgers", "*", burgers => {
            aCallback(burgers);
        });
    }

    // add a burger and send back the inserted burger
    addBurger(newBurger, myCallback) {
        // When adding a new burger, isDevoured will always be false
        newBurger.isDevoured = false;

        orm.insertOne("burgers", newBurger, (rows) => {
            myCallback(rows[0]);
        });
    }

    // Delete a burger
    deleteBurger(burger, myCallback) {
        orm.deleteOne("burgers", {
            id: burger.id
        }, (rows) => {
            console.log(`deleted Burger`);
            myCallback();
        });
    }

    // Devour a burger and send back the updated burger
    devourBurger(burger, myCallback) {

        let isDevoured = burger.isDevoured ? true : false;
        console.log(`isDevoured ${isDevoured}, burger.isDevoured: ${burger.isDevoured}`);

        orm.updateOne("burgers", {
            isDevoured: isDevoured
        }, {
            id: burger.id
        }, (rows) => {
            myCallback(rows[0]);
        });
    }

    // Update a burger and send back the updated burger
    updateBurger(burger, myCallback) {

        orm.updateOne("burgers", burger, {
            id: burger.id
        }, (rows) => {
            myCallback(rows[0]);
        });
    }
} // End Class

module.exports = Burger;