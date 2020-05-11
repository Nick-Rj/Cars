const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Importing keys file
const config = require("./config/key");

// const { Car } = require("./models/cars");

// Atlas: Cloud Platform
// mongoose
//   .connect(
//     "mongodb+srv://nikrj10348:1234qwertyui@userdata-xnrix.mongodb.net/test?retryWrites=true&w=majority",
//     { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => console.log("DB CONNECTED"))
//   .catch((err) => console.error(err));

mongoose
  //Adding URL from dev via key.
  .connect(config.mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.error(err));

// Used for provide access to third-party services
app.use(cors());

// Using Middlewares.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const routes = require("./routes/users");
app.use("/api/users", routes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// app.post("/api/cars/database", (req, res) => {
//   const car = new Car(req.body);
//   car.save((err, carData) => {
//     if (err)
//       return res.status(400).json({
//         message: "Not able to save in Database",
//         success: false,
//         err,
//       });
//       //Will be returned in postman
//       return res.status(200).json({
//       company: car.company,
//       name: car.name,
//       modelNum: car.modelNum,
//       chassis: car.chassis,
//       color: car.color,
//       price: car.price,
//     });
//   });
// });

app.use('/uploads', express.static('uploads'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // // Set static folder    
  // // All the javascript and css files will be read and served from this folder
  // app.use(express.static("client/build"));

  // // index.html for all page routes    html or routing and naviagtion
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  // });
  app.get("/", (req, res) => {
  res.send("Server is running");
});
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SERVER is up and running at ${PORT}`));
