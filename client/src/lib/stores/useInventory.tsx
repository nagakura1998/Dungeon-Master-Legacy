import { create } from "zustand";
import { Item } from "../gameTypes";

interface InventoryState {
  items: Item[];
  showInventory: boolean;
  showCrafting: boolean;
  
  // Actions
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
  toggleInventory: () => void;
  toggleCrafting: () => void;
}

export const useInventory = create<InventoryState>((set, get) => ({
  items: [
    // Starting items
    {
      id: 'health-potion-1',
      name: 'Health Potion',
      type: 'consumable',
      icon: '🧪',
      quantity: 1,
      description: 'Restores 50 health'
    },
    {
      id: 'magic-shard-1',
      name: 'Magic Shard',
      type: 'material',
      icon: '💎',
      quantity: 1,
      description: 'A fragment of ancient magic'
    },
    {
      id: 'iron-ore-1',
      name: 'Iron Ore',
      type: 'material',
      icon: '⚡',
      quantity: 1,
      description: 'Raw iron for crafting'
    }
  ],
  showInventory: false,
  showCrafting: false,
  
  addItem: (item) => {
    const { items } = get();
    const existingItem = items.find(i => i.name === item.name);
    
    if (existingItem) {
      existingItem.quantity += 1;
      set({ items: [...items] });
    } else {
      set({ items: [...items, { ...item, quantity: 1 }] });
    }
  },
  
  removeItem: (itemId) => {
    const { items } = get();
    const item = items.find(i => i.id === itemId);
    
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        set({ items: [...items] });
      } else {
        set({ items: items.filter(i => i.id !== itemId) });
      }
    }
  },
  
  useItem: (itemId) => {
    const { items, removeItem } = get();
    const item = items.find(i => i.id === itemId);
    
    if (item && item.type === 'consumable') {
      // Handle consumable effects here
      console.log(`Using ${item.name}`);
      
      if (item.name === 'Health Potion') {
        // We'll handle healing through a callback system
        // For now, just log and remove the item
        console.log('Health potion used - healing player');
        // The actual healing will be handled by the component
      }
      
      removeItem(itemId);
    }
  },
  
  toggleInventory: () => {
    const { showInventory } = get();
    set({ showInventory: !showInventory, showCrafting: false });
  },
  
  toggleCrafting: () => {
    const { showCrafting } = get();
    set({ showCrafting: !showCrafting, showInventory: false });
  }
}));
