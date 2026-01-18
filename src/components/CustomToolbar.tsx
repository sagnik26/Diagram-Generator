import { useCallback, useEffect, useState } from 'react'
import { useEditorContext } from '../contexts/EditorContext'
import { useBorderWidthContext } from '../contexts/BorderWidthContext'
import {
  Square,
  Circle,
  ArrowRight,
  Minus,
  Type,
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
  MessageSquare,
  MessageCircle,
  Zap,
  Radio,
  Cloud,
  Globe,
  Shield,
  ShieldCheck,
  User,
  Smartphone,
  Monitor,
  Eye,
  FileText,
  BarChart,
  Brain,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Workflow,
} from 'lucide-react'
import './CustomToolbar.css'

interface CustomToolbarProps {}

function CustomToolbar({}: CustomToolbarProps) {
  const { editor } = useEditorContext()
  const { borderWidth, setBorderWidth } = useBorderWidthContext()
  
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    shapes: true,
    database: false,
    serviceLayer: false,
    messaging: false,
    infrastructure: false,
    clientLayer: false,
    monitoring: false,
    aiMl: false,
    borderWidth: false,
    actions: true,
  })

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])
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
                if (shape.type === 'geo' || shape.type === 'cylinder' || shape.type === 'hard-drive' || shape.type === 'search' || shape.type === 'box' || shape.type === 'microservice' || shape.type === 'server' || shape.type === 'api-gateway' || shape.type === 'load-balancer' || shape.type === 'authentication-service' || shape.type === 'notification-service' || shape.type === 'payment-gateway' || shape.type === 'message-queue' || shape.type === 'message-broker' || shape.type === 'stream-processor' || shape.type === 'event-bus' || shape.type === 'cdn' || shape.type === 'dns' || shape.type === 'firewall' || shape.type === 'vpn' || shape.type === 'container' || shape.type === 'client' || shape.type === 'mobile-app' || shape.type === 'web-app' || shape.type === 'admin-panel' || shape.type === 'iot-device' || shape.type === 'monitoring' || shape.type === 'logging' || shape.type === 'alerting' || shape.type === 'analytics' || shape.type === 'ml-model' || shape.type === 'ml-pipeline') {
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
      <div className="toolbar-brand">
        <div className="toolbar-brand-container">
          <Workflow className="toolbar-brand-icon" size={38} />
          <h1 className="toolbar-brand-name">Archflow</h1>
        </div>
      </div>
      <div className="toolbar-section">
        <div 
          className="toolbar-section-header"
          onClick={() => toggleSection('shapes')}
        >
          <h3 className="toolbar-title">Shapes</h3>
          {expandedSections.shapes ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedSections.shapes && (
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
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <div 
          className="toolbar-section-header"
          onClick={() => toggleSection('database')}
        >
          <h3 className="toolbar-title">Database</h3>
          {expandedSections.database ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedSections.database && (
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
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <div 
          className="toolbar-section-header"
          onClick={() => toggleSection('serviceLayer')}
        >
          <h3 className="toolbar-title">Service Layer</h3>
          {expandedSections.serviceLayer ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedSections.serviceLayer && (
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
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <div 
          className="toolbar-section-header"
          onClick={() => toggleSection('messaging')}
        >
          <h3 className="toolbar-title">Messaging & Streaming</h3>
          {expandedSections.messaging ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedSections.messaging && (
          <div className="toolbar-buttons">
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'message-queue')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Message Queue - Click to select tool or drag to canvas"
          >
            <MessageSquare size={20} />
            <span>Message Queue</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'message-broker')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Message Broker - Click to select tool or drag to canvas"
          >
            <MessageCircle size={20} />
            <span>Message Broker</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'stream-processor')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Stream Processor - Click to select tool or drag to canvas"
          >
            <Zap size={20} />
            <span>Stream Processor</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'event-bus')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Event Bus - Click to select tool or drag to canvas"
          >
            <Radio size={20} />
            <span>Event Bus</span>
          </button>
          </div>
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <div 
          className="toolbar-section-header"
          onClick={() => toggleSection('infrastructure')}
        >
          <h3 className="toolbar-title">Infrastructure</h3>
          {expandedSections.infrastructure ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedSections.infrastructure && (
          <div className="toolbar-buttons">
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'cdn')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="CDN - Click to select tool or drag to canvas"
          >
            <Cloud size={20} />
            <span>CDN</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'dns')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="DNS - Click to select tool or drag to canvas"
          >
            <Globe size={20} />
            <span>DNS</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'firewall')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Firewall - Click to select tool or drag to canvas"
          >
            <Shield size={20} />
            <span>Firewall</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'vpn')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="VPN - Click to select tool or drag to canvas"
          >
            <ShieldCheck size={20} />
            <span>VPN</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'container')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Container - Click to select tool or drag to canvas"
          >
            <Box size={20} />
            <span>Container</span>
          </button>
          </div>
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <div 
          className="toolbar-section-header"
          onClick={() => toggleSection('clientLayer')}
        >
          <h3 className="toolbar-title">Client Layer</h3>
          {expandedSections.clientLayer ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedSections.clientLayer && (
          <div className="toolbar-buttons">
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'client')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Client - Click to select tool or drag to canvas"
          >
            <User size={20} />
            <span>Client</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'mobile-app')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Mobile App - Click to select tool or drag to canvas"
          >
            <Smartphone size={20} />
            <span>Mobile App</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'web-app')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Web App - Click to select tool or drag to canvas"
          >
            <Monitor size={20} />
            <span>Web App</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'admin-panel')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Admin Panel - Click to select tool or drag to canvas"
          >
            <Monitor size={20} />
            <span>Admin Panel</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'iot-device')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="IoT Device - Click to select tool or drag to canvas"
          >
            <Radio size={20} />
            <span>IoT Device</span>
          </button>
          </div>
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <div 
          className="toolbar-section-header"
          onClick={() => toggleSection('monitoring')}
        >
          <h3 className="toolbar-title">Monitoring & Operations</h3>
          {expandedSections.monitoring ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedSections.monitoring && (
          <div className="toolbar-buttons">
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'monitoring')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Monitoring - Click to select tool or drag to canvas"
          >
            <Eye size={20} />
            <span>Monitoring</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'logging')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Logging - Click to select tool or drag to canvas"
          >
            <FileText size={20} />
            <span>Logging</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'alerting')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Alerting - Click to select tool or drag to canvas"
          >
            <Bell size={20} />
            <span>Alerting</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'analytics')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="Analytics - Click to select tool or drag to canvas"
          >
            <BarChart size={20} />
            <span>Analytics</span>
          </button>
          </div>
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <div 
          className="toolbar-section-header"
          onClick={() => toggleSection('aiMl')}
        >
          <h3 className="toolbar-title">AI/ML</h3>
          {expandedSections.aiMl ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedSections.aiMl && (
          <div className="toolbar-buttons">
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'ml-model')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="ML Model - Click to select tool or drag to canvas"
          >
            <Brain size={20} />
            <span>ML Model</span>
          </button>
          <button
            className="toolbar-button"
            draggable
            onDragStart={(e) => handleDragStart(e, 'ml-pipeline')}
            onClick={() => editor?.setCurrentTool('geo')}
            title="ML Pipeline - Click to select tool or drag to canvas"
          >
            <GitBranch size={20} />
            <span>ML Pipeline</span>
          </button>
          </div>
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <div 
          className="toolbar-section-header"
          onClick={() => toggleSection('borderWidth')}
        >
          <h3 className="toolbar-title">Border Width</h3>
          {expandedSections.borderWidth ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedSections.borderWidth && (
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
        )}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section">
        <div 
          className="toolbar-section-header"
          onClick={() => toggleSection('actions')}
        >
          <h3 className="toolbar-title">Actions</h3>
          {expandedSections.actions ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </div>
        {expandedSections.actions && (
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
        )}
      </div>

    </div>
  )
}

export default CustomToolbar
