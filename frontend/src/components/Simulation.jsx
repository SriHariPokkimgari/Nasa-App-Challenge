import React, { useContext, useState } from "react";
import ImpactMap from "./ImpactMap";
import AsteroidSelector from "./AsteroidSelector";
import { dataContext } from "@/Context";
import { simulateImpact } from "@/services/api";

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
  const handleRunSimulation = async () => {
    console.log("Running simulation with:");
    setSimError("");
    if (!selectedId) {
      setSimError("Please select an asteroid.");
      return;
    }
    if (!selectedLocation) {
      setSimError("Please select a location on the map.");
      return;
    }
    const asteroid = asteroidsData.find((a) => a.id === selectedId);
    if (!asteroid) {
      setSimError("Asteroid data not found.");
      return;
    }
    try {
      const res = await simulateImpact(
        asteroid.id,
        size,
        velocity,
        velocityChange,
        selectedLocation[0],
        selectedLocation[1]
      );
      setImpactResult(res);
    } catch (error) {
      console.error("Simulation error:", error);
      setSimError("Simulation failed. Please try again.");
    }
  };

  // Pass click handler to ImpactMap
  const impactMapProps = {
    onMapClick: handleMapClick,
    selectedMarker: selectedLocation,
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Asteroid selection and controls */}
        <div className="space-y-8">
          <div className=" rounded-2xl shadow-lg p-6">
            <AsteroidSelector />
          </div>
          <div className="bg-gradient-to-br  rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-extrabold  mb-4 tracking-tight">
              Simulation Controls
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold  mb-2">
                  Asteroid Size (meters)
                </label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full "
                  aria-label="Asteroid Size"
                />
                <span className="text-sm  font-mono">{size} m</span>
              </div>
              <div>
                <label className="block text-sm font-semibold  mb-2">
                  Velocity (km/s)
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.1"
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="w-full "
                  aria-label="Velocity"
                />
                <span className="text-sm font-mono">{velocity} km/s</span>
              </div>
              <div>
                <label className="block text-sm font-semibold  mb-2">
                  Velocity Change (km/s)
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={velocityChange}
                  onChange={(e) => setVelocityChange(Number(e.target.value))}
                  className="w-full "
                  aria-label="Velocity Change"
                />
                <span className="text-sm  font-mono">
                  {velocityChange} km/s
                </span>
              </div>
            </div>
          </div>
          <div>
            <button
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-900 text-white font-bold py-2 px-4 rounded-xl shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleRunSimulation}
            >
              Run Simulation
            </button>
            {simError && (
              <div className="text-red-500 mt-2 font-semibold text-center animate-pulse">
                {simError}
              </div>
            )}
            <div className="text-xs  mt-2 rounded p-2">
              <span className="font-bold">How to use:</span> 1. Select an
              asteroid. 2. Select a place on the map. 3. Click Run Simulation.
            </div>
          </div>
        </div>
        {/* Right: Impact analysis and map */}
        <div className="space-y-8">
          {impactResult ? (
            <div className=" rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-extrabold  mb-4 tracking-tight">
                Impact Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="">Mass:</span>
                  <span className="ml-2 font-mono ">
                    {impactResult.mass.toFixed(2)} kg
                  </span>
                </div>
                <div>
                  <span className="">Energy:</span>
                  <span className="ml-2 font-mono ">
                    {(impactResult.energy / 1e12).toFixed(2)} TJ
                  </span>
                </div>
                <div>
                  <span className="">TNT Equivalent:</span>
                  <span className="ml-2 font-mono ">
                    {(impactResult.tntEquivalent / 1e6).toFixed(2)} MT
                  </span>
                </div>
                <div>
                  <span className="">Crater:</span>
                  <span className="ml-2 font-mono ">
                    {impactResult.crater.toFixed(0)} m
                  </span>
                </div>
                <div>
                  <span className="">Seismic:</span>
                  <span className="ml-2 font-mono ">
                    M{impactResult.seismicMagnitude.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="">Tsunami:</span>
                  <span className="ml-2 font-mono ">
                    {impactResult.tsunamiHeight.toFixed(1)} m
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="  rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-extrabold  mb-4 tracking-tight">
                Impact Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="">Mass:</span>
                  <span className="ml-2 font-mono ">0 kg</span>
                </div>
                <div>
                  <span className="">Energy:</span>
                  <span className="ml-2 font-mono ">0 TJ</span>
                </div>
                <div>
                  <span className="">TNT Equivalent:</span>
                  <span className="ml-2 font-mono ">0 MT</span>
                </div>
                <div>
                  <span className="">Crater:</span>
                  <span className="ml-2 font-mono ">0 m</span>
                </div>
                <div>
                  <span className="">Seismic:</span>
                  <span className="ml-2 font-mono ">M 0</span>
                </div>
                <div>
                  <span className="">Tsunami:</span>
                  <span className="ml-2 font-mono ">0 m</span>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-2xl overflow-hidden shadow-lg border-2 bg-gradient-to-br  ">
            <h2 className="text-2xl font-extrabold text-center p-4   racking-tight">
              Impact Map
            </h2>
            <ImpactMap {...impactMapProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
