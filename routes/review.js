const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  createReview,
  reviewdata,
  editReview,
  viewdata,
  updateReview,
  addReview,
  addReviewfromadmin,
} = require("../controllers/ReviewController");

// creating a review
router.post("/create_review/:id", passport.checkAuthentication, createReview);

// ROUTES FOR /review/reviewdata
router.get("/reviewdata", passport.checkAuthentication, reviewdata);

// ROUTES FOR /review/edit/<id>
router.get("/edit/:id", passport.checkAuthentication, editReview);

// ROUTES FOR /review/view/<id>
router.get("/view/:id", passport.checkAuthentication, viewdata);

// ROUTES FOR /review/updatedreview/<id>
router.post("/updatedreview/:id", passport.checkAuthentication, updateReview);

// ROUTES FOR /review/addreview
router.get("/addreview", passport.checkAuthentication, addReview);

// ROUTES FOR /review/addReviewfromadmin
router.post(
  "/addReviewfromadmin",
  passport.checkAuthentication,
  addReviewfromadmin
);

module.exports = router;
