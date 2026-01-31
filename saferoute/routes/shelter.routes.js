const express = require("express");
const router = express.Router();

const {
  getAllShelters,
  getDashboardStats,
  getSheltersForMap
} = require("../controllers/shelter.controller");

const { checkInPerson } = require("../controllers/person.controller");

router.get("/shelters", getAllShelters);
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/map", getSheltersForMap);
router.post("/check-in", checkInPerson);

module.exports = router;
