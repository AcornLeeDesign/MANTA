import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useMousePosition } from '../hooks/useMousePosition'
import { useFlyAnimation } from '../hooks/useFlyAnimation'
import { useDriftAnimation } from '../hooks/useDriftAnimation'
import * as THREE from 'three'
import { useBodyGlassMaterial, useEyesMaterial, useMetalMaterial } from '../materials/mantaMaterials'

function Manta({ showBody = true, showRig = false }) {
  const manta = useGLTF(`/MANTA_CHEESECAKE.glb`)
  const mantaRef = useRef()
  const mousePos = useMousePosition()

  // FLYYYY
  useFlyAnimation(manta)
  useDriftAnimation(manta)

  // Material application
  useBodyGlassMaterial(manta.scene, 'MANTA_BODY', showBody)
  useEyesMaterial(manta.scene, 'EYES', showBody)
  useMetalMaterial(manta.scene, ['RIBCAGE', 'TAILBONE', 'FISHBONE', 'LIL_WING'])

  // Base rotation

  // useFrame runs on every frame > Update the rotation to follow the mouse
  useFrame(() => {
    if (!mantaRef.current) return

    // Convert mouse position (-1 to 1) to a 3D direction
    // Z stays at 0 so it doesn't tilt up/down
    const targetX = mousePos.x * 0.5  // multiplier for subtle movement
    const targetY = mousePos.y * 0.5

    // Add the base rotation offset to the target
    // This way the mouse following happens relative to the base rotation
    const targetYWithOffset = targetX

    // Smoothly interpolate (lerp) the current rotation toward the target
    // This creates a smooth following effect instead of instant snapping
    mantaRef.current.rotation.y += (targetYWithOffset - mantaRef.current.rotation.y) * 0.05
    mantaRef.current.rotation.x += (-targetY - mantaRef.current.rotation.x) * 0.05
  })

  if (showRig) {
    return (
      <group ref={mantaRef} position={[0, 0, 0]}>
        <primitive object={manta.scene} rotation={[0, Math.PI, 0]}/>
        <primitive object={new THREE.SkeletonHelper(manta.scene)} />
      </group>
    )
  }
  else {
    return (
      <group ref={mantaRef} position={[0, 0, 0]}>
        <primitive object={manta.scene} rotation={[0, Math.PI, 0]}/>
      </group>
    )
  }

}

export default Manta


