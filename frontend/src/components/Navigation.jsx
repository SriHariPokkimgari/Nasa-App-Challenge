import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap gap-2 md:gap-6 justify-center items-center">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold border-b-2  transition-all    ${
                isActive ? "border-b-blue-500" : " hover:border-b-blue-500 "
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/simulation"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold border-b-2  transition-all    ${
                isActive ? "border-b-blue-500" : " hover:border-b-blue-500"
              }`
            }
          >
            Simulation
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/mitigation"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold border-b-2  transition-all    ${
                isActive ? "border-b-blue-500" : " hover:border-b-blue-500 "
              }`
            }
          >
            Mitigation
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/analysis"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-semibold border-b-2  transition-all    ${
                isActive ? "border-b-blue-500" : "hover:border-b-blue-500"
              }`
            }
          >
            Analysis
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
