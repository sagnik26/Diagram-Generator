# Guide: Creating Custom Components with Lucide Icons

This guide explains how to create custom shape components using Lucide React icons and integrate them into the Diagram Generator project.

## Overview

Custom components are shapes that use Lucide React icons and are fully integrated with tldraw's features (selection, resizing, text editing, connections, etc.). Examples include Database, HardDrive, Search, and Box icons.

---

## Step-by-Step Guide

### Step 1: Create the Custom Shape File

Create a new file in `src/shapes/` directory. For example, `src/shapes/YourIconShape.tsx`

**Template:**

```typescript
import { BaseBoxShapeUtil, TLBaseShape, RecordProps, T, HTMLContainer } from '@tldraw/tldraw'
import { YourIcon } from 'lucide-react' // Replace with your Lucide icon

// Define the shape type
export type YourIconShape = TLBaseShape<
  'your-icon', // Unique type name (use kebab-case)
  {
    w: number
    h: number
    color: string
    size: 's' | 'm' | 'l' | 'xl'
    fill: 'none' | 'semi' | 'solid'
    dash: 'draw' | 'dashed' | 'dotted'
    text: string
  }
>

// Custom ShapeUtil for your icon
export class YourIconShapeUtil extends BaseBoxShapeUtil<YourIconShape> {
  static override type = 'your-icon' as const

  static override props: RecordProps<YourIconShape> = {
    w: T.number,
    h: T.number,
    color: T.string,
    size: T.literalEnum('s', 'm', 'l', 'xl'),
    fill: T.literalEnum('none', 'semi', 'solid'),
    dash: T.literalEnum('draw', 'dashed', 'dotted'),
    text: T.string,
  }

  override getDefaultProps(): YourIconShape['props'] {
    return {
      w: 120,        // Default width
      h: 80,         // Default height
      color: 'black',
      size: 'm',
      fill: 'none',
      dash: 'draw',
      text: '',
    }
  }

  override component(shape: YourIconShape) {
    const { w, h } = shape.props
    const iconSize = Math.min(w, h) * 0.7 // Scale icon to 70% of smallest dimension
    
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: w,
          height: h,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'currentColor',
        }}
      >
        {/* Lucide Icon */}
        <YourIcon 
          size={iconSize} 
          strokeWidth={this.getStrokeWidth(shape.props.size)}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        
        {/* Text overlay */}
        {shape.props.text && (
          <div
            style={{
              position: 'absolute',
              bottom: h * 0.1,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: Math.min(w, h) * 0.12,
              color: 'currentColor',
              pointerEvents: 'none',
              userSelect: 'none',
              textAlign: 'center',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: w * 0.9,
            }}
          >
            {shape.props.text}
          </div>
        )}
      </HTMLContainer>
    )
  }

  override indicator(shape: YourIconShape) {
    const { w, h } = shape.props
    return <rect width={w} height={h} />
  }

  private getStrokeWidth(size: 's' | 'm' | 'l' | 'xl'): number {
    switch (size) {
      case 's': return 1
      case 'm': return 2
      case 'l': return 3
      case 'xl': return 4
      default: return 2
    }
  }
}
```

**Key Points:**
- Replace `YourIcon` with your Lucide icon import
- Replace `'your-icon'` with a unique kebab-case name
- Replace `YourIconShape` and `YourIconShapeUtil` with descriptive names
- Adjust default `w` and `h` values as needed

---

### Step 2: Register the Shape with tldraw

**File:** `src/App.tsx`

**2.1. Import the ShapeUtil:**

```typescript
import { YourIconShapeUtil } from './shapes/YourIconShape'
```

**2.2. Add to shapeUtils array:**

Find the `<Tldraw>` component and add your shape util:

```typescript
<Tldraw
  shapeUtils={[
    CylinderShapeUtil, 
    HardDriveShapeUtil, 
    SearchShapeUtil, 
    BoxShapeUtil,
    YourIconShapeUtil  // Add your new shape here
  ]}
  onMount={(editor) => {
    // ...
  }}
  hideUi
/>
```

---

### Step 3: Add Button to Toolbar

**File:** `src/components/CustomToolbar.tsx`

**3.1. Import the icon:**

```typescript
import {
  // ... existing imports
  YourIcon, // Add your Lucide icon
} from 'lucide-react'
```

**3.2. Add handler function:**

```typescript
const handleYourIcon = useCallback(() => {
  if (!editor) return
  editor.setCurrentTool('geo') // Or your custom tool if needed
}, [editor])
```

**3.3. Add button in toolbar JSX:**

Find the appropriate section (or create a new one) and add:

```typescript
<button
  className="toolbar-button"
  draggable
  onDragStart={(e) => handleDragStart(e, 'your-icon')}
  onClick={handleYourIcon}
  title="Your Icon - Click to select tool or drag to canvas"
>
  <YourIcon size={20} />
  <span>Your Icon</span>
</button>
```

**Note:** The `'your-icon'` string must match the shape type you defined in Step 1.

---

### Step 4: Handle Drop Event

**File:** `src/App.tsx`

**4.1. Find the `handleDrop` function:**

