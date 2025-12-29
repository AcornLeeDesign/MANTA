import { useState, useEffect } from 'react'

export function useMousePosition() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse position to -1 to 1 range
      // Center of screen is (0, 0)
      // X: -1 (left) to 1 (right)
      // Y: 1 (top) to -1 (bottom)
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      
      setMousePos({ x, y })
    }

    const handleMouseLeave = () => {
      // Reset to center when mouse leaves window
      setMousePos({ x: 0, y: 0 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return mousePos
}

