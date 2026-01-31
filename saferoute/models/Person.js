const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema(
  {
    family_id: {
      type: String,
      required: true
    },

    current_shelter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter"
    },

    checked_in_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Person", PersonSchema);
