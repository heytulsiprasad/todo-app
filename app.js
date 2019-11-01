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
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

// connecting to the mongo db and creating a database
mongoose.connect("mongodb://localhost:27017/todoDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));
app.set('view engine', 'ejs');

// importing day name from the date.js module
var day = date.getDay();

// create a schema for defining the type of inputs
const itemSchema = {
    name: String
};

// create a model to define a collection to store data into
const Item = mongoose.model("Item", itemSchema);

// create three documents to add in the todo list by default
const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);



app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {
        // console.log(foundItems);

        if (foundItems.length === 0) {
            // inserting all three items into the collection in mongo server
            Item.insertMany(defaultItems, function (err) {
                // to deal with error
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successully saved default items to database");
                }
            });
            // res.redirect("/");
            res.render("list", {
                listTitle: day,
                items: foundItems
            });
        } else {
            res.render("list", {
                listTitle: day,
                items: foundItems
            });
        }

        // res.render("list", {
        //     listTitle: day,
        //     items: foundItems
        // });
    });
});

app.get("/:customListName", function (req, res) {
    const customListName = req.params.customListName;

    List.findOne({name: customListName}, function (err, foundItem) {
        if (!err) {
            if (!foundItem) {
                // create a new list
                const list1 = new List({
                    name: customListName,
                    items: defaultItems
                });

                list1.save();
                res.redirect("/" + customListName);
            } else {
                // show an existing list
                res.render("list", {
                    listTitle: foundItem.name,
                    items: foundItem.items
                });
            }
        } 
    })
});

app.post("/", function (req, res) {

    let item = req.body.newItem;

    const item4 = new Item ({
        name: item
    });

    Item.insertMany([item4], function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("added new item to database")
        }
    });
    
    res.redirect("/");

});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, { useFindAndModify: false }    , function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed 1 success");
        }
    });
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});