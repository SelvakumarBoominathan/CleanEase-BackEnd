import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  city: {
    type: String,
  },
  id: {
    type: Number,
  },
  price: {
    type: Number,
  },
});

export default mongoose.model.employee ||
  mongoose.model("employee", employeeSchema);
