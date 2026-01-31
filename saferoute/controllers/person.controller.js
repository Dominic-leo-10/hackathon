const Person = require("../models/Person");
const Shelter = require("../models/Shelter");

const checkInPerson = async (req, res) => {
  try {
    const { family_id, shelter_id } = req.body;

    const shelter = await Shelter.findById(shelter_id);
    if (!shelter) {
      return res.status(404).json({ success: false, message: "Shelter not found" });
    }

    if (shelter.capacity_current >= shelter.capacity_total) {
      return res.status(400).json({ success: false, message: "Shelter FULL" });
    }

    await Person.create({
      family_id,
      current_shelter_id: shelter._id
    });

    shelter.capacity_current += 1;

    if (shelter.capacity_current >= shelter.capacity_total) {
      shelter.status = "FULL";
    }

    shelter.last_reported_at = new Date();
    await shelter.save();

    res.status(201).json({
      success: true,
      current_occupancy: shelter.capacity_current,
      status: shelter.status
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Check-in failed" });
  }
};

module.exports = { checkInPerson };
