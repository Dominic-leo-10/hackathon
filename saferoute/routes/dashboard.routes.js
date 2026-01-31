const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboard.controller");

router.get("/map", controller.getMapData);
router.get("/stats", controller.getDashboardStats);

module.exports = router;
