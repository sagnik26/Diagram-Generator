import { useCallback, useRef } from 'react'
import { Tldraw, createShapeId } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { EditorProvider, useEditorContext } from './contexts/EditorContext'
import { BorderWidthProvider, useBorderWidthContext } from './contexts/BorderWidthContext'
import CustomToolbar from './components/CustomToolbar'
import ConnectionPoints from './components/ConnectionPoints'
import TextEditor from './components/TextEditor'
import DottedBackground from './components/DottedBackground'
import './App.css'

// Map border width (1-10) to tldraw size ('s', 'm', 'l', 'xl')
const getSizeFromWidth = (width: number): 's' | 'm' | 'l' | 'xl' => {
  if (width <= 2) return 's'
  if (width <= 4) return 'm'
  if (width <= 6) return 'l'
  return 'xl'
}

// Setup text editing functionality, border width management, and delete functionality
function setupTextEditing(editor: any) {
  // Handle double-click for text editing
  editor.on('double-click', (e: any) => {
    const hitShape = editor.getShapeAtPoint(e.point, {
      hitInside: true,
      margin: 0,
    })

    if (hitShape && (hitShape.type === 'geo' || hitShape.type === 'text')) {
      editor.setEditingShape(hitShape.id)
      editor.setCurrentTool('select')
    }
  })

  // Handle keyboard delete (Delete/Backspace keys)
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only handle if not typing in an input/textarea
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target as HTMLElement).isContentEditable
    ) {
      return
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      const selectedShapes = editor.getSelectedShapes()
      if (selectedShapes.length > 0) {
        e.preventDefault()
        const shapeIds = selectedShapes.map((shape: any) => shape.id)
        editor.deleteShapes(shapeIds)
      }
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  // Store original border sizes to maintain constant width during resize
  const originalBorderSizes = new Map<string, 's' | 'm' | 'l' | 'xl'>()
  const toolbarUpdateTimes = new Map<string, number>()
  let isDragging = false
  let rafId: number | null = null

  // Track dragging state to skip updates during drag
  // Check if editor is currently pointing (dragging)
  const checkDraggingState = () => {
    const instanceState = editor.getInstanceState()
    // Check if cursor indicates dragging/grabbing
    isDragging = instanceState.cursor.type === 'grabbing' || false
  }

  // Listen for shape updates to maintain constant border width - optimized for performance
  let lastUpdateTime = 0
  const unsubscribe = editor.store.listen(() => {
    // Check dragging state
    checkDraggingState()
    
    // Skip updates during dragging for better performance
    if (isDragging) return
    
    // Throttle updates more aggressively
    const now = Date.now()
    if (now - lastUpdateTime < 300) return
    lastUpdateTime = now

    // Use requestAnimationFrame to batch updates
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }

    rafId = requestAnimationFrame(() => {
      const shapes = editor.getCurrentPageShapes()
      shapes.forEach((shape: any) => {
        if (shape.type === 'geo') {
          // Store original border size if not already stored
          if (!originalBorderSizes.has(shape.id)) {
            originalBorderSizes.set(shape.id, shape.props.size || 'm')
          } else {
            // Maintain constant border width - restore if changed (unless from toolbar)
            const originalSize = originalBorderSizes.get(shape.id)!
            const lastToolbarUpdate = toolbarUpdateTimes.get(shape.id) || 0
            
            // Only restore if enough time has passed (not a recent toolbar update)
            if (shape.props.size !== originalSize && (Date.now() - lastToolbarUpdate > 500)) {
              editor.updateShape({
                id: shape.id,
                type: shape.type,
                props: {
                  ...shape.props,
                  size: originalSize, // Keep border width constant during resize
                },
              })
            }
          }
        }
      })
      rafId = null
    })
  })

  // Expose method to mark toolbar updates
  ;(editor as any).markToolbarUpdate = (shapeId: string) => {
    toolbarUpdateTimes.set(shapeId, Date.now())
  }

  return () => {
    unsubscribe()
    window.removeEventListener('keydown', handleKeyDown)
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
  }
}

