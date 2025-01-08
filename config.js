import dotenv from "dotenv";
dotenv.config();

export default {
  JWT_SECRET: process.env.JWT_SECRET,
  name: {},
  Email: process.env.EMAIL,
  Password: process.env.PASSWORD,
  ATLAS_URI:
    "mongodb+srv://admin:admin123@cluster-cleanease-be-fi.qir72.mongodb.net/",
};
// console.log("JWT_SECRET:", process.env.JWT_SECRET);
