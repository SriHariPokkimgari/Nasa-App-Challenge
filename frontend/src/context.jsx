import { createContext } from "react";
import { useStorage } from "./hooks/useStorage";

const defaultContext = {
  asteroidsData: [],
  selectedId: "",
  selectedAsteroid: null,
  size: 100,
  velocity: 20,
  velocityChange: 0,
  impactResult: null,
  showEducational: false,
  showScenario: false,
  mitigationResults: null,
  riskData: [],
  setSelectedId: () => {},
  setVelocityChange: () => {},
  setVelocity: () => {},
  setSize: () => {},
  setMitigationResults: () => {},
  setShowScenario: () => {},
  setShowEducational: () => {},
  setImpactResult: () => {},
};
export const dataContext = createContext(defaultContext);

export const ContextProvider = ({ children }) => {
  return (
    <dataContext.Provider value={useStorage()}>{children}</dataContext.Provider>
  );
};
