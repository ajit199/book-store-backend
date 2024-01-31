const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.SECRETKEY);
  req.user = await User.findById(decoded.id);
  next();
};

module.exports = verifyToken;
