// import React from "react";

// const steps = [
//   { label: "Select Asteroid" },
//   { label: "Select Impact Location" },
//   { label: "Adjust Parameters" },
//   { label: "Run Simulation" },
//   { label: "View Results" },
// ];

// const SimulationStepper = ({ currentStep }) => {
//   return (
//     <aside className="hidden lg:block w-64 pr-6">
//       <nav aria-label="Simulation steps" className="mt-4">
//         <ol className="space-y-4">
//           {steps.map((step, idx) => (
//             <li key={step.label}>
//               <div
//                 className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-base transition-colors
//                   ${
//                     idx === currentStep
//                       ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600 shadow"
//                       : idx < currentStep
//                       ? "bg-green-100 text-green-700 border-l-4 border-green-500"
//                       : "bg-gray-100 text-gray-400 border-l-4 border-gray-200"
//                   }
//                 `}
//               >
//                 <span className="w-6 text-center font-bold">
//                   {idx < currentStep ? "✓" : idx + 1}
//                 </span>
//                 <span>{step.label}</span>
//               </div>
//             </li>
//           ))}
//         </ol>
//       </nav>
//     </aside>
//   );
// };

// export default SimulationStepper;
