export type GamePhase = 'ready' | 'playing' | 'gameOver' | 'sanctum';

export interface Position {
  x: number;
  y: number;
}

export interface Monster {
  id: string;
  type: string;
  position: Position;
  health: number;
  damage: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'consumable' | 'material' | 'artifact' | 'equipment';
  icon: string;
  quantity: number;
  description: string;
  effects?: string[];
}

export interface CraftingRecipe {
  id: string;
  name: string;
  ingredients: {
    itemId: string;
    name: string;
    quantity: number;
  }[];
  result: {
    name: string;
    type: Item['type'];
    icon: string;
    description: string;
    effects?: string[];
  };
}
