import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

//middlewere to find user while loging in
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    const exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "User not Exist" });
    next();
  } catch (error) {
    return res.status(500).send({ error: "Authentication Error" });
  }
}

export async function register(req, res) {
  try {
    const { name, username, email, password } = req.body;

    // Check if username and email exist
    const [usernameCheck, emailCheck] = await Promise.all([
      UserModel.findOne({ username }).exec(),
      UserModel.findOne({ email }).exec(),
    ]);

    if (usernameCheck) {
      return res.status(400).send({ error: "username already exists" });
    }

    if (emailCheck) {
      return res.status(400).send({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new UserModel({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(200).send({ msg: "User registered successfully." });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

// // Post request for signup email -  sending OTP to Gmail for mail verification
// // http://localhost:8000/api/registermail
export async function registermail(req, res) {
  // let testAccount = await nodemailer.createTestAccount();
  const { email } = req.body;

  try {
    // Verify if email exists in the database
    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      return res.status(404).send({ error: "Email not found" });
    }

    //Email configuration
    let config = {
      service: "gmail",
      auth: {
        //using Email and password from .env file(config.js)
        user: ENV.Email,
        pass: ENV.Password,
      },
    };

    const transporter = nodemailer.createTransport(config);

    // Object to send mail
    let message = {
      from: "'CleanEase' <`${ENV.Email}`>", // sender address
      to: email, // list of receivers
      subject: "OTP Verification", // Subject line
      html: `<b>Your OTP is <h1>${req.app.locals.OTP}</h1>!</b>`, // html body
    };

    transporter
      .sendMail(message)
      .then((info) => {
        return res.status(201).json({
          msg: "Mail Sent Successfully!",
          info: info.messageId,
          preview: nodemailer.getTestMessageUrl(info),
        });
      })
      .catch((error) => {
        return res.status(500).json({ error });
      });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

// http://localhost:8000/api/getbill
export async function getbill(req, res) {
  return res.status(201).send({ msg: "Get bill successfully!" });
}

// POST req to login
// http://localhost:8000/api/login
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Dont have Password" });
            //Create JWT (JSON Web Token)
            const token = Jwt.sign(
              {
                username: user.username,
                // userID : user.userID,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );
            return res.status(200).send({
              msg: "Login Successful..!",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: " username not found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

// GET req to login
// http://localhost:8000/api/user/:username
export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) return res.status(400).send({ error: "Invalid username!" });

    const user = await UserModel.findOne({ username });

    if (!user) return res.status(404).send({ error: "user not found" });

    // Remove password from the user  (converting it to JSON to omit unnecessay data from mongoose)
    const { password, ...rest } = Object.assign({}, user.toJSON());
    return res.status(200).send(rest);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

// GET req to generate otp in user Obj
// http://localhost:8000/api/generateOTP
export async function generateOTP(req, res) {
  //otp-generator will generate 6 dig OTP without upper, lowercase and special chars (only numbers)
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

// GET req to verifyOTP otp in user Obj
// http://localhost:8000/api/verifyOTP
export async function verifyOTP(req, res) {
  const { code } = req.query;

  //Comparing the OTP from req and stored variable in middleware
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    //resettingthe OTP and session values in the middleware
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "OTP verified!" });
  }
  return res.status(400).send({ error: "Invalid OTP." });
}

// GET method for creating resetsession
// http://localhost:8000/api/createResetSession
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; // this will create a reset session only once
    return res.status(201).send({ msg: "Access granted" });
  }
  return res.status(440).send({ error: "Session expired!" });
}

export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session expired!" });
    }

    const { username, password } = req.body;

    // Find user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "username not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );

    return res.status(200).send({ msg: "Password updated successfully!" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}
