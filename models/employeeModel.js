import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, "Please provide image URL"],
  },
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  category: {
    type: String,
    required: [true, "Please provide category"],
  },
  city: {
    type: String,
    required: [true, "Please provide city"],
  },
  id: {
    type: Number,
    required: [true, "Please provide id"],
  },
  price: {
    type: Number,
    required: [true, "Please provide number"],
  },
});

export default mongoose.model.employee ||
  mongoose.model("employee", employeeSchema);
