// frontend/src/components/ImpactMap.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Polygon,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import Leaflet default marker icons for Vite/ESM environments
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { data } from "react-router-dom";
import { dataContext } from "@/Context";
import { getSeismicData } from "@/services/api";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function idToLatLng(id) {
  // deterministic pseudo-random lat/lng from id
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  const lat = (hash % 18000) / 100 - 90; // -90..+90
  const lng = (Math.floor(hash / 18000) % 36000) / 100 - 180; // -180..+180
  return [lat, lng];
}

const ImpactMap = ({
  crater,
  velocityShift = 0,
  selectedMarker,
  tsunamiZones = [],
  onMapClick,
}) => {
  const { asteroidsData: asteroids = [], impactResult } =
    useContext(dataContext);
  const [tsunamiData, setTsunamiData] = useState([]);
  const [seismicData, setSeismicData] = useState([]);

  useEffect(() => {
    // Load tsunami and seismic data
    const loadData = async () => {
      try {
        // In a real implementation, these would be API calls
        const res = await getSeismicData();
        console.log(res?.data);
        // For now, we'll generate sample data
        const sampleTsunamiZones = [
          { lat: 35.6762, lng: 139.6503, risk: "high", name: "Tokyo Bay" },
          {
            lat: 40.7128,
            lng: -74.006,
            risk: "medium",
            name: "New York Harbor",
          },
          { lat: 51.5074, lng: -0.1278, risk: "low", name: "Thames Estuary" },
        ];

        const sampleSeismicData = [
          { lat: 35.6762, lng: 139.6503, magnitude: 6.5, depth: 10 },
          { lat: 40.7128, lng: -74.006, magnitude: 5.2, depth: 15 },
          { lat: 51.5074, lng: -0.1278, magnitude: 4.8, depth: 20 },
        ];

        setTsunamiData(sampleTsunamiZones);
        setSeismicData(sampleSeismicData);
      } catch (error) {
        console.error("Error loading map data:", error);
      }
    };

    loadData();
  }, []);

  const getCraterColor = (craterSize) => {
    if (!craterSize) return "#ff4444";
    if (craterSize < 50) return "#10B981"; // green
    if (craterSize < 200) return "#F59E0B"; // yellow
    if (craterSize < 500) return "#F97316"; // orange
    return "#EF4444"; // red
  };

  const getTsunamiRiskColor = (risk) => {
    switch (risk) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const getSeismicColor = (magnitude) => {
    if (magnitude < 4) return "#10B981";
    if (magnitude < 5) return "#F59E0B";
    if (magnitude < 6) return "#F97316";
    return "#EF4444";
  };

  // Generate impact zone polygon
  const generateImpactZone = (center, radius) => {
    const points = [];
    const segments = 32;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const lat = center[0] + (radius / 111) * Math.cos(angle); // 111 km per degree
      const lng =
        center[1] +
        (radius / (111 * Math.cos((center[0] * Math.PI) / 180))) *
          Math.sin(angle);
      points.push([lat, lng]);
    }
    return points;
  };

  const impactCenter = selectedMarker || [0, 0];
  const impactRadius = crater ? crater / 1000 : 10; // Convert to km
  const impactZone = generateImpactZone(impactCenter, impactRadius);

  return (
    <div className="relative">
      <MapContainer
        center={impactCenter}
        zoom={impactResult ? 6 : 2}
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg"
        onClick={onMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Impact Zone */}
        {impactResult && (
          <Polygon
            positions={impactZone}
            pathOptions={{
              color: "#ff4444",
              fillColor: "#ff4444",
              fillOpacity: 0.3,
              weight: 2,
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-red-600">Impact Zone</h3>
                <p>Radius: {impactRadius.toFixed(1)} km</p>
                <p>Crater: {crater?.toFixed(0)} m</p>
                {impactResult.seismicMagnitude && (
                  <p>Seismic: M{impactResult.seismicMagnitude.toFixed(1)}</p>
                )}
                {impactResult.tsunamiHeight && (
                  <p>Tsunami: {impactResult.tsunamiHeight.toFixed(1)} m</p>
                )}
              </div>
            </Popup>
          </Polygon>
        )}

        {/* Tsunami Risk Zones */}
        {tsunamiData.map((zone, index) => (
          <CircleMarker
            key={`tsunami-${index}`}
            center={[zone.lat, zone.lng]}
            radius={8}
            pathOptions={{
              color: getTsunamiRiskColor(zone.risk),
              fillColor: getTsunamiRiskColor(zone.risk),
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Tooltip>
              <div>
                <strong>Tsunami Risk Zone</strong>
                <br />
                {zone.name}
                <br />
                Risk: {zone.risk.toUpperCase()}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {/* Seismic Activity */}
        {seismicData.map((quake, index) => (
          <CircleMarker
            key={`seismic-${index}`}
            center={[quake.lat, quake.lng]}
            radius={Math.max(3, quake.magnitude)}
            pathOptions={{
              color: getSeismicColor(quake.magnitude),
              fillColor: getSeismicColor(quake.magnitude),
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Tooltip>
              <div>
                <strong>Seismic Activity</strong>
                <br />
                Magnitude: {quake.magnitude}
                <br />
                Depth: {quake.depth} km
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {/* Asteroids */}
        {asteroids.map((asteroid) => {
          const lat = Math.random() * 140 - 70 + velocityShift;
          const lng = Math.random() * 360 - 180 + velocityShift;
          const isSelected =
            selectedMarker &&
            Math.abs(lat - selectedMarker[0]) < 0.1 &&
            Math.abs(lng - selectedMarker[1]) < 0.1;

          return (
            <CircleMarker
              key={asteroid.id}
              center={isSelected ? selectedMarker : [lat, lng]}
              radius={crater ? Math.max(3, crater / 1000) : 3}
              pathOptions={{
                color: isSelected ? "#00ffff" : getCraterColor(crater),
                fillColor: isSelected ? "#00ffff" : getCraterColor(crater),
                fillOpacity: 0.8,
                weight: 2,
              }}
            >
              <Tooltip>
                <div>
                  <strong>{asteroid.name}</strong>
                  <br />
                  {crater && `Crater: ${crater.toFixed(0)} m`}
                  <br />
                  {asteroid.is_potentially_hazardous_asteroid && (
                    <span className="text-red-600 font-bold">HAZARDOUS</span>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 p-3 rounded-lg text-white text-sm">
        <div className="space-y-2">
          <div className="font-bold">Map Legend</div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Impact Zone</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Tsunami Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Seismic Activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span>Selected Asteroid</span>
          </div>
        </div>
      </div>

      {/* Impact Statistics */}
      {impactResult && (
        <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 p-3 rounded-lg text-white text-sm ">
          <div className="font-bold mb-2">Impact Analysis</div>
          <div className="space-y-1">
            <div>Energy: {(impactResult.energy / 1e12).toFixed(2)} TJ</div>
            <div>TNT: {(impactResult.tntEquivalent / 1e6).toFixed(2)} MT</div>
            <div>Crater: {crater?.toFixed(0)} m</div>
            {impactResult.seismicMagnitude && (
              <div>Seismic: M{impactResult.seismicMagnitude.toFixed(1)}</div>
            )}
            {impactResult.tsunamiHeight && (
              <div>Tsunami: {impactResult.tsunamiHeight.toFixed(1)} m</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactMap;
