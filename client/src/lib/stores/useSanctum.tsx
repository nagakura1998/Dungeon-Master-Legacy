import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SanctumRoom {
  level: number;
  description: string;
  effects: string[];
}

interface SanctumState {
  materials: Record<string, number>;
  rooms: Record<string, SanctumRoom>;
  
  // Actions
  addMaterial: (material: string, quantity: number) => void;
  upgradeRoom: (roomType: string) => void;
  canUpgradeRoom: (roomType: string) => boolean;
  getRoomUpgradeCost: (roomType: string) => Record<string, number>;
}

const initialRooms: Record<string, SanctumRoom> = {
  training_hall: {
    level: 1,
    description: "A place to hone your combat skills",
    effects: ["Start with +10 health"]
  },
  workshop: {
    level: 1,
    description: "Craft better equipment and artifacts",
    effects: ["Unlock basic crafting recipes"]
  },
  library: {
    level: 1,
    description: "Store knowledge and unlock mysteries",
    effects: ["Gain +5 XP per monster kill"]
  },
  vault: {
    level: 1,
    description: "Secure storage for valuable items",
    effects: ["Keep 1 item when you die"]
  }
};

export const useSanctum = create<SanctumState>()(
  persist(
    (set, get) => ({
      materials: {
        stone: 10,
        wood: 5,
        iron: 3,
        magic_crystal: 1
      },
      rooms: initialRooms,
      
      addMaterial: (material, quantity) => {
        const { materials } = get();
        set({
          materials: {
            ...materials,
            [material]: (materials[material] || 0) + quantity
          }
        });
      },
      
      upgradeRoom: (roomType) => {
        const { rooms, materials, canUpgradeRoom, getRoomUpgradeCost } = get();
        
        if (!canUpgradeRoom(roomType)) return;
        
        const cost = getRoomUpgradeCost(roomType);
        const newMaterials = { ...materials };
        
        // Deduct materials
        Object.entries(cost).forEach(([material, amount]) => {
          newMaterials[material] -= amount;
        });
        
        // Upgrade room
        const newRooms = { ...rooms };
        newRooms[roomType] = {
          ...newRooms[roomType],
          level: newRooms[roomType].level + 1,
          effects: [...newRooms[roomType].effects, `Level ${newRooms[roomType].level + 1} bonus`]
        };
        
        set({
          materials: newMaterials,
          rooms: newRooms
        });
      },
      
      canUpgradeRoom: (roomType) => {
        const { rooms, materials, getRoomUpgradeCost } = get();
        const room = rooms[roomType];
        
        if (!room || room.level >= 5) return false;
        
        const cost = getRoomUpgradeCost(roomType);
        return Object.entries(cost).every(([material, amount]) => 
          (materials[material] || 0) >= amount
        );
      },
      
      getRoomUpgradeCost: (roomType) => {
        const { rooms } = get();
        const room = rooms[roomType];
        
        if (!room) return {};
        
        const baseCost = {
          stone: 5,
          wood: 3,
          iron: 2,
          magic_crystal: 1
        };
        
        // Cost increases with level
        const multiplier = room.level;
        return Object.entries(baseCost).reduce((cost, [material, amount]) => ({
          ...cost,
          [material]: amount * multiplier
        }), {});
      }
    }),
    {
      name: 'sanctum-storage'
    }
  )
);
