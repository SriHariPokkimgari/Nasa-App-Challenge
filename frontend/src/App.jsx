// frontend/src/App.jsx
import React, { useContext } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import OrbitalView from "./components/OrbitalView";
import ImpactMap from "./components/ImpactMap";
import AsteroidSelector from "./components/AsteroidSelector";
import MitigationPanel from "./components/MitigationPanel";
import RiskChart from "./components/RiskChart";
import EducationalOverlay from "./components/EducationalOverlay";
import Impactor2025Scenario from "./components/Impactor2025Scenario";
import "./accessibility.css";
import { dataContext } from "./Context";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

function idToLatLng(id) {
  // deterministic pseudo-random lat/lng from id
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  const lat = (hash % 18000) / 100 - 90; // -90..+90
  const lng = (Math.floor(hash / 18000) % 36000) / 100 - 180; // -180..+180
  return [lat, lng];
}

const App = () => {
  const {
    selectedAsteroid,
    size,
    velocity,
    velocityChange,
    impactResult,
    showEducational,
    showScenario,

    setVelocityChange,
    setVelocity,
    setSize,

    setShowScenario,
    setShowEducational,
  } = useContext(dataContext);

  const selectedMarker = selectedAsteroid
    ? idToLatLng(selectedAsteroid.id)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      {/* Header */}
      <Header />

      {/* Navigation */}
      <Navigation />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/simulation"
            element={
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <AsteroidSelector />

                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                      <h3 className="text-xl font-bold mb-4">
                        Simulation Controls
                      </h3>
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
                          <span className="text-sm text-gray-300">
                            {size} m
                          </span>
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
                            onChange={(e) =>
                              setVelocity(Number(e.target.value))
                            }
                            className="w-full"
                          />
                          <span className="text-sm text-gray-300">
                            {velocity} km/s
                          </span>
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
                            onChange={(e) =>
                              setVelocityChange(Number(e.target.value))
                            }
                            className="w-full"
                          />
                          <span className="text-sm text-gray-300">
                            {velocityChange} km/s
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {impactResult && (
                      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">
                          Impact Analysis
                        </h3>
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
                            <span className="text-gray-300">
                              TNT Equivalent:
                            </span>
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

                    <RiskChart />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="rounded-lg overflow-hidden shadow-lg border-2 border-gray-600">
                    <h2 className="text-2xl font-bold text-center p-4 bg-gray-800">
                      3D Orbital View
                    </h2>
                    <OrbitalView />
                  </div>

                  <div className="rounded-lg overflow-hidden shadow-lg border-2 border-gray-600">
                    <h2 className="text-2xl font-bold text-center p-4 bg-gray-800">
                      Impact Map
                    </h2>
                    <ImpactMap />
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/mitigation" element={<MitigationPanel />} />
          <Route
            path="/analysis"
            element={
              <div className="space-y-8">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">
                    Advanced Impact Analysis
                  </h2>
                  {impactResult && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-bold text-blue-400 mb-2">
                          Atmospheric Effects
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            Airburst Altitude:{" "}
                            {impactResult.atmosphericEffects.airburstAltitude.toFixed(
                              0
                            )}{" "}
                            m
                          </div>
                          <div>
                            Fireball Radius:{" "}
                            {impactResult.atmosphericEffects.fireballRadius.toFixed(
                              0
                            )}{" "}
                            m
                          </div>
                          <div>
                            Energy:{" "}
                            {impactResult.atmosphericEffects.energy.toFixed(2)}{" "}
                            TJ
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-bold text-red-400 mb-2">
                          Environmental Impact
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            Impact Type:{" "}
                            {impactResult.environmentalEffects.impactType}
                          </div>
                          <div>
                            Affected Radius:{" "}
                            {(
                              impactResult.environmentalEffects.affectedRadius /
                              1000
                            ).toFixed(1)}{" "}
                            km
                          </div>
                          <div>
                            Seismic:{" "}
                            {impactResult.environmentalEffects
                              .environmentalDamage.seismic
                              ? "Yes"
                              : "No"}
                          </div>
                          <div>
                            Tsunami:{" "}
                            {impactResult.environmentalEffects
                              .environmentalDamage.tsunami
                              ? "Yes"
                              : "No"}
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-bold text-yellow-400 mb-2">
                          Risk Assessment
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            Risk Level:{" "}
                            <span
                              className={`font-bold ${
                                impactResult.riskAssessment.riskLevel === "HIGH"
                                  ? "text-red-400"
                                  : impactResult.riskAssessment.riskLevel ===
                                    "MEDIUM"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              }`}
                            >
                              {impactResult.riskAssessment.riskLevel}
                            </span>
                          </div>
                          <div>
                            Risk Score:{" "}
                            {impactResult.riskAssessment.riskScore.toFixed(2)}
                          </div>
                          <div>
                            Energy Factor:{" "}
                            {impactResult.riskAssessment.factors.energy.toFixed(
                              2
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Educational Overlay */}
      {showEducational && (
        <EducationalOverlay onClose={() => setShowEducational(false)} />
      )}

      {/* Impactor-2025 Scenario */}
      {showScenario && (
        <Impactor2025Scenario onClose={() => setShowScenario(false)} />
      )}
    </div>
  );
};

export default App;
