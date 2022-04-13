const { ObjectId } = require("mongodb");
const { ressuccess,reserror} = require("./utils");
const app = require("express").Router();

app.get("/cakes", (req, res) => {
    const connectToDB = require("./utils").connectToDB;
    const cakes = connectToDB.collection("cakes");

    cakes.find({}).toArray((err, cakes) => {
        ressuccess(res, cakes);
    });
}); 

app.get("/cake/:cake", (req, res) => {
    const connectToDB = require("./utils").connectToDB;
    const cakes = connectToDB.collection("cakes");
    
    cakes.findOne({ _id: ObjectId(req.params.cake) },(err, cake) => {
        if (cake) {
            ressuccess(res, cake);
        } else {
            reserror(res, "Cake not found");
        }
    });
});

module.exports = app;
