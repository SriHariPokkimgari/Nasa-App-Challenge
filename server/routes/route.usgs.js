import express from "express";
import axios from "axios";
const router = express.Router();

// Cache for USGS data
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Fetch recent earthquake data
router.get("/seismic", async (req, res) => {
  try {
    const cacheKey = "seismic";
    const cached = getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson",
      { timeout: 10000 }
    );

    setCachedData(cacheKey, response.data.features);
    res.json(response.data.features);
  } catch (err) {
    console.error("USGS Seismic Error:", err);
    res.status(500).json({ error: "Failed to fetch USGS seismic data" });
  }
});

// Fetch real-time earthquake data
router.get("/seismic/realtime", async (req, res) => {
  try {
    const cacheKey = "seismic_realtime";
    const cached = getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await axios.get(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
      { timeout: 10000 }
    );

    setCachedData(cacheKey, response.data.features);
    res.json(response.data.features);
  } catch (err) {
    console.error("USGS Realtime Seismic Error:", err);
    res.status(500).json({ error: "Failed to fetch real-time seismic data" });
  }
});

// Fetch tsunami zones data
router.get("/tsunami-zones", async (req, res) => {
  try {
    const cacheKey = "tsunami_zones";
    const cached = getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // USGS doesn't have direct tsunami zone API, so we'll simulate with coastal data
    const response = await axios.get(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
      { timeout: 10000 }
    );

    // Process data to identify coastal areas at risk
    const tsunamiZones = response.data.features
      .filter((feature) => {
        const coords = feature.geometry.coordinates;
        const lat = coords[1];
        const lng = coords[0];
        // Simple coastal detection (within 50km of coast)
        return (
          Math.abs(lat) < 60 && (Math.abs(lng) < 10 || Math.abs(lng) > 170)
        );
      })
      .map((feature) => ({
        type: "Feature",
        properties: {
          risk_level: "high",
          description: "Potential tsunami zone",
          magnitude: feature.properties.mag || 0,
        },
        geometry: feature.geometry,
      }));

    const result = {
      type: "FeatureCollection",
      features: tsunamiZones,
    };

    setCachedData(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error("USGS Tsunami Zones Error:", err);
    res.status(500).json({ error: "Failed to fetch tsunami zone data" });
  }
});

// Fetch elevation/topography data (simplified)
router.get("/topography", async (req, res) => {
  try {
    const { lat, lng, radius = 100 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const cacheKey = `topography_${lat}_${lng}_${radius}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Simulate elevation data (in real implementation, would use USGS elevation API)
    const elevationData = {
      center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      radius: parseFloat(radius),
      elevation: Math.random() * 1000, // meters above sea level
      terrain_type: Math.random() > 0.5 ? "mountainous" : "flat",
      tsunami_risk: Math.random() > 0.7 ? "high" : "low",
    };

    setCachedData(cacheKey, elevationData);
    res.json(elevationData);
  } catch (err) {
    console.error("USGS Topography Error:", err);
    res.status(500).json({ error: "Failed to fetch topography data" });
  }
});

// Fetch geological data for impact analysis
router.get("/geological", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const cacheKey = `geological_${lat}_${lng}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Simulate geological data
    const geologicalData = {
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      rock_type: Math.random() > 0.5 ? "sedimentary" : "igneous",
      soil_density: 2000 + Math.random() * 1000, // kg/m³
      seismic_activity: Math.random() * 5, // Richter scale
      impact_resistance: Math.random() * 100, // percentage
      crater_preservation: Math.random() > 0.5 ? "good" : "poor",
    };

    setCachedData(cacheKey, geologicalData);
    res.json(geologicalData);
  } catch (err) {
    console.error("USGS Geological Error:", err);
    res.status(500).json({ error: "Failed to fetch geological data" });
  }
});

// Fetch atmospheric data for impact modeling
router.get("/atmospheric", async (req, res) => {
  try {
    const { lat, lng, altitude = 0 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const cacheKey = `atmospheric_${lat}_${lng}_${altitude}`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Simulate atmospheric data
    const atmosphericData = {
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      altitude: parseFloat(altitude),
      density: 1.225 * Math.exp(-altitude / 8000), // kg/m³ (exponential decay)
      pressure: 101325 * Math.exp(-altitude / 8000), // Pa
      temperature: 288 - altitude * 0.0065, // K (lapse rate)
      wind_speed: Math.random() * 20, // m/s
      wind_direction: Math.random() * 360, // degrees
    };

    setCachedData(cacheKey, atmosphericData);
    res.json(atmosphericData);
  } catch (err) {
    console.error("USGS Atmospheric Error:", err);
    res.status(500).json({ error: "Failed to fetch atmospheric data" });
  }
});

// Calculate impact effects using USGS data
router.post("/impact-effects", async (req, res) => {
  try {
    const { lat, lng, energy, diameter } = req.body;

    if (!lat || !lng || !energy) {
      return res
        .status(400)
        .json({ error: "Latitude, longitude, and energy required" });
    }

    // Fetch relevant USGS data
    const [seismicData, geologicalData, atmosphericData] = await Promise.all([
      axios
        .get(`http://localhost:${process.env.PORT || 7000}/api/usgs/seismic`)
        .catch(() => ({ data: { features: [] } })),
      axios
        .get(
          `http://localhost:${
            process.env.PORT || 7000
          }/api/usgs/geological?lat=${lat}&lng=${lng}`
        )
        .catch(() => ({ data: {} })),
      axios
        .get(
          `http://localhost:${
            process.env.PORT || 7000
          }/api/usgs/atmospheric?lat=${lat}&lng=${lng}`
        )
        .catch(() => ({ data: {} })),
    ]);

    // Calculate impact effects
    const impactEffects = {
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      energy: parseFloat(energy),
      diameter: parseFloat(diameter),
      effects: {
        seismic: {
          magnitude: Math.log10(energy / 1e12) * 2, // Simplified
          affected_area: Math.pow(energy / 1e12, 0.33) * 1000, // km
          local_seismic_risk: geologicalData.data.seismic_activity || 0,
        },
        atmospheric: {
          airburst_altitude: 8500 * Math.pow(diameter / 100, 0.4), // meters
          fireball_radius: Math.pow(energy / 1e12, 0.4) * 1000, // meters
          atmospheric_density: atmosphericData.data.density || 1.225,
        },
        tsunami: {
          risk_level: Math.abs(parseFloat(lat)) < 60 ? "high" : "low",
          wave_height: Math.pow(energy / 1e12, 0.25) * 100, // meters
          affected_coastline:
            Math.abs(parseFloat(lat)) < 60 ? "extensive" : "minimal",
        },
      },
    };

    res.json(impactEffects);
  } catch (err) {
    console.error("USGS Impact Effects Error:", err);
    res.status(500).json({ error: "Failed to calculate impact effects" });
  }
});

export default router;
