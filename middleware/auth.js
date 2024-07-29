export function localVariables(req, res, next) {
  //middleware to create variable when generate otp triggered
  if (!req.app.locals.OTP) {
    req.app.locals = {
      OTP: null,
      resetSession: false,
    };
  }
  next();
}
