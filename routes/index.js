const express = require("express");
const { home } = require("../controllers/UserControllers");
const { route } = require("./user.js");
const router = express.Router();

// adding router for the home  page
router.get("/", home);

// adding users routes
router.use("/users", require("./user.js"));

// adding reviews router
router.use("/review", require("./review.js"));

// adding admin routes
router.use("/admin", require("./admin.js"));

module.exports = router;
