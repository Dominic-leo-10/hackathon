const Shelter = require("../models/Shelter");
const Hospital = require("../models/Hospital");

exports.getMapData = async (req, res) => {
  console.log("✅ /api/dashboard/map called");

  const shelters = await Shelter.find();
  res.json({ data: shelters });
};

exports.getDashboardStats = async (req, res) => {
  console.log("✅ /api/dashboard/stats called");

  const shelters = await Shelter.find();

  let totalCapacity = 0;
  let usedCapacity = 0;

  shelters.forEach(s => {
    totalCapacity += s.capacity_total;
    usedCapacity += s.capacity_current;
  });

  res.json({
    stats: {
      totalShelters: shelters.length,
      totalCapacity,
      usedCapacity,
      availableCapacity: totalCapacity - usedCapacity,
    },
  });
};