Look for the `handleDrop` callback in `AppContentInner` function.

**4.2. Add shape creation logic:**

Add your shape case in the `if-else` chain:

```typescript
} else if (shapeType === 'your-icon') {
  // YOUR_ICON: Custom shape, size 120x80
  shapeDef = {
    id: shapeId,
    type: 'your-icon', // Must match the type in your ShapeUtil
    x: point.x - 60,   // Center horizontally (half of width)
    y: point.y - 40,   // Center vertically (half of height)
    props: {
      w: 120,          // Width
      h: 80,           // Height
      fill: 'none',
      dash: 'draw',
      size: borderSize, // Respects border width setting
      color: 'black',
      text: 'Your Label', // Default text
    },
  }
} else {
```

**Key Points:**
- `type: 'your-icon'` must match your ShapeUtil's type
- Adjust `x` and `y` offsets based on your default width/height
- Adjust `w` and `h` to your desired default size

---

### Step 5: Integrate with Features

**File:** `src/App.tsx`

**5.1. Enable text editing:**

In the `setupTextEditing` function, find the double-click handler:

```typescript
if (hitShape && (hitShape.type === 'geo' || hitShape.type === 'text' || hitShape.type === 'cylinder' || ...)) {
```

Add your shape type:

```typescript
if (hitShape && (hitShape.type === 'geo' || hitShape.type === 'text' || hitShape.type === 'cylinder' || hitShape.type === 'your-icon' || ...)) {
```

**5.2. Enable border width management:**

In the `setupTextEditing` function, find the store listener:

```typescript
shapes.forEach((shape: any) => {
  if (shape.type === 'geo' || shape.type === 'cylinder' || ...) {
```

Add your shape type:

```typescript
if (shape.type === 'geo' || shape.type === 'cylinder' || shape.type === 'your-icon' || ...) {
```

**File:** `src/components/CustomToolbar.tsx`

**5.3. Enable border width updates:**

In `handleBorderWidthChange`, find:

```typescript
if (shape.type === 'geo' || shape.type === 'cylinder' || ...) {
```

Add your shape type:

```typescript
if (shape.type === 'geo' || shape.type === 'cylinder' || shape.type === 'your-icon' || ...) {
```

**File:** `src/components/ConnectionPoints.tsx`

**5.4. Enable connection points:**

Find the hover check:

```typescript
if (hoveredShape.type === 'geo' || hoveredShape.type === 'cylinder' || ... || hoveredShape.type === 'text') {
```

Add your shape type:

```typescript
if (hoveredShape.type === 'geo' || hoveredShape.type === 'cylinder' || hoveredShape.type === 'your-icon' || ... || hoveredShape.type === 'text') {
```

---

## Complete Example: Adding a Server Icon

Let's create a complete example for a Server icon.

### Step 1: Create `src/shapes/ServerShape.tsx`

```typescript
import { BaseBoxShapeUtil, TLBaseShape, RecordProps, T, HTMLContainer } from '@tldraw/tldraw'
import { Server } from 'lucide-react'

export type ServerShape = TLBaseShape<
  'server',
  {
    w: number
    h: number
    color: string
    size: 's' | 'm' | 'l' | 'xl'
    fill: 'none' | 'semi' | 'solid'
    dash: 'draw' | 'dashed' | 'dotted'
    text: string
  }
>

export class ServerShapeUtil extends BaseBoxShapeUtil<ServerShape> {
  static override type = 'server' as const

  static override props: RecordProps<ServerShape> = {
    w: T.number,
    h: T.number,
    color: T.string,
    size: T.literalEnum('s', 'm', 'l', 'xl'),
    fill: T.literalEnum('none', 'semi', 'solid'),
    dash: T.literalEnum('draw', 'dashed', 'dotted'),
    text: T.string,
  }

  override getDefaultProps(): ServerShape['props'] {
    return {
      w: 120,
      h: 100,
      color: 'black',
      size: 'm',
      fill: 'none',
      dash: 'draw',
      text: '',
    }
  }

  override component(shape: ServerShape) {
    const { w, h } = shape.props
    const iconSize = Math.min(w, h) * 0.7
    
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: w,
          height: h,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'currentColor',
        }}
      >
        <Server 
          size={iconSize} 
          strokeWidth={this.getStrokeWidth(shape.props.size)}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        
        {shape.props.text && (
          <div
            style={{
              position: 'absolute',
              bottom: h * 0.1,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: Math.min(w, h) * 0.12,
              color: 'currentColor',
              pointerEvents: 'none',
              userSelect: 'none',
              textAlign: 'center',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: w * 0.9,
            }}
          >
            {shape.props.text}
          </div>
        )}
      </HTMLContainer>
    )
  }

  override indicator(shape: ServerShape) {
    const { w, h } = shape.props
    return <rect width={w} height={h} />
  }

  private getStrokeWidth(size: 's' | 'm' | 'l' | 'xl'): number {
    switch (size) {
      case 's': return 1
      case 'm': return 2
      case 'l': return 3
      case 'xl': return 4
      default: return 2
    }
  }
}
```

### Step 2: Register in `src/App.tsx`

