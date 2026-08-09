import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
} from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Text,
  OrbitControls,
} from "@react-three/drei";

import * as THREE from "three";


// =====================================================
// Animated 3D Carbon Bar
// =====================================================

function Bar({
  position,
  targetHeight,
  color,
  label,
  value,
  index,
}) {
  const meshRef = useRef();

  const [currentHeight, setCurrentHeight] =
    useState(0);

  // ---------------------------------------------------
  // Stagger bar animation
  // ---------------------------------------------------

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentHeight(targetHeight);
    }, index * 80);

    return () => clearTimeout(timeout);
  }, [targetHeight, index]);


  // ---------------------------------------------------
  // Smooth bar animation
  // ---------------------------------------------------

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    meshRef.current.scale.y =
      THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        currentHeight,
        delta * 4
      );

    meshRef.current.position.y =
      meshRef.current.scale.y / 2;
  });


  return (
    <group position={position}>

      {/* =========================================
          Main 3D Bar
      ========================================= */}

      <mesh
        ref={meshRef}
        scale={[1, 0.001, 1]}
        castShadow
      >
        <boxGeometry
          args={[0.6, 1, 0.6]}
        />

        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>


      {/* =========================================
          Soft Base Highlight
      ========================================= */}

      <mesh
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry
          args={[0.72, 0.72]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          transparent
          opacity={0.08}
        />
      </mesh>


      {/* =========================================
          Date Label
      ========================================= */}

      <Text
        position={[0, -0.5, 0]}
        rotation={[
          -Math.PI / 4,
          0,
          0,
        ]}
        fontSize={0.25}
        color="#647067"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>


      {/* =========================================
          Value Label
      ========================================= */}

      {value > 0 && (
        <Text
          position={[
            0,
            targetHeight + 0.4,
            0,
          ]}
          fontSize={0.22}
          color="#17211B"
          anchorX="center"
          anchorY="middle"
        >
          {value.toFixed(1)}
        </Text>
      )}

    </group>
  );
}


// =====================================================
// Light Theme Grid Floor
// =====================================================

function GridFloor() {
  return (
    <>
      {/* -----------------------------------------
          Grid
      ----------------------------------------- */}

      <gridHelper
        args={[
          20,
          20,
          "#D7DED9",
          "#E8ECE9",
        ]}
        position={[0, 0, 0]}
      />


      {/* -----------------------------------------
          White Ground Plane
      ----------------------------------------- */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry
          args={[20, 20]}
        />

        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.9}
        />
      </mesh>
    </>
  );
}


// =====================================================
// Main Chart Scene
// =====================================================

function ChartScene({ activities }) {

  // ---------------------------------------------------
  // CarbonTrack Green Palette
  // ---------------------------------------------------

  const BAR_COLORS = [
    "#16A34A",
    "#22C55E",
    "#15803D",
    "#4ADE80",
    "#166534",
    "#34D399",
    "#65A30D",
  ];


  // ---------------------------------------------------
  // Group activities by date
  // ---------------------------------------------------

  const chartData = useMemo(() => {

    const grouped = {};

    activities.forEach((item) => {

      const date =
        item.date || "Unknown";

      grouped[date] =
        (grouped[date] || 0) +
        Number(
          item.carbonEmission || 0
        );
    });


    // Sort by date and keep
    // the latest 10 entries

    return Object.entries(grouped)
      .sort(([a], [b]) =>
        a.localeCompare(b)
      )
      .slice(-10);

  }, [activities]);


  // ---------------------------------------------------
  // Empty State
  // ---------------------------------------------------

  if (chartData.length === 0) {

    return (
      <Text
        position={[0, 1, 0]}
        fontSize={0.4}
        color="#647067"
        anchorX="center"
        anchorY="middle"
      >
        No data yet — log some activities!
      </Text>
    );
  }


  // ---------------------------------------------------
  // Find highest emission value
  // ---------------------------------------------------

  const maxVal = Math.max(
    ...chartData.map(
      ([, value]) => value
    ),
    1
  );


  // ---------------------------------------------------
  // Bar spacing
  // ---------------------------------------------------

  const spacing = 1.2;

  const totalWidth =
    (chartData.length - 1) *
    spacing;


  return (
    <>

      {/* =========================================
          LIGHT THEME LIGHTING
      ========================================= */}

      <ambientLight
        intensity={1.4}
      />

      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
      />

      <directionalLight
        position={[-5, 6, -5]}
        intensity={0.5}
      />


      {/* =========================================
          Floor
      ========================================= */}

      <GridFloor />


      {/* =========================================
          Carbon Bars
      ========================================= */}

      {chartData.map(
        ([date, value], index) => {

          // Normalize height
          const normalizedHeight =
            Math.max(
              (value / maxVal) * 4,
              0.1
            );


          // Center chart
          const x =
            index * spacing -
            totalWidth / 2;


          // Select green shade
          const color =
            BAR_COLORS[
              index %
                BAR_COLORS.length
            ];


          // Format date
          const label =
            date.length >= 5
              ? date.slice(-5)
              : date;


          return (
            <Bar
              key={date}
              index={index}
              position={[
                x,
                0,
                0,
              ]}
              targetHeight={
                normalizedHeight
              }
              color={color}
              label={label}
              value={value}
            />
          );
        }
      )}


      {/* =========================================
          Y Axis Label
      ========================================= */}

      <Text
        position={[
          -totalWidth / 2 - 1.2,
          2,
          0,
        ]}
        rotation={[
          0,
          0,
          Math.PI / 2,
        ]}
        fontSize={0.22}
        color="#647067"
        anchorX="center"
        anchorY="middle"
      >
        kg CO₂e
      </Text>

    </>
  );
}


// =====================================================
// Main Exported Component
// =====================================================

export default function ThreeCarbonChart({
  activities,
}) {

  return (
    <div
      style={{
        width: "100%",
        height: "380px",
        background: "#FFFFFF",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >

      <Canvas
        shadows
        camera={{
          position: [0, 5, 12],
          fov: 50,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        style={{
          background:
            "transparent",
        }}
      >

        {/* =====================================
            Chart Scene
        ===================================== */}

        <ChartScene
          activities={activities}
        />


        {/* =====================================
            Mouse / Touch Controls
        ===================================== */}

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={
            Math.PI / 6
          }
          maxPolarAngle={
            Math.PI / 2.2
          }
          autoRotate
          autoRotateSpeed={0.4}
        />

      </Canvas>

    </div>
  );
}