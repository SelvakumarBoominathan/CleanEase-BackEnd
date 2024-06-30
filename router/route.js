import { Router } from "express";
import bcrypt from "bcrypt";
import * as controller from "../controllers/appcontroller.js";

const router = Router();

// Create or POST method
router.route("/register").post(controller.register); // create a new user
router.route("/Login").post(controller.login); // Login to the app
router.route("/authEmail").post((req, res) => res.end()); // put OTP in the obj
// router.route("/otpvalidation").post((req, res) => res.json("OTP route"));
// router.route("/setpassword").post((req, res) => res.json("set password route"));

// Read or GET method
router.route("/user/:username").get(controller.getUser); // get the user details
router.route("/genOTP").get(controller.generateOTP); // to generate random OTP
router.route("/authUser").get(controller.verifyOTP); // verify generated OTP
router.route("/ResetSession").get(controller.createResetSession); // creating session for pass update

// Update or PATCH method
router.route("/resetPassword").put(controller.resetPassword); // reset password

// Deleta or DEL Method

// router.route("/Registerpage").delete((req, res) => res.json("register route"));

export default router;
