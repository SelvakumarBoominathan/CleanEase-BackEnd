export function localVariables(req, res, next) {
  //middleware to create variable when generate otp triggered
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
