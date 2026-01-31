const mongoose = require("mongoose");

const ShelterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    location: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },

    capacity_total: {
      type: Number,
      required: true
    },

    capacity_current: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["OPEN", "FULL", "CLOSED"],
      default: "OPEN"
    },

    supplies: {
      food: Boolean,
      water: Boolean,
      medical: Boolean
    },

    connectivity_status: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      default: "ONLINE"
    },

    last_reported_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shelter", ShelterSchema);
