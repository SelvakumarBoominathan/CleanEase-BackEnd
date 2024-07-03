import { Router } from "express";
import bcrypt from "bcrypt";
import * as controller from "../controllers/appcontroller.js";
import { localVariables } from "../middleware/auth.js";

const router = Router();

// Create or POST method
router.route("/register").post(controller.register); // create a new user
router.route("/login").post(controller.verifyUser, controller.login); // Login to the app (first verify user exist in DB and then run login code).controller.verifyUser is a middleware
router.route("/authEmail").post((req, res) => res.end()); // put OTP in the obj
// router.route("/otpvalidation").post((req, res) => res.json("OTP route"));
// router.route("/setpassword").post((req, res) => res.json("set password route"));

// Read or GET method
router.route("/user/:username").get(controller.getUser); // get the user details

//First to verify user and then generate OTP. OTP variables will be generated using middleware
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariables, controller.generateOTP); // to generate random OTP
router.route("/verifyOTP").get(controller.verifyOTP); // verify generated OTP
router.route("/ResetSession").get(controller.createResetSession); // creating session for pass update

// Update or PATCH method
router
  .route("/resetPassword")
  .patch(controller.verifyUser, controller.resetPassword); // reset password

// Deleta or DEL Method

// router.route("/Registerpage").delete((req, res) => res.json("register route"));

export default router;
