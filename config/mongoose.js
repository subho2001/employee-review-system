// requiring the library
const mongoose = require("mongoose");

//connecting to the database
mongoose.connect(
  "mongodb+srv://subhobaroi:admin@cluster0.x7qj2cm.mongodb.net/?retryWrites=true&w=majority"
);

// acquiring the connection to check if it is succesfull
const db = mongoose.connection;

//checking the error
db.on("error", console.error.bind(console, "error in connecting the database"));

//up and running then print the statement
db.once("open", function () {
  console.log("succesfully connected to database");
});

// exporting the db
module.exports = db;