function AppContentInner() {
  const { editor, setEditor } = useEditorContext()
  const { borderWidth } = useBorderWidthContext()
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleSave = useCallback(() => {
    if (!editor) return
    
    const snapshot = editor.store.serialize()
    const jsonString = JSON.stringify(snapshot, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'diagram.json'
    link.click()
    URL.revokeObjectURL(url)
  }, [editor])

  const handleLoad = useCallback(() => {
    if (!editor) return
    
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string)
          editor.store.loadSnapshot(json)
        } catch (error) {
          console.error('Failed to load diagram:', error)
          alert('Failed to load diagram. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [editor])

  const handleExportPNG = useCallback(async () => {
    if (!editor) return
    
    try {
      const shapes = editor.getCurrentPageShapes()
      if (shapes.length === 0) {
        alert('No shapes to export')
        return
      }

      const bounds = editor.getCurrentPageBounds()
      if (!bounds) return

      const svg = await editor.getSvg(shapes, {
        bounds,
        background: true,
      })
      
      if (!svg) return
      
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = 'diagram.png'
            link.click()
            URL.revokeObjectURL(downloadUrl)
          }
          URL.revokeObjectURL(url)
        })
      }
      
      img.src = url
    } catch (error) {
      console.error('Failed to export PNG:', error)
      alert('Failed to export PNG. Please try again.')
    }
  }, [editor])

  const handleExportSVG = useCallback(async () => {
    if (!editor) return
    
    try {
      const shapes = editor.getCurrentPageShapes()
      if (shapes.length === 0) {
        alert('No shapes to export')
        return
      }

      const bounds = editor.getCurrentPageBounds()
      if (!bounds) return

      const svg = await editor.getSvg(shapes, {
        bounds,
        background: true,
      })
      
      if (!svg) return
      
      const svgData = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'diagram.svg'
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export SVG:', error)
      alert('Failed to export SVG. Please try again.')
    }
  }, [editor])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!editor || !canvasRef.current) return

    const shapeType = e.dataTransfer.getData('application/tldraw-shape')
    if (!shapeType) return

    try {
      // Get the drop position in canvas coordinates
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Convert screen coordinates to page coordinates
      const point = editor.screenToPage({ x, y })

      // Handle tools that don't create shapes immediately
      if (shapeType === 'arrow') {
        editor.setCurrentTool('arrow')
        return
      }
      
      if (shapeType === 'line') {
        editor.setCurrentTool('line')
        return
      }

      // Generate a unique ID for the shape
      const shapeId = createShapeId()

      // Create the shape based on type
      let shapeDef: any

      // Get border size from current border width setting
      const borderSize = getSizeFromWidth(borderWidth)

      if (shapeType === 'rectangle') {
        shapeDef = {
          id: shapeId,
          type: 'geo',
          x: point.x - 50,
          y: point.y - 50,
          props: {
            geo: 'rectangle',
            w: 100,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize, // Border width from toolbar - stays constant during resize
            color: 'black',
            text: '', // Enable text on shape - will be editable on double-click
          },
        }
      } else if (shapeType === 'circle') {
        shapeDef = {
          id: shapeId,
          type: 'geo',
          x: point.x - 50,
          y: point.y - 50,
          props: {
            geo: 'ellipse',
            w: 100,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize, // Border width from toolbar - stays constant during resize
            color: 'black',
            text: '', // Enable text on shape - will be editable on double-click
          },
        }
      } else if (shapeType === 'text') {
        shapeDef = {
          id: shapeId,
          type: 'text',
          x: point.x - 50,
          y: point.y - 25,
          props: {
            text: 'Text',
            color: 'black',
            size: 'm',
            font: 'draw',
            autoSize: true,
          },
        }
      } else if (shapeType === 'triangle') {
        shapeDef = {
          id: shapeId,
          type: 'geo',
          x: point.x - 50,
          y: point.y - 50,
          props: {
            geo: 'triangle',
            w: 100,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: '', // Enable text on shape - will be editable on double-click
          },
        }
      } else {
        return
      }

      // Create shape using the store directly to ensure proper creation
      editor.batch(() => {
        editor.createShape(shapeDef)
        // Select the shape after creation
        editor.setSelectedShapes([shapeId])
      })
    } catch (error) {
      console.error('Error creating shape:', error)
    }
  }, [editor, borderWidth])

  return (
    <div className="app-container">
      <div className="toolbar-container">
        <CustomToolbar
          onSave={handleSave}
          onLoad={handleLoad}
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
        />
      </div>
      <div 
        ref={canvasRef}
        className="canvas-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <DottedBackground />
        <Tldraw
          onMount={(editor) => {
            setEditor(editor)
            // Configure editor for connections
            editor.updateInstanceState({ isGridMode: false })
            
            // Set up text editing and auto-sizing
            setupTextEditing(editor)
          }}
          hideUi
        />
        <ConnectionPoints />
        <TextEditor />
      </div>
    </div>
  )
}

function AppContent() {
  return (
    <BorderWidthProvider>
      <AppContentInner />
    </BorderWidthProvider>
  )
}

function App() {
  return (
    <EditorProvider>
      <AppContent />
    </EditorProvider>
  )
}

export default App
