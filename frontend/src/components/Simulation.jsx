import React, { useContext, useState } from "react";
import RiskChart from "./RiskChart";
import OrbitalView from "./OrbitalView";
import ImpactMap from "./ImpactMap";
import AsteroidSelector from "./AsteroidSelector";
import { dataContext } from "@/Context";

const Simulation = () => {
  const {
    impactResult,
    size,
    setSize,
    velocity,
    setVelocity,
    velocityChange,
    setVelocityChange,
    selectedId,
    setSelectedId,
    asteroidsData,
    setImpactResult,
  } = useContext(dataContext);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [simError, setSimError] = useState("");

  // Handler for map click
  const handleMapClick = (e) => {
    setSelectedLocation([e.latlng.lat, e.latlng.lng]);
  };

  // Handler for running simulation
  const handleRunSimulation = () => {
    setSimError("");
    if (!selectedId) {
      setSimError("Please select an asteroid.");
      return;
    }
    if (!selectedLocation) {
      setSimError("Please select a location on the map.");
      return;
    }
    // Simulate impact result (replace with real calculation or API call)
    const asteroid = asteroidsData.find((a) => a.id === selectedId);
    if (!asteroid) {
      setSimError("Asteroid data not found.");
      return;
    }
    // Example calculation (replace with real logic)
    setImpactResult({
      mass: size * 1000,
      energy: size * velocity * 1e9,
      tntEquivalent: size * velocity * 1e6,
      crater: size * 10,
      seismicMagnitude: Math.log10(size * velocity) + 2,
      tsunamiHeight: Math.max(0, (size * velocity) / 100),
      riskAssessment: {
        riskLevel:
          size * velocity > 10000
            ? "HIGH"
            : size * velocity > 3000
            ? "MEDIUM"
            : "LOW",
        riskScore: Math.min(1, (size * velocity) / 20000),
      },
      environmentalEffects: {
        impactType: size > 500 ? "Global" : size > 100 ? "Regional" : "Local",
      },
      location: selectedLocation,
      asteroid,
    });
  };

  // Pass click handler to ImpactMap
  const impactMapProps = {
    onMapClick: handleMapClick,
    selectedMarker: selectedLocation,
    crater: impactResult?.crater,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <AsteroidSelector />

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Simulation Controls</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Asteroid Size (meters)
                </label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-300">{size} m</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Velocity (km/s)
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.1"
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-300">{velocity} km/s</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Velocity Change (km/s)
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={velocityChange}
                  onChange={(e) => setVelocityChange(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-300">
                  {velocityChange} km/s
                </span>
              </div>
              <button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                onClick={handleRunSimulation}
              >
                Run Simulation
              </button>
              {/* {simError && (
                <div className="text-red-400 mt-2 font-semibold">
                  {simError}
                </div>
              )} */}
              {/* <div className="text-xs text-gray-400 mt-2">
                1. Select an asteroid
                <br />
                2. Select a place on the map
                <br />
                3. Click Run Simulation
              </div> */}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {impactResult && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Impact Analysis</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-300">Mass:</span>
                  <span className="ml-2 font-mono">
                    {impactResult.mass.toFixed(2)} kg
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">Energy:</span>
                  <span className="ml-2 font-mono">
                    {(impactResult.energy / 1e12).toFixed(2)} TJ
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">TNT Equivalent:</span>
                  <span className="ml-2 font-mono">
                    {(impactResult.tntEquivalent / 1e6).toFixed(2)} MT
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">Crater:</span>
                  <span className="ml-2 font-mono">
                    {impactResult.crater.toFixed(0)} m
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">Seismic:</span>
                  <span className="ml-2 font-mono">
                    M{impactResult.seismicMagnitude.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">Tsunami:</span>
                  <span className="ml-2 font-mono">
                    {impactResult.tsunamiHeight.toFixed(1)} m
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg overflow-hidden shadow-lg border-2 border-gray-600">
            <h2 className="text-2xl font-bold text-center p-4 bg-gray-800">
              Impact Map
            </h2>
            <ImpactMap {...impactMapProps} />
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden shadow-lg border-2 border-gray-600">
          <h2 className="text-2xl font-bold text-center p-4 bg-gray-800">
            3D Orbital View
          </h2>
  
        </div>
      </div>  */}
    </div>
  );
};

export default Simulation;
