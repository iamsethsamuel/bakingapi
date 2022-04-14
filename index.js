const app = require("express")(),
cors = require("cors"),
allowedOrigins = [
    "http://localhost:3000",
    "http://34.132.176.233"
]
let corsOptions = {
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || origin === undefined) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));
app.use(require("body-parser").json())
app.use(require("./login"))
app.use(require("./cake"))
app.use(require("./order"))

app.listen(process.env.PORT || "8080", (connect) => {
    console.log(`Serving at port 8080`);
}).on("error", (err) => {
    console.log(err);
});

process.on("uncaughtException", (err) => {
    console.log(err);
});

