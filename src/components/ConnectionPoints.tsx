import { useEffect, useState } from 'react'
import { useEditorContext } from '../contexts/EditorContext'
import './ConnectionPoints.css'

function ConnectionPoints() {
  const { editor } = useEditorContext()
  const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null)

  useEffect(() => {
    if (!editor) return

    const handlePointerMove = () => {
      const hoveredShapes = editor.getHoveredShapes()
      if (hoveredShapes.length > 0) {
        const shape = hoveredShapes[0]
        // Only show connection points for geo shapes and text
        if (shape.type === 'geo' || shape.type === 'text') {
          setHoveredShapeId(shape.id as string)
        } else {
          setHoveredShapeId(null)
        }
      } else {
        setHoveredShapeId(null)
      }
    }

    // Listen to pointer events
    const unsubscribe = editor.store.listen(() => {
      handlePointerMove()
    })

    // Also listen to pointer move events directly
    const handleMove = () => handlePointerMove()
    window.addEventListener('mousemove', handleMove)

    return () => {
      unsubscribe()
      window.removeEventListener('mousemove', handleMove)
    }
  }, [editor])

  if (!editor || !hoveredShapeId) {
    return null
  }

  try {
    const shape = editor.getShape(hoveredShapeId as any)
    if (!shape) return null

    const bounds = editor.getShapePageBounds(shape.id as any)
    if (!bounds) return null

    // Calculate connection points at the edges
    const points = [
      { x: bounds.midX, y: bounds.minY, id: 'top' },
      { x: bounds.maxX, y: bounds.midY, id: 'right' },
      { x: bounds.midX, y: bounds.maxY, id: 'bottom' },
      { x: bounds.minX, y: bounds.midY, id: 'left' },
    ]

    // Convert page coordinates to screen coordinates
    const screenPoints = points.map((point) => {
      const screenPoint = editor.pageToScreen(point)
      return { ...screenPoint, id: point.id }
    })

    return (
      <div className="connection-points-overlay">
        {screenPoints.map((point) => (
          <div
            key={point.id}
            className="connection-point"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
            }}
          />
        ))}
      </div>
    )
  } catch (error) {
    return null
  }
}

export default ConnectionPoints
