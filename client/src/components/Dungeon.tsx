import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { useGameState } from "../lib/stores/useGameState";
import { generateDungeon } from "../lib/dungeonGenerator";

export default function Dungeon() {
  const { currentFloor, dungeonLayout } = useGameState();
  const stoneTexture = useTexture("/textures/asphalt.png");
  
  // Use the dungeon layout from game state instead of generating a new one
  const dungeon = dungeonLayout || generateDungeon(20, 20, currentFloor);

  // Create floor tiles
  const floorTiles = useMemo(() => {
    const tiles = [];
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        if (dungeon.tiles[x][y] === 0) { // Floor tile
          tiles.push(
            <mesh key={`floor-${x}-${y}`} position={[x - 10, y - 10, -0.5]}>
              <boxGeometry args={[1, 1, 0.1]} />
              <meshStandardMaterial map={stoneTexture} />
            </mesh>
          );
        }
      }
    }
    return tiles;
  }, [dungeon, stoneTexture]);

  // Create wall tiles
  const wallTiles = useMemo(() => {
    const tiles = [];
    for (let x = 0; x < dungeon.width; x++) {
      for (let y = 0; y < dungeon.height; y++) {
        if (dungeon.tiles[x][y] === 1) { // Wall tile
          tiles.push(
            <mesh key={`wall-${x}-${y}`} position={[x - 10, y - 10, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#444" />
            </mesh>
          );
        }
      }
    }
    return tiles;
  }, [dungeon]);

  return (
    <group>
      {floorTiles}
      {wallTiles}
    </group>
  );
}
