const User = require("../../models/User");
const CustomError = require("../../utils/CustomError");
const bcrypt = require("bcrypt");
async function register(req, res, next) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please enter required fields." });
      // throw new CustomError("email or password is missing", 400);
    }
    const userExists = await User.findOne({ email: email });
    if (userExists?.email) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email: email,
      password: hashedPassword,
      role: role,
    });
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    next(error);
  }
}

module.exports = register;
