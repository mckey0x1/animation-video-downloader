"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface ThreedObjectProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function ThreedObject({ canvasRef }: ThreedObjectProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 50 }}
      gl={{ preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        // Assign the actual canvas DOM node to the ref
        if (canvasRef && "current" in canvasRef) {
          canvasRef.current = gl.domElement;
        }
      }}>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff4500" />
      <EarthParticles />
      <FireParticles />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

function EarthParticles() {
  const earthRef = useRef<THREE.Points>(null);
  const earthRadius = 3;
  const particleCount = 3000;

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Generate points on a sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = earthRadius * Math.sin(phi) * Math.cos(theta);
      const y = earthRadius * Math.sin(phi) * Math.sin(theta);
      const z = earthRadius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    return positions;
  }, [particleCount]);

  const colors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Blue-green colors for Earth
      colors[i * 3] = 0.1 + Math.random() * 0.2; // R
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.3; // G
      colors[i * 3 + 2] = 0.6 + Math.random() * 0.4; // B
    }

    return colors;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1;
    }

    // Capture frame for video recording
    if ((window as any).captureFrame) {
      (window as any).captureFrame();
    }
  });

  return (
    <points ref={earthRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} />
    </points>
  );
}

function FireParticles() {
  const fireRef = useRef<THREE.Points>(null);
  const particleCount = 5000;
  const fireRadius = 4;

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Generate points in a shell around the Earth
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Add some randomness to create a fire-like effect
      const radiusVariation = Math.random() * 0.8;
      const radius = fireRadius + radiusVariation;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    return positions;
  }, [particleCount]);

  const colors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Fire colors (red, orange, yellow)
      const colorChoice = Math.random();

      if (colorChoice < 0.3) {
        // Red
        colors[i * 3] = 0.8 + Math.random() * 0.2; // R
        colors[i * 3 + 1] = 0.1 + Math.random() * 0.2; // G
        colors[i * 3 + 2] = 0.0; // B
      } else if (colorChoice < 0.7) {
        // Orange
        colors[i * 3] = 0.9 + Math.random() * 0.1; // R
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3; // G
        colors[i * 3 + 2] = 0.0; // B
      } else {
        // Yellow
        colors[i * 3] = 0.9 + Math.random() * 0.1; // R
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3; // G
        colors[i * 3 + 2] = 0.0 + Math.random() * 0.2; // B
      }
    }

    return colors;
  }, [particleCount]);

  const initialPositions = useMemo(() => {
    return positions.slice();
  }, [positions]);

  useFrame((state, delta) => {
    if (fireRef.current) {
      fireRef.current.rotation.y -= delta * 0.2;

      // Animate fire particles
      const positions = fireRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Add some movement to fire particles
        positions[i3] =
          initialPositions[i3] +
          Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
        positions[i3 + 1] =
          initialPositions[i3 + 1] +
          Math.cos(state.clock.elapsedTime * 2 + i) * 0.1;
        positions[i3 + 2] =
          initialPositions[i3 + 2] +
          Math.sin(state.clock.elapsedTime * 3 + i) * 0.1;
      }

      fireRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Capture frame for video recording
    if ((window as any).captureFrame) {
      (window as any).captureFrame();
    }
  });

  return (
    <points ref={fireRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
