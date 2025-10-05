import { dataContext } from "@/Context";
import React, { useContext } from "react";

const AsteroidSelector = () => {
  const {
    asteroidsData: asteroids,
    selectedId,
    setSelectedId,
  } = useContext(dataContext);
  return (
    <div className="bg-white dark:bg-black border border-blue-100 dark:border-gray-700 rounded-2xl shadow-lg p-4 mb-4 transition-colors">
      <label
        className="block font-bold  mb-2 text-lg"
        htmlFor="asteroid-select"
      >
        Select Asteroid
      </label>
      <select
        id="asteroid-select"
        className="w-full p-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 font-semibold transition-all"
        value={selectedId || ""}
        onChange={(e) => setSelectedId(e.target.value)}
        aria-label="Select Asteroid"
      >
        <option value="">— Pick an asteroid —</option>
        {asteroids.map((a) => (
          <option key={a.id} value={a.id} className="font-mono">
            {a.name} — {a.id}
          </option>
        ))}
      </select>
      {selectedId && (
        <div className="mt-2 text-blue-700 text-sm font-medium animate-fade-in">
          Selected:{" "}
          <span className="font-mono">
            {asteroids.find((a) => a.id === selectedId)?.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default AsteroidSelector;
