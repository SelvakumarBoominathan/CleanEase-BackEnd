import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  employeeName: String,
  employeeImage: String,
  city: String,
  date: Date,
  time: String,
  bookedBy: String,
});

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
  bookings: {
    type: [bookingSchema],
    default: [],
  },
});

// Export the model, ensuring it is not overwritten if it already exists
export default mongoose.models.user || mongoose.model("user", userSchema);
