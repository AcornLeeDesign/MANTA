import { useEffect, useMemo } from 'react'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Glass Material – re-renders all meshes in a scene with MeshTransmissionMaterial
export function BodyMeshes({ scene }) {
  // Extract all meshes from the scene
  const meshes = useMemo(() => {
    const meshArray = []
    if (!scene) return meshArray

    scene.traverse((child) => {
      if (child.isMesh) {
        // Update the world matrix to get the correct transformation
        child.updateMatrixWorld()
        meshArray.push({
          geometry: child.geometry,
          position: child.position.clone(),
          rotation: child.rotation.clone(),
          scale: child.scale.clone(),
          matrix: child.matrix.clone(),
          name: child.name,
        })
      }
    })
    return meshArray
  }, [scene])

  return (
    <>
      {meshes.map((mesh, index) => (
        <mesh
          key={mesh.name || index}
          geometry={mesh.geometry}
          position={mesh.position}
          rotation={mesh.rotation}
          scale={mesh.scale}
        >
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.3}
            roughness={0}
            ior={2}
            chromaticAberration={0.05}
            anisotropicBlur={0.5}
            samples={6}
          />
        </mesh>
      ))}
    </>
  )
}

// Apply Glass material to a mesh by name
export function useBodyGlassMaterial(scene, meshName = 'MANTA_BODY', visible = true) {
  useEffect(() => {
    if (!scene || !meshName) return

    scene.traverse((child) => {
      if (child.isMesh && child.name === meshName) {
        child.visible = visible
        child.material = new THREE.MeshPhysicalMaterial({
          transmission: 1,
          thickness: 0.5,
          roughness: 0,
          ior: 1.5,
          metalness: 0,
          transparent: true,
          opacity: 1,
        })
      }
    })
  }, [scene, meshName, visible])
}

// Apply orange glowing material to eyes
export function useEyesMaterial(scene, meshName = 'EYES', visible = true) {
  useEffect(() => {
    if (!scene || !meshName) return

    scene.traverse((child) => {
      if (child.isMesh && child.name === meshName) {
        child.visible = visible
        child.material = new THREE.MeshStandardMaterial({
          color: 0xff6600,
          emissive: 0xff6600,
          emissiveIntensity: 5,
          metalness: 0,
          roughness: 0.3,
        })
      }
    })
  }, [scene, meshName, visible])
}

// Metal Material
export function useMetalMaterial(scene, meshNames = ['RIBCAGE', 'TAILBONE', 'FISHBONE', 'LIL_WING']) {
  const targets = Array.isArray(meshNames) ? meshNames : [meshNames]

  useEffect(() => {
    if (!scene || !targets.length) return

    scene.traverse((child) => {
      if (child.isMesh && targets.includes(child.name)) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xefefef,
          metalness: 1,
          roughness: 0.2,
        })
      }
    })
  }, [scene, targets])
}
