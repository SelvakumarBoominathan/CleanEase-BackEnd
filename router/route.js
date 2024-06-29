import { Router } from "express";

const router = Router();

// Create or POST method
router.route("/Registerpage").post((req, res) => res.json("register route")); // create a new user
router.route("/Login").post((req, res) => res.json("Login route")); // Login to the app
router.route("/emailverification").post((req, res) => res.json("Email route"));
router.route("/otpvalidation").post((req, res) => res.json("OTP route"));
router.route("/setpassword").post((req, res) => res.json("set password route"));

// Read or GET method
router.route("/Registerpage").get((req, res) => res.json("register route"));
router.route("/Login").get((req, res) => res.json("Login route"));
router.route("/generateOTP").get((req, res) => res.json("Email route")); // to generate ramdon OTP
router.route("/VerifyOTP").get((req, res) => res.json("OTP route")); // verify generated OTP
router.route("/ResetSession").get((req, res) => res.json("set password route"));

// Update or PUT method
router.route("/resetPassword").put((req, res) => res.json("reset pass route")); // reset password

// Deleta or DEL Method

// router.route("/Registerpage").delete((req, res) => res.json("register route"));

export default router;
