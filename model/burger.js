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

    constructor() {
    }

    getBurgers(aCallback) {
        aCallback(burgersDevoured);

        // burgersORM.selectAll( burgers => {
        //     aCallback(burgers);
        // });
    }
}

module.exports = Burger;
