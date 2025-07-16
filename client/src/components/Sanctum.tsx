import { useSanctum } from "../lib/stores/useSanctum";
import { useGameState } from "../lib/stores/useGameState";

export default function Sanctum() {
  const { 
    materials, 
    rooms, 
    upgradeRoom, 
    canUpgradeRoom,
    getRoomUpgradeCost 
  } = useSanctum();
  const { setGamePhase } = useGameState();

  const handleUpgradeRoom = (roomType: string) => {
    if (canUpgradeRoom(roomType)) {
      upgradeRoom(roomType);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #2c1810 0%, #1a0f0a 100%)',
      color: 'white',
      fontFamily: 'monospace',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '2px solid #444',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Keeper's Sanctum</h1>
        <button
          onClick={() => setGamePhase('ready')}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'monospace'
          }}
        >
          Return to Adventure
        </button>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Materials Panel */}
        <div style={{
          width: '300px',
          padding: '20px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRight: '2px solid #444'
        }}>
          <h2 style={{ marginBottom: '15px' }}>Materials</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(materials).map(([material, quantity]) => (
              <div
                key={material}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '5px'
                }}
              >
                <span style={{ textTransform: 'capitalize' }}>{material}</span>
                <span>{quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rooms Panel */}
        <div style={{ flex: 1, padding: '20px' }}>
          <h2 style={{ marginBottom: '15px' }}>Sanctum Rooms</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.entries(rooms).map(([roomType, room]) => {
              const cost = getRoomUpgradeCost(roomType);
              const canUpgrade = canUpgradeRoom(roomType);
              
              return (
                <div
                  key={roomType}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '2px solid #444'
                  }}
                >
                  <h3 style={{ 
                    textTransform: 'capitalize', 
                    marginBottom: '10px',
                    color: '#ffd700'
                  }}>
                    {roomType.replace('_', ' ')}
                  </h3>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Level:</strong> {room.level}
                  </div>
                  
                  <div style={{ marginBottom: '15px', fontSize: '14px', color: '#ccc' }}>
                    {room.description}
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Effects:</strong>
                    <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                      {room.effects.map((effect, index) => (
                        <li key={index} style={{ fontSize: '14px', color: '#ccc' }}>
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {room.level < 5 && (
                    <div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Upgrade Cost:</strong>
                        <div style={{ marginLeft: '10px', fontSize: '14px' }}>
                          {Object.entries(cost).map(([material, amount]) => (
                            <div key={material} style={{ 
                              color: materials[material] >= amount ? '#4CAF50' : '#f44336'
                            }}>
                              {material}: {amount} ({materials[material] || 0} available)
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleUpgradeRoom(roomType)}
                        disabled={!canUpgrade}
                        style={{
                          background: canUpgrade ? '#4CAF50' : '#666',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '5px',
                          cursor: canUpgrade ? 'pointer' : 'not-allowed',
                          fontFamily: 'monospace'
                        }}
                      >
                        Upgrade
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
