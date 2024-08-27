import mongoose from "mongoose";

// Define the review schema
const reviewSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  comments: { type: String, default: "" },
});

const employeeSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Please provide image URL"],
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Please provide name"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Please provide category"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "Please provide city"],
    trim: true,
  },
  id: {
    type: Number,
    required: [true, "Please provide id"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide number"],
    min: 0,
  },
  rating: {
    average: {
      type: Number,
      required: [false, "Please provide number"],
      default: 0,
    },
    count: {
      type: Number,
      required: [false, "Please provide number"],
      default: 0,
    },
  },
  review: {
    type: [reviewSchema], // Array of review objects
    default: [], // Default is an empty array
  },
});

export default mongoose.model.employee ||
  mongoose.model("employee", employeeSchema);
