// importing the database connection
const User = require("../models/EmpoloyeeModel");
const Reviews = require("../models/review");

// controller for home  page
module.exports.home = async function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/users/login");
  }

  let user = await User.findById(req.user._id);
  let to_review = [];

  for (let i = 0; i < user.reviewsByMe.length; i++) {
    let data = await User.findById(user.reviewsByMe[i]);
    to_review.push(data);
  }

  let all_review = await Reviews.find({
    to: req.user._id,
  });
  let my_review = [];

  for (let i = 0; i < all_review.length; i++) {
    let reviewername = await User.findById(all_review[i].from);
    let data = {
      reviewer_name: reviewername.name,
      review: all_review[i].review,
      lastupdate: all_review[i].updatedAt,
    };

    my_review.push(data);
  }

  return res.render("home", { to_review, my_review });
};

// adding login functionalities
module.exports.login = function (req, res) {
  if (!req.isAuthenticated()) {
    return res.render("signin");
  }
  return res.redirect("/");
};

// singing up the user
module.exports.signup = function (req, resp) {
  if (!req.isAuthenticated()) {
    return resp.render("signup");
  }

  return resp.redirect("/");
};

// sign out the user
module.exports.signOut = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("error");
      return;
    }
    res.redirect("/");
  });
  return res.redirect("/");
};

// creating a new User
module.exports.CreateUser = async function (req, res) {
  try {
    if (req.body.password != req.body.confirmpassword) {
      return res.redirect("back");
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const newuser = await User.create({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isAdmin: false,
      });
      await newuser.save();

      if (!newuser) {
        console.log("error in creating new user");
        return res.redirect("back");
      }
      return res.redirect("/users/login");
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    console.log(`Error during submit the sigup form:  ${error}`);
    res.redirect("back");
  }
};

// SESSION IS CREATE AFTER SUCCESSFULLY LOGIN
module.exports.CreateSession = function (req, resp) {
  return resp.redirect("/");
};
