// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");

// Create an instance of the express app.
var app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 3000;

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Data
var burgersNotDevoured = [{
        name: 'bacon',
        price: 10,
        awesomeness: 3
    },
    {
        name: 'greek',
        price: 8,
        awesomeness: 8
    }
];

var burgersDevoured = [{
        name: 'cheese',
        price: 10,
        awesomeness: 3
    },
    {
        name: 'mexican',
        price: 8,
        awesomeness: 8
    }
];


// Routes
app.get("/burgers/:name", function (req, res) {
    let name = req.params.name;

    burgersNotDevoured.forEach(burger => {
        if (name == burger.name) {
            res.render("index", burder);
        }
    });
});

app.get("/burgers", function (req, res) {
    res.render("burgers", {
        burgersNotDevoured: burgersNotDevoured
    });
});

app.post("/burgers",  (req, res) => {
    console.log(req);

    const newBurger = {
        "name": req.body.name,
        "price": req.body.price,
        "awesomeness": req.body.awesomeness
    };

    // Add the the burger to not eaten
    burgersNotDevoured.push(newBurger);

    res.render("burgers", {
        burgersNotDevoured: burgersNotDevoured
    });

});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});