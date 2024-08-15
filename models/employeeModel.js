import mongoose from "mongoose";

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
});

export default mongoose.model.employee ||
  mongoose.model("employee", employeeSchema);
