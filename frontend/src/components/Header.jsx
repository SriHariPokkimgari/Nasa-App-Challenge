import { dataContext } from "@/Context";
import React, { useContext } from "react";
import Navigation from "./Navigation";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const { showEducational, setShowEducational, showScenario, setShowScenario } =
    useContext(dataContext);

  return (
    <header className="bg-background shadow-md border-b border-border transition-colors">
      <div className="  px-4 sm:px-8 lg:px-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-2 md:gap-0">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-400">
              <a href="/">🌍 Asteroid Impactor</a>
            </h1>
          </div>

          {/* Navigation */}
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <Navigation />
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <button
              onClick={() => setShowEducational(!showEducational)}
              className={`px-4 py-2 rounded-lg font-semibold   hover:bg-secondary/80 focus:outline-none  transition-all shadow-lg }`}
              aria-pressed={showEducational}
            >
              {showEducational ? "Hide" : "Show"} Educational
            </button>
            <button
              onClick={() => setShowScenario(!showScenario)}
              className={`px-4 py-2 rounded-lg font-semibold hover:bg-secondary/80 focus:outline-none   transition-all shadow-lg `}
              aria-pressed={showScenario}
            >
              Impactor-2025 Scenario
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
