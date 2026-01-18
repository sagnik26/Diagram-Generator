# Diagram Generator - Draw.io Clone

A modern diagram editor built with React, TypeScript, and tldraw, inspired by draw.io.

## Features

- 🎨 **Infinite Canvas**: Pan and zoom with smooth interactions
- 🖱️ **Drawing Tools**: Rectangle, Circle, Arrow, Line, and Text tools
- 🛠️ **Custom Toolbar**: Easy access to all shapes and tools
- 💾 **Save/Load**: Save and load diagrams in JSON format
- 📤 **Export**: Export diagrams as PNG or SVG
- 🎯 **Modern UI**: Clean, intuitive interface similar to draw.io

## Getting Started

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

## Usage

1. **Select Tools**: Click on any tool in the left toolbar (Rectangle, Circle, Arrow, Line, Text)
2. **Draw**: Click and drag on the canvas to create shapes
3. **Pan**: Hold space and drag, or use middle mouse button
4. **Zoom**: Use mouse wheel or pinch gesture
5. **Select**: Click on shapes to select and edit them
6. **Delete**: Select a shape and press Delete or Backspace
7. **Save**: Click the Save button to download your diagram as JSON
8. **Load**: Click the Load button to import a previously saved diagram
9. **Export**: Use PNG or SVG buttons to export your diagram as an image

## Available Tools

- **Rectangle**: Draw rectangular shapes
- **Circle**: Draw circular/elliptical shapes
- **Arrow**: Draw arrows and connectors
- **Line**: Draw straight lines
- **Text**: Add text labels

## Technologies

- React 18
- TypeScript
- tldraw (powerful drawing library)
- Vite
- Lucide React (icons)

## Project Structure

```
src/
  App.tsx                 # Main application component
  components/
    CustomToolbar.tsx     # Custom toolbar with tools and file operations
  contexts/
    EditorContext.tsx     # Editor context for sharing editor instance
```

## Features in Detail

### Infinite Canvas
- Smooth panning and zooming
- Infinite workspace
- Grid background for alignment

### Drawing Tools
- All tools support resizing and editing
- Shapes can be styled with colors and borders
- Text tool for adding labels

### Save/Load
- Save diagrams as JSON files
- Load previously saved diagrams
- Preserves all shapes, positions, and styles

### Export
- PNG export for raster images
- SVG export for vector graphics
- High-quality output
