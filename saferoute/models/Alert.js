const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["SHELTER", "MEDICAL", "CONNECTIVITY", "DISASTER"],
      required: true
    },

    level: {
      type: String,
      enum: ["INFO", "WARNING", "CRITICAL"],
      required: true
    },

    message: {
      type: String,
      required: true
    },

    shelter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter",
      default: null
    },

    // ✅ NEW (recommended)
    isActive: {
      type: Boolean,
      default: true
    },

    source: {
      type: String,
      enum: ["SYSTEM", "ADMIN", "AUTO"],
      default: "AUTO"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", AlertSchema);
