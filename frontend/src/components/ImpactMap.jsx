// frontend/src/components/ImpactMap.jsx
import React, { useState, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Tooltip,
  Popup,
  Marker,
  useMapEvent,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import Leaflet default marker icons for Vite/ESM environments
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { dataContext } from "@/Context";
//import { getSeismicData } from "@/services/api";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom component for handling map click and showing marker
function LocationSelector({ selectedMarker, onMapClick }) {
  useMapEvent("click", (e) => {
    if (onMapClick) onMapClick(e);
  });
  return selectedMarker ? (
    <Marker position={selectedMarker}>
      <Popup>Selected Impact Location</Popup>
    </Marker>
  ) : null;
}

const ImpactMap = ({ selectedMarker, onMapClick }) => {
  const { impactResult } = useContext(dataContext);
  // const [tsunamiData, setTsunamiData] = useState([]);
  // const [seismicData, setSeismicData] = useState([]);
  // useEffect(() => {
  //   // Load tsunami and seismic data
  //   const loadData = async () => {
  //     try {
  //       // In a real implementation, these would be API calls
  //       const res = await getSeismicData();
  //       console.log(res?.data);
  //       // For now, we'll generate sample data
  //       // const sampleTsunamiZones = [
  //       //   { lat: 35.6762, lng: 139.6503, risk: "high", name: "Tokyo Bay" },
  //       //   {
  //       //     lat: 40.7128,
  //       //     lng: -74.006,
  //       //     risk: "medium",
  //       //     name: "New York Harbor",
  //       //   },
  //       //   { lat: 51.5074, lng: -0.1278, risk: "low", name: "Thames Estuary" },
  //       // ];

  //       // const sampleSeismicData = [
  //       //   { lat: 35.6762, lng: 139.6503, magnitude: 6.5, depth: 10 },
  //       //   { lat: 40.7128, lng: -74.006, magnitude: 5.2, depth: 15 },
  //       //   { lat: 51.5074, lng: -0.1278, magnitude: 4.8, depth: 20 },
  //       // ];
  //       setSeismicData(res?.data || []);

  //       // setTsunamiData(sampleTsunamiZones);
  //       // setSeismicData(sampleSeismicData);
  //     } catch (error) {
  //       console.error("Error loading map data:", error);
  //     }
  //   };

  //   loadData();
  // }, []);

  const getCraterColor = (craterSize) => {
    if (!craterSize) return "#ff4444";
    if (craterSize < 50) return "#10B981"; // green
    if (craterSize < 200) return "#F59E0B"; // yellow
    if (craterSize < 500) return "#F97316"; // orange
    return "#EF4444"; // red
  };

  // const getTsunamiRiskColor = (risk) => {
  //   switch (risk) {
  //     case "high":
  //       return "#EF4444";
  //     case "medium":
  //       return "#F59E0B";
  //     case "low":
  //       return "#10B981";
  //     default:
  //       return "#6B7280";
  //   }
  // };

  // const getSeismicColor = (magnitude) => {
  //   if (magnitude < 4) return "#10B981";
  //   if (magnitude < 5) return "#F59E0B";
  //   if (magnitude < 6) return "#F97316";
  //   return "#EF4444";
  // };

  const impactCenter = impactResult?.impactLocation || [
    26.85941325487688, 75.90796597380016,
  ];

  return (
    <div className="relative">
      <MapContainer
        center={impactCenter} //
        zoom={impactResult ? 6 : 2}
        style={{ height: "500px", width: "100%" }}
        className="rounded-2xl border-2 border-blue-200 shadow-lg"
      >
        {/* Location selection marker and click handler */}
        <LocationSelector
          selectedMarker={selectedMarker}
          onMapClick={onMapClick}
        />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Impact Zone */}
        {impactResult && selectedMarker && (
          <Circle
            center={impactResult?.impactLocation}
            radius={impactResult?.crater || 1000} // crater in meters, fallback to 1000m
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 0.15,
              weight: 3,
              dashArray: "6 6",
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-blue-700">Impact Zone</h3>
                <p>Radius: {(impactResult?.crater / 1000).toFixed(1)} km</p>
                <p>Crater: {impactResult?.crater?.toFixed(0)} m</p>
                {impactResult.seismicMagnitude && (
                  <p>Seismic: M{impactResult.seismicMagnitude.toFixed(1)}</p>
                )}
                {impactResult.tsunamiHeight && (
                  <p>Tsunami: {impactResult.tsunamiHeight.toFixed(1)} m</p>
                )}
              </div>
            </Popup>
          </Circle>
        )}

        {/* Tsunami Risk Zones */}
        {/* {tsunamiData.map((zone, index) => (
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
                <strong className="text-blue-700">Tsunami Risk Zone</strong>
                <br />
                {zone.name}
                <br />
                Risk: {zone.risk.toUpperCase()}
              </div>
            </Tooltip>
          </CircleMarker>
        ))} */}

        {/* Seismic Activity */}
        {/* {seismicData.map((quake, index) => (
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
                <strong className="text-blue-700">Seismic Activity</strong>
                <br />
                Magnitude: {quake.magnitude}
                <br />
                Depth: {quake.depth} km
              </div>
            </Tooltip>
          </CircleMarker>
        ))} */}
      </MapContainer>
    </div>
  );
};

export default ImpactMap;
