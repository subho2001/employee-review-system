const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  assignTask,
  taskassigned,
  EmployeeRecords,
  AddUser,
  UpdateReqUser,
  UpdatedUser,
  CreateUser,
  ViewEmployee,
  deleteEmployee,
  makeadmin,
} = require("../controllers/adminController");

// ROUTES for /admin/assigntask
router.get("/assigntask", passport.checkAuthentication, assignTask);

// ROUTES for /admin/taskassigned
router.post("/taskassigned", passport.checkAuthentication, taskassigned);

// ROUTES for /admin/employeerecords
router.get("/employeerecords", passport.checkAuthentication, EmployeeRecords);

// ROUTES for /admin/adduser
router.get("/adduser", passport.checkAuthentication, AddUser);

// ROUTES for /adminupdate/<id>
router.get("/update/:id", passport.checkAuthentication, UpdateReqUser);

// ROUTES for /admin/UpdatedUser/<id>
router.post("/UpdatedUser/:id", passport.checkAuthentication, UpdatedUser);

// ROUTES for /admin/create_user
router.post("/create_user", passport.checkAuthentication, CreateUser);

router.get("/delete/:id", passport.checkAuthentication, deleteEmployee);

// ROUTES for /admin/makeadmin
router.post("/makeadmin", passport.checkAuthentication, makeadmin);
module.exports = router;
