const express = require("express");
const validUrl = require("valid-url");
const path = require('path');

// Create an instance of Router
const router = express.Router();

// Create an instance of burger
const Burger = require(path.join(__dirname, `/../model/Burger.js`));
const burger = new Burger();

// Default
router.get("/", (req, res) => {
    res.redirect("/burgers");
});

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
            burgers: burgers
        });
    });
});

router.post("/burgers", (req, res) => {
    const newBurger = req.body;

    // Add the the burger to not eaten
    burger.addBurger(newBurger, (burger) => {
        // Send the new burger back via JSON and fix on client 
        res.json(burger);
    });

});

router.put("/burgers", (req, res) => {
    const updatedBurger = req.body;

    // Add the the burger to not eaten
    burger.updateBurger(updatedBurger, (burger) => {
        // Send the new burger back via JSON and fix on client 
        res.json(burger);
    });

});

router.delete("/burgers/:id", (req, res) => {
    const deleteId = parseInt(req.params.id);
    // Delete the the burger to
    burger.deleteBurger({id: deleteId}, () => {
        res.end();
    });

});



module.exports = router;