```typescript
import { ServerShapeUtil } from './shapes/ServerShape'

// In the Tldraw component:
<Tldraw
  shapeUtils={[
    CylinderShapeUtil, 
    HardDriveShapeUtil, 
    SearchShapeUtil, 
    BoxShapeUtil,
    ServerShapeUtil  // Add this
  ]}
  // ...
/>
```

### Step 3: Add to Toolbar in `src/components/CustomToolbar.tsx`

```typescript
import { Server } from 'lucide-react'

// Add handler:
const handleServer = useCallback(() => {
  if (!editor) return
  editor.setCurrentTool('geo')
}, [editor])

// Add button:
<button
  className="toolbar-button"
  draggable
  onDragStart={(e) => handleDragStart(e, 'server')}
  onClick={handleServer}
  title="Server - Click to select tool or drag to canvas"
>
  <Server size={20} />
  <span>Server</span>
</button>
```

### Step 4: Handle Drop in `src/App.tsx`

```typescript
} else if (shapeType === 'server') {
  shapeDef = {
    id: shapeId,
    type: 'server',
    x: point.x - 60,
    y: point.y - 50,
    props: {
      w: 120,
      h: 100,
      fill: 'none',
      dash: 'draw',
      size: borderSize,
      color: 'black',
      text: 'Server',
    },
  }
} else {
```

### Step 5: Integrate Features

Update all the integration points as described in Step 5 above.

---

## File Checklist

When adding a custom component, update these files:

- [ ] `src/shapes/YourIconShape.tsx` - Create new shape file
- [ ] `src/App.tsx` - Import and register shape util
- [ ] `src/App.tsx` - Add drop handler
- [ ] `src/App.tsx` - Add to text editing (double-click)
- [ ] `src/App.tsx` - Add to border width management
- [ ] `src/components/CustomToolbar.tsx` - Import icon
- [ ] `src/components/CustomToolbar.tsx` - Add handler function
- [ ] `src/components/CustomToolbar.tsx` - Add toolbar button
- [ ] `src/components/CustomToolbar.tsx` - Add to border width updates
- [ ] `src/components/ConnectionPoints.tsx` - Add to connection points check

---

## Shape Properties

### Required Properties

All custom shapes must include these props:

```typescript
{
  w: number,           // Width
  h: number,           // Height
  color: string,       // Color (tldraw color name)
  size: 's' | 'm' | 'l' | 'xl',  // Border width
  fill: 'none' | 'semi' | 'solid', // Fill style
  dash: 'draw' | 'dashed' | 'dotted', // Border style
  text: string,        // Text label
}
```

### Optional Customization

You can add custom properties:

```typescript
// In shape type definition:
export type YourShape = TLBaseShape<
  'your-shape',
  {
    // ... standard props
    customProp: string,  // Add custom property
  }
>

// In props definition:
static override props: RecordProps<YourShape> = {
  // ... standard props
  customProp: T.string,  // Add validation
}
```

---

## Available Lucide Icons

Browse all available icons at: https://lucide.dev/icons/

Popular infrastructure icons:
- `Server`, `Database`, `HardDrive`, `Box`, `Search`
- `Cloud`, `Network`, `Router`, `Monitor`, `Smartphone`
- `Globe`, `Lock`, `Key`, `Shield`, `AlertCircle`

---

## Tips

1. **Icon Size**: Icons scale to 70% of the smallest dimension for good visibility
2. **Text Position**: Text appears at the bottom (10% from bottom edge)
3. **Stroke Width**: Maps to border width setting (1-4px based on size)
4. **Naming**: Use kebab-case for shape types (`'my-shape'`)
5. **Default Sizes**: Common sizes: 100×100 (square), 120×80 (wide), 140×80 (extra wide)
6. **Testing**: After adding, test:
   - Drag-and-drop from toolbar
   - Click to select tool
   - Resize the shape
   - Double-click to edit text
   - Change border width
   - Connect with arrows
   - Delete with keyboard

---

## Troubleshooting

### Shape not appearing
- Check if shape util is registered in `shapeUtils` array
- Verify shape type matches in all files
- Check browser console for errors

### Text editing not working
- Ensure shape type is added to double-click handler
- Check if `text` property is in shape props

### Border width not working
- Add shape type to border width management in `App.tsx`
- Add shape type to border width updates in `CustomToolbar.tsx`

### Connection points not showing
- Add shape type to connection points check in `ConnectionPoints.tsx`

### TypeScript errors
- Ensure all imports are correct
- Check that shape type is consistent across files
- Verify `RecordProps` validation matches shape props

---

## Example: Multiple Icons

To add multiple icons at once:

1. Create separate shape files for each icon
2. Import all in `App.tsx`
3. Add all to `shapeUtils` array
4. Add all buttons to toolbar
5. Add all drop handlers
6. Update all integration points

---

## Summary

Creating a custom component involves:
1. **Creating** a ShapeUtil class with Lucide icon
2. **Registering** it with tldraw
3. **Adding** toolbar button
4. **Handling** drop events
5. **Integrating** with features (text, border, connections)

Follow this guide step-by-step, and your custom component will work seamlessly with all tldraw features!
