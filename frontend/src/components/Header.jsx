import { dataContext } from "@/Context";
import React, { useContext } from "react";

const Header = () => {
  const { showEducational, setShowEducational, showScenario, setShowScenario } =
    useContext(dataContext);

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-blue-400">
              🌍 Asteroid Impact Simulator
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowEducational(!showEducational)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              {showEducational ? "Hide" : "Show"} Educational
            </button>
            <button
              onClick={() => setShowScenario(!showScenario)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Impactor-2025 Scenario
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
