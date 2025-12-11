import { useState, useEffect } from 'react'

// Hook that tracks mouse position and converts it to normalized coordinates

export function useMousePosition() {
  // Raw mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Window dimensions
      const width = window.innerWidth
      const height = window.innerHeight

      // Convert pixel coordinates to normalized coordinates (-1 to 1)
      // event.clientX is 0 at left edge, width at right edge
      // We subtract width/2 to center it, then divide by width/2 to normalize
      const x = (event.clientX / width) * 2 - 1
      const y = (event.clientY / height) * 2 - 1

      setMousePos({ x, y })
    }

    // Add event listener when model mounts
    window.addEventListener('mousemove', handleMouseMove)

    // Remove event listener when model unmounts (no memory leaks)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return mousePos
}

