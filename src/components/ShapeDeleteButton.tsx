import { useEffect, useState, useCallback } from 'react'
import { useEditorContext } from '../contexts/EditorContext'
import { TLShape } from '@tldraw/tldraw'
import { Trash2 } from 'lucide-react'
import './ShapeDeleteButton.css'

export default function ShapeDeleteButton() {
  const { editor } = useEditorContext()
  const [selectedShapes, setSelectedShapes] = useState<TLShape[]>([])

  // Track selected shapes
  useEffect(() => {
    if (!editor) return

    let rafId: number | null = null
    let lastUpdate = 0

    const updateSelection = () => {
      // Throttle selection updates
      const now = Date.now()
      if (now - lastUpdate < 100) return
      lastUpdate = now

      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const selected = editor.getSelectedShapes()
        setSelectedShapes(selected)
        rafId = null
      })
    }

    const unsubscribe = editor.store.listen(updateSelection)
    updateSelection()

    return () => {
      unsubscribe()
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [editor])

  const handleDelete = useCallback((shape: TLShape, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!editor) return
    
    const shapeIds = [(shape as any).id]
    editor.deleteShapes(shapeIds)
  }, [editor])

  if (!editor || selectedShapes.length === 0) {
    return null
  }

  return (
    <>
      {selectedShapes.map((shape) => {
        // Get shape bounds in page coordinates
        const bounds = editor.getShapePageBounds(shape.id)
        if (!bounds) return null

        // Convert page coordinates to screen coordinates
        const topRight = editor.pageToScreen({ x: bounds.maxX, y: bounds.minY })
        
        // Position button at top-right corner with small offset
        const buttonSize = 24
        const offset = 8

        return (
          <div
            key={shape.id}
            className="shape-delete-button"
            style={{
              position: 'absolute',
              left: `${topRight.x - buttonSize - offset}px`,
              top: `${topRight.y - offset}px`,
              zIndex: 10000,
            }}
            onClick={(e) => handleDelete(shape, e)}
            onMouseDown={(e) => e.stopPropagation()}
            title="Delete shape"
          >
            <Trash2 size={16} />
          </div>
        )
      })}
    </>
  )
}
