const User = require("../../models/User");
const CustomError = require("../../utils/CustomError");
const bcrypt = require("bcrypt");
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomError("email or password is missing", 400);
    }
    console.log("printing");
  } catch (error) {
    next(error);
  }
}

module.exports = login;
