const { ressuccess, reserror, hashedPassword } = require("./utils");
const app = require("express").Router();

app.post("/signup", async (req, res) => {
    const connectToDB = require("./utils").connectToDB;
    const users = connectToDB.collection("users");

    if (req.body.email && req.body.name && req.body.password && req.body.picture) {
        users.findOne({ email: req.body.email }, (err, user) => {
            if (user) {
                reserror(res, "This email address it taken already");
            } else {
                const sessionId = hashedPassword(Date() + req.body.password, "sha256");
                users.insertOne(
                    {
                        email: req.body.email,
                        name: req.body.name,
                        sessionId: sessionId,
                        picture: req.body.picture,
                        password: hashedPassword(req.body.password, "sha512"),
                    },
                    (err, insert) => {
                        if (insert) {
                            ressuccess(res, sessionId);
                        } else {
                            reserror(res, "Sorry an error occurred");
                        }
                    }
                );
            }
        });
    } else {
        reserror(res, "Invalid form submitted");
    }
});

app.post("/updateprofile", async (req, res) => {
    const connectToDB = require("./utils").connectToDB;
    const users = connectToDB.collection("users");

    if (req.body.email && req.body.name && req.body.picture) {
        users.findOneAndUpdate(
            { sessionId: req.headers.authorization },
            {
                $set: {
                    email: req.body.email,
                    name: req.body.name,
                    picture: req.body.picture,
                    ...() => {
                        if (req.body.password && req.body.password.length >= 8)
                            return { password: hashedPassword(req.body.password, "sha512") };
                    },
                },
            },
            (err, insert) => {
                if (insert) {
                    ressuccess(res, "Success");
                } else {
                    reserror(res, "Sorry an error occurred");
                }
            }
        );
    } else {
        reserror(res, "Invalid form submitted");
    }
});

app.post("/login", async (req, res) => {
    const connectToDB = require("./utils").connectToDB;
    const users = connectToDB.collection("users");
    const sessionId = hashedPassword(Date() + req.body.password, "sha256");

    users.findOneAndUpdate(
        { email: req.body.email, password: hashedPassword(req.body.password, "sha512") },
        { $set: { sessionId: sessionId } },
        (err, user) => {
            if (user.value) {
                ressuccess(res, sessionId);
            } else {
                reserror(res, "Invalid email or password");
            }
        }
    );
});

app.post("/logout", async (req, res) => {
    const connectToDB = require("./utils").connectToDB;
    const users = connectToDB.collection("users");

    users.findOneAndUpdate({ sessionId: req.body.sessionId }, { $set: { sessionId: "" } }, (err, user) => {
        if (user.value) {
            ressuccess(res, user.value.sessionId);
        } else {
            reserror(res, "Session not found");
        }
    });
});

app.get("/user", (req, res) => {
    const connectToDB = require("./utils").connectToDB;
    const users = connectToDB.collection("users");

    users.findOne({ sessionId: req.headers.authorization }, (err, user) => {
        if (user) {
            delete user.password;
            ressuccess(res, user);
        } else {
            reserror(res, "User not found");
        }
    });
});

module.exports = app;
