# Diagram Generator

A modern, feature-rich diagram editor built with React, TypeScript, and tldraw, inspired by draw.io. Create professional diagrams with an intuitive interface, drag-and-drop functionality, and powerful editing capabilities.

![Diagram Generator](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![tldraw](https://img.shields.io/badge/tldraw-2.3-green)

## 🎯 Features

- 🎨 **Infinite Canvas**: Pan and zoom with smooth interactions
- 🖱️ **Drag-and-Drop**: Drag shapes from toolbar directly onto canvas
- 🛠️ **Drawing Tools**: Rectangle, Circle, Arrow, Line, and Text
- 📝 **Text Editing**: Double-click any shape to edit text inline
- 🔗 **Connection Points**: Visual connection points on hover for easy linking
- 🎨 **Border Width Control**: Adjustable border width (1-10px) that stays constant during resize
- 🗑️ **Delete Functionality**: Keyboard shortcuts (Delete/Backspace) and toolbar button
- 💾 **Save/Load**: Save and load diagrams in JSON format
- 📤 **Export**: Export diagrams as PNG or SVG
- 🎨 **Dotted Background**: Professional dotted grid background like draw.io
- ⚡ **Performance Optimized**: Smooth dragging with throttled updates and GPU acceleration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── App.tsx                    # Main application component
├── components/
│   ├── CustomToolbar.tsx      # Left sidebar with tools and controls
│   ├── ConnectionPoints.tsx    # Connection point indicators
│   ├── TextEditor.tsx         # Text editing handler
│   └── DottedBackground.tsx   # Dotted background pattern
├── contexts/
│   ├── EditorContext.tsx      # tldraw editor instance provider
│   └── BorderWidthContext.tsx # Border width state management
└── main.tsx                   # Application entry point
```

## 🏗️ Architecture

### Technology Stack

- **React 18**: UI framework with hooks
- **TypeScript**: Type safety
- **tldraw**: Canvas rendering and shape management
- **Vite**: Build tool and dev server
- **Lucide React**: Icon library

### Component Architecture

```
App
├── EditorProvider (Context)
│   └── BorderWidthProvider (Context)
│       └── AppContentInner
│           ├── CustomToolbar
│           └── Canvas Container
│               ├── DottedBackground
│               ├── Tldraw (Canvas)
│               ├── ConnectionPoints
│               └── TextEditor
```

### State Management

- **React Context API**: Global state (editor instance, border width)
- **tldraw Store**: Canvas state (shapes, selection, viewport)
- **Local State**: Component-specific UI state

## 🔄 How It Works

### Core Flow

1. **Initialization**: tldraw canvas mounts and editor instance is created
2. **Tool Selection**: User clicks toolbar button or drags shape
3. **Shape Creation**: Shape is created using tldraw's API
4. **Rendering**: tldraw renders shapes on canvas
5. **Interaction**: User can select, move, resize, and edit shapes
6. **Persistence**: State can be saved/loaded as JSON

### Key Functions

#### `setupTextEditing(editor)`
Sets up core editor functionality:
- Double-click text editing
- Keyboard delete (Delete/Backspace)
- Border width persistence during resize
- Performance optimizations

#### `handleDrop(e)`
Handles drag-and-drop from toolbar:
- Retrieves shape type from drag data
- Converts screen to page coordinates
- Creates shape using tldraw API
- Selects newly created shape

## 🖱️ Drag-and-Drop Implementation

### Overview

**Important**: tldraw does **NOT** handle drag-and-drop. The implementation uses the **HTML5 Drag and Drop API** with custom handlers. tldraw only handles shape creation and rendering after the drop.

### Step-by-Step Flow

#### 1. Drag Start (CustomToolbar.tsx)

```typescript
// Toolbar buttons are draggable
<button
  draggable={true}
  onDragStart={(e) => handleDragStart(e, 'rectangle')}
>

// Handler stores shape type in drag data
const handleDragStart = (e: React.DragEvent, shapeType: string) => {
  e.dataTransfer.setData('application/tldraw-shape', shapeType)
  e.dataTransfer.effectAllowed = 'copy'
}
```

**What happens:**
- Shape type ('rectangle', 'circle', etc.) is stored in `dataTransfer`
- Browser shows drag cursor

#### 2. Drag Over (App.tsx)

```typescript
<div
  onDragOver={handleDragOver}
  onDrop={handleDrop}
>

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault()  // Required to allow drop
  e.dataTransfer.dropEffect = 'copy'
}
```

**What happens:**
- `preventDefault()` allows drop on canvas
- Cursor shows copy effect

#### 3. Drop (App.tsx)

```typescript
const handleDrop = (e: React.DragEvent) => {
  e.preventDefault()
  
  // 1. Get shape type from drag data
  const shapeType = e.dataTransfer.getData('application/tldraw-shape')
  
  // 2. Get drop position (screen coordinates)
  const rect = canvasRef.current.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  // 3. Convert to page coordinates (tldraw's coordinate system)
  const point = editor.screenToPage({ x, y })
  
  // 4. Create shape definition
  const shapeDef = {
    id: createShapeId(),
    type: 'geo',
    x: point.x - 50,  // Center shape on drop point
    y: point.y - 50,
    props: { geo: 'rectangle', w: 100, h: 100, ... }
  }
  
  // 5. Create shape using tldraw API
  editor.batch(() => {
    editor.createShape(shapeDef)
    editor.setSelectedShapes([shapeId])
  })
}
```

### Coordinate System Conversion

**Critical**: The canvas uses two coordinate systems:

1. **Screen Coordinates**: Browser viewport pixels (`e.clientX`, `e.clientY`)
2. **Page Coordinates**: tldraw's infinite canvas coordinates (accounts for zoom/pan)

**Conversion:**
```typescript
// Screen → Page
const point = editor.screenToPage({ x, y })

// Page → Screen (for connection points)
const screenPoint = editor.pageToScreen({ x, y })
```

### Visual Flow Diagram

```
┌─────────────────┐
│ Toolbar Button  │
│  (draggable)    │
└────────┬────────┘
         │ onDragStart
         │ (store shape type)
         ▼
┌─────────────────┐
│ HTML5 Drag API  │
│ dataTransfer    │
└────────┬────────┘
         │ drag over canvas
         ▼
┌─────────────────┐
│ Canvas Container│
│  onDragOver     │
└────────┬────────┘
         │ onDrop
         │ (get position)
         ▼
┌─────────────────┐
│ Custom Handler  │
│ - Get drop pos  │
│ - Convert coords│
│ - Build shape   │
└────────┬────────┘
         │ editor.createShape()
         ▼
┌─────────────────┐
│   tldraw API    │
│ - Validate      │
│ - Add to store  │
│ - Render        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Shape on Canvas │ ✨
└─────────────────┘
```

## 🎨 What tldraw Does

### Responsibilities

tldraw handles:

1. **Canvas Rendering**
   - Infinite canvas with pan/zoom
   - Shape rendering (SVG-based)
   - Viewport management

2. **Shape Management**
   - Shape creation (`editor.createShape()`)
   - Shape updates (`editor.updateShape()`)
   - Shape deletion (`editor.deleteShapes()`)
   - Shape selection (`editor.getSelectedShapes()`)

3. **State Management**
   - Store-based state (shapes, selection, viewport)
   - Undo/redo support
   - State serialization (`editor.store.serialize()`)

4. **Interaction Handling**
   - Mouse/touch events
   - Selection and dragging
   - Resizing
   - Text editing

5. **Tool System**
   - Tool selection (`editor.setCurrentTool()`)
   - Tool-specific behaviors (arrow, line, geo)

### What tldraw Does NOT Do

- ❌ Drag-and-drop from external sources (we implement this)
- ❌ Custom toolbar UI (we build our own)
- ❌ Connection point visualization (we add this)
- ❌ Border width persistence (we manage this)

### tldraw API Usage

```typescript
// Shape Creation
editor.createShape({
  id: createShapeId(),
  type: 'geo',
  x: 100, y: 100,
  props: { geo: 'rectangle', w: 100, h: 100 }
})

// Shape Updates
editor.updateShape({
  id: shapeId,
  type: 'geo',
  props: { ...shape.props, size: 'l' }
})

// Shape Deletion
editor.deleteShapes([shapeId1, shapeId2])

// Selection
editor.setSelectedShapes([shapeId])
const selected = editor.getSelectedShapes()

// Coordinate Conversion
const pagePoint = editor.screenToPage({ x: 100, y: 200 })
const screenPoint = editor.pageToScreen({ x: 100, y: 200 })

// Export
const svg = await editor.getSvg(shapes, { bounds, background: true })

// State Management
const snapshot = editor.store.serialize()
editor.store.loadSnapshot(snapshot)
```

## 🎯 Key Features Explained

### 1. Border Width Management

**Problem**: tldraw's `size` property affects both border width and text size. We need border width to stay constant during resize.

**Solution**:
- Store original border size when shape is created
- Listen to shape updates
- Restore original size if changed (unless from toolbar)
- Use timestamp tracking to distinguish toolbar updates from resize

```typescript
const originalBorderSizes = new Map<string, 's' | 'm' | 'l' | 'xl'>()

// On shape update, restore original size if changed
if (shape.props.size !== originalSize) {
  editor.updateShape({
    id: shape.id,
    props: { ...shape.props, size: originalSize }
  })
}
```

### 2. Connection Points

**Implementation**:
- Listen to store changes for hover detection
- Calculate mid-edge points (top, right, bottom, left)
- Convert page to screen coordinates
- Render as overlay with CSS positioning

**Performance**:
- Throttled updates (100ms)
- Hidden during dragging
- requestAnimationFrame batching

### 3. Text Editing

**Implementation**:
- Listen to `double-click` event from tldraw
- Check if clicked shape supports text
- Call `editor.setEditingShape()` to enable editing
- tldraw handles the actual text input UI

### 4. Performance Optimizations

**Throttling**:
- Store listeners: 300ms
- Connection points: 100ms
- Selection tracking: 150ms

**RequestAnimationFrame**:
- Batches DOM updates
- Aligns with browser paint cycles

**Skip During Drag**:
- Border width checks paused
- Connection points hidden
- Reduces unnecessary calculations

**CSS Optimizations**:
- GPU acceleration (`translateZ(0)`)
- `will-change` hints
- Hardware-accelerated transforms

## 📝 Usage

### Creating Shapes

1. **Drag-and-Drop**: Drag a shape from the toolbar onto the canvas
2. **Click Tool**: Click a toolbar button, then click on canvas to create
3. **Tool Selection**: Select a tool and draw directly on canvas

### Editing Text

1. Double-click any shape (rectangle, circle, text)
2. Type your text (supports multi-line with Enter)
3. Click outside or press Escape to finish

### Connecting Shapes

1. Hover over a shape to see connection points
2. Select the arrow tool
3. Click and drag from one connection point to another

### Adjusting Border Width

1. Select one or more shapes
2. Use +/- buttons in Border Width section
3. Border width updates for selected shapes only

### Deleting Shapes

1. Select shape(s)
2. Press Delete or Backspace, OR
3. Click Delete button in toolbar

### Saving/Loading

- **Save**: Click Save button → Downloads `diagram.json`
- **Load**: Click Load button → Select JSON file → Diagram restores

### Exporting

- **PNG**: Click PNG button → Downloads `diagram.png`
- **SVG**: Click SVG button → Downloads `diagram.svg`

## 🔧 Configuration

### Border Width

Default: 2px  
Range: 1-10px  
Location: `BorderWidthContext.tsx`

### Dotted Background

Dot size: 1px  
Spacing: 20px × 20px  
Color: #cbd5e0 (light gray)  
Location: `DottedBackground.css`

## 🐛 Troubleshooting

### Shapes not appearing after drop
- Check browser console for errors
- Verify editor instance is initialized
- Ensure coordinates are valid

### Connection points not showing
- Check if shape is hovered (not selected)
- Verify editor instance is available
- Check browser console for errors

### Border width changing during resize
- This should be fixed, but if it happens:
  - Check if shape was recently updated from toolbar
  - Verify `originalBorderSizes` map is working

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [tldraw](https://tldraw.com/) - Powerful drawing library
- [draw.io](https://app.diagrams.net/) - Inspiration for the UI/UX
- [Lucide](https://lucide.dev/) - Beautiful icon library

## 📚 Additional Resources

- [tldraw Documentation](https://tldraw.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

**Built with ❤️ using React, TypeScript, and tldraw**
