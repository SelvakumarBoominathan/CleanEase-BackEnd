// import { Schema } from "mongoose";
import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    unique: [true, "userName Exist"],
  },
  userName: {
    type: String,
    required: [true, "Please provide a unique Username"],
    unique: [false],
  },
  email: {
    type: String,
    required: [true, "Please provide your Email"],
    unique: [false],
  },
  password: {
    type: String,
    required: [true, "Please provide a strong password"],
    unique: [false],
  },
});

export default mongoose.model.Users || mongoose.model("User", userSchema);
