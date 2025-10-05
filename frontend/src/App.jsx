// frontend/src/App.jsx
import React, { useContext } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import MitigationPanel from "./components/MitigationPanel";
import EducationalOverlay from "./components/EducationalOverlay";
import Impactor2025Scenario from "./components/Impactor2025Scenario";
//import "./accessibility.css";
import { dataContext } from "./Context";
import Header from "./components/Header";

import Simulation from "./components/Simulation";
import Analysis from "./components/Analysis";

const App = () => {
  const { showEducational, showScenario, setShowScenario, setShowEducational } =
    useContext(dataContext);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/mitigation" element={<MitigationPanel />} />
            <Route path="/analysis" element={<Analysis />} />
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
    </ThemeProvider>
  );
};

export default App;
