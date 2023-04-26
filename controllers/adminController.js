const User = require("../models/EmpoloyeeModel");
const Reviews = require("../models/review");

// ASSIGN TASK PAGE SENDS WITH ALL EMPLOYEENAME
module.exports.assignTask = async function (req, res) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return res.redirect("/");
    }

    let users = await User.find({});

    return res.render("assign_task", { users });
  } catch (error) {
    console.log(`Error during assign task page :  ${error}`);
    res.redirect("back");
  }
};

// ON SUBMIT THE ASSIGN TASK
module.exports.taskassigned = async function (req, res) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    if (req.body.employee_name === req.body.reviewer_name) {
      return resp.redirect("/admin/assigntask");
    }

    let to_employee = await User.findById(req.body.employee_name);
    let from_employee = await User.findById(req.body.reviewer_name);

    to_employee.reviewsByOther.push(from_employee);
    to_employee.save();

    from_employee.reviewsByMe.push(to_employee);
    from_employee.save();
    console.log("Task assigned successfully");

    return res.redirect("back");
  } catch (error) {
    console.log(`Error during assigned task :  ${error}`);
    res.redirect("back");
  }
};

// SHOW ALL EMPLOYEES RECORDS AND SEND THE ALL EMPLOYEES
module.exports.EmployeeRecords = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let users = await User.find({});

    return resp.render("employee_records", { users });
  } catch (error) {
    console.log(`Error during showing on all employee records :  ${error}`);
    resp.redirect("back");
  }
};

// ADD THE EMPLOYEE FROM ADMIN FORM PAGE
module.exports.AddUser = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    return resp.render("addUser");
  } catch (error) {
    console.log(`Error during addemployee page from admin :  ${error}`);
    resp.redirect("back");
  }
};

// EDIT FORM ON EDIT WITH AUTOFILL DATA
module.exports.UpdateReqUser = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let user = await User.findById(req.params.id);

    return resp.render("update_employee", { user });
  } catch (error) {
    console.log(`Error during update form from admin :  ${error}`);
    resp.redirect("back");
  }
};

// UPDATE SUBMIT SAVE THE UPDATED  EMPLOYEE DATA
module.exports.UpdatedUser = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let user = await User.findById(req.params.id);

    user.name = req.body.name;
    user.password = req.body.password;
    user.isAdmin = req.body.admin;

    user.save();

    console.log("Employee's details are updated successfully...");

    return resp.redirect("/admin/employeerecords");
  } catch (error) {
    console.log(`Error during updating the employee records :  ${error}`);
    resp.redirect("back");
  }
};

module.exports.CreateUser = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    if (req.body.password != req.body.confirmpassword) {
      return resp.redirect("back");
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
        console.log("error in creating new employee");
        return resp.redirect("back");
      }

      console.log("Employee added successfully from admin");

      return resp.redirect("/admin/employeerecords");
    } else {
      return resp.redirect("back");
    }
  } catch (error) {
    console.log(`Error during creating an employee from admin:  ${error}`);
    resp.redirect("back");
  }
};

// DELETE THE EMPLOYEE DATA FROM ADMIN
module.exports.deleteEmployee = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let id = req.params.id;

    let allusers = await User.find({});

    for (let i = 0; i < allusers.length; i++) {
      let index = await allusers[i].evaluatebyme.indexOf(id);

      if (index !== -1) {
        while (index != -1) {
          await allusers[i].reviewsByMe.splice(index, 1);
          index = allusers[i].reviewsByMe.indexOf(id);
        }
        await allusers[i].save();
      }

      index = await allusers[i].reviewsByOther.indexOf(id);

      if (index !== -1) {
        while (index != -1) {
          await allusers[i].evaluatebyme.splice(index, 1);
          index = allusers[i].evaluatebyme.indexOf(id);
        }
        await allusers[i].save();
      }
    }

    let reviews = await Reviews.find({ from: id });
    for (let i = 0; i < reviews.length; i++) {
      await Reviews.findByIdAndDelete(reviews[i].id);
    }

    reviews = await Reviews.find({ to: id });
    for (let i = 0; i < reviews.length; i++) {
      await Reviews.findByIdAndDelete(reviews[i].id);
    }

    await User.findByIdAndDelete(id);
    console.log("Employee's are deleted successfully...");

    return resp.redirect("/admin/employeerecords");
  } catch (error) {
    console.log(`Error during deleting an employee :  ${error}`);
    resp.redirect("back");
  }
};

// MAKE AN EMPLOYEE TO ADMIN
module.exports.makeadmin = async function (req, resp) {
  try {
    if (!req.isAuthenticated() || req.user.isAdmin == false) {
      return resp.redirect("/");
    }

    let user = await User.findById(req.body.admin_employee_name);

    if (user.isAdmin == true) {
      return resp.redirect("back");
    } else {
      user.isAdmin = true;
      await user.save();
    }
    console.log("employee make admin successfully...");

    return resp.redirect("back");
  } catch (error) {
    console.log(`Error during making an employee to admin :  ${error}`);
    resp.redirect("back");
  }
};
