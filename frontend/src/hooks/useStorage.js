import {
  getAsteroidDetails,
  getAsteroids,
  simulateImpact,
} from "@/services/api";
import { useCallback, useEffect, useMemo, useReducer } from "react";

function avgDiameterFromEstimated(estimated) {
  if (!estimated?.meters) return null;
  const m = estimated.meters;
  return (m.estimated_diameter_min + m.estimated_diameter_max) / 2;
}

export function useStorage() {
  const [
    {
      asteroidsData,
      selectedId,
      size,
      selectedAsteroid,
      velocity,
      velocityChange,
      impactResult,
      showScenario,
      showEducational,
      mitigationResults,
      riskData,
    },
    dispatch,
  ] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setAsteroidsData":
          return {
            ...state,
            asteroidsData: action.payload,
          };
        case "setSelectedId":
          return {
            ...state,
            selectedId: action.payload,
          };
        case "setSelectedAsteroid":
          return {
            ...state,
            selectedAsteroid: action.payload,
          };
        case "setSize":
          return {
            ...state,
            size: action.payload,
          };
        case "setVelocity":
          return {
            ...state,
            velocity: action.payload,
          };
        case "setVelocityChange":
          return {
            ...state,
            velocityChange: action.payload,
          };
        case "setImpactResult":
          return {
            ...state,
            impactResult: action.payload,
          };
        case "setShowEducational":
          return {
            ...state,
            showEducational: action.payload,
          };
        case "setShowScenario":
          return {
            ...state,
            showScenario: action.payload,
          };
        case "setMitigationResults":
          return {
            ...state,
            mitigationResults: action.payload,
          };
        case "setRiskData":
          return {
            ...state,
            riskData: action.payload,
          };
      }
    },
    {
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
    }
  );

  useEffect(() => {
    async function load() {
      const data = await getAsteroids(0);
      // NASA browse returns near_earth_objects array OR near_earth_objects keyed by page; handle both
      const list = data.near_earth_objects || data;
      dispatch({ type: "setAsteroidsData", payload: list || [] });
    }
    load();
  }, []);

  useEffect(() => {
    // when user selects an asteroid id, fetch details and fill defaults
    if (!selectedId) {
      dispatch({ type: "setSelectedAsteroid", payload: null });
      return;
    }
    (async () => {
      const details = await getAsteroidDetails(selectedId);
      dispatch({ type: "setSelectedAsteroid", payload: details });

      const avgD = avgDiameterFromEstimated(details.estimated_diameter);
      const relVel =
        details.close_approach_data?.[0]?.relative_velocity
          ?.kilometers_per_second;
      if (avgD) dispatch({ type: "setSize", payload: Math.round(avgD) });
      if (relVel)
        dispatch({
          type: "setVelocity",
          payload: Number(parseFloat(relVel).toFixed(2)),
        });
      // trigger an immediate simulation (using asteroid defaults)
      // const sim = await simulateImpact(
      //   avgD || size,
      //   relVel || velocity,
      //   velocityChange,
      //   selectedId
      // );
      // dispatch({ type: "setImpactResult", payload:  });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // When size/velocity/velocityChange change, re-simulate (but keep asteroidId if selected)
  // useEffect(() => {
  //   (async () => {
  //     const sim = await simulateImpact(
  //       size,
  //       velocity,
  //       velocityChange,
  //       selectedId
  //     );
  //     dispatch({ type: "setImpactResult", payload: sim });
  //   })();
  // }, [size, velocity, velocityChange, selectedId]);

  const setSelectedId = useCallback((input) => {
    dispatch({ type: "setSelectedId", payload: input });
  }, []);

  const setVelocityChange = useCallback((number) => {
    dispatch({ type: "setVelocityChange", payload: number });
  }, []);

  const setVelocity = useCallback((input) => {
    dispatch({ type: "setVelocity", payload: input });
  }, []);

  const setSize = useCallback((input) => {
    dispatch({ type: "setSize", payload: input });
  }, []);

  const setMitigationResults = useCallback((data) => {
    dispatch({ type: "setMitigationResults", payload: data });
  }, []);

  const setShowScenario = useCallback((toggle) => {
    dispatch({ type: "setShowScenario", payload: toggle });
  }, []);

  const setShowEducational = useCallback((toggle) => {
    dispatch({ type: "setShowEducational", payload: toggle });
  }, []);

  const setImpactResult = useCallback((data) => {
    dispatch({ type: "setImpactResult", payload: data });
  }, []);
  return {
    asteroidsData,
    selectedId,
    selectedAsteroid,
    size,
    velocity,
    velocityChange,
    impactResult,
    showEducational,
    showScenario,
    mitigationResults,
    riskData,
    setSelectedId,
    setVelocityChange,
    setVelocity,
    setSize,
    setMitigationResults,
    setShowScenario,
    setShowEducational,
    setImpactResult,
  };
}
