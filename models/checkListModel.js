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
      this.setDefaultCheckPoints();
    }
    next();
  });

  // Method to set default checkPoints
  checkListSchema.methods.setDefaultCheckPoints = function () {
    switch (this.service) {
      case "House Cleaner":
        this.checkPoints = ["Sweep floors", "Mop floors", "Clean bathroom"];
        break;
      case "Gardener":
        this.checkPoints = ["Watering plants", "Cleaning garden"];
        break;
      case "Car Cleaner":
        this.checkPoints = ["Clean Carbody", "Clean Tyres", "Clean bonnet"];
        break;
      case "Kitchen Cleaner":
        this.checkPoints = ["Cleaning Kitchen", "Pack ration items"];
        break;
      case "Electrician":
        this.checkPoints = ["Wiring check", "Wiring Repair"];
        break;
      case "Plumber":
        this.checkPoints = ["Plumbing work", "Check water flow"];
        break;
      case "AC service":
        this.checkPoints = ["Cleaning fins", "Gas Check", "Wiring check"];
        break;
      case "Vessel Washer":
        this.checkPoints = [
          "Washing vessels",
          "Using detergent",
          "Cleaning sink",
        ];
        break;
      default:
        this.checkPoints = [];
        break;
    }
  };

  export default mongoose.models.checklist ||
    mongoose.model("checklist", checkListSchema);
