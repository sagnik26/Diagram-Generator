import { useCallback, useEffect, useState } from 'react'
import { useEditorContext } from '../contexts/EditorContext'
import { useBorderWidthContext } from '../contexts/BorderWidthContext'
import {
  Square,
  Circle,
  ArrowRight,
  Minus,
  Type,
  Save,
  FolderOpen,
  Download,
  FileImage,
  Minus as MinusIcon,
  Plus,
  Trash2,
} from 'lucide-react'
import './CustomToolbar.css'

interface CustomToolbarProps {
  onSave: () => void
  onLoad: () => void
  onExportPNG: () => void
  onExportSVG: () => void
}

function CustomToolbar({ onSave, onLoad, onExportPNG, onExportSVG }: CustomToolbarProps) {
  const { editor } = useEditorContext()
  const { borderWidth, setBorderWidth } = useBorderWidthContext()
  const [hasSelection, setHasSelection] = useState(false)

  // Track selection state to enable/disable delete button
  useEffect(() => {
    if (!editor) return

    const updateSelection = () => {
      const selected = editor.getSelectedShapes()
      setHasSelection(selected.length > 0)
    }

    const unsubscribe = editor.store.listen(updateSelection)
    updateSelection()

    return unsubscribe
  }, [editor])

  const handleDragStart = useCallback((e: React.DragEvent, shapeType: string) => {
    e.dataTransfer.setData('application/tldraw-shape', shapeType)
    e.dataTransfer.effectAllowed = 'copy'
  }, [])

  // Map border width (1-10) to tldraw size ('s', 'm', 'l', 'xl')
  const getSizeFromWidth = (width: number): 's' | 'm' | 'l' | 'xl' => {
    if (width <= 2) return 's'
    if (width <= 4) return 'm'
    if (width <= 6) return 'l'
    return 'xl'
  }

  const handleBorderWidthChange = useCallback((newWidth: number) => {
    if (!editor) return
    
    const clampedWidth = Math.max(1, Math.min(10, newWidth))
    setBorderWidth(clampedWidth)
    
    // Update selected shapes with new border width
    const selectedShapes = editor.getSelectedShapes()
    if (selectedShapes.length > 0) {
      const newSize = getSizeFromWidth(clampedWidth)
      editor.batch(() => {
        selectedShapes.forEach((shape) => {
          if (shape.type === 'geo') {
            // Mark this as a toolbar update to prevent constant width restoration
            if ((editor as any).markToolbarUpdate) {
              (editor as any).markToolbarUpdate(shape.id)
            }
            
            editor.updateShape({
              id: shape.id,
              type: shape.type,
              props: {
                ...shape.props,
                size: newSize, // This controls border width in tldraw
              },
            })
          }
        })
      })
    }
  }, [editor, setBorderWidth])

  const handleIncreaseBorder = useCallback(() => {
    handleBorderWidthChange(borderWidth + 1)
  }, [borderWidth, handleBorderWidthChange])

  const handleDecreaseBorder = useCallback(() => {
    handleBorderWidthChange(borderWidth - 1)
  }, [borderWidth, handleBorderWidthChange])

  const handleRectangle = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('geo')
  }, [editor])

  const handleCircle = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('geo')
  }, [editor])

  const handleArrow = useCallback(() => {
    if (!editor) return
    // Set arrow tool - arrows in tldraw automatically bind to shapes
    // when drawn from one shape to another
    editor.setCurrentTool('arrow')
  }, [editor])

  const handleLine = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('line')
  }, [editor])

  const handleText = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('text')
  }, [editor])

  const handleDelete = useCallback(() => {
    if (!editor) return
    
    const selectedShapes = editor.getSelectedShapes()
    if (selectedShapes.length > 0) {
      const shapeIds = selectedShapes.map((shape: any) => shape.id)
      editor.deleteShapes(shapeIds)
    }
  }, [editor])

  return (
    <div className="custom-toolbar">
      <div className="toolbar-section">
        <h3 className="toolbar-title">Shapes</h3>
        <div className="toolbar-buttons">
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'rectangle')}
            onClick={handleRectangle}
            title="Rectangle - Click to select tool or drag to canvas"
          >
            <Square size={20} />
            <span>Rectangle</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'circle')}
            onClick={handleCircle}
            title="Circle - Click to select tool or drag to canvas"
          >
            <Circle size={20} />
            <span>Circle</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'arrow')}
            onClick={handleArrow}
            title="Arrow - Click to select tool or drag to canvas"
          >
            <ArrowRight size={20} />
            <span>Arrow</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'line')}
            onClick={handleLine}
            title="Line - Click to select tool or drag to canvas"
          >
            <Minus size={20} />
            <span>Line</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'text')}
            onClick={handleText}
            title="Text - Click to select tool or drag to canvas"
          >
            <Type size={20} />
            <span>Text</span>
          </button>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <h3 className="toolbar-title">Border Width</h3>
        <div className="toolbar-buttons">
          <div className="border-width-controls">
            <button
              className="toolbar-button border-width-button"
              onClick={handleDecreaseBorder}
              title="Decrease border width"
              disabled={borderWidth <= 1}
            >
              <MinusIcon size={16} />
            </button>
            <div className="border-width-display">
              <span>{borderWidth}px</span>
            </div>
            <button
              className="toolbar-button border-width-button"
              onClick={handleIncreaseBorder}
              title="Increase border width"
              disabled={borderWidth >= 10}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <h3 className="toolbar-title">Actions</h3>
        <div className="toolbar-buttons">
          <button
            className="toolbar-button toolbar-button-danger"
            onClick={handleDelete}
            title="Delete selected shapes (Delete/Backspace)"
            disabled={!editor || !hasSelection}
          >
            <Trash2 size={20} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <h3 className="toolbar-title">File</h3>
        <div className="toolbar-buttons">
          <button
            className="toolbar-button"
            onClick={onSave}
            title="Save Diagram"
          >
            <Save size={20} />
            <span>Save</span>
          </button>
          <button
            className="toolbar-button"
            onClick={onLoad}
            title="Load Diagram"
          >
            <FolderOpen size={20} />
            <span>Load</span>
          </button>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <h3 className="toolbar-title">Export</h3>
        <div className="toolbar-buttons">
          <button
            className="toolbar-button"
            onClick={onExportPNG}
            title="Export as PNG"
          >
            <FileImage size={20} />
            <span>PNG</span>
          </button>
          <button
            className="toolbar-button"
            onClick={onExportSVG}
            title="Export as SVG"
          >
            <Download size={20} />
            <span>SVG</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomToolbar
