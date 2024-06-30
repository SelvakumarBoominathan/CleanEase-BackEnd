// POST request to create new user
//   "firstname": "Selvakumar",
//   "lastname": "B",
//   "email": "selvans2k@gmail.com",
//   "password": "1111",
//   "confirmpassword": "1111",
//    http://localhost:8000/api/register

// file to update the user inputs
export async function register(req, res) {
  res.json("Register a new user");
}

// POST req to login {name: 'selva22', pass: '11111'}
// http://localhost:8000/api/login
export async function login(req, res) {
  res.json("User LOGIN");
}

// GET req to login {name: 'selva22', pass: '11111'}
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

// GEt method for creating session
export async function createResetSession(req, res) {
  res.json("Creating session for password update");
}

// PATCH req to update the password
// {newpassword: '111111111s$S', reenterpassword: '111111111s$S'}
// http://localhost:8000/api/updatepassword
export async function resetPassword(req, res) {
  res.json("Password has been updated");
}
