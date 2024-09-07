import UserModel from "../models/userModel.js";
import EmployeeModel from "../models/employeeModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import ENV from "../config.js";
import nodemailer from "nodemailer";
import otpStore from "../middleware/auth.js";

//middlewere to find user while loging in
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    const exist = await UserModel.findOne({ username });
    if (!exist)
      return res.status(404).send({ error: `User ${username} not Exist` });
    next();
  } catch (error) {
    return res.status(500).send({ error: "Authentication Error" });
  }
}

// POST req to login
// http://localhost:8000/api/login
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({ error: "Password does not match" });
    }

    // Create JWT (JSON Web Token)
    const token = Jwt.sign(
      {
        username: user.username,
      },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).send({
      msg: "Login Successful!",
      username: user.username,
      token,
    });
  } catch (error) {
    console.error("Login error:", error); // Log the error for debugging
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

// To register new user
// http://localhost:8000/api/register
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

    //access OTP from middleware
    const otp = req.otp || otpStore.auth_otp;

    if (!otp) {
      return res.status(400).send({ error: "OTP is not generated" });
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
      html: `<b>Your OTP is <h1>${otp}</h1></b>`, //html body
    };

    // Send mail
    try {
      const info = await transporter.sendMail(message);

      return res.status(201).json({
        user: user.username,
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

// GET req to verifyOTP otp in user Obj
// http://localhost:8000/api/verifyOTP
export async function verifyOTP(req, res) {
  const { otp } = req.body;

  const storedOTP = otpStore.auth_otp;
  const receivedOtp = String(otp);

  if (!storedOTP) {
    return res.status(400).send({ error: "OTP not generated." });
  }

  //Comparing the OTP from req and stored variable in middleware
  if (storedOTP === receivedOtp) {
    //reset OTP value
    otpStore.auth_otp = null;
    req.app.locals.resetSession = true;
    console.log(req.app.locals.resetSession);

    return res.status(201).send({ msg: "OTP verified!" });
  }
  return res.status(400).send({ error: "Invalid OTP." });
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

// GET method for creating resetsession
// http://localhost:8000/api/createResetSession
export async function createResetSession(req, res, next) {
  console.log(req.app.locals.resetSession);
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; // this will create a reset session only once
    // return res.status(201).send({ msg: "Access granted" });
    next();
  } else {
    return res.status(440).send({ error: "Session expired!" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await UserModel.findOne({ username });
    console.log(user);
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

// http://localhost:8000/api/getbill
export async function getbill(req, res) {
  return res.status(201).send({ msg: "Get bill successfully!" });
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

// // GET req to generate otp in user Obj
// // http://localhost:8000/api/generateOTP
// export const generateOTP = async (req, res) => {
//   const { username } = req.query;
//   try {
//     const user = await UserModel.findOne({ username });
//     if (!user) return res.status(404).send({ error: "User not found" });

//     const otp = otpGenerator.generate(6, {
//       lowerCaseAlphabets: false,
//       upperCaseAlphabets: false,
//       specialChars: false,
//     });
//     req.app.locals.OTP = otp;

//     res.status(201).send({ code: otp });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// };

//EMPLOYEE APIs

export const addemployee = async (req, res) => {
  try {
    const newEmp = new EmployeeModel(req.body);
    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await EmployeeModel.find({});
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EmployeeModel.deleteOne({ id: parseInt(id, 10) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await EmployeeModel.findOneAndUpdate(
      { id: parseInt(id, 10) },
      req.body,
      {
        new: true,
      }
    );

    if (!result) return res.status(404).send("Employee not found");

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addrating = async (req, res) => {
  try {
    const { rating, reviewtext, username, empID } = req.body;

    // Find the employee by empID
    const employee = await EmployeeModel.findOne({ id: parseInt(empID, 10) });
    if (!employee) {
      return res.status(404).send("Employee not found!");
    }

    const userExist = await EmployeeModel.findOne({
      "review.name": username,
    });

    if (userExist) {
      return res.status(409).send("You have already provided your review");
    }

    // Calculate the new average
    const currentAvg = employee.rating.average;
    const currentCount = employee.rating.count;

    const newCount = currentCount + 1;
    const newAvg = (currentAvg * currentCount + rating) / newCount;

    // Create the new review object
    const newReview = {
      name: username,
      comments: reviewtext,
    };

    // Update the employee document with the new average, count, and review
    const result = await EmployeeModel.findOneAndUpdate(
      { id: parseInt(empID, 10) }, // Use empID here
      {
        $set: {
          "rating.average": newAvg,
          "rating.count": newCount,
        },
        $push: {
          review: newReview,
        },
      },
      { new: true } // This option returns the updated document
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating employee rating and review: ", error);
    res.status(500).send("Error updating employee rating and review");
  }
};
