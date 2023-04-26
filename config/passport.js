// import Modules
const passport = require("passport");
const LocalStratgey = require("passport-local").Strategy;

// import database Collections
const User = require("../models/EmpoloyeeModel");

passport.use(
  new LocalStratgey(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne({ email: email }, function (error, user) {
        if (error) {
          console.log("Error comes in finding user inside the passport");
          return done(error);
        }

        if (!user || user.password != password) {
          console.log("Invalid Username/password");
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);

// serializing a user to decide which key should be kept in cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding user--> Passport");
      return done(err);
    }

    return done(null, user);
  });
});

// check if user is authenticated or not
passport.checkAuthentication = function (req, res, next) {
  // if user is signed in then pass the control to controller actions
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/users/login");
};

// setting up the user for views
passport.setAuthenticatedUser = function (req, resp, next) {
  if (req.isAuthenticated()) {
    resp.locals.user = req.user;
  }
  next();
};
