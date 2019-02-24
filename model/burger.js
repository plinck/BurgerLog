const path = require('path');

// Create an instance of BurgersORM
const BurgersORM = require(path.join(__dirname, `/../config/BurgersORM.js`));
const burgersORM = new BurgersORM();

// Test Data - njot needed after SQL/ORM completed
var burgersNotDevoured = [{
        id: 1,
        name: 'bacon',
        price: 10,
        awesomeness: 3
    },
    {
        id: 2,
        name: 'greek',
        price: 8,
        awesomeness: 8
    }
];

var burgersDevoured = [{
        id: 3,
        name: 'cheese',
        price: 10,
        awesomeness: 3
    },
    {
        id: 4,
        name: 'mexican',
        price: 8,
        awesomeness: 8
    }
];

class Burger {

    constructor() {}

    getBurgers(aCallback) {
        burgersORM.selectAll(burgers => {
            aCallback(burgers);
        });
    }

    // add a burger and send back the inserted burger
    addBurger(newBurger, myCallback) {
        // When adding a new burger, isDevoured will always be false
        newBurger.isDevoured = false;

        burgersORM.insertOne("burgers", newBurger, (rows) => {
            myCallback(rows[0]);
        });
    }

    // Delete a burger
    deleteBurger(burger, myCallback) {
        burgersORM.deleteOne("burgers", {
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

        burgersORM.updateOne("burgers", {
            isDevoured: isDevoured
        }, {
            id: burger.id
        }, (rows) => {
            myCallback(rows[0]);
        });
    }

    // Update a burger and send back the updated burger
    updateBurger(burger, myCallback) {

        burgersORM.updateOne("burgers", burger, {
            id: burger.id
        }, (rows) => {
            myCallback(rows[0]);
        });
    }
} // End Class

module.exports = Burger;