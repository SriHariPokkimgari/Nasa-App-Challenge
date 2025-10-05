// backend/services/neoService.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const NASA_API_KEY = process.env.NASA_API_KEY;
const BASE = "https://api.nasa.gov/neo/rest/v1";
const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 minutes

function setCache(key, value) {
  cache.set(key, { value, ts: Date.now() });
}
function getCache(key) {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > TTL) {
    cache.delete(key);
    return null;
  }
  return e.value;
}

async function fetchNeoBrowse(page = 0) {
  const cacheKey = `browse:${page}`;
  const c = getCache(cacheKey);
  if (c) return c;

  const url = `${BASE}/neo/browse?page=${page}&api_key=${NASA_API_KEY}`;
  const res = await axios.get(url, { timeout: 10000 });
  setCache(cacheKey, res.data);
  return res.data;
}

async function fetchNeoById(id) {
  const cacheKey = `neo:${id}`;
  const c = getCache(cacheKey);
  if (c) return c;

  const url = `${BASE}/neo/${id}?api_key=${NASA_API_KEY}`;
  const res = await axios.get(url, { timeout: 10000 });
  setCache(cacheKey, res.data);
  return res.data;
}

export { fetchNeoBrowse, fetchNeoById };
