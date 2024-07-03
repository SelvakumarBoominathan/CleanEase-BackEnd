import jwt from "jsonwebtoken";

export function localVariable(req, res, next) {
  //middleware to create variable when gen otp triggered
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
