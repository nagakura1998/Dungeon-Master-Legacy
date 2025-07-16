import { CraftingRecipe, Item } from "./gameTypes";

export function getCraftingRecipes(): CraftingRecipe[] {
  return [
    {
      id: 'basic-sword',
      name: 'Basic Sword',
      ingredients: [
        { itemId: 'iron-ore', name: 'Iron Ore', quantity: 2 },
        { itemId: 'wood', name: 'Wood', quantity: 1 }
      ],
      result: {
        name: 'Iron Sword',
        type: 'equipment',
        icon: '⚔️',
        description: 'A sturdy iron sword that increases attack damage',
        effects: ['+10 attack damage']
      }
    },
    {
      id: 'health-crystal',
      name: 'Health Crystal',
      ingredients: [
        { itemId: 'magic-shard', name: 'Magic Shard', quantity: 2 },
        { itemId: 'health-potion', name: 'Health Potion', quantity: 1 }
      ],
      result: {
        name: 'Health Crystal',
        type: 'artifact',
        icon: '💚',
        description: 'Permanently increases maximum health',
        effects: ['+25 max health']
      }
    },
    {
      id: 'speed-boots',
      name: 'Speed Boots',
      ingredients: [
        { itemId: 'leather', name: 'Leather', quantity: 2 },
        { itemId: 'magic-shard', name: 'Magic Shard', quantity: 1 }
      ],
      result: {
        name: 'Speed Boots',
        type: 'equipment',
        icon: '👢',
        description: 'Increases movement speed',
        effects: ['+50% movement speed']
      }
    }
  ];
}

export function canCraftItem(recipe: CraftingRecipe, inventory: Item[]): boolean {
  return recipe.ingredients.every(ingredient => {
    const availableQuantity = inventory.filter(item => 
      item.name.toLowerCase() === ingredient.name.toLowerCase()
    ).reduce((total, item) => total + item.quantity, 0);
    
    return availableQuantity >= ingredient.quantity;
  });
}

export function craftItem(recipe: CraftingRecipe): Item {
  return {
    id: `${recipe.id}-${Date.now()}`,
    name: recipe.result.name,
    type: recipe.result.type,
    icon: recipe.result.icon,
    quantity: 1,
    description: recipe.result.description,
    effects: recipe.result.effects
  };
}
