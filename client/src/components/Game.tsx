import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { useInventory } from "../lib/stores/useInventory";
import { useAudio } from "../lib/stores/useAudio";
import Player from "./Player";
import Dungeon from "./Dungeon";
import Monster from "./Monster";
import { GamePhase } from "../lib/gameTypes";

enum Controls {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
  action = 'action',
  inventory = 'inventory',
  craft = 'craft',
  sanctum = 'sanctum'
}

export default function Game() {
  const { 
    gamePhase, 
    playerPosition, 
    playerHealth, 
    playerLevel,
    monsters,
    currentFloor,
    pendingDrops,
    setGamePhase,
    movePlayer,
    attackMonster,
    takeDamage,
    healPlayer,
    gainExp,
    nextFloor,
    resetRun,
    initializeGame,
    clearPendingDrops
  } = useGameState();
  
  const { showInventory, showCrafting, toggleInventory, toggleCrafting, addItem } = useInventory();
  const { playHit, playSuccess } = useAudio();
  
  const [subscribe, getState] = useKeyboardControls<Controls>();
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const lastMoveTime = useRef<{ [key: string]: number }>({});
  const moveDelay = 150; // Milliseconds between moves

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Handle keyboard controls
  useEffect(() => {
    const unsubscribeInventory = subscribe(
      state => state.inventory,
      (pressed) => {
        if (pressed) {
          console.log("Inventory key pressed");
          toggleInventory();
        }
      }
    );

    const unsubscribeCraft = subscribe(
      state => state.craft,
      (pressed) => {
        if (pressed) {
          console.log("Craft key pressed");
          toggleCrafting();
        }
      }
    );

    const unsubscribeSanctum = subscribe(
      state => state.sanctum,
      (pressed) => {
        if (pressed && gamePhase === 'ready') {
          console.log("Sanctum key pressed");
          setGamePhase('sanctum');
        }
      }
    );

    return () => {
      unsubscribeInventory();
      unsubscribeCraft();
      unsubscribeSanctum();
    };
  }, [subscribe, toggleInventory, toggleCrafting, setGamePhase, gamePhase]);

  // Game loop with movement throttling
  useFrame(() => {
    if (gamePhase !== 'playing') return;

    const controls = getState();
    const currentTime = Date.now();
    
    // Handle movement with throttling and collision detection
    if (controls.up && (!lastMoveTime.current.up || currentTime - lastMoveTime.current.up > moveDelay)) {
      console.log("Moving up");
      movePlayer(0, 1);
      lastMoveTime.current.up = currentTime;
    }
    if (controls.down && (!lastMoveTime.current.down || currentTime - lastMoveTime.current.down > moveDelay)) {
      console.log("Moving down");
      movePlayer(0, -1);
      lastMoveTime.current.down = currentTime;
    }
    if (controls.left && (!lastMoveTime.current.left || currentTime - lastMoveTime.current.left > moveDelay)) {
      console.log("Moving left");
      movePlayer(-1, 0);
      lastMoveTime.current.left = currentTime;
    }
    if (controls.right && (!lastMoveTime.current.right || currentTime - lastMoveTime.current.right > moveDelay)) {
      console.log("Moving right");
      movePlayer(1, 0);
      lastMoveTime.current.right = currentTime;
    }
    
    // Handle action (attack/interact)
    if (controls.action && (!lastMoveTime.current.action || currentTime - lastMoveTime.current.action > 300)) {
      console.log("Action key pressed");
      const nearbyMonster = monsters.find(monster => 
        Math.abs(monster.position.x - playerPosition.x) < 1.5 && 
        Math.abs(monster.position.y - playerPosition.y) < 1.5
      );
      
      if (nearbyMonster) {
        attackMonster(nearbyMonster.id);
        playHit();
      } else {
        // Check if all monsters are defeated and player can go to next floor
        const aliveMonsters = monsters.filter(monster => monster.health > 0);
        if (aliveMonsters.length === 0) {
          console.log("Going to next floor!");
          nextFloor();
          playSuccess();
        }
      }
      lastMoveTime.current.action = currentTime;
    }
  });

  // Monster AI and game logic
  useEffect(() => {
    if (gamePhase !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      // Simple monster AI - move towards player
      monsters.forEach(monster => {
        const dx = playerPosition.x - monster.position.x;
        const dy = playerPosition.y - monster.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
          // Move towards player
          const moveX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
          const moveY = dy > 0 ? 1 : dy < 0 ? -1 : 0;
          
          // Update monster position (simplified)
          monster.position.x += moveX * 0.1;
          monster.position.y += moveY * 0.1;
          
          // Attack if close enough
          if (distance < 1.5) {
            takeDamage(monster.damage);
            playHit();
          }
        }
      });
      
      // Check if all monsters are defeated
      const aliveMonsters = monsters.filter(monster => monster.health > 0);
      if (aliveMonsters.length === 0) {
        // All monsters defeated, player can go to next floor
        console.log("All monsters defeated! Press N to go to next floor");
      }
    }, 500);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gamePhase, monsters, playerPosition, takeDamage, playHit]);

  // Handle game over
  useEffect(() => {
    if (playerHealth <= 0) {
      setGamePhase('gameOver');
      playSuccess(); // Use success sound for game over too
    }
  }, [playerHealth, setGamePhase, playSuccess]);

  // Handle pending drops
  useEffect(() => {
    if (pendingDrops && pendingDrops.length > 0) {
      pendingDrops.forEach(drop => {
        addItem(drop);
      });
      clearPendingDrops();
    }
  }, [pendingDrops, addItem, clearPendingDrops]);

  return (
    <group>
      <Dungeon />
      <Player position={playerPosition} health={playerHealth} level={playerLevel} />
      {monsters.map(monster => (
        <Monster
          key={monster.id}
          position={monster.position}
          health={monster.health}
          type={monster.type}
        />
      ))}
    </group>
  );
}
