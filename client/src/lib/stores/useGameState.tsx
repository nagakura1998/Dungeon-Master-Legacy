import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GamePhase, Monster, Position } from "../gameTypes";
import { generateDungeon } from "../dungeonGenerator";

interface GameState {
  // Game state
  gamePhase: GamePhase;
  
  // Player state
  playerPosition: Position;
  playerHealth: number;
  playerLevel: number;
  playerExp: number;
  
  // Dungeon state
  currentFloor: number;
  dungeonLayout: any;
  monsters: Monster[];
  pendingDrops: any[];
  
  // Actions
  setGamePhase: (phase: GamePhase) => void;
  initializeGame: () => void;
  resetRun: () => void;
  movePlayer: (dx: number, dy: number) => void;
  takeDamage: (damage: number) => void;
  healPlayer: (amount: number) => void;
  gainExp: (exp: number) => void;
  attackMonster: (monsterId: string) => void;
  nextFloor: () => void;
  clearPendingDrops: () => void;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: 'ready',
    
    playerPosition: { x: 0, y: 0 },
    playerHealth: 100,
    playerLevel: 1,
    playerExp: 0,
    
    currentFloor: 1,
    dungeonLayout: null,
    monsters: [],
    pendingDrops: [],
    
    setGamePhase: (phase) => set({ gamePhase: phase }),
    
    initializeGame: () => {
      const dungeon = generateDungeon(20, 20, 1);
      
      // Find a valid starting position on a floor tile
      let startX = 0;
      let startY = 0;
      
      // Try to find the first room's center as starting position
      if (dungeon.rooms.length > 0) {
        const firstRoom = dungeon.rooms[0];
        startX = firstRoom.x + Math.floor(firstRoom.width / 2) - 10;
        startY = firstRoom.y + Math.floor(firstRoom.height / 2) - 10;
      }
      
      // Generate monsters after dungeon is created so they can use the layout
      const monsters = generateMonsters(5, 1, dungeon);
      
      set({
        playerPosition: { x: startX, y: startY },
        playerHealth: 100,
        playerLevel: 1,
        playerExp: 0,
        currentFloor: 1,
        dungeonLayout: dungeon,
        monsters: monsters,
        gamePhase: 'ready'
      });
    },
    
    resetRun: () => {
      const { initializeGame } = get();
      initializeGame();
    },
    
    movePlayer: (dx, dy) => {
      const { playerPosition, dungeonLayout } = get();
      const newX = playerPosition.x + dx;
      const newY = playerPosition.y + dy;
      
      // Check bounds first
      if (newX < -9.5 || newX > 9.5 || newY < -9.5 || newY > 9.5) {
        return; // Out of bounds
      }
      
      // Check wall collision using dungeon layout
      if (dungeonLayout && dungeonLayout.tiles) {
        // Convert world coordinates to dungeon grid coordinates
        // Add 10 to convert from world space (-10 to 10) to grid space (0 to 20)
        const gridX = Math.floor(newX + 10);
        const gridY = Math.floor(newY + 10);
        
        // Check if the position is within the dungeon grid
        if (gridX >= 0 && gridX < dungeonLayout.width && 
            gridY >= 0 && gridY < dungeonLayout.height) {
          
          // Check if the exact grid position would be a wall
          if (dungeonLayout.tiles[gridX] && dungeonLayout.tiles[gridX][gridY] === 1) {
            return; // Hit a wall, don't move
          }
        } else {
          return; // Out of dungeon bounds
        }
      }
      
      // Movement is valid, update position
      set({
        playerPosition: { x: newX, y: newY }
      });
    },
    
    takeDamage: (damage) => {
      const { playerHealth } = get();
      const newHealth = Math.max(0, playerHealth - damage);
      
      set({ playerHealth: newHealth });
      
      if (newHealth <= 0) {
        set({ gamePhase: 'gameOver' });
      }
    },
    
    healPlayer: (amount) => {
      const { playerHealth } = get();
      const newHealth = Math.min(100, playerHealth + amount);
      set({ playerHealth: newHealth });
      console.log(`Player healed to ${newHealth} HP`);
    },
    
