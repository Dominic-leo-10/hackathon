const Shelter = require("../models/Shelter");

/**
 * ================================
 * GOVERNMENT CONTROLLERS
 * ================================
 */

/**
 * 1️⃣ Get all shelters (Table view)
 * Used by: Government dashboard table
 */
const getAllShelters = async (req, res) => {
  try {
    const shelters = await Shelter.find();

    res.json({
      success: true,
      data: shelters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch shelters"
    });
  }
};

/**
 * 2️⃣ Dashboard summary stats
 * Used by: Top cards (total shelters, capacity, etc.)
 */
const getDashboardStats = async (req, res) => {
  try {
    const shelters = await Shelter.find();

    const totalShelters = shelters.length;
    const fullShelters = shelters.filter(
      s => s.status === "FULL"
    ).length;

    const totalCapacity = shelters.reduce(
      (sum, s) => sum + s.capacity_total,
      0
    );

    const usedCapacity = shelters.reduce(
      (sum, s) => sum + s.capacity_current,
      0
    );

    res.json({
      success: true,
      stats: {
        totalShelters,
        fullShelters,
        usedCapacity,
        availableCapacity: totalCapacity - usedCapacity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats"
    });
  }
};

/**
 * 3️⃣ Map data (FRONTEND COMPATIBLE)
 * Used by: Disaster map + shelter detail panel
 */
const getSheltersForMap = async (req, res) => {
  try {
    const shelters = await Shelter.find();

    const mapData = shelters.map(s => ({
      id: s._id.toString(),
      name: s.name,

      // Coordinates
      latitude: s.location.latitude,
      longitude: s.location.longitude,

      // Status & capacity (EXPECTED BY FRONTEND)
      status: s.status,
      maxCapacity: s.capacity_total,
      availableSpace: s.capacity_total - s.capacity_current,

      // Extra fields expected by UI (safe defaults)
      area: s.area ?? null,
      floors: s.floors ?? null,
      address: s.address ?? "Not specified",
      type: s.type ?? "GENERAL",
      womenChildFriendly: s.womenChildFriendly ?? false,

      // Connectivity
      connectivity_status: s.connectivity_status
    }));

    res.json({
      success: true,
      data: mapData
    });
  } catch (error) {
    console.error("Map API error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load map data"
    });
  }
};

module.exports = {
  getAllShelters,
  getDashboardStats,
  getSheltersForMap
};
