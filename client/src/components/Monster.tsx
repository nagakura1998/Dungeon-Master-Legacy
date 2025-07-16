import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

interface MonsterProps {
  position: { x: number; y: number };
  health: number;
  type: string;
}

export default function Monster({ position, health, type }: MonsterProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = position.x;
      meshRef.current.position.y = position.y;
    }
  });

  const getMonsterColor = (type: string) => {
    switch (type) {
      case 'goblin': return '#8B4513';
      case 'orc': return '#556B2F';
      case 'skeleton': return '#F5F5DC';
      default: return '#8B0000';
    }
  };

  return (
    <group>
      {/* Monster sprite */}
      <mesh ref={meshRef} position={[position.x, position.y, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.1]} />
        <meshStandardMaterial color={getMonsterColor(type)} />
      </mesh>
      
      {/* Health bar */}
      <mesh position={[position.x, position.y + 0.5, 0.1]}>
        <boxGeometry args={[0.7, 0.08, 0.01]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[position.x - 0.35 + (0.7 * health / 100) / 2, position.y + 0.5, 0.11]}>
        <boxGeometry args={[0.7 * health / 100, 0.06, 0.01]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>
    </group>
  );
}
