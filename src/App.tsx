import { useCallback, useRef } from 'react'
import { Tldraw, createShapeId } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { EditorProvider, useEditorContext } from './contexts/EditorContext'
import { BorderWidthProvider, useBorderWidthContext } from './contexts/BorderWidthContext'
import CustomToolbar from './components/CustomToolbar'
import TopNav from './components/TopNav'
import ConnectionPoints from './components/ConnectionPoints'
import TextEditor from './components/TextEditor'
import DottedBackground from './components/DottedBackground'
import { CylinderShapeUtil } from './shapes/CylinderShape'
import { HardDriveShapeUtil } from './shapes/HardDriveShape'
import { SearchShapeUtil } from './shapes/SearchShape'
import { BoxShapeUtil } from './shapes/BoxShape'
import { MicroserviceShapeUtil } from './shapes/MicroserviceShape'
import { ServerShapeUtil } from './shapes/ServerShape'
import { ApiGatewayShapeUtil } from './shapes/ApiGatewayShape'
import { LoadBalancerShapeUtil } from './shapes/LoadBalancerShape'
import { AuthenticationServiceShapeUtil } from './shapes/AuthenticationServiceShape'
import { NotificationServiceShapeUtil } from './shapes/NotificationServiceShape'
import { PaymentGatewayShapeUtil } from './shapes/PaymentGatewayShape'
import { MessageQueueShapeUtil } from './shapes/MessageQueueShape'
import { MessageBrokerShapeUtil } from './shapes/MessageBrokerShape'
import { StreamProcessorShapeUtil } from './shapes/StreamProcessorShape'
import { EventBusShapeUtil } from './shapes/EventBusShape'
import { CdnShapeUtil } from './shapes/CdnShape'
import { DnsShapeUtil } from './shapes/DnsShape'
import { FirewallShapeUtil } from './shapes/FirewallShape'
import { VpnShapeUtil } from './shapes/VpnShape'
import { ContainerShapeUtil } from './shapes/ContainerShape'
import { ClientShapeUtil } from './shapes/ClientShape'
import { MobileAppShapeUtil } from './shapes/MobileAppShape'
import { WebAppShapeUtil } from './shapes/WebAppShape'
import { AdminPanelShapeUtil } from './shapes/AdminPanelShape'
import { IotDeviceShapeUtil } from './shapes/IotDeviceShape'
import { MonitoringShapeUtil } from './shapes/MonitoringShape'
import { LoggingShapeUtil } from './shapes/LoggingShape'
import { AlertingShapeUtil } from './shapes/AlertingShape'
import { AnalyticsShapeUtil } from './shapes/AnalyticsShape'
import { MlModelShapeUtil } from './shapes/MlModelShape'
import { MlPipelineShapeUtil } from './shapes/MlPipelineShape'
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

    if (hitShape && (hitShape.type === 'geo' || hitShape.type === 'text' || hitShape.type === 'cylinder' || hitShape.type === 'hard-drive' || hitShape.type === 'search' || hitShape.type === 'box' || hitShape.type === 'microservice' || hitShape.type === 'server' || hitShape.type === 'api-gateway' || hitShape.type === 'load-balancer' || hitShape.type === 'authentication-service' || hitShape.type === 'notification-service' || hitShape.type === 'payment-gateway' || hitShape.type === 'message-queue' || hitShape.type === 'message-broker' || hitShape.type === 'stream-processor' || hitShape.type === 'event-bus' || hitShape.type === 'cdn' || hitShape.type === 'dns' || hitShape.type === 'firewall' || hitShape.type === 'vpn' || hitShape.type === 'container')) {
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
        if (shape.type === 'geo' || shape.type === 'cylinder' || shape.type === 'hard-drive' || shape.type === 'search' || shape.type === 'box' || shape.type === 'microservice' || shape.type === 'server' || shape.type === 'api-gateway' || shape.type === 'load-balancer' || shape.type === 'authentication-service' || shape.type === 'notification-service' || shape.type === 'payment-gateway') {
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
      } else if (shapeType === 'database') {
        // DATABASE: Custom cylinder shape, size 120x80
        shapeDef = {
          id: shapeId,
          type: 'cylinder',
          x: point.x - 60,
          y: point.y - 40,
          props: {
            w: 120,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Database',
          },
        }
      } else if (shapeType === 'nosql-database') {
        // NOSQL_DATABASE: Custom box shape, size 120x80
        shapeDef = {
          id: shapeId,
          type: 'box',
          x: point.x - 60,
          y: point.y - 40,
          props: {
            w: 120,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'NoSQL DB',
          },
        }
      } else if (shapeType === 'cache') {
        // CACHE: Custom hard drive shape, size 100x100
        shapeDef = {
          id: shapeId,
          type: 'hard-drive',
          x: point.x - 50,
          y: point.y - 50,
          props: {
            w: 100,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Cache',
          },
        }
      } else if (shapeType === 'storage') {
        // STORAGE: Custom hard drive shape, size 120x80
        shapeDef = {
          id: shapeId,
          type: 'hard-drive',
          x: point.x - 60,
          y: point.y - 40,
          props: {
            w: 120,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Storage',
          },
        }
      } else if (shapeType === 'data-warehouse') {
        // DATA_WAREHOUSE: Custom cylinder shape, size 140x80
        shapeDef = {
          id: shapeId,
          type: 'cylinder',
          x: point.x - 70,
          y: point.y - 40,
          props: {
            w: 140,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Data Warehouse',
          },
        }
      } else if (shapeType === 'search-engine') {
        // SEARCH_ENGINE: Custom search shape, size 120x100
        shapeDef = {
          id: shapeId,
          type: 'search',
          x: point.x - 60,
          y: point.y - 50,
          props: {
            w: 120,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Search Engine',
          },
        }
      } else if (shapeType === 'microservice') {
        // MICROSERVICE: Custom microservice shape, size 140x80
        shapeDef = {
          id: shapeId,
          type: 'microservice',
          x: point.x - 70,
          y: point.y - 40,
          props: {
            w: 140,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Microservice',
          },
        }
      } else if (shapeType === 'server') {
        // SERVER: Custom server shape, size 140x80
        shapeDef = {
          id: shapeId,
          type: 'server',
          x: point.x - 70,
          y: point.y - 40,
          props: {
            w: 140,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Server',
          },
        }
      } else if (shapeType === 'api-gateway') {
        // API_GATEWAY: Custom API gateway shape (trapezoid), size 160x80
        shapeDef = {
          id: shapeId,
          type: 'api-gateway',
          x: point.x - 80,
          y: point.y - 40,
          props: {
            w: 160,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'API Gateway',
          },
        }
      } else if (shapeType === 'load-balancer') {
        // LOAD_BALANCER: Custom load balancer shape (diamond), size 120x120
        shapeDef = {
          id: shapeId,
          type: 'load-balancer',
          x: point.x - 60,
          y: point.y - 60,
          props: {
            w: 120,
            h: 120,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Load Balancer',
          },
        }
      } else if (shapeType === 'authentication-service') {
        // AUTHENTICATION_SERVICE: Custom authentication service shape, size 160x80
        shapeDef = {
          id: shapeId,
          type: 'authentication-service',
          x: point.x - 80,
          y: point.y - 40,
          props: {
            w: 160,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Auth Service',
          },
        }
      } else if (shapeType === 'notification-service') {
        // NOTIFICATION_SERVICE: Custom notification service shape, size 160x80
        shapeDef = {
          id: shapeId,
          type: 'notification-service',
          x: point.x - 80,
          y: point.y - 40,
          props: {
            w: 160,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Notification Service',
          },
        }
      } else if (shapeType === 'payment-gateway') {
        // PAYMENT_GATEWAY: Custom payment gateway shape, size 140x80
        shapeDef = {
          id: shapeId,
          type: 'payment-gateway',
          x: point.x - 70,
          y: point.y - 40,
          props: {
            w: 140,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Payment Gateway',
          },
        }
      } else if (shapeType === 'message-queue') {
        // MESSAGE_QUEUE: Custom message queue shape (parallelogram), size 140x80
        shapeDef = {
          id: shapeId,
          type: 'message-queue',
          x: point.x - 70,
          y: point.y - 40,
          props: {
            w: 140,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Message Queue',
          },
        }
      } else if (shapeType === 'message-broker') {
        // MESSAGE_BROKER: Custom message broker shape (parallelogram), size 160x80
        shapeDef = {
          id: shapeId,
          type: 'message-broker',
          x: point.x - 80,
          y: point.y - 40,
          props: {
            w: 160,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Message Broker',
          },
        }
      } else if (shapeType === 'stream-processor') {
        // STREAM_PROCESSOR: Custom stream processor shape (parallelogram), size 160x80
        shapeDef = {
          id: shapeId,
          type: 'stream-processor',
          x: point.x - 80,
          y: point.y - 40,
          props: {
            w: 160,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Stream Processor',
          },
        }
      } else if (shapeType === 'event-bus') {
        // EVENT_BUS: Custom event bus shape (parallelogram), size 140x80
        shapeDef = {
          id: shapeId,
          type: 'event-bus',
          x: point.x - 70,
          y: point.y - 40,
          props: {
            w: 140,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Event Bus',
          },
        }
      } else if (shapeType === 'cdn') {
        // CDN: Custom CDN shape (cloud), size 140x100
        shapeDef = {
          id: shapeId,
          type: 'cdn',
          x: point.x - 70,
          y: point.y - 50,
          props: {
            w: 140,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'CDN',
          },
        }
      } else if (shapeType === 'dns') {
        // DNS: Custom DNS shape (diamond), size 100x100
        shapeDef = {
          id: shapeId,
          type: 'dns',
          x: point.x - 50,
          y: point.y - 50,
          props: {
            w: 100,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'DNS',
          },
        }
      } else if (shapeType === 'firewall') {
        // FIREWALL: Custom firewall shape (shield), size 100x100
        shapeDef = {
          id: shapeId,
          type: 'firewall',
          x: point.x - 50,
          y: point.y - 50,
          props: {
            w: 100,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Firewall',
          },
        }
      } else if (shapeType === 'vpn') {
        // VPN: Custom VPN shape (shield), size 100x100
        shapeDef = {
          id: shapeId,
          type: 'vpn',
          x: point.x - 50,
          y: point.y - 50,
          props: {
            w: 100,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'VPN',
          },
        }
      } else if (shapeType === 'container') {
        // CONTAINER: Custom container shape (rectangle), size 120x80
        shapeDef = {
          id: shapeId,
          type: 'container',
          x: point.x - 60,
          y: point.y - 40,
          props: {
            w: 120,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Container',
          },
        }
      } else if (shapeType === 'client') {
        // CLIENT: Custom client shape (ellipse), size 100x100
        shapeDef = {
          id: shapeId,
          type: 'client',
          x: point.x - 50,
          y: point.y - 50,
          props: {
            w: 100,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Client',
          },
        }
      } else if (shapeType === 'mobile-app') {
        // MOBILE_APP: Custom mobile app shape (phone), size 80x120
        shapeDef = {
          id: shapeId,
          type: 'mobile-app',
          x: point.x - 40,
          y: point.y - 60,
          props: {
            w: 80,
            h: 120,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Mobile App',
          },
        }
      } else if (shapeType === 'web-app') {
        // WEB_APP: Custom web app shape (monitor), size 120x100
        shapeDef = {
          id: shapeId,
          type: 'web-app',
          x: point.x - 60,
          y: point.y - 50,
          props: {
            w: 120,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Web App',
          },
        }
      } else if (shapeType === 'admin-panel') {
        // ADMIN_PANEL: Custom admin panel shape (monitor), size 120x100
        shapeDef = {
          id: shapeId,
          type: 'admin-panel',
          x: point.x - 60,
          y: point.y - 50,
          props: {
            w: 120,
            h: 100,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Admin Panel',
          },
        }
      } else if (shapeType === 'iot-device') {
        // IOT_DEVICE: Custom IoT device shape (circle), size 80x80
        shapeDef = {
          id: shapeId,
          type: 'iot-device',
          x: point.x - 40,
          y: point.y - 40,
          props: {
            w: 80,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'IoT Device',
          },
        }
      } else if (shapeType === 'monitoring') {
        // MONITORING: Custom monitoring shape (eye), size 100x80
        shapeDef = {
          id: shapeId,
          type: 'monitoring',
          x: point.x - 50,
          y: point.y - 40,
          props: {
            w: 100,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Monitoring',
          },
        }
      } else if (shapeType === 'logging') {
        // LOGGING: Custom logging shape (file), size 100x80
        shapeDef = {
          id: shapeId,
          type: 'logging',
          x: point.x - 50,
          y: point.y - 40,
          props: {
            w: 100,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Logging',
          },
        }
      } else if (shapeType === 'alerting') {
        // ALERTING: Custom alerting shape (bell), size 100x80
        shapeDef = {
          id: shapeId,
          type: 'alerting',
          x: point.x - 50,
          y: point.y - 40,
          props: {
            w: 100,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Alerting',
          },
        }
      } else if (shapeType === 'analytics') {
        // ANALYTICS: Custom analytics shape (chart), size 120x80
        shapeDef = {
          id: shapeId,
          type: 'analytics',
          x: point.x - 60,
          y: point.y - 40,
          props: {
            w: 120,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'Analytics',
          },
        }
      } else if (shapeType === 'ml-model') {
        // ML_MODEL: Custom ML model shape (rectangle), size 140x80
        shapeDef = {
          id: shapeId,
          type: 'ml-model',
          x: point.x - 70,
          y: point.y - 40,
          props: {
            w: 140,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'ML Model',
          },
        }
      } else if (shapeType === 'ml-pipeline') {
        // ML_PIPELINE: Custom ML pipeline shape (rectangle), size 160x80
        shapeDef = {
          id: shapeId,
          type: 'ml-pipeline',
          x: point.x - 80,
          y: point.y - 40,
          props: {
            w: 160,
            h: 80,
            fill: 'none',
            dash: 'draw',
            size: borderSize,
            color: 'black',
            text: 'ML Pipeline',
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
      <TopNav
        onSave={handleSave}
        onLoad={handleLoad}
        onExportPNG={handleExportPNG}
        onExportSVG={handleExportSVG}
      />
      <div className="toolbar-container">
        <CustomToolbar />
      </div>
      <div 
        ref={canvasRef}
        className="canvas-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <DottedBackground />
        <Tldraw
          shapeUtils={[
            CylinderShapeUtil, 
            HardDriveShapeUtil, 
            SearchShapeUtil, 
            BoxShapeUtil,
            MicroserviceShapeUtil,
            ServerShapeUtil,
            ApiGatewayShapeUtil,
            LoadBalancerShapeUtil,
            AuthenticationServiceShapeUtil,
            NotificationServiceShapeUtil,
            PaymentGatewayShapeUtil,
            MessageQueueShapeUtil,
            MessageBrokerShapeUtil,
            StreamProcessorShapeUtil,
            EventBusShapeUtil,
            CdnShapeUtil,
            DnsShapeUtil,
            FirewallShapeUtil,
            VpnShapeUtil,
            ContainerShapeUtil,
            ClientShapeUtil,
            MobileAppShapeUtil,
            WebAppShapeUtil,
            AdminPanelShapeUtil,
            IotDeviceShapeUtil,
            MonitoringShapeUtil,
            LoggingShapeUtil,
            AlertingShapeUtil,
            AnalyticsShapeUtil,
            MlModelShapeUtil,
            MlPipelineShapeUtil
          ]}
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
