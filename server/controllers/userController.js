import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  // Condition Checking
  if (!email) {
    return res.status(400).json({ message: "Email Id is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Please enter a valid password" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email Id" });
  }

  const userExists = await User.find({ email: email });

  if (userExists.length > 0) {
    return res
      .status(400)
      .json({ message: "Email already exists for another user" });
  }

  // creating User instance
  const user = new User({
    name,
    email,
  });

  // hashing the user entered password
  const hashedPassword = await user.hashPassword(password);

  user.password = hashedPassword;

  user.save();

  generateToken(res, user);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email id cannot be blank" });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email id" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password cannot be blank" });
  }

  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(400).json({ message: "No user found for this email" });
  }

  const passwordMatches = await bcrypt.compare(password, userExists.password);

  if (!passwordMatches) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  generateToken(res, userExists);
};

export { registerUser, loginUser };
