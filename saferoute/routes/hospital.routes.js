const express = require("express");
const router = express.Router();
const controller = require("../controllers/hospital.controller");

router.get("/", controller.getHospitals);
router.get("/stats", controller.getHospitalStats);

module.exports = router;
