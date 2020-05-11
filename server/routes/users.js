const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

// Setting up authentication route:Adding authentication middleware
router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//   User Registration
router.post("/register", (req, res) => {
  const user = new User(req.body);
  // Before saving data in DB, password is hashed with bcrypt

  // Saving Data
  user.save((err, userData) => {
    if (err)
      return res.json({
        success: false,
        err,
      });
    return res.status(200).json({
      success: true,
    });
  });
});

// Login request:Route
router.post("/login", (req, res) => {
  // Find email in the database.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });
    // Compare password.
    // req.body.password : password entered by the user during login
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "Wrong password",
        });
      // Generate token.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // Storing user data in cookie.
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

// Logout request
router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});


module.exports = router;