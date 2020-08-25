const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
/*
    ReqType: POST URL: /users/register
    Access: Public
    Desc: Validate user input for new User registration,
          hash password, and store new user in DB
*/
router.post("/register", async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // Validate
    if (!name || !password || !email) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password needs to be atleast 5 characters" });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // Create a new user and save to db
    const newUser = new User({
      email,
      password: passwordHash,
      name,
      library: [],
      wishlist: [],
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
    ReqType: POST URL: /users/login
    Access: Public
    Desc: Validate User Login and provide jwt upon successful log in
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!password || !email) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user with this email exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    const token = jwt.sign({ id: user._id }, process.env.jwtSecret);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        library: user.library,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

/*
    ReqType: DELETE URL: /users/delete
    Access: Private
    Desc: Allow user to delete their account after they have logged in
    Note: the auth function is middleware which runs before the async function 
          so we can verify a user has logged in before deleting them
*/
router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
    ReqType: POST URL: /users/tokenIsValid
    Access: Public
    Desc: Check if token is valid, ie. user is logged in
*/
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.jwtSecret);
    if (!verified) {
      return res.json(false);
    }
    const user = await User.findById(verified.id);
    if (!user) {
      return res.json(false);
    }
    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
    ReqType: GET URL: /users/
    Access: Private
    Desc: If user is logged in, then return user name and id.
          Used by frontend for display purposes
*/
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    name: user.name,
    email: user.email,
    id: user._id,
    library: user.library,
    wishlist: user.wishlist,
  });
});

module.exports = router;
