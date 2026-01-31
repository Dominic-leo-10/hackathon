const mongoose = require("mongoose");

const FamilySchema = new mongoose.Schema(
  {
    family_code: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Family", FamilySchema);
