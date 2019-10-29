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
const date = require(__dirname +  "/date.js");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));
app.set('view engine', 'ejs');

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get("/", function (req, res) {

    let day = date.getDay();
    
    res.render("list", {
        listTitle: day,
        items: items
    });
});

app.post("/", function (req, res) {

    let item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work")
    } else {
        items.push(item);
        res.redirect("/");
    }

});

app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work Items",
        items: workItems
    });
});

app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});