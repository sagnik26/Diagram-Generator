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
  Triangle,
  Database,
  HardDrive,
  Search,
  Box,
  Package,
  Server,
  Network,
  Activity,
  Lock,
  Bell,
  CreditCard,
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

  // Track selection state to enable/disable delete button - optimized
  useEffect(() => {
    if (!editor) return

    let rafId: number | null = null
    let lastUpdate = 0

    const updateSelection = () => {
      // Throttle selection updates
      const now = Date.now()
      if (now - lastUpdate < 150) return
      lastUpdate = now

      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const selected = editor.getSelectedShapes()
        setHasSelection(selected.length > 0)
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
                if (shape.type === 'geo' || shape.type === 'cylinder' || shape.type === 'hard-drive' || shape.type === 'search' || shape.type === 'box' || shape.type === 'microservice' || shape.type === 'server' || shape.type === 'api-gateway' || shape.type === 'load-balancer' || shape.type === 'authentication-service' || shape.type === 'notification-service' || shape.type === 'payment-gateway') {
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

  const handleTriangle = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('geo')
  }, [editor])

  // Custom component handlers
  const handleDatabase = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('geo')
  }, [editor])

  const handleNoSqlDatabase = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('geo')
  }, [editor])

  const handleCache = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('geo')
  }, [editor])

  const handleStorage = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('geo')
  }, [editor])

  const handleDataWarehouse = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('geo')
  }, [editor])

  const handleSearchEngine = useCallback(() => {
    if (!editor) return
    editor.setCurrentTool('geo')
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
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'triangle')}
            onClick={handleTriangle}
            title="Triangle - Click to select tool or drag to canvas"
          >
            <Triangle size={20} />
            <span>Triangle</span>
          </button>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <h3 className="toolbar-title">Infrastructure</h3>
        <div className="toolbar-buttons">
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'database')}
            onClick={handleDatabase}
            title="Database - Click to select tool or drag to canvas"
          >
            <Database size={20} />
            <span>Database</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'nosql-database')}
            onClick={handleNoSqlDatabase}
            title="NoSQL Database - Click to select tool or drag to canvas"
          >
            <Box size={20} />
            <span>NoSQL DB</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'cache')}
            onClick={handleCache}
            title="Cache - Click to select tool or drag to canvas"
          >
            <HardDrive size={20} />
            <span>Cache</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'storage')}
            onClick={handleStorage}
            title="Storage - Click to select tool or drag to canvas"
          >
            <HardDrive size={20} />
            <span>Storage</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'data-warehouse')}
            onClick={handleDataWarehouse}
            title="Data Warehouse - Click to select tool or drag to canvas"
          >
            <Database size={20} />
            <span>Data Warehouse</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'search-engine')}
            onClick={handleSearchEngine}
            title="Search Engine - Click to select tool or drag to canvas"
          >
            <Search size={20} />
            <span>Search Engine</span>
          </button>
        </div>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <h3 className="toolbar-title">Service Layer</h3>
        <div className="toolbar-buttons">
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'microservice')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Microservice - Click to select tool or drag to canvas"
          >
            <Package size={20} />
            <span>Microservice</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'server')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Server - Click to select tool or drag to canvas"
          >
            <Server size={20} />
            <span>Server</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'api-gateway')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="API Gateway - Click to select tool or drag to canvas"
          >
            <Network size={20} />
            <span>API Gateway</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'load-balancer')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Load Balancer - Click to select tool or drag to canvas"
          >
            <Activity size={20} />
            <span>Load Balancer</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'authentication-service')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Authentication Service - Click to select tool or drag to canvas"
          >
            <Lock size={20} />
            <span>Auth Service</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'notification-service')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Notification Service - Click to select tool or drag to canvas"
          >
            <Bell size={20} />
            <span>Notification</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'payment-gateway')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Payment Gateway - Click to select tool or drag to canvas"
          >
            <CreditCard size={20} />
            <span>Payment Gateway</span>
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
