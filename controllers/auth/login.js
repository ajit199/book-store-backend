const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter required fields." });
    }
    const user = await User.findOne({ email: email });
    const matched = await bcrypt.compare(password, user?.password);
    if (!user?.email || !matched) {
      return res
        .status(404)
        .json({ message: "User does not exists or invalid credentials." });
    }
    const token = jwt.sign(
      { id: user?._id, role: user?.role },
      process.env.SECRETKEY
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
}

module.exports = login;
