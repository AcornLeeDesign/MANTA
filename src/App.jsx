import { useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

import Manta from './components/Manta'
import ContentBlock from './components/ContentBlock'
import writing from './content/writing.txt?raw'
import './App.css'

// Drive the render loop at a fixed rate (default 60fps)
function FrameLimiter({ fps = 60 }) {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    let raf
    const frameInterval = 1000 / fps
    let last = performance.now()

    const loop = (now) => {
      const delta = now - last
      if (delta >= frameInterval) {
        last = now - (delta % frameInterval) // reduce drift over time
        invalidate()
      }
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [fps, invalidate])

  return null
}

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
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* == Canvas == */}
      <div className="fixed inset-0 w-screen h-screen m-0 p-0 z-0">
        <Canvas 
          frameloop="demand"
          camera={{ position: [0, 0, cameraDist], fov: 40, near: 0.1, far: 200 }}
          gl={{ alpha: false }}
        >
          <FrameLimiter fps={60} />
          {/* Camera controller for smooth transitions */}
          <CameraController targetZ={cameraDist} />
          
          {/* Black background */}
          <color attach="background" args={['#080808']} />

          <fogExp2 attach="fog" args={['#e3e3e3', 0.03]} />

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
      </div>
        
      {/* === Hero === */}
      <main className="relative flex flex-col w-full z-[1] h-screen overflow-hidden touch-none overscroll-none">
        <section className="w-full flex flex-col grow justify-between">
          {/* Title stuff */}
          <div className="flex justify-center p-4">
            <h5 style={{ color: 'rgba(255, 255, 255, 1)' }}>Manta Ray</h5>
          </div>
        </section>

        {/* === Written content === */}
        <section>
          <ContentBlock 
            content={writing} 
            showBody={showBody}
            showRig={showRig}
            setShowBody={setShowBody}
            setShowRig={setShowRig}
          />
        </section>
      </main>
    </div>
  )
}

// Preload model for better performance
useGLTF.preload(`/MANTA_CHEESECAKE.glb`)

export default App
