// frontend/src/services/api.js
import axios from "axios";
// Prefer Vite env var, fallback to server default port 7000
const API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:7000/api";

// Asteroid data endpoints
export const getAsteroids = async (page = 0) => {
  const res = await axios.get(`${API_URL}/asteroids?page=${page}`);
  return res.data;
};

export const getAsteroidDetails = async (id) => {
  const res = await axios.get(`${API_URL}/asteroids/${id}`);
  return res.data;
};

export const simulateImpact = async (
  asteroidId = null,
  diameter,
  velocity,
  velocityChange = 0,
  lat,
  lon
) => {
  try {
    const body = { diameter, velocity, velocityChange, lat, lon };
    if (asteroidId) body.asteroidId = asteroidId;
    const res = await axios.post(`${API_URL}/asteroids/simulate-impact`, body);
    return res.data;
  } catch (error) {
    console.log("simulation", error);
  }
};

// USGS data endpoints
export const getSeismicData = async () => {
  const res = await axios.get(`${API_URL}/usgs/seismic`);
  return res.data;
};

export const getTsunamiZones = async () => {
  const res = await axios.get(`${API_URL}/usgs/tsunami-zones`);
  return res.data;
};

export const getTopographyData = async (lat, lng, radius = 100) => {
  const res = await axios.get(
    `${API_URL}/usgs/topography?lat=${lat}&lng=${lng}&radius=${radius}`
  );
  return res.data;
};

export const getGeologicalData = async (lat, lng) => {
  const res = await axios.get(
    `${API_URL}/usgs/geological?lat=${lat}&lng=${lng}`
  );
  return res.data;
};

export const getAtmosphericData = async (lat, lng, altitude = 0) => {
  const res = await axios.get(
    `${API_URL}/usgs/atmospheric?lat=${lat}&lng=${lng}&altitude=${altitude}`
  );
  return res.data;
};

export const calculateImpactEffects = async (lat, lng, energy, diameter) => {
  const res = await axios.post(`${API_URL}/usgs/impact-effects`, {
    lat,
    lng,
    energy,
    diameter,
  });
  return res.data;
};

// Mitigation strategy endpoints
export const runKineticImpactor = async (parameters) => {
  const res = await axios.post(
    `${API_URL}/mitigation/kinetic-impactor`,
    parameters
  );
  console.log(res.data);
  return res.data;
};

export const runGravityTractor = async (parameters) => {
  const res = await axios.post(
    `${API_URL}/mitigation/gravity-tractor`,
    parameters
  );
  return res.data;
};

export const runLaserAblation = async (parameters) => {
  const res = await axios.post(
    `${API_URL}/mitigation/laser-ablation`,
    parameters
  );
  return res.data;
};

export const runNuclearDeflection = async (parameters) => {
  const res = await axios.post(
    `${API_URL}/mitigation/nuclear-deflection`,
    parameters
  );
  return res.data;
};

export const compareMitigationStrategies = async (parameters) => {
  const res = await axios.post(`${API_URL}/mitigation/compare`, parameters);
  return res.data;
};

// Health check
export const checkHealth = async () => {
  const res = await axios.get(`${API_URL}/health`);
  return res.data;
};
