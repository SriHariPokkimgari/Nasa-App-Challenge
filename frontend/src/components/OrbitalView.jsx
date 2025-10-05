import React, { useRef, useState, useEffect, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import Asteroid from "./Asteroid";
import { dataContext } from "@/context";

const Earth = ({ selectedAsteroid }) => {
  const earthRef = useRef();

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={earthRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={new THREE.TextureLoader().load(
          "https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg"
        )}
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
};

const OrbitalPath = ({ asteroid, isSelected }) => {
  const pathRef = useRef();

  useEffect(() => {
    if (pathRef.current) {
      const points = [];
      const radius = asteroid.radius || 5;
      const segments = 64;

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        points.push(new THREE.Vector3(x, asteroid.yOffset || 0, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      pathRef.current.geometry = geometry;
    }
  }, [asteroid]);

  return (
    <line ref={pathRef}>
      <lineBasicMaterial
        color={isSelected ? "#ff6b6b" : "#4a90e2"}
        opacity={isSelected ? 0.8 : 0.3}
        transparent
      />
    </line>
  );
};

const ImpactZone = ({ impactResult, selectedAsteroid }) => {
  if (!impactResult || !selectedAsteroid) return null;

  const craterRadius = Math.min(impactResult.crater / 1000, 0.5); // Scale down for visualization

  return (
    <mesh position={[0, 0, 1.01]}>
      <circleGeometry args={[craterRadius, 32]} />
      <meshBasicMaterial
        color="#ff4444"
        opacity={0.6}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const OrbitalView = () => {
  const {
    asteroidsData: asteroids,
    selectedAsteroid,
    impactResult,
  } = useContext(dataContext);
  const [hoveredAsteroid, setHoveredAsteroid] = useState(null);
  const [showLabels, setShowLabels] = useState(true);

  // Enhanced asteroid mapping with orbital mechanics
  const mappedAsteroids = asteroids.map((a) => {
    const diameter = a.estimated_diameter?.meters;
    const size = diameter
      ? (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2
      : 10;

    return {
      id: a.id,
      name: a.name,
      size: Math.max(size / 1000, 0.1), // Scale down for visualization
      radius: 3 + Math.random() * 8, // Orbital distance
      yOffset: (Math.random() - 0.5) * 3,
      speed: 0.005 + Math.random() * 0.01,
      isHazardous: a.is_potentially_hazardous_asteroid,
      isSelected: selectedAsteroid?.id === a.id,
    };
  });

  return (
    <div className="relative">
      <Canvas
        style={{
          height: "500px",
          background: "radial-gradient(circle, #1a1a2e 0%, #000 100%)",
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#4a90e2"
        />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />

        {/* Earth */}
        <Earth selectedAsteroid={selectedAsteroid} />

        {/* Impact Zone */}
        <ImpactZone
          impactResult={impactResult}
          selectedAsteroid={selectedAsteroid}
        />

        {/* Asteroids with orbital paths */}
        {mappedAsteroids.map((asteroid) => (
          <group key={asteroid.id}>
            <OrbitalPath asteroid={asteroid} isSelected={asteroid.isSelected} />
            <Asteroid
              asteroid={asteroid}
              speed={asteroid.speed}
              isSelected={asteroid.isSelected}
              isHazardous={asteroid.isHazardous}
              onHover={(hovered) =>
                setHoveredAsteroid(hovered ? asteroid : null)
              }
            />
          </group>
        ))}

        {/* Labels */}
        {showLabels && hoveredAsteroid && (
          <Html position={[0, 0, 0]}>
            <div className="bg-gray-800 text-white p-2 rounded-lg shadow-lg max-w-xs">
              <div className="font-bold">{hoveredAsteroid.name}</div>
              <div className="text-sm text-gray-300">
                Size: {hoveredAsteroid.size.toFixed(1)}m
              </div>
              <div className="text-sm text-gray-300">
                Hazardous: {hoveredAsteroid.isHazardous ? "Yes" : "No"}
              </div>
            </div>
          </Html>
        )}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
        />
      </Canvas>

      {/* Controls */}
      <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-75 p-2 rounded-lg">
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="text-white text-sm hover:text-blue-400 transition-colors"
        >
          {showLabels ? "Hide" : "Show"} Labels
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-75 p-3 rounded-lg text-white text-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Normal Asteroids</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Hazardous Asteroids</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Selected Asteroid</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrbitalView;
