import React, { useContext, useState } from "react";
import axios from "axios";
import { dataContext } from "@/context";
import {
  runKineticImpactor,
  runGravityTractor,
  runLaserAblation,
  runNuclearDeflection,
  compareMitigationStrategies,
} from "@/services/api";

const MitigationPanel = () => {
  const {
    selectedAsteroid,
    impactResult,
    setMitigationResults: onResultsChange,
  } = useContext(dataContext);
  const [selectedStrategy, setSelectedStrategy] = useState("kinetic-impactor");
  const [parametersKinetic, setParametersKinetic] = useState({
    impactorMass: 1000,
    impactorVelocity: 10,
    impactAngle: 0,
  });

  const [parametersGravity, setParametersGravity] = useState({
    tractorMass: 10000,
    distance: 100,
  });
  const [parametersLaser, setParametersLaser] = useState({
    laserPower: 1000,
  });
  const [parametersNuclear, setParametersNuclear] = useState({
    nuclearYield: 1,
    detonationDistance: 1400,
  });
  const [timeToImpact, setTimeToImpact] = useState(365);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(results);

  const strategies = [
    {
      id: "kinetic-impactor",
      name: "Kinetic Impactor",
      description: "High-speed collision to change asteroid trajectory",
      icon: "🚀",
      color: "blue",
    },
    {
      id: "gravity-tractor",
      name: "Gravity Tractor",
      description: "Gravitational pull from nearby spacecraft",
      icon: "🛰️",
      color: "green",
    },
    {
      id: "laser-ablation",
      name: "Laser Ablation",
      description: "Focused laser to vaporize surface material",
      icon: "🔴",
      color: "red",
    },
    {
      id: "nuclear-deflection",
      name: "Nuclear Deflection",
      description: "Nuclear explosion for maximum deflection",
      icon: "💥",
      color: "yellow",
    },
  ];

  const runSimulation = (strategy) => async () => {
    if (!selectedAsteroid || !impactResult) {
      alert("Please select an asteroid and run an impact simulation first");
      return;
    }

    setLoading(true);
    try {
      switch (strategy) {
        case "kinetic-impactor":
          const response = await runKineticImpactor({
            targetMass: impactResult.mass,
            targetVelocity: impactResult.adjustedVelocity,
            ...parametersKinetic,
            timeToImpact,
          });
          setResults(response);
          onResultsChange(response);
          break;
        case "gravity-tractor":
          const gravityResponse = await runGravityTractor({
            targetMass: impactResult.mass,
            timeToImpact,
            ...parametersGravity,
          });
          setResults(gravityResponse);
          onResultsChange(gravityResponse);
          break;
        case "laser-ablation":
          const laserResponse = await runLaserAblation({
            targetMass: impactResult.mass,
            timeToImpact,
            ...parametersLaser,
          });
          setResults(laserResponse);
          onResultsChange(laserResponse);
          break;
        case "nuclear-deflection":
          const nuclearResponse = await runNuclearDeflection({
            targetMass: impactResult.mass,
            targetVelocity: impactResult.adjustedVelocity,
            timeToImpact,
            ...parametersNuclear,
          });
          setResults(nuclearResponse);
          onResultsChange(nuclearResponse);
          break;
        default:
          alert("Unknown strategy selected");
          setLoading(false);
          return;
      }
    } catch (error) {
      console.error("Mitigation simulation error:", error);
      alert("Failed to run mitigation simulation");
    } finally {
      setLoading(false);
    }
  };

  const compareStrategies = async () => {
    if (!selectedAsteroid || !impactResult) {
      alert("Please select an asteroid and run an impact simulation first");
      return;
    }

    setLoading(true);
    try {
      const response = await compareMitigationStrategies({
        targetMass: impactResult.mass,
        targetVelocity: impactResult.adjustedVelocity,
        timeToImpact,
      });
      setResults(response);
      onResultsChange(response);
    } catch (error) {
      console.error("Strategy comparison error:", error);
      alert("Failed to compare mitigation strategies");
    } finally {
      setLoading(false);
    }
  };

  const handleGravityChange = (field) => (e) => {
    setParametersGravity({
      ...parametersGravity,
      [field]: Number(e.target.value),
    });
  };

  const handleKineticChange = (field) => (e) => {
    setParametersKinetic({
      ...parametersKinetic,
      [field]: Number(e.target.value),
    });
  };

  const handleNuclearChange = (field) => (e) => {
    setParametersNuclear({
      ...parametersNuclear,
      [field]: Number(e.target.value),
    });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-blue-900 p-8 rounded-2xl text-white shadow-2xl border border-blue-700/30">
        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-2">
          <span className="inline-block text-yellow-300 text-3xl">
            &#128737;&#65039;
          </span>{" "}
          Mitigation Strategies
        </h1>
        <p className="text-lg text-green-100">
          Explore different methods to deflect threatening asteroids
        </p>
      </div>

      {/* Strategy Selection */}
      <div className="bg-gradient-to-br from-blue-900/80 to-black p-8 rounded-2xl shadow-lg border border-blue-700/30 transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-blue-200 flex items-center gap-2">
          <span className="text-2xl">&#128640;</span> Select Mitigation Strategy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {strategies.map((strategy) => (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id)}
              className={`p-6 rounded-xl border-2 transition-all font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/60 ${
                selectedStrategy === strategy.id
                  ? `border-${strategy.color}-400 bg-${strategy.color}-900/80 text-${strategy.color}-200`
                  : "border-gray-600 bg-gray-800 hover:border-blue-400/60 text-gray-200"
              }`}
              aria-pressed={selectedStrategy === strategy.id}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{strategy.icon}</div>
                <div className="font-bold">{strategy.name}</div>
                <div className="text-sm text-gray-300 mt-1">
                  {strategy.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Parameters */}
      <div className="bg-gradient-to-br from-blue-900/80 to-black p-8 rounded-2xl shadow-lg border border-blue-700/30 transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-blue-200 flex items-center gap-2">
          <span className="text-2xl">&#9881;&#65039;</span> Strategy Parameters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {selectedStrategy === "kinetic-impactor" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-100">
                  Impactor Mass (kg)
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={parametersKinetic.impactorMass}
                  onChange={handleKineticChange("impactorMass")}
                  className="w-full accent-blue-500"
                />
                <span className="text-sm text-blue-200">
                  {parametersKinetic.impactorMass} kg
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-100">
                  Impactor Velocity (km/s)
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="0.5"
                  value={parametersKinetic.impactorVelocity}
                  onChange={handleKineticChange("impactorVelocity")}
                  className="w-full accent-blue-500"
                />
                <span className="text-sm text-blue-200">
                  {parametersKinetic.impactorVelocity} km/s
                </span>
              </div>
            </>
          )}

          {selectedStrategy === "gravity-tractor" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-green-100">
                  Tractor Mass (kg)
                </label>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={parametersGravity.tractorMass}
                  onChange={handleGravityChange("tractorMass")}
                  className="w-full accent-green-500"
                />
                <span className="text-sm text-green-200">
                  {parametersGravity.tractorMass} kg
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-green-100">
                  Distance (m)
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={parametersGravity.distance}
                  onChange={handleGravityChange("distance")}
                  className="w-full accent-green-500"
                />
                <span className="text-sm text-green-200">
                  {parametersGravity.distance} m
                </span>
              </div>
            </>
          )}

          {selectedStrategy === "laser-ablation" && (
            <div>
              <label className="block text-sm font-medium mb-2 text-pink-100">
                Laser Power (kW)
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={parametersLaser.laserPower}
                onChange={(e) =>
                  setParametersLaser({ laserPower: Number(e.target.value) })
                }
                className="w-full accent-pink-500"
              />
              <span className="text-sm text-pink-200">
                {parametersLaser.laserPower} kW
              </span>
            </div>
          )}

          {selectedStrategy === "nuclear-deflection" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-yellow-100">
                  Nuclear Yield (MT)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={parametersNuclear.nuclearYield}
                  onChange={handleNuclearChange("nuclearYield")}
                  className="w-full accent-yellow-500"
                />
                <span className="text-sm text-yellow-200">
                  {parametersNuclear.nuclearYield} MT
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-yellow-100">
                  Detonation distance (m/s)
                </label>
                <input
                  type="range"
                  min="1400"
                  max="10000"
                  step="100"
                  value={parametersNuclear.detonationDistance}
                  onChange={handleNuclearChange("detonationDistance")}
                  className="w-full accent-yellow-500"
                />
                <span className="text-sm text-yellow-200">
                  {parametersNuclear.detonationDistance} m/s
                </span>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-blue-100">
              Time to Impact (days)
            </label>
            <input
              type="range"
              min="30"
              max="1095"
              step="30"
              value={timeToImpact}
              onChange={(e) => setTimeToImpact(e.target.value)}
              className="w-full accent-blue-500"
            />
            <span className="text-sm text-blue-200">{timeToImpact} days</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={runSimulation(selectedStrategy)}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-8 py-4 rounded-xl font-bold transition-colors shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400/60"
        >
          Run Mitigation{loading ? "..." : null}
        </button>

        <button
          onClick={compareStrategies}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-8 py-4 rounded-xl font-bold transition-colors shadow-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-400/60"
        >
          Compare All Strategies{loading ? "...." : null}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-gradient-to-br from-blue-900/80 to-gray-900/90 p-8 rounded-2xl shadow-2xl border border-blue-700/30 mt-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-200 flex items-center gap-2">
            <span className="text-2xl">&#128202;</span> Simulation Results
          </h2>

          {results.comparison ? (
            // Strategy comparison results
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-green-800/80 to-gray-900/80 p-6 rounded-xl shadow-lg border border-green-600/30">
                <h3 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">&#11088;</span> Recommended Strategy
                </h3>
                <div className="text-lg font-bold text-green-100">
                  {results.recommendation.name}
                </div>
                <div className="text-sm text-green-200">
                  Effectiveness:{" "}
                  {(results.recommendation.effectiveness * 100).toFixed(8)}%
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.comparison.map((strategy, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 rounded-xl shadow-lg border border-gray-600/30"
                  >
                    <div className="font-bold text-blue-200">
                      {strategy.name}
                    </div>
                    <div className="text-sm text-blue-100">
                      Effectiveness: {(strategy.effectiveness * 100).toFixed(8)}
                      %
                    </div>
                    <div className="text-sm text-blue-100">
                      Cost: ${strategy.cost.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-100">
                      Risk: {strategy.risk}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Single strategy results
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-800/80 to-blue-900/80 p-6 rounded-xl shadow-lg border border-blue-600/30">
                <h3 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">&#128168;</span> Deflection Results
                </h3>
                <div className="space-y-3 text-base text-blue-100">
                  <div>
                    Velocity Change:{" "}
                    <span className="font-semibold">
                      {results.results.velocityChange.toFixed(6)} km/s
                    </span>
                  </div>
                  <div>
                    Deflection Distance:{" "}
                    <span className="font-semibold">
                      {(results.results.deflectionDistance / 1000).toFixed(2)}{" "}
                      km
                    </span>
                  </div>
                  <div>
                    Effectiveness:{" "}
                    <span className="font-semibold">
                      {(results.results.effectiveness * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    Success Probability:{" "}
                    <span className="font-semibold">
                      {(results.results.successProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-800/80 to-gray-900/80 p-6 rounded-xl shadow-lg border border-green-600/30">
                <h3 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                  <span className="text-xl">&#128640;</span> Mission
                  Requirements
                </h3>
                <div className="space-y-3 text-base text-green-100">
                  <div>
                    Launch Window:{" "}
                    <span className="font-semibold">
                      {results.missionRequirements.launchWindow} days before
                      impact
                    </span>
                  </div>
                  <div>
                    Total Mass:{" "}
                    <span className="font-semibold">
                      {results.missionRequirements.totalMissionMass.toFixed(0)}{" "}
                      kg
                    </span>
                  </div>
                  <div>
                    Fuel Mass:{" "}
                    <span className="font-semibold">
                      {results.missionRequirements.fuelMass
                        ? results.missionRequirements.fuelMass.toFixed(2)
                        : 0}{" "}
                      kg
                    </span>
                  </div>
                  {results.missionRequirements.operationDuration && (
                    <div>
                      Operation Duration:{" "}
                      <span className="font-semibold">
                        {results.missionRequirements.operationDuration} days
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MitigationPanel;
