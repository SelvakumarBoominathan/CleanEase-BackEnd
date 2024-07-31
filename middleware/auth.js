import otpGenerator from "otp-generator";
// import { generateOTP } from "../controllers/appcontroller";

// In-memory store for OTPs

// export function localVariables(req, res, next) {
//   //middleware to create variable when generate otp triggered
//   if (!req.app.locals.OTP) {
//     req.app.locals = {
//       OTP: null,
//       resetSession: false,
//     };
//   }
//   next();
// }

export async function localVariables(req, res, next) {
  const otpStore = { auth_otp: null };

  try {
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Store OTP in memory
    otpStore[auth_otp] = otp;

    req.otp = otp;
    next();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
