/*

    This project will help the users to jot down any important lists or stuff they intend to do in a particular day.
    This is emphasised on the simplicity in terms of the elegant user interface and experience.
    We aim into bringing useful interactive applications, along with the ease of access being the center of focus.
    This is the main server side code of the TODO application.

*/

// Author: Tulsi Prasad
// Start Date: 28 October 2019
// Project Name: TODO-APP

// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));
app.set('view engine', 'ejs');

let items = [];

app.get("/", function (req, res) {
    // res.send("Hello");
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    res.render("list", {
        kindOfDay: day,
        items: items
    });
});

app.post("/", function (req, res) {
    let item = req.body.newItem;
    // console.log(item);

    items.push(item);
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
});