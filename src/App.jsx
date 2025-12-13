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
        <Manta showBody={showBody} />
      </Canvas>

      {/* Toggle button */}
      <button
        onClick={() => setShowBody(!showBody)}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '6px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.18)',
          color: 'white',
          border: 'none',
          borderRadius: '99px',
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'all 1s',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
          e.target.style.color = 'black'
          e.target.style.transform = 'translateX(-50%) scale(1.02)'
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'
          e.target.style.color = 'white'
          e.target.style.transform = 'translateX(-50%) scale(1)'
        }}
      >
        {showBody ? 'skeleton' : 'body'}
      </button>
    </div>
  )
}

// Preload all models for better performance
// useGLTF.preload('/body.glb')
// useGLTF.preload('/eyes.glb')
// useGLTF.preload('/ribcage.glb')
useGLTF.preload(`/MANTA_CHEESECAKE.glb`)

export default App
