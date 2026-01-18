import { useEffect, useState, useRef } from 'react'
import { useEditorContext } from '../contexts/EditorContext'
import './ConnectionPoints.css'

function ConnectionPoints() {
  const { editor } = useEditorContext()
  const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    if (!editor) return

    let isDragging = false
    let dragTimeout: number | null = null

    // Track dragging state by checking editor state
    const checkDraggingState = () => {
      try {
        const instanceState = editor.getInstanceState()
        // Check if cursor indicates dragging/grabbing or if editor is in pointing state
        const isCurrentlyDragging = instanceState.cursor.type === 'grabbing' || 
          instanceState.cursor.type === 'grab' ||
          (instanceState as any).isPointing === true

        if (isCurrentlyDragging && !isDragging) {
          isDragging = true
          setHoveredShapeId(null) // Hide connection points while dragging
        } else if (!isCurrentlyDragging && isDragging) {
          // Use a small delay to ensure dragging has ended
          if (dragTimeout) clearTimeout(dragTimeout)
          dragTimeout = window.setTimeout(() => {
            isDragging = false
          }, 150)
        }
      } catch (error) {
        // Fallback: if we can't determine dragging state, just continue
      }
    }

    const handlePointerMove = () => {
      // Check dragging state
      checkDraggingState()

      // Skip updates during dragging for better performance
      if (isDragging) return

      // Throttle updates using requestAnimationFrame
      const now = Date.now()
      if (now - lastUpdateRef.current < 100) return
      lastUpdateRef.current = now

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const hoveredShape = editor.getHoveredShape()
        if (hoveredShape) {
          // Only show connection points for geo shapes, cylinder shapes, and text
          if (hoveredShape.type === 'geo' || hoveredShape.type === 'cylinder' || hoveredShape.type === 'hard-drive' || hoveredShape.type === 'search' || hoveredShape.type === 'box' || hoveredShape.type === 'microservice' || hoveredShape.type === 'server' || hoveredShape.type === 'api-gateway' || hoveredShape.type === 'load-balancer' || hoveredShape.type === 'authentication-service' || hoveredShape.type === 'notification-service' || hoveredShape.type === 'payment-gateway' || hoveredShape.type === 'message-queue' || hoveredShape.type === 'message-broker' || hoveredShape.type === 'stream-processor' || hoveredShape.type === 'event-bus' || hoveredShape.type === 'cdn' || hoveredShape.type === 'dns' || hoveredShape.type === 'firewall' || hoveredShape.type === 'vpn' || hoveredShape.type === 'container' || hoveredShape.type === 'client' || hoveredShape.type === 'mobile-app' || hoveredShape.type === 'web-app' || hoveredShape.type === 'admin-panel' || hoveredShape.type === 'iot-device' || hoveredShape.type === 'monitoring' || hoveredShape.type === 'logging' || hoveredShape.type === 'alerting' || hoveredShape.type === 'analytics' || hoveredShape.type === 'ml-model' || hoveredShape.type === 'ml-pipeline' || hoveredShape.type === 'text') {
            setHoveredShapeId(hoveredShape.id as string)
          } else {
            setHoveredShapeId(null)
          }
        } else {
          setHoveredShapeId(null)
        }
        rafIdRef.current = null
      })
    }

    // Listen to store changes with throttling
    const unsubscribe = editor.store.listen(() => {
      handlePointerMove()
    })

    return () => {
      unsubscribe()
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
      if (dragTimeout) {
        clearTimeout(dragTimeout)
      }
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
