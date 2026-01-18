# Guide: Adding Custom Shapes

This guide explains how to add custom shapes to the Diagram Generator.

## Overview

There are two approaches to adding custom shapes:

1. **Using Existing tldraw Shape Types** (Easier) - Use built-in types with custom properties
2. **Creating Custom Shape Types** (Advanced) - Define completely new shape types

## Approach 1: Using Existing tldraw Types

This is the simplest way. tldraw's `geo` type supports various geometries.

### Example: Adding a Triangle

#### Step 1: Add Button to Toolbar

In `src/components/CustomToolbar.tsx`:

```typescript
import { Triangle } from 'lucide-react' // Add icon import

// Add handler function
const handleTriangle = useCallback(() => {
  if (!editor) return
  editor.setCurrentTool('geo')
}, [editor])

// Add button in the toolbar JSX
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
```

#### Step 2: Handle Drop in App.tsx

In `src/App.tsx`, add to the `handleDrop` function:

```typescript
} else if (shapeType === 'triangle') {
  shapeDef = {
    id: shapeId,
    type: 'geo',
    x: point.x - 50,
    y: point.y - 50,
    props: {
      geo: 'triangle',  // tldraw supports triangle!
      w: 100,
      h: 100,
      fill: 'none',
      dash: 'draw',
      size: borderSize,
      color: 'black',
      text: '',
    },
  }
}
```

### Available Geo Types in tldraw

tldraw's `geo` type supports:
- `rectangle`
- `ellipse` (circle)
- `triangle`
- `diamond`
- `star`
- `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`
- `cloud`
- `hexagon`
- `octagon`
- `pentagon`
- `rhombus`
- `trapezoid`

### Example: Adding a Diamond

```typescript
// In handleDrop
} else if (shapeType === 'diamond') {
  shapeDef = {
    id: shapeId,
    type: 'geo',
    x: point.x - 50,
    y: point.y - 50,
    props: {
      geo: 'diamond',
      w: 100,
      h: 100,
      fill: 'none',
      dash: 'draw',
      size: borderSize,
      color: 'black',
      text: '',
    },
  }
}
```

## Approach 2: Custom Shape with SVG Path

For more complex shapes, you can use the `draw` type with custom SVG paths.

### Example: Custom Heart Shape

```typescript
} else if (shapeType === 'heart') {
  shapeDef = {
    id: shapeId,
    type: 'draw',
    x: point.x - 50,
    y: point.y - 50,
    props: {
      fill: 'none',
      dash: 'draw',
      size: borderSize,
      color: 'black',
      // Custom SVG path for heart
      segments: [
        {
          type: 'free',
          points: [
            { x: 50, y: 30 },
            { x: 30, y: 20 },
            { x: 20, y: 30 },
            { x: 20, y: 50 },
            { x: 50, y: 80 },
            { x: 80, y: 50 },
            { x: 80, y: 30 },
            { x: 70, y: 20 },
            { x: 50, y: 30 },
          ],
        },
      ],
    },
  }
}
```

## Approach 3: Fully Custom Shape Types (Advanced)

For completely custom shapes with custom rendering, you need to:

1. Define a custom shape type
2. Register it with tldraw
3. Create custom renderer

This requires extending tldraw's shape system. See [tldraw Custom Shapes Documentation](https://tldraw.dev/docs/custom-shapes).

### Basic Structure

```typescript
// Create a custom shape definition
const customShape = {
  type: 'custom-shape',
  props: {
    // Your custom properties
  },
  // Custom rendering logic
}
```

## Complete Example: Adding Multiple Shapes

Here's a complete example adding Triangle, Diamond, and Star:

### 1. Update CustomToolbar.tsx

```typescript
import { Triangle, Diamond, Star } from 'lucide-react'

// Add handlers
const handleTriangle = useCallback(() => {
  if (!editor) return
  editor.setCurrentTool('geo')
}, [editor])

const handleDiamond = useCallback(() => {
  if (!editor) return
  editor.setCurrentTool('geo')
}, [editor])

const handleStar = useCallback(() => {
  if (!editor) return
  editor.setCurrentTool('geo')
}, [editor])

// Add buttons
<button
  className="toolbar-button"
  draggable
  onDragStart={(e) => handleDragStart(e, 'triangle')}
  onClick={handleTriangle}
>
  <Triangle size={20} />
  <span>Triangle</span>
</button>

<button
  className="toolbar-button"
  draggable
  onDragStart={(e) => handleDragStart(e, 'diamond')}
  onClick={handleDiamond}
>
  <Diamond size={20} />
  <span>Diamond</span>
</button>

<button
  className="toolbar-button"
  draggable
  onDragStart={(e) => handleDragStart(e, 'star')}
  onClick={handleStar}
>
  <Star size={20} />
  <span>Star</span>
</button>
```

### 2. Update App.tsx handleDrop

```typescript
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
      text: '',
    },
  }
} else if (shapeType === 'diamond') {
  shapeDef = {
    id: shapeId,
    type: 'geo',
    x: point.x - 50,
    y: point.y - 50,
    props: {
      geo: 'diamond',
      w: 100,
      h: 100,
      fill: 'none',
      dash: 'draw',
      size: borderSize,
      color: 'black',
      text: '',
    },
  }
} else if (shapeType === 'star') {
  shapeDef = {
    id: shapeId,
    type: 'geo',
    x: point.x - 50,
    y: point.y - 50,
    props: {
      geo: 'star',
      w: 100,
      h: 100,
      fill: 'none',
      dash: 'draw',
      size: borderSize,
      color: 'black',
      text: '',
    },
  }
}
```

## Shape Properties Reference

### Common Properties

```typescript
{
  id: string,              // Unique shape ID (use createShapeId())
  type: 'geo' | 'text' | 'arrow' | 'line' | 'draw',
  x: number,              // X position in page coordinates
  y: number,              // Y position in page coordinates
  props: {
    // For geo shapes:
    geo: string,          // 'rectangle', 'ellipse', 'triangle', etc.
    w: number,           // Width
    h: number,           // Height
    fill: string,        // 'none' | 'semi' | 'solid' | color
    dash: string,        // 'draw' | 'dashed' | 'dotted'
    size: 's' | 'm' | 'l' | 'xl',  // Border width
    color: string,       // Color name or hex
    text: string,        // Text content (for geo shapes)
    
    // For text shapes:
    text: string,
    color: string,
    size: 's' | 'm' | 'l' | 'xl',
    font: 'draw' | 'sans' | 'serif' | 'mono',
    autoSize: boolean,
  }
}
```

## Tips

1. **Icon Selection**: Use icons from `lucide-react` that match your shape
2. **Positioning**: Center shapes on drop point (subtract half width/height)
3. **Size**: Default size is 100x100, adjust as needed
4. **Border Width**: Use `borderSize` from context for consistency
5. **Text Support**: Add `text: ''` to geo shapes to enable text editing

## Testing

After adding a custom shape:

1. Check toolbar button appears
2. Test drag-and-drop from toolbar
3. Test click-to-select tool
4. Verify shape appears correctly
5. Test resizing and text editing (if applicable)
6. Verify border width control works

## Next Steps

- Add more shapes using the geo types
- Experiment with custom SVG paths
- Explore tldraw's advanced shape customization
- Add shape-specific properties (colors, sizes, etc.)
