const environment = "production",
    mongod = require("mongodb").MongoClient,
    crypto = require("crypto");

require("dotenv").config()

function ressuccess(res, data) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ data: data }));
}

function reserror(res, data) {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ err: data }));
}

(() => {
    const uri = environment === "production" ? process.env.DB_URL : "mongodb://127.0.0.1:27017/baking";
    const options = { useNewUrlParser: true, useUnifiedTopology: true };

    mongod.connect(uri, options, (err, db) => {
        if (!err) {
            module.exports = {
                connectToDB: db.db(environment === "production" ? process.env.DB : "baking"),
            };
        } else {
            console.log(err);
            return err;
        }
    });
})();


const hashedPassword = (password, algorithm) => {
    if (typeof password === "string" && typeof algorithm === "string") {
        let hash = crypto.createHash(algorithm);
        hash.update(password);
        return "" + hash.digest("hex");
    } else {
        return "";
    }
};



module.exports = {
    ressuccess: ressuccess,
    reserror: reserror,
    hashedPassword: hashedPassword,
};
