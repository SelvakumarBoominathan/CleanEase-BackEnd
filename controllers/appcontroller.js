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

// export async function register(req, res) {
//   try {
//     const { name, username, email, password } = req.body;
//     console.log(name, username, email, password);

//     // Check if username and email exist
//     const [usernameCheck, emailCheck] = await Promise.all([
//       UserModel.findOne({ username }).exec(),
//       UserModel.findOne({ email }).exec(),
//     ]);

//     if (usernameCheck) {
//       return res.status(400).send({ error: "username already exists" });
//     }

//     if (emailCheck) {
//       return res.status(400).send({ error: "Email already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save the new user
//     const newUser = new UserModel({
//       name,
//       username,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     return res.status(200).send({ msg: "User registered successfully." });
//   } catch (error) {
//     return res.status(500).send({ error: error.message });
//   }
// }

export async function register(req, res) {
  try {
    const { name, username, email, password } = req.body;

    // Check if username or email exists
    const [usernameCheck, emailCheck] = await Promise.all([
      UserModel.findOne({ username }).exec(),
      UserModel.findOne({ email }).exec(),
    ]);

    if (usernameCheck) {
      return res.status(400).send({ error: "Username already exists" });
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

    return res.status(201).send({ msg: "User registered successfully." });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

// GET req to generate otp in user Obj
// http://localhost:8000/api/generateOTP
// Generate OTP
export const generateOTP = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).send({ error: "User not found" });

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    req.app.locals.OTP = otp;

    res.status(201).send({ code: otp });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Post request for signup email -  sending OTP to Gmail for mail verification
// http://localhost:8000/api/registermail
export const registermail = async (req, res) => {
  const { email } = req.body;

  try {
    // Verify if email exists in the database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "Email not found" });
    }

    // Email configuration
    const config = {
      service: "gmail",
      auth: {
        user: ENV.Email,
        pass: ENV.Password,
      },
    };

    const transporter = nodemailer.createTransport(config);

    // Object to send mail
    const message = {
      from: `"CleanEase" <${ENV.Email}>`, // sender address
      to: email, // list of receivers
      subject: "OTP Verification", // Subject line
      html: `<b>Your OTP is <h1>${req.app.locals.OTP}</h1>!</b>`, // html body
    };

    // Send mail

    try {
      const info = await transporter.sendMail(message);
      return res.status(201).json({
        msg: "Mail Sent Successfully!",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

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

// export async function login(req, res) {
//   const { username, password } = req.body;

//   try {
//     const user = await UserModel.findOne({ username });

//     if (!user) {
//       return res.status(404).send({ error: "Username not found" });
//     }

//     const passwordCheck = await bcrypt.compare(password, user.password);

//     if (!passwordCheck) {
//       return res.status(400).send({ error: "Incorrect password" });
//     }

//     // Debugging: Check if JWT_SECRET is defined
//     console.log("JWT_SECRET:", ENV.JWT_SECRET);

//     // Ensure JWT_SECRET is not undefined
//     if (!ENV.JWT_SECRET) {
//       return res
//         .status(500)
//         .send({ error: "Internal server error. JWT secret is missing." });
//     }

//     // Create JWT
//     const token = Jwt.sign(
//       {
//         username: user.username,
//       },
//       ENV.JWT_SECRET,
//       { expiresIn: "24h" }
//     );

//     return res.status(200).send({
//       msg: "Login Successful!",
//       username: user.username,
//       token,
//     });
//   } catch (error) {
//     return res.status(500).send({ error: error.message });
//   }
// }

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
