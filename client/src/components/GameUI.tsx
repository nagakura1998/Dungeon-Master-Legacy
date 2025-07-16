import { useGameState } from "../lib/stores/useGameState";
import { useInventory } from "../lib/stores/useInventory";
import { useAudio } from "../lib/stores/useAudio";
import Inventory from "./Inventory";
import CraftingSystem from "./CraftingSystem";

export default function GameUI() {
  const { 
    gamePhase, 
    playerHealth, 
    playerLevel, 
    playerExp,
    currentFloor,
    monsters,
    setGamePhase,
    resetRun,
    initializeGame 
  } = useGameState();
  
  const { showInventory, showCrafting } = useInventory();
  const { isMuted, toggleMute } = useAudio();

  const handleStartGame = () => {
    initializeGame();
    setGamePhase('playing');
  };

  const handleRestart = () => {
    resetRun();
    setGamePhase('ready');
  };

  const handleBackToSanctum = () => {
    setGamePhase('sanctum');
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1000
    }}>
      {/* Game HUD */}
      {gamePhase === 'playing' && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '14px',
          pointerEvents: 'auto',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          backdropFilter: 'blur(10px)',
          minWidth: '200px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '12px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#f1f5f9'
          }}>
            <span style={{ marginRight: '8px' }}>⚔️</span>
            Dungeon Keeper
          </div>
          
          {/* Show message when all monsters are defeated */}
          {monsters.filter(m => m.health > 0).length === 0 && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%)',
              color: '#22c55e',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'center'
            }}>
              🎉 All monsters defeated!<br />
              Press SPACE to advance to floor {currentFloor + 1}
            </div>
          )}
          
          {/* Game instructions */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            color: '#cbd5e1',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '12px',
            fontSize: '12px',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <div>🎮 <strong>Controls:</strong></div>
            <div>WASD - Move | SPACE - Attack/Next Floor</div>
            <div>I - Inventory | C - Crafting</div>
            <div style={{ marginTop: '8px' }}>
              💡 <strong>Tips:</strong> Defeat monsters to get materials!<br />
              Use health potions to restore HP.
            </div>
          </div>
          
          {/* Health Bar */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '4px',
              fontSize: '12px',
              color: '#cbd5e1'
            }}>
              <span>Health</span>
              <span>{playerHealth}/100</span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${playerHealth}%`,
                height: '100%',
                background: playerHealth > 50 
                  ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
                  : playerHealth > 25
                  ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Experience Bar */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '4px',
              fontSize: '12px',
              color: '#cbd5e1'
            }}>
              <span>Level {playerLevel}</span>
              <span>{playerExp}/100 XP</span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${playerExp}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#cbd5e1'
          }}>
            <span>Floor {currentFloor}</span>
            <span>{monsters.filter(m => m.health > 0).length} enemies</span>
          </div>
        </div>
      )}

      {/* Audio Control */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        pointerEvents: 'auto'
      }}>
        <button
          onClick={toggleMute}
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
            color: 'white',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            padding: '12px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '18px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2) inset';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
          }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Main Menu */}
      {gamePhase === 'ready' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(51, 65, 85, 0.98) 100%)',
          color: 'white',
          padding: '60px 50px',
          borderRadius: '20px',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          pointerEvents: 'auto',
          border: '2px solid rgba(148, 163, 184, 0.3)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          backdropFilter: 'blur(15px)',
          maxWidth: '500px',
          minWidth: '400px'
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '800',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            ⚔️ Dungeon Keeper's Apprentice
          </div>
          
          <p style={{ 
            fontSize: '16px', 
            marginBottom: '30px',
            color: '#cbd5e1',
            fontWeight: '400',
            lineHeight: '1.5'
          }}>
            Venture into the depths, collect artifacts, and restore your master's realm
          </p>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#94a3b8',
              marginBottom: '10px',
              fontWeight: '600'
            }}>
              Controls
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: '#cbd5e1',
              lineHeight: '1.4'
            }}>
              <div>WASD / Arrow Keys - Move</div>
              <div>Space - Attack</div>
              <div>I - Inventory • C - Craft • B - Sanctum</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={handleStartGame}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
              }}
            >
              🏴‍☠️ Start Adventure
            </button>
            <button
              onClick={handleBackToSanctum}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
              }}
            >
              🏰 Enter Sanctum
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gamePhase === 'gameOver' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(51, 65, 85, 0.98) 100%)',
          color: 'white',
          padding: '50px 40px',
          borderRadius: '20px',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          pointerEvents: 'auto',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          backdropFilter: 'blur(15px)',
          maxWidth: '450px',
          minWidth: '350px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px'
          }}>
            💀
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Game Over
          </div>
          
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <div style={{ 
              fontSize: '16px', 
              color: '#cbd5e1',
              marginBottom: '8px'
            }}>
              You reached floor
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {currentFloor}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={handleRestart}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 25px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
              }}
            >
              🔄 Try Again
            </button>
            <button
              onClick={handleBackToSanctum}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 25px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset';
              }}
            >
              🏰 Return to Sanctum
            </button>
          </div>
        </div>
      )}

      {/* Inventory */}
      {showInventory && <Inventory />}
      
      {/* Crafting */}
      {showCrafting && <CraftingSystem />}
    </div>
  );
}
