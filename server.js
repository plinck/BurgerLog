// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const path = require('path');

// Create an instance of the express app.
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// The app.use below is so we can use static directories in express - it tells express where to look.
// First parameter is the mount point, second is the location in the file system where it actually is.
// This tells express the static directory we will use for the files vs embedding
// it directly in the HTML file, so in the html file, we can use:
//  <script src="public/assets/js/survey.js" type="text/javascript"></script>
// and take js files out of html files where they belong
app.use("/public", express.static(path.join(__dirname, "public")));

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 3000;

// Routes
const burger_router = require(path.join(__dirname, "controllers/burger_controller.js"));
app.use("/", burger_router);


// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));

app.set("view engine", "handlebars");

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});