import ENV from "../config.js";
import nodemailer from "nodemailer";
import mailgen from "mailgen";

// http://localhost:8000/api/registermail
let config = {
  // host: "smtp.ethereal.email",
  service: "gmail",
  // port: 587,
  // secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: ENV.Email,
    pass: ENV.Password,
  },
};

const transporter = nodemailer.createTransport(config);

//generate a mail
let mailgenerator = new mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

// Post request for signup email -  sending OTP to Gmail for mail verification
// http://localhost:8000/api/registermail
export async function registermail(req, res) {
  // let testAccount = await nodemailer.createTestAccount();
  const { username, email, text, subject } = req.body;

  // body of Email
  var mail = {
    body: {
      name: username,
      intro: text || "Welcome to cleanEase!",
      outro: `Your OTP is: ${req.app.locals.OTP}`,
    },
  };

  var emailBody = mailgenerator.generate(mail);

  let message = {
    from: ENV.Email,
    to: email,
    subject: subject || "OTP Verification",
    html: emailBody,
  };

  //send mail
  try {
    // Send mail
    let info = await transporter.sendMail(message);
    console.log("Email sent:", info.messageId); // Debug log
    res
      .status(201)
      .send({ msg: "You will receive an Email!", info: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error); // Error log
    res.status(500).send({ error: "Error sending email" });
  }
}