    gainExp: (exp) => {
      const { playerExp, playerLevel } = get();
      const newExp = playerExp + exp;
      
      if (newExp >= 100) {
        set({
          playerExp: newExp - 100,
          playerLevel: playerLevel + 1
        });
      } else {
        set({ playerExp: newExp });
      }
    },
    
    attackMonster: (monsterId) => {
      const { monsters, gainExp } = get();
      const monster = monsters.find(m => m.id === monsterId);
      
      if (monster) {
        monster.health -= 20; // Player damage
        
        if (monster.health <= 0) {
          // Monster defeated - drop materials
          const materialDrops = [
            { name: 'Magic Shard', icon: '💎', chance: 0.3 },
            { name: 'Iron Ore', icon: '⚡', chance: 0.4 },
            { name: 'Ancient Bone', icon: '🦴', chance: 0.2 },
            { name: 'Dark Crystal', icon: '🔮', chance: 0.1 }
          ];
          
          // Drop materials with chance - we'll handle this through a callback
          
          // Store drops in the game state for the component to handle
          const drops = [];
          materialDrops.forEach(drop => {
            if (Math.random() < drop.chance) {
              drops.push({
                id: `${drop.name.toLowerCase().replace(' ', '-')}-${Date.now()}`,
                name: drop.name,
                type: 'material',
                icon: drop.icon,
                quantity: 1,
                description: `Dropped by ${monster.type}`
              });
              console.log(`Dropped ${drop.name}!`);
            }
          });
          
          // Store drops to be processed by the component
          set({ pendingDrops: drops });
          
          // Remove monster
          set({
            monsters: monsters.filter(m => m.id !== monsterId)
          });
          gainExp(10);
        }
      }
    },
    
    nextFloor: () => {
      const { currentFloor } = get();
      const newFloor = currentFloor + 1;
      const dungeon = generateDungeon(20, 20, newFloor);
      
      // Find a valid starting position on the new floor
      let startX = 0;
      let startY = 0;
      
      if (dungeon.rooms.length > 0) {
        const firstRoom = dungeon.rooms[0];
        startX = firstRoom.x + Math.floor(firstRoom.width / 2) - 10;
        startY = firstRoom.y + Math.floor(firstRoom.height / 2) - 10;
      }
      
      // Generate monsters after dungeon is created
      const monsters = generateMonsters(5 + newFloor, newFloor, dungeon);
      
      set({
        currentFloor: newFloor,
        dungeonLayout: dungeon,
        monsters: monsters,
        playerPosition: { x: startX, y: startY }
      });
    },
    
    clearPendingDrops: () => {
      set({ pendingDrops: [] });
    }
  }))
);

function generateMonsters(count: number, floor: number, dungeon: any): Monster[] {
  const monsters: Monster[] = [];
  const types = ['goblin', 'orc', 'skeleton'];
  
  for (let i = 0; i < count; i++) {
    // Try to find a valid floor position for the monster
    let attempts = 0;
    let validPosition = false;
    let x = 0;
    let y = 0;
    
    while (!validPosition && attempts < 100) {
      x = Math.random() * 18 - 9; // Keep within bounds
      y = Math.random() * 18 - 9;
      
      // Convert to grid coordinates to check the dungeon layout
      const gridX = Math.floor(x + 10);
      const gridY = Math.floor(y + 10);
      
      // Check if this position is on a floor tile and not too close to player spawn
      if (gridX >= 0 && gridX < dungeon.width && 
          gridY >= 0 && gridY < dungeon.height &&
          dungeon.tiles[gridX] && dungeon.tiles[gridX][gridY] === 0 && // Floor tile
          (Math.abs(x) > 2 || Math.abs(y) > 2)) { // Not too close to player spawn
        validPosition = true;
      }
      attempts++;
    }
    
    // If we couldn't find a valid position, place it in a room
    if (!validPosition && dungeon.rooms.length > 0) {
      const room = dungeon.rooms[Math.floor(Math.random() * dungeon.rooms.length)];
      x = room.x + Math.random() * (room.width - 2) + 1 - 10;
      y = room.y + Math.random() * (room.height - 2) + 1 - 10;
    }
    
    monsters.push({
      id: `monster-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      position: { x, y },
      health: 50 + floor * 10,
      damage: 10 + floor * 2
    });
  }
  
  return monsters;
}
