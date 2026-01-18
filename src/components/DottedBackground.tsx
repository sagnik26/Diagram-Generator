import { useEffect, useRef } from 'react'
import './DottedBackground.css'

function DottedBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Ensure the background stays in sync with the canvas
    const updateBackground = () => {
      if (backgroundRef.current) {
        // The background will be positioned absolutely to cover the canvas
        // The CSS will handle the dotted pattern
      }
    }

    updateBackground()
    window.addEventListener('resize', updateBackground)

    return () => {
      window.removeEventListener('resize', updateBackground)
    }
  }, [])

  return <div ref={backgroundRef} className="dotted-background" />
}

export default DottedBackground
