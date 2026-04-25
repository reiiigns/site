'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

function Keycap() {
  return (
    <mesh rotation={[0.3, 0.6, 0]}>
      <boxGeometry args={[1, 0.6, 1]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.15}
        roughness={0.1}
        metalness={0.2}
      />
    </mesh>
  );
}

export default function ArtifactScene() {
  return (
    <Canvas camera={{ position: [2, 2, 2] }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="city" />
      <Keycap />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
