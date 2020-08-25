const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const colors = require("colors");
const cors = require("cors");
require("dotenv").config({ path: "./config/config.env" });
//Set up Express
const app = express();

//Set up middleware
app.use(express.json());
app.use(cors());

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server has started on Port: ${PORT}`.blue.bold)
);

//Set up mongoose
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) console.log(err);
    console.log(`MongoDB connection established`.yellow);
  }
);

//Set up Routes for user auth
app.use("/users", require("./routes/userRouter"));
// Set up routes for library functions
app.use("/home/library", require("./routes/libraryRouter"));
// Set up routes for wishlist functions
app.use("/home/wishlist", require("./routes/wishlistRouter"));

// Set up routes for recommendations functions
app.use("/home/recommendations", require("./routes/recommendationsRouter"));

// Serve static assets
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
