// backend/routes/asteroid.js
import express from "express";
const router = express.Router();
import { fetchNeoBrowse, fetchNeoById } from "../services/neoServices.js";
import {
  calculateCraterDiameter,
  calculateImpactEnergy,
  calculateMass,
  calculateTNTEquivalent,
  calculateSeismicMagnitude,
  calculateTsunamiHeight,
  calculateAtmosphericEntryEffects,
  calculateEnvironmentalEffects,
  calculateRiskScore,
} from "../utils/calculations.js";

// GET /api/asteroids?page=0
router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 0;
    const data = await fetchNeoBrowse(page);
    res.json(data?.near_earth_objects);
  } catch (err) {
    console.error(err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to fetch asteroid list" });
  }
});

// GET /api/asteroids/:id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fetchNeoById(id);
    // return a trimmed helpful payload
    const trimmed = {
      id: data.id,
      name: data.name,
      nasa_jpl_url: data.nasa_jpl_url,
      is_potentially_hazardous_asteroid: data.is_potentially_hazardous_asteroid,
      estimated_diameter_kilo: data.estimated_diameter.kilometers,
      orbital_data: data.orbital_data,
      close_approach_data: data.close_approach_data,
    };
    res.json(trimmed);
  } catch (err) {
    console.error(err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to fetch asteroid details" });
  }
});

// POST /api/asteroids/simulate-impact
// body: { asteroidId?, diameter?, velocity?, velocityChange? }
router.post("/simulate-impact", async (req, res) => {
  try {
    let {
      asteroidId,
      diameter,
      velocity,
      velocityChange = 0,
      lat,
      lon,
    } = req.body;

    if (asteroidId && (!diameter || !velocity)) {
      // if user provided asteroidId but not diameter/velocity, pull defaults
      const neo = await fetchNeoById(asteroidId);
      // diameter: average of min & max in meters (if available)
      if (!diameter && neo.estimated_diameter?.meters) {
        const ed = neo.estimated_diameter.meters;
        diameter = (ed.estimated_diameter_min + ed.estimated_diameter_max) / 2;
      }
      // velocity: use first close approach relative_velocity (km/s) if available
      if (!velocity && neo.close_approach_data?.length) {
        const rel =
          neo.close_approach_data[0].relative_velocity?.kilometers_per_second;
        velocity = parseFloat(rel) || velocity;
      }
    }

    if (!diameter || !velocity) {
      return res.status(400).json({
        error: "Missing diameter or velocity (or invalid asteroidId)",
      });
    }

    const adjustedVelocity = parseFloat(velocity) + parseFloat(velocityChange);
    const mass = calculateMass(diameter);
    const energy = calculateImpactEnergy(mass, adjustedVelocity);
    const crater = calculateCraterDiameter(energy);
    const tntEquivalent = calculateTNTEquivalent(energy);
    const seismicMagnitude = calculateSeismicMagnitude(energy);
    const atmosphericEffects = calculateAtmosphericEntryEffects(
      diameter,
      adjustedVelocity
    );

    // Environmental effects (simplified location)
    const impactLocation = {
      lat: lat,
      lng: lon,
      isCoastal: Math.random() > 0.5,
    };
    const environmentalEffects = calculateEnvironmentalEffects(
      energy,
      impactLocation
    );

    // Tsunami height calculation
    const tsunamiHeight = calculateTsunamiHeight(energy, 0); // 0 km from coast

    // Risk assessment
    const riskAssessment = calculateRiskScore(
      { diameter, velocity: adjustedVelocity },
      Math.random() * 0.1, // Random impact probability
      365 // 1 year to impact
    );

    // deterministic approximate "impact point shift" for demo (simple)
    const impactShiftLat = velocityChange * 2;
    const impactShiftLng = velocityChange * 2;

    res.json({
      asteroidId: asteroidId || null,
      diameter,
      originalVelocity: parseFloat(velocity),
      adjustedVelocity,
      mass,
      energy,
      crater,
      impactShiftLat,
      impactShiftLng,
      // Enhanced impact analysis
      tntEquivalent,
      seismicMagnitude,
      tsunamiHeight,
      atmosphericEffects,
      environmentalEffects,
      riskAssessment,
      impactLocation,
    });
  } catch (err) {
    console.error(err?.response?.data || err.message || err);
    res.status(500).json({ error: "Simulation failed" });
  }
});

export default router;
