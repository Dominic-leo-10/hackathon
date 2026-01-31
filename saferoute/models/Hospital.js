const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: { type: String, required: true },

    totalBeds: { type: Number, required: true },
    availableBeds: { type: Number, required: true },

    icuTotal: { type: Number, required: true },
    icuAvailable: { type: Number, required: true },

    oxygenAvailable: { type: Boolean, default: true },

    ambulances: { type: Number, default: 0 },

    criticalPatients: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", HospitalSchema);
