import mongoose from "mongoose";

const checkListSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
  },
  checkPoints: {
    type: [String],
    default: [],
  },
  additionalCheckpoints: {
    type: [String],
    default: [],
  },
});

// Pre-save middleware to set default checkPoints based on the service
checkListSchema.pre("save", function (next) {
  if (this.isNew) {
    switch (this.service) {
      case "House Cleaner":
        this.checkPoints = ["Sweep floors", "Mop floors", "Clean bathroom"];
        break;
      case "Gardener":
        this.checkPoints = ["Watering plants", "Cleaning garden"];
        break;
      case "Car Cleaner":
        this.checkPoints = ["Clean Carbody", "Clean Tyres", "Clean bannet"];
        break;
      case "Kitchen Cleaner":
        this.checkPoints = ["Cleaning Kitchen", "Pack ration items"];
        break;
      case "Electrition":
        this.checkPoints = ["Wiring check", "Wiring Repair"];
        break;
      case "Plumber":
        this.checkPoints = ["Plumbing work", "Check waterflow"];
        break;
      case "AC service":
        this.checkPoints = ["Cleaning fines", "Gas Check", "Wiring check"];
        break;
      case "Vessel Washer":
        this.checkPoints = [
          "Washing vessels",
          "Using detergent",
          "Cleaining sink",
        ];
        break;
      default:
        this.checkPoints = [];
        break;
    }
  }
  next();
});

export default mongoose.models.checklist ||
  mongoose.model("checklist", checkListSchema);
