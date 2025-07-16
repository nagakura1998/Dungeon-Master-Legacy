import { useInventory } from "../lib/stores/useInventory";
import { useSanctum } from "../lib/stores/useSanctum";
import { useGameState } from "../lib/stores/useGameState";

export default function Inventory() {
  const { items, toggleInventory, useItem } = useInventory();
  const { addMaterial } = useSanctum();
  const { healPlayer } = useGameState();

  const handleUseItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      // Handle healing directly in the component
      if (item.name === 'Health Potion') {
        healPlayer(50);
        console.log('Player healed for 50 HP');
      }
      
      useItem(itemId);
      
      // Add to sanctum materials if it's a material
      if (item.type === 'material') {
        addMaterial(item.name, 1);
      }
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
      maxWidth: '500px',
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
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          🎒 Inventory
        </h2>
        <button
          onClick={toggleInventory}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              padding: '15px',
              borderRadius: '12px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onClick={() => handleUseItem(item.id)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.border = '1px solid rgba(148, 163, 184, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.border = '1px solid rgba(148, 163, 184, 0.2)';
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9', marginBottom: '4px' }}>{item.name}</div>
            <div style={{ 
              fontSize: '11px', 
              color: '#94a3b8',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '2px 6px',
              borderRadius: '6px',
              display: 'inline-block'
            }}>
              ×{item.quantity}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#64748b', 
          fontStyle: 'italic',
          padding: '40px 20px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          border: '1px dashed rgba(148, 163, 184, 0.3)'
        }}>
          📦 No items in inventory
        </div>
      )}
    </div>
  );
}
