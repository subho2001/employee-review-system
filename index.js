const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./config/mongoose");
const port = process.env.PORT || 8000;

// use session
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport");
const MongoStore = require("connect-mongo");
const { disabled } = require("express/lib/application");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// setting up the views as ejs
app.set("view engine", "ejs");
app.set("views", "./views");

// using mongoStore to store session cookies
app.use(
  session({
    name: "EmployeeReview",
    secret: "ErsAppDesign",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl:
          "mongodb+srv://subhobaroi:admin@cluster0.x7qj2cm.mongodb.net/?retryWrites=true&w=majority",
        autoRemove: "disabled",
        mongooseConnection: db,
        collectionName: "sessions",
      },
      function (error) {
        console.log(error || "connect mongodb setup is ok");
      }
    ),
  })
);

// for authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// using express-routers
app.use("/", require("./routes"));

// using bodyparsers
app.use(bodyParser.json());

// listening to the app at port 8000
app.listen(port, (err) => {
  if (err) {
    console.log("error in starting the server", err);
    return;
  }
  console.log("server is succesfully running on port 8000");
});
