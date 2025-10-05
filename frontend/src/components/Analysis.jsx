import { dataContext } from "@/Context";
import React, { useContext } from "react";

const Analysis = () => {
  const { impactResult } = useContext(dataContext);
  return (
    <div className="space-y-10">
      <div className="bg-gradient-to-br from-blue-900/80 to-gray-900/90 dark:from-black dark:to-gray-900 p-8 rounded-2xl shadow-2xl border border-blue-700/30 transition-colors">
        <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-2 text-blue-200">
          <span className="inline-block text-blue-400 text-2xl">&#128300;</span>
          Advanced Impact Analysis
        </h2>
        {impactResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Atmospheric Effects Card */}
            <div className="bg-white dark:bg-black p-6 rounded-xl shadow-lg border border-blue-600/30 transition-colors">
              <h3 className="font-bold  mb-3 flex items-center gap-2">
                <span className="text-xl">&#9729;&#65039;</span> Atmospheric
                Effects
              </h3>
              <div className="space-y-3 text-base">
                <div className="flex items-center gap-2">
                  <span className="">&#8593;</span>
                  Airburst Altitude:{" "}
                  <span className="font-semibold">
                    {impactResult.atmosphericEffects.airburstAltitude.toFixed(
                      0
                    )}{" "}
                    m
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>&#128293;</span>
                  Fireball Radius:{" "}
                  <span className="font-semibold">
                    {impactResult.atmosphericEffects.fireballRadius.toFixed(0)}{" "}
                    m
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="">&#9889;</span>
                  Energy:{" "}
                  <span className="font-semibold">
                    {impactResult.atmosphericEffects.energy.toFixed(2)} TJ
                  </span>
                </div>
              </div>
            </div>
            {/* Environmental Impact Card */}
            <div className="bg-white dark:bg-black p-6 rounded-xl shadow-lg border border-red-600/30 transition-colors">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">&#127758;</span> Environmental Impact
              </h3>
              <div className="space-y-3 text-base ">
                <div className="flex items-center gap-2">
                  <span className="">&#128165;</span>
                  Impact Type:{" "}
                  <span className="font-semibold">
                    {impactResult.environmentalEffects.impactType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="">&#128205;</span>
                  Affected Radius:{" "}
                  <span className="font-semibold">
                    {(
                      impactResult.environmentalEffects.affectedRadius / 1000
                    ).toFixed(1)}{" "}
                    km
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="">&#127786;</span>
                  Seismic:{" "}
                  <span className="font-semibold">
                    {impactResult.environmentalEffects.environmentalDamage
                      .seismic
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="">&#128167;</span>
                  Tsunami:{" "}
                  <span className="font-semibold">
                    {impactResult.environmentalEffects.environmentalDamage
                      .tsunami
                      ? "Yes"
                      : "No"}
                  </span>
                </div>
              </div>
            </div>
            {/* Risk Assessment Card */}
            <div className="bg-white dark:bg-black p-6 rounded-xl shadow-lg border border-yellow-500/30 transition-colors">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">&#9888;&#65039;</span> Risk Assessment
              </h3>
              <div className="space-y-3 text-base ">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">&#128200;</span>
                  Risk Level:{" "}
                  <span
                    className={`font-bold ${
                      impactResult.riskAssessment.riskLevel === "HIGH"
                        ? "text-red-400"
                        : impactResult.riskAssessment.riskLevel === "MEDIUM"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {impactResult.riskAssessment.riskLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-200">&#11088;</span>
                  Risk Score:{" "}
                  <span className="font-semibold">
                    {impactResult.riskAssessment.riskScore.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-200">&#128170;</span>
                  Energy Factor:{" "}
                  <span className="font-semibold">
                    {impactResult.riskAssessment.factors.energy.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
