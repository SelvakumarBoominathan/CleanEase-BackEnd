import { Router } from "express";
import bcrypt from "bcrypt";

const router = Router();

// Create or POST method
router.route("/register").post((req, res) => res.json("register route")); // create a new user
// router.route("/Login").post((req, res) => res.json("Login route")); // Login to the app
router.route("/authEmail").post((req, res) => res.json("Email route")); // put OTP in the obj
// router.route("/otpvalidation").post((req, res) => res.json("OTP route"));
// router.route("/setpassword").post((req, res) => res.json("set password route"));

// Read or GET method
router.route("/user/:username").get((req, res) => res.json("user route")); // get the user details
router.route("/genOTP").get((req, res) => res.json("Email route")); // to generate random OTP
router.route("/authUser").get((req, res) => res.json("OTP route")); // verify generated OTP
// router.route("/ResetSession").get((req, res) => res.json("set password route"));

// Update or PUT method
router.route("/resetPassword").put((req, res) => res.json("reset pass route")); // reset password

// Deleta or DEL Method

// router.route("/Registerpage").delete((req, res) => res.json("register route"));

export default router;
