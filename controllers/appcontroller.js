import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export async function register(req, res) {
  try {
    const { name, userName, email, password } = req.body;

    // Check if username and email exist
    const [usernameCheck, emailCheck] = await Promise.all([
      UserModel.findOne({ userName }).exec(),
      UserModel.findOne({ email }).exec(),
    ]);

    if (usernameCheck) {
      return res.status(400).send({ error: "Username already exists" });
    }

    if (emailCheck) {
      return res.status(400).send({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new UserModel({
      name,
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(200).send({ msg: "User registered successfully." });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

// POST req to login {name: 'selva22', pass: '11111'}
// http://localhost:8000/api/login
export async function login(req, res) {
  res.json("User LOGIN");
}

// GET req to login {username: 'selva22', password: '11111'}
// http://localhost:8000/api/user/:username
export async function getUser(req, res) {
  res.json("User Details");
}

// GET req to generate otp in user Obj
// get user details from userdata {email: 'selva@gmail.com'}
// update otp details to user {otp: '22222'}
// http://localhost:8000/api/generateOTP
export async function generateOTP(req, res) {
  res.json("Generate OTP to user obj");
}

// GET req to verifyOTP otp in user Obj
// get user details from userdata {email: 'selva@gmail.com'}
// update otp details to user {otp: '22222'}
// http://localhost:8000/api/verifyOTP
export async function verifyOTP(req, res) {
  res.json("verifyOTP OTP in user obj");
}

// GET method for creating session
export async function createResetSession(req, res) {
  res.json("Creating session for password update");
}

// PATCH req to update the password
// {newpassword: '111111111s$S', reenterpassword: '111111111s$S'}
// http://localhost:8000/api/updatepassword
export async function resetPassword(req, res) {
  res.json("Password has been updated");
}
