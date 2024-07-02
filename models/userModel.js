import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  username: {
    type: String,
    required: [true, "Please provide a unique Username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a strong password"],
  },
});

// Export the model, ensuring it is not overwritten if it already exists
export default mongoose.models.user || mongoose.model("user", userSchema);
