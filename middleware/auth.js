const jwt = require("jsonwebtoken");

// next is used to call the next function after this middleware function is done
const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access Denied" });
    }
    const verified = jwt.verify(token, process.env.jwtSecret);
    if (!verified) {
      return res.status(401).json({ message: "Unauthorized Access Denied" });
    }
    req.user = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;
