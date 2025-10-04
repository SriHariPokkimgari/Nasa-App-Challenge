import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `py-4 px-2 border-b-2 font-medium text-base transition-colors ${
                isActive
                  ? "border-b-blue-600 text-blue-700"
                  : "border-transparent text-blue-500 hover:text-blue-700 hover:border-blue-200"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/simulation"
            className={({ isActive }) =>
              `py-4 px-2 border-b-2 font-medium text-base transition-colors ${
                isActive
                  ? "border-b-blue-600 text-blue-700"
                  : "border-transparent text-blue-500 hover:text-blue-700 hover:border-blue-200"
              }`
            }
          >
            Simulation
          </NavLink>
          <NavLink
            to="/mitigation"
            className={({ isActive }) =>
              `py-4 px-2 border-b-2 font-medium text-base transition-colors ${
                isActive
                  ? "border-b-blue-600 text-blue-700"
                  : "border-transparent text-blue-500 hover:text-blue-700 hover:border-blue-200"
              }`
            }
          >
            Mitigation
          </NavLink>
          <NavLink
            to="/analysis"
            className={({ isActive }) =>
              `py-4 px-2 border-b-2 font-medium text-base transition-colors ${
                isActive
                  ? "border-b-blue-600 text-blue-700"
                  : "border-transparent text-blue-500 hover:text-blue-700 hover:border-blue-200"
              }`
            }
          >
            Analysis
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
