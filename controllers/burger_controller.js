const express = require("express");
const validUrl = require("valid-url");
const path = require('path');

// Create an instance of Router
const router = express.Router();

// Create an instance of BurgersORM
const Burger = require(path.join(__dirname, `/../model/burger.js`));
const burger = new Burger();

// Routes
router.get("/burgers/:name", function (req, res) {
    let name = req.params.name;

    burgersNotDevoured.forEach(burger => {
        if (name == burger.name) {
            res.render("index", burder);
        }
    });
});

router.get("/burgers", function (req, res) {
    burger.getBurgers(burgers => {
        res.render("burgers", {
            burgersNotDevoured: burgers,
            burgersDevoured: burgers
        });
    });
});

router.post("/burgers", (req, res) => {
    console.log(req.body);
    const newBurger = req.body;

    // const newBurger = {
    //     "name": req.body.name,
    //     "price": req.body.price,
    //     "awesomeness": req.body.awesomeness
    // };

    // Add the the burger to not eaten
    burgersORM.addOne(profile);

    res.render("burgers", {
        burgersNotDevoured: burgersNotDevoured
    });
});

module.exports = router;