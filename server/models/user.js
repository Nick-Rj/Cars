const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

// Defining the length of salt.
const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 32,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 5,
    },
    lastname: {
      type: String,
      maxlength: 50,
    },
    role: {
      type: String,
      default: 0,
    },
    image: String,
    token: {
      type: String,
    },
    tokenExp: {
      type: Number,
    },
  },
  { timestamps: true }
);

//Hashing password before storing in database.
userSchema.pre("save", function (next) {
  // Using current Schema,i.e, userSchema.
  let user = this;

  //If password is modified, then it will be hashed.
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        //Throwing control to the previous stage.
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          //Throwing control to the previous stage.
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
    //If password not modified, then it will remain same.
  } else {
    next();
  }
});

// Method for comparing passwords.
userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Method for generating token.
userSchema.methods.generateToken = function (cb) {
  var user = this;
  // Generating token.
  var token = jwt.sign(user._id.toHexString(), "secret");
  var oneHour = moment().add(1, "hour").valueOf();

  // Storing token.
  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

// Method for finding token.
userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // Verifying token with jwt.
  jwt.verify(token, "secret", function (err, decoded) {
    // decoded is used to fetch the user._id from the given token. If user._id matches, token verified.
    user.findOne({ "_id": decoded, "token": token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
