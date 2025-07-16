import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

interface PlayerProps {
  position: { x: number; y: number };
  health: number;
  level: number;
}

export default function Player({ position, health, level }: PlayerProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = position.x;
      meshRef.current.position.y = position.y;
    }
  });

  return (
    <group>
      {/* Player sprite - simple colored box for now */}
      <mesh ref={meshRef} position={[position.x, position.y, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color={health > 50 ? "#4CAF50" : "#FF5722"} />
      </mesh>
      
      {/* Health bar */}
      <mesh position={[position.x, position.y + 0.6, 0.1]}>
        <boxGeometry args={[0.8, 0.1, 0.01]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[position.x - 0.4 + (0.8 * health / 100) / 2, position.y + 0.6, 0.11]}>
        <boxGeometry args={[0.8 * health / 100, 0.08, 0.01]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
    </group>
  );
}
