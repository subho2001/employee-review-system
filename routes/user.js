const express = require("express");
const {
  login,
  signup,
  signOut,
  CreateUser,
  CreateSession,
} = require("../controllers/UserControllers");
const router = express.Router();
const passport = require("passport");

// adding login routes
router.get("/login", login);

// singing up the user
router.get("/Signup", signup);

// adding a route for creating a user
router.post("/create", CreateUser);

// singing out the user
router.get("/SignOut", signOut);

// route for creating a session
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  CreateSession
);
module.exports = router;
