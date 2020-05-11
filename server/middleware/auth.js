// For authenticated users.
const { User } = require("../models/user");

let auth = (req, res, next) => {
  // Token is loaded in cookie which should be used here.
  // Cookie holds a key which is linked to user credentials currently logged in.
  // If removed from browser, user will be automatically logged out.
  let token = req.cookies.w_auth;

  //   Method fetched from User Model.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });


    //   Will be sent to implementation in index.js
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
