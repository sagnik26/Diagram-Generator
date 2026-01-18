import { createContext, useContext, useState, ReactNode } from 'react'
import { Editor } from '@tldraw/tldraw'

interface EditorContextType {
  editor: Editor | null
  setEditor: (editor: Editor | null) => void
}

const EditorContext = createContext<EditorContextType>({
  editor: null,
  setEditor: () => {},
})

export const useEditorContext = () => useContext(EditorContext)

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [editor, setEditor] = useState<Editor | null>(null)

  return (
    <EditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </EditorContext.Provider>
  )
}
