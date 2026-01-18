import { useEffect } from 'react'
import { useEditorContext } from '../contexts/EditorContext'

function TextEditor() {
  const { editor } = useEditorContext()

  useEffect(() => {
    if (!editor) return

    const handleDoubleClick = (e: any) => {
      const hitShape = editor.getShapeAtPoint(e.point, {
        hitInside: true,
        margin: 0,
      })

      if (hitShape) {
        // Enable text editing for geo shapes (rectangles, circles, etc.)
        if (hitShape.type === 'geo') {
          editor.setEditingShape(hitShape.id)
          editor.setCurrentTool('select')
        } else if (hitShape.type === 'text') {
          editor.setEditingShape(hitShape.id)
          editor.setCurrentTool('select')
        }
      }
    }

    // Listen for double-click events
    editor.on('double-click', handleDoubleClick)

    return () => {
      editor.off('double-click', handleDoubleClick)
    }
  }, [editor])

  return null
}

export default TextEditor
