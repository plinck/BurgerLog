// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");

// Create an instance of the express app.
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// The app.use below is so we can use static directories in express - it tells express where to look.
// First parameter is the mount point, second is the location in the file system where it actually is.
// This tells express the static directory we will use for the files vs embedding
// it directly in the HTML file, so in the html file, we can use:
//  <script src="public/assets/js/survey.js" type="text/javascript"></script>
// and take js files out of html files where they belong
app.use("/public", express.static(__dirname + "/public"));

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
        burgersNotDevoured: burgersNotDevoured,
        burgersDevoured: burgersDevoured
    });
});  

app.post("/burgers",  (req, res) => {
    console.log(req.body);
    const newBurger = req.body;

    // const newBurger = {
    //     "name": req.body.name,
    //     "price": req.body.price,
    //     "awesomeness": req.body.awesomeness
    // };

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