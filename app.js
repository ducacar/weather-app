if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const helmet = require("helmet");
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/CRUD';



const weatherRouter = require("./routes/weather");

const app = express();

const secret = process.env.SECRET || "my-secret-key";

app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: true,
  })
);


app.use(require("connect-flash")());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const scriptSrcUrls = [
  "https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.1/dist/umd/popper.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js",
];

const styleSrcUrls = [
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
];
const connectSrcUrls = [];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dgwtmmyl7/",
        "https://openweathermap.org/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

mongoose.set("strictQuery", false);

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");

app.use("/", weatherRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
