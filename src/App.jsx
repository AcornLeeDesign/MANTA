import { useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import Manta from './components/Manta'
import writing from './content/writing.txt?raw'
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

function Typewriter({ content }) {
  const fullText = content;
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (typeof fullText !== "string") return;

    setDisplayed("");       // reset when text changes
    let i = 0;

    const interval = setInterval(() => {
      i += 1;
      setDisplayed(fullText.slice(0, i));  // always match original text
      if (i >= fullText.length) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [fullText]);

  return <>{displayed}</>;
}

function ContentBlock({ showContent, content, showBody, showRig }) {
  return (
    <>
      <div className='relative flex flex-col bg-gray-700 gap-4'>
        <div className='flex relative gap-2 justify-center'>          
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
        
        {showContent &&
          <p className='text-white'><Typewriter content={content} /></p>
        }
      </div>
    </>
  );
}

function App() {
  const [showBody, setShowBody] = useState(true)
  const [showRig, setShowRig] = useState(false)
  const [showContent, setShowContent] = useState(false)
  
  // Camera distance based on whether body is shown
  const cameraDist = showBody ? 8 : 4

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      console.log('Scrolling:', scrollPosition)
      setShowContent(scrollPosition > 1)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    // Parent
    <div className='relative w-full min-h-screens'>
      {/* == Canvas == */}
      <div style={{ position: 'fixed', inset: 0, margin: 0, padding: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
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
      </div>
        
      {/* === Hero === */}
      <main className="relative w-full z-[1] p-4">
        <section className="w-full h-screen flex flex-col justify-between">
          {/* Title stuff */}
          <div className="flex justify-center gap-2">
            <h5 style={{ color: 'rgba(255, 255, 255, 1)' }}>Manta Ray</h5>
            <h5 style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Artifact No.1</h5>
          </div>
        </section>
        
        {/* === Written content === */}
        <section className='w-full'>
          <ContentBlock 
            showContent={showContent} 
            content={writing} 
            showBody={showBody}
            showRig={showRig}
          />
        </section>
      </main>
    </div>
  )
}

// Preload model for better performance
useGLTF.preload(`/MANTA_CHEESECAKE.glb`)

export default App
