import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ------- Individual animated bar -------
function Bar({ position, targetHeight, color, label, value, index }) {
  const meshRef = useRef();
  const [currentHeight, setCurrentHeight] = useState(0);

  useEffect(() => {
    // Stagger animation start by index
    const timeout = setTimeout(() => {
      setCurrentHeight(targetHeight);
    }, index * 80);
    return () => clearTimeout(timeout);
  }, [targetHeight, index]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Smooth lerp to target height
    meshRef.current.scale.y = THREE.MathUtils.lerp(
      meshRef.current.scale.y,
      currentHeight,
      delta * 4
    );
    meshRef.current.position.y = meshRef.current.scale.y / 2;
  });

  return (
    <group position={position}>
      {/* Bar mesh - starts at scale 0 */}
      <mesh ref={meshRef} scale={[1, 0.001, 1]} castShadow>
        <boxGeometry args={[0.6, 1, 0.6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          roughness={0.25}
          metalness={0.4}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Base glow plane */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.65, 0.65]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Date label below */}
      <Text
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 4, 0, 0]}
        fontSize={0.25}
        color="#33443c"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Value label above bar */}
      {value > 0 && (
        <Text
          position={[0, targetHeight + 0.4, 0]}
          fontSize={0.22}
          color="#0f1a14"
          anchorX="center"
          anchorY="middle"
        >
          {value.toFixed(1)}
        </Text>
      )}
    </group>
  );
}

// ------- Grid floor -------
function GridFloor() {
  return (
    <group>
      <gridHelper args={[20, 20, "#c7d4cd", "#dbe5df"]} position={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#f1f5f3"
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

// ------- Floating particles -------
function Particles() {
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = Math.random() * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return arr;
  }, []);

  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#22c274" transparent opacity={0.35} />
    </points>
  );
}

// ------- Main chart scene -------
function ChartScene({ activities }) {
  const BAR_COLORS = [
    "#22c274", // brand green
    "#4ade93",
    "#86efb8",
    "#16a35e",
    "#12804c",
    "#0d9488",
    "#0f766e",
  ];

  const chartData = useMemo(() => {
    // Group by date and sum emissions
    const grouped = {};
    activities.forEach((item) => {
      const d = item.date || "Unknown";
      grouped[d] = (grouped[d] || 0) + Number(item.carbonEmission || 0);
    });
    const sorted = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10); // last 10 days
    return sorted;
  }, [activities]);

  if (chartData.length === 0) {
    return (
      <Text position={[0, 1, 0]} fontSize={0.4} color="#94a49c" anchorX="center">
        No data yet — log some activities!
      </Text>
    );
  }

  const maxVal = Math.max(...chartData.map(([, v]) => v), 1);
  const spacing = 1.2;
  const totalWidth = (chartData.length - 1) * spacing;

  return (
    <>
      {/* Ambient + directional lights */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 8, -5]} intensity={0.4} color="#22c274" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#0d9488" />

      <GridFloor />
      <Particles />

      {/* Bars */}
      {chartData.map(([date, value], i) => {
        const normalizedHeight = Math.max((value / maxVal) * 4, 0.1);
        const x = i * spacing - totalWidth / 2;
        const color = BAR_COLORS[i % BAR_COLORS.length];
        // Format date label: show last 5 chars e.g. "07-25"
        const label = date.length >= 5 ? date.slice(-5) : date;

        return (
          <Bar
            key={date}
            index={i}
            position={[x, 0, 0]}
            targetHeight={normalizedHeight}
            color={color}
            label={label}
            value={value}
          />
        );
      })}

      {/* Y-axis label */}
      <Text
        position={[-totalWidth / 2 - 1.2, 2, 0]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.22}
        color="#5c6f66"
        anchorX="center"
      >
        kg CO₂e
      </Text>
    </>
  );
}

// ------- Exported wrapper -------
export default function ThreeCarbonChart({ activities }) {
  return (
    <div style={{ width: "100%", height: "380px" }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ChartScene activities={activities} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}
