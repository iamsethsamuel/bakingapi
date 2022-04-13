const { ObjectId } = require("mongodb");
const { ressuccess, reserror } = require("./utils");
const app = require("express").Router();

app.get("/orders", (req, res) => {
    const connectToDB = require("./utils").connectToDB;
    const orders = connectToDB.collection("orders");
    const users = connectToDB.collection("users");

    users.findOne({ sessionId: req.headers.authorization }, (err, user) => {
        if (user) {
            orders.find({}).toArray((err, orders) => {
                ressuccess(res, orders);
            });
        } else {
            reserror(res, "Please login to view orders");
        }
    });
});

app.post("/order", (req, res) => {
    const connectToDB = require("./utils").connectToDB;
    const orders = connectToDB.collection("orders");

    orders.insertOne(
        {
            size: req.body.size,
            color: req.body.color,
            date: req.body.date,
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            price: req.body.price,
            cake: req.body.cake,
            inscription: req.body.inscription,
        },
        (err, order) => {
            if (order) {
                ressuccess(res, order.insertedId);
            } else {
                reserror(res, "Sorry an error occurred");
            }
        }
    );
});

app.get("/order/:order", (req, res) => {
    const connectToDB = require("./utils").connectToDB;
    const orders = connectToDB.collection("orders");
    orders.findOne({ _id: ObjectId(req.params.order) }, (err, order) => {
        if (order) {
            ressuccess(res, order);
        } else {
            reserror(res, "Order not found");
        }
    });
});

module.exports = app;
