import { useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Sky, OrbitControls } from '@react-three/drei';
import Manta from './components/Manta'
import './App.css'

// Component to smoothly animate camera position
function CameraController({ targetZ }) {
  const { camera } = useThree()
  
  useFrame(() => {
    // Smoothly interpolate camera position
    camera.position.z += (targetZ - camera.position.z) * 0.1
  })
  
  return null
}

function App() {
  const [showBody, setShowBody] = useState(true)
  const [showRig, setShowRig] = useState(false)

  // Camera distance based on whether body is shown
  const cameraDist = showBody ? 8 : 4

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, backgroundColor: '#000' }}>
      <Canvas 
        camera={{ position: [0, 0, cameraDist], fov: 40, near: 0.1, far: 200 }}
        gl={{ alpha: false }}
      >
        {/* Camera controller for smooth transitions */}
        <CameraController targetZ={cameraDist} />
        
        {/* Black background */}
        <color attach="background" args={['#080808']} />

        <fog attach="fog" args={['#000000', 6, 25]} />

        {/* Ambient light */}
        <ambientLight intensity={0.3} />
        
        {/* Directional light from above */}
        <directionalLight position={[0, 12, 5]} intensity={3} />
        
        {/* Spotlight light the manta from below */}
        <spotLight
          position={[0, -5, 5]}
          angle={1}
          penumbra={1}
          intensity={15}
          castShadow
        />
        
        {/* Manta component */}
        <Manta showBody={showBody} showRig={showRig} />
      </Canvas>

      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px'
      }}>
        {/* Show Skeleton View */}
        <button
          onClick={() => setShowBody(!showBody)}
          className="toggle-button"
        >
          {showBody ? 'skeleton' : 'body'}
        </button>
        
        {/* Show Rig View */}
        <button
          onClick={() => setShowRig(!showRig)}
          className="toggle-button"
        >
          {showRig ? 'no rig' : 'rig'}
        </button>
      </div>
    </div>
  )
}

// Preload all models for better performance
// useGLTF.preload('/body.glb')
// useGLTF.preload('/eyes.glb')
// useGLTF.preload('/ribcage.glb')
useGLTF.preload(`/MANTA_CHEESECAKE.glb`)

export default App
