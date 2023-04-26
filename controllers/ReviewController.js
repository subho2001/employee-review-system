const User = require("../models/EmpoloyeeModel");
const Reviews = require("../models/review");

// creating up a review
module.exports.createReview = async function (req, res) {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/");
    }

    let to_user = await User.findById(req.params.id);
    let from_user = req.user;
    let feedback = req.body.new_review;

    await Reviews.create({
      review: feedback,
      from: from_user,
      to: to_user,
    });

    const index = req.user.evaluatebyme.indexOf(req.params.id);
    req.user.evaluatebyme.splice(index, 1);
    req.user.save();

    return res.redirect("back");
  } catch (error) {
    console.log(`Error during creating a review  :  ${error}`);
    res.redirect("back");
  }
};

// REVIEW DASHBAORD REVIEW'S DATA
module.exports.reviewdata = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let allreview = await Reviews.find({});

    allreviewdata = [];

    for (let r of allreview) {
      let fromuser = await User.findById(r.from._id);
      let foruser = await User.findById(r.to._id);
      let review = r.review;

      let data = {
        fromemailid: fromuser.email,
        foremailid: foruser.email,
        feedback: review,
        id: r._id,
      };

      allreviewdata.push(data);
    }

    return resp.render("review_records", { allreviewdata });
  } catch (error) {
    console.log(
      `Error during fetching all review from review dashbaord :  ${error}`
    );
    resp.redirect("back");
  }
};

// EDIT THE REVIEW WITH AUTOFILL
module.exports.editReview = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let reviewdata = await Reviews.findById(req.params.id);
    let fromuser = await User.findById(reviewdata.from._id);
    let foruser = await User.findById(reviewdata.to._id);
    let review = reviewdata.review;
    let rid = req.params.id;

    let data = {
      fromemail: fromuser.email,
      foremail: foruser.email,
      feedback: review,
    };

    return resp.render("updatereview", { data, rid });
  } catch (error) {
    console.log(
      `Error during update a review page from review dashbaord :  ${error}`
    );
    resp.redirect("back");
  }
};

// VIEW THE REVIEW WITH AUTOFILL
module.exports.viewdata = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let reviewdata = await Reviews.findById(req.params.id);
    let fromuser = await User.findById(reviewdata.from._id);
    let foruser = await User.findById(reviewdata.for._id);
    let review = reviewdata.review;

    let data = {
      fromemail: fromuser.email,
      foremail: foruser.email,
      feedback: review,
    };

    return resp.render("review_view", { data });
  } catch (error) {
    console.log(`Error during view a review from review dashbaord :  ${error}`);
    resp.redirect("back");
  }
};

// UPDATE THE EDITED REVIEW
module.exports.updateReview = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let updatedreviewdata = await Reviews.findById(req.params.id);

    updatedreviewdata.review = req.body.feedback;
    updatedreviewdata.save();
    return resp.redirect("/review/reviewdata");
  } catch (error) {
    console.log(
      `Error during updating a review from review dashbaord :  ${error}`
    );
    resp.redirect("back");
  }
};

// ADD REVIEW FROM REVIEW DASHBAORD (ONLY FOR ADMIN)
module.exports.addReview = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let users = await User.find({});
    let loggeduser = req.user.email;

    return resp.render("addreview", { loggeduser, users });
  } catch (error) {
    console.log(
      `Error during adding a review form page from review dashbaord :  ${error}`
    );
    resp.redirect("back");
  }
};

// ADDED REVIEW FROM REVIEW DASHBAORD (ONLY FOR ADMIN)
module.exports.addReviewfromadmin = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let reviewdetails = await User.findById(req.body.reviewer_name);

    if (req.body.from_email === reviewdetails.email) {
      return resp.redirect("/");
    } else {
      let newreview = await Reviews.create({
        review: req.body.new_added_feedback,
        from: req.user,
        to: reviewdetails,
      });

      reviewdetails.reviewsByOther.push(newreview._id);

      reviewdetails.save();
      newreview.save();
    }
    return resp.redirect("/review/reviewdata");
  } catch (error) {
    console.log(
      `Error during adding a review from review dashbaord :  ${error}`
    );
    resp.redirect("back");
  }
};
