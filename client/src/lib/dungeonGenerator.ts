export interface DungeonTile {
  x: number;
  y: number;
  type: 'floor' | 'wall' | 'door';
}

export interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Dungeon {
  width: number;
  height: number;
  tiles: number[][];
  rooms: Room[];
}

export function generateDungeon(width: number, height: number, floor: number): Dungeon {
  // Initialize with walls
  const tiles = Array(width).fill(null).map(() => Array(height).fill(1));
  const rooms: Room[] = [];
  
  // Generate rooms
  const numRooms = Math.min(8 + floor, 15);
  const attempts = 100;
  
  for (let i = 0; i < attempts && rooms.length < numRooms; i++) {
    const room = {
      x: Math.floor(Math.random() * (width - 8)) + 2,
      y: Math.floor(Math.random() * (height - 8)) + 2,
      width: Math.floor(Math.random() * 6) + 4,
      height: Math.floor(Math.random() * 6) + 4
    };
    
    // Check if room overlaps with existing rooms
    const overlaps = rooms.some(existingRoom => 
      room.x < existingRoom.x + existingRoom.width + 1 &&
      room.x + room.width + 1 > existingRoom.x &&
      room.y < existingRoom.y + existingRoom.height + 1 &&
      room.y + room.height + 1 > existingRoom.y
    );
    
    if (!overlaps && room.x + room.width < width - 2 && room.y + room.height < height - 2) {
      rooms.push(room);
      
      // Carve out room
      for (let x = room.x; x < room.x + room.width; x++) {
        for (let y = room.y; y < room.y + room.height; y++) {
          tiles[x][y] = 0; // Floor
        }
      }
    }
  }
  
  // Connect rooms with corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    const roomA = rooms[i];
    const roomB = rooms[i + 1];
    
    const centerAX = roomA.x + Math.floor(roomA.width / 2);
    const centerAY = roomA.y + Math.floor(roomA.height / 2);
    const centerBX = roomB.x + Math.floor(roomB.width / 2);
    const centerBY = roomB.y + Math.floor(roomB.height / 2);
    
    // Create L-shaped corridor
    createCorridor(tiles, centerAX, centerAY, centerBX, centerAY);
    createCorridor(tiles, centerBX, centerAY, centerBX, centerBY);
  }
  
  return {
    width,
    height,
    tiles,
    rooms
  };
}

function createCorridor(tiles: number[][], x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  if (dx !== 0) {
    const step = dx > 0 ? 1 : -1;
    for (let x = x1; x !== x2; x += step) {
      if (x >= 0 && x < tiles.length && y1 >= 0 && y1 < tiles[0].length) {
        tiles[x][y1] = 0;
      }
    }
  }
  
  if (dy !== 0) {
    const step = dy > 0 ? 1 : -1;
    for (let y = y1; y !== y2; y += step) {
      if (x2 >= 0 && x2 < tiles.length && y >= 0 && y < tiles[0].length) {
        tiles[x2][y] = 0;
      }
    }
  }
}
