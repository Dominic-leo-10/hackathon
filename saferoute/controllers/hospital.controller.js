const Hospital = require("../models/Hospital");

exports.getHospitals = async (req, res) => {
  console.log("✅ /api/hospitals called");

  const hospitals = await Hospital.find();
  res.json({ data: hospitals });
};

exports.getHospitalStats = async (req, res) => {
  console.log("✅ /api/hospitals/stats called");

  const hospitals = await Hospital.find();

  let totalBeds = 0;
  let availableBeds = 0;
  let icuTotal = 0;
  let icuAvailable = 0;
  let criticalPatients = 0;
  let ambulances = 0;

  hospitals.forEach(h => {
    totalBeds += h.totalBeds;
    availableBeds += h.availableBeds;
    icuTotal += h.icuTotal;
    icuAvailable += h.icuAvailable;
    criticalPatients += h.criticalPatients;
    ambulances += h.ambulances;
  });

  res.json({
    stats: {
      totalHospitals: hospitals.length,
      totalBeds,
      availableBeds,
      icuTotal,
      icuAvailable,
      criticalPatients,
      ambulances,
    },
  });
};
