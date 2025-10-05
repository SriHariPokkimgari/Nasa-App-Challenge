import { dataContext } from "@/context";
import React, { useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const RiskChart = () => {
  const { riskData: data } = useContext(dataContext);
  // Generate sample risk data if none provided
  const sampleData =
    data.length > 0
      ? data
      : [
          { time: "0", risk: 0.1, energy: 0 },
          { time: "1", risk: 0.15, energy: 0.5 },
          { time: "2", risk: 0.25, energy: 1.2 },
          { time: "3", risk: 0.4, energy: 2.1 },
          { time: "4", risk: 0.6, energy: 3.5 },
          { time: "5", risk: 0.8, energy: 5.2 },
          { time: "6", risk: 0.9, energy: 7.1 },
          { time: "7", risk: 0.95, energy: 9.3 },
          { time: "8", risk: 0.98, energy: 12.1 },
          { time: "9", risk: 1.0, energy: 15.5 },
        ];

  const riskLevelData = [
    { level: "Low", count: 15, color: "#10B981" },
    { level: "Medium", count: 8, color: "#F59E0B" },
    { level: "High", count: 3, color: "#EF4444" },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-900/80 to-gray-900/90 dark:from-black dark:to-gray-900 p-8 rounded-2xl shadow-2xl border border-blue-700/30 transition-colors">
      <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-blue-200">
        <span className="inline-block text-yellow-400 text-2xl">
          &#9888;&#65039;
        </span>
        Risk Assessment
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Over Time */}
        <div className="bg-white dark:bg-black p-6 rounded-xl shadow-lg border border-blue-600/30 transition-colors">
          <h4 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
            <span className="text-lg">&#9201;</span> Risk Evolution
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} domain={[0, 1]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "#F3F4F6" }}
              />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Level Distribution */}
        <div className="bg-white dark:bg-black p-6 rounded-xl shadow-lg border border-green-600/30 transition-colors">
          <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
            <span className="text-lg">&#128200;</span> Risk Level Distribution
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskLevelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="level" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "6px",
                }}
                labelStyle={{ color: "#F3F4F6" }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow border border-green-500/30 transition-colors">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
            <span className="font-medium text-green-200">Low Risk</span>
          </div>
          <div className="text-sm text-green-100 mt-1">Risk score &lt; 0.3</div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow border border-yellow-500/30 transition-colors">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
            <span className="font-medium text-yellow-100">Medium Risk</span>
          </div>
          <div className="text-sm text-yellow-100 mt-1">
            Risk score 0.3 - 0.7
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow border border-red-500/30 transition-colors">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
            <span className="font-medium text-red-100">High Risk</span>
          </div>
          <div className="text-sm text-red-100 mt-1">Risk score &gt; 0.7</div>
        </div>
      </div>
    </div>
  );
};

export default RiskChart;
