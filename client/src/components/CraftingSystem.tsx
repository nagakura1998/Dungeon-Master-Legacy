import { useMemo } from "react";
import { useInventory } from "../lib/stores/useInventory";
import { getCraftingRecipes, canCraftItem, craftItem } from "../lib/craftingSystem";

export default function CraftingSystem() {
  const { items, toggleCrafting, addItem, removeItem } = useInventory();
  const recipes = useMemo(() => getCraftingRecipes(), []);

  const handleCraftItem = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe && canCraftItem(recipe, items)) {
      // Remove ingredients
      recipe.ingredients.forEach(ingredient => {
        for (let i = 0; i < ingredient.quantity; i++) {
          removeItem(ingredient.itemId);
        }
      });
      
      // Add crafted item
      addItem(craftItem(recipe));
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
      color: 'white',
      padding: '30px',
      borderRadius: '20px',
      maxWidth: '700px',
      maxHeight: '600px',
      overflow: 'auto',
      fontFamily: 'Inter, system-ui, sans-serif',
      pointerEvents: 'auto',
      border: '2px solid rgba(148, 163, 184, 0.3)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
      backdropFilter: 'blur(15px)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ 
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          🔨 Artifact Crafting
        </h2>
        <button
          onClick={toggleCrafting}
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 12px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(239, 68, 68, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(239, 68, 68, 0.3)';
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {recipes.map(recipe => {
          const canCraft = canCraftItem(recipe, items);
          
          return (
            <div
              key={recipe.id}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                padding: '25px',
                borderRadius: '16px',
                border: canCraft ? '2px solid #22c55e' : '2px solid rgba(148, 163, 184, 0.3)',
                boxShadow: canCraft ? '0 8px 20px rgba(34, 197, 94, 0.2)' : '0 8px 20px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ 
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#f1f5f9'
                }}>
                  {recipe.result.icon} {recipe.result.name}
                </h3>
                <button
                  onClick={() => handleCraftItem(recipe.id)}
                  disabled={!canCraft}
                  style={{
                    background: canCraft 
                      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                      : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    cursor: canCraft ? 'pointer' : 'not-allowed',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: canCraft 
                      ? '0 4px 12px rgba(34, 197, 94, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (canCraft) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (canCraft) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
                    }
                  }}
                >
                  ⚡ Craft
                </button>
              </div>
              
              <div style={{ 
                fontSize: '14px', 
                color: '#cbd5e1', 
                marginBottom: '15px',
                lineHeight: '1.4'
              }}>
                {recipe.result.description}
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#94a3b8',
                  marginBottom: '10px'
                }}>
                  Required Materials:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {recipe.ingredients.map((ingredient, index) => {
                    const availableQuantity = items.filter(item => item.id === ingredient.itemId).length;
                    const hasEnough = availableQuantity >= ingredient.quantity;
                    
                    return (
                      <div
                        key={index}
                        style={{
                          background: hasEnough 
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(239, 68, 68, 0.1)',
                          color: hasEnough ? '#22c55e' : '#ef4444',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: `1px solid ${hasEnough ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        {ingredient.name} × {ingredient.quantity} ({availableQuantity} available)
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {recipes.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#64748b', 
          fontStyle: 'italic',
          padding: '40px 20px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          border: '1px dashed rgba(148, 163, 184, 0.3)'
        }}>
          🔨 No recipes available
        </div>
      )}
    </div>
  );
}
