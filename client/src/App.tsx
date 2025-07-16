import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useGameState } from "./lib/stores/useGameState";
import Game from "./components/Game";
import GameUI from "./components/GameUI";
import Sanctum from "./components/Sanctum";
import "@fontsource/inter";

// Define control keys for the game
enum Controls {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
  action = 'action',
  inventory = 'inventory',
  craft = 'craft',
  sanctum = 'sanctum'
}

const controls = [
  { name: Controls.up, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.down, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.action, keys: ["Space"] },
  { name: Controls.inventory, keys: ["KeyI"] },
  { name: Controls.craft, keys: ["KeyC"] },
  { name: Controls.sanctum, keys: ["KeyB"] }
];

function App() {
  const { gamePhase } = useGameState();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const [showCanvas, setShowCanvas] = useState(false);

  // Initialize audio
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    setBackgroundMusic(bgMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
    
    setShowCanvas(true);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  if (!showCanvas) {
    return <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#000', 
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>Loading...</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KeyboardControls map={controls}>
        {gamePhase === 'sanctum' ? (
          <Sanctum />
        ) : (
          <>
            <Canvas
              shadows
              camera={{
                position: [0, 0, 20],
                fov: 45,
                near: 0.1,
                far: 1000
              }}
              gl={{
                antialias: false,
                powerPreference: "default"
              }}
            >
              <color attach="background" args={["#111111"]} />
              
              {/* Lighting for 2D game */}
              <ambientLight intensity={0.8} />
              <directionalLight position={[10, 10, 5]} intensity={0.5} />

              <Suspense fallback={null}>
                <Game />
              </Suspense>
            </Canvas>
            <GameUI />
          </>
        )}
      </KeyboardControls>
    </div>
  );
}

export default App;
