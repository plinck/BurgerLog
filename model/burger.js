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

        burgersORM.insertOne(newBurger, (burger) => {
            console.log("added Burger");
            myCallback(burger);
        });
    }

    // Devour a burger and send back the updated burger
    devourBurger(burger, myCallback) {
        console.log(burger);

        burgersORM.updateOne("burgers", {isDevoured: true }, {id: burger.id}, (rows) => {
            console.log("updated Burger");
            myCallback(rows[0]);
        });

        // burgersORM.devourOne(burger, (burger) => {
        //     console.log("updated Burger");
        //     myCallback(burger);
        // });
    }

    // Update a burger and send back the updated burger
    updateBurger(updatedBurger, myCallback) {

        burgersORM.updateOne(updatedBurger, (burger) => {
            console.log("updated Burger");
            myCallback(burger);
        });
    }

}

module.exports = Burger;