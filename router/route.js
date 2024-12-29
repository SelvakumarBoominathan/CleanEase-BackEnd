import { Router } from "express";
import * as controller from "../controllers/appcontroller.js";
// import * as mailer from "../controllers/mailer.js";
import { localVariables } from "../middleware/auth.js";
// import otpStore from "../middleware/auth.js";

const router = Router();

// Create or POST method
router.route("/login").post(controller.verifyUser, controller.login); // Login to the app (first verify user exist in DB and then run login code).controller.verifyUser is a middleware
router.route("/register").post(controller.register); // create a new user
router.route("/registermail").post(localVariables, controller.registermail); // sending OTP to email
router.route("/otpvalidation").post(controller.verifyOTP);

// Update or PATCH method
router.route("/resetPassword").patch(
  // controller.verifyUser,
  controller.createResetSession,
  controller.resetPassword
); // reset password

router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) => res.end()); //authenticate user (from client)

router.route("/getbill").post(controller.getbill); // sample

// router.route("/setpassword").post((req, res) => res.json("set password route"));

// Read or GET method
router.route("/user/:username").get(controller.getUser); // get the user details

//First to verify user and then generate OTP. OTP variables will be generated using middleware
// router
// .route("/generateOTP")
// .get(controller.verifyUser, localVariables, controller.generateOTP); // to generate random OTP
// router.route("/verifyOTP").get(controller.verifyOTP); // verify generated OTP
router.route("/ResetSession").get(controller.createResetSession); // creating session for pass update

// Deleta or DEL Method

// router.route("/Registerpage").delete((req, res) => res.json("register route"));

// APIs for EMPLOYEES
router.route("/addemployee").post(controller.addemployee);
router.route("/employees").get(controller.getEmployees);
router.route("/deleteEmployee/:id").delete(controller.deleteEmployee);
router.route("/updateEmployee/:id").put(controller.updateEmployee);
router.route("/employees/:id").get(controller.getSingleEmployee);
//APIs for Review and Rating
router.route("/rating").post(controller.addrating);
router.route("/booking").post(controller.addBooking);
router.route("/Cartpage").get(controller.getbookings);
router.route("/removeBooking").delete(controller.removeBooking);
export default router;
