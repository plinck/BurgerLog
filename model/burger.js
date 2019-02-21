const path = require('path');

// Create an instance of BurgersORM
const BurgersORM = require(path.join(__dirname, `/../config/BurgersORM.js`));
const burgersORM = new BurgersORM();

// Data
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

    // add a burger and the call get to get all burgers and return
    addBurger(newBurger, myCallback) {
        // When adding a new burger, isDevoured will always be false
        newBurger.isDevoured = false;

        burgersORM.insertOne(newBurger, () => {
            console.log("added Burger");
            burgersORM.selectAll(burgers => {
                myCallback(burgers);
            });
        });
    }

}

module.exports = Burger;