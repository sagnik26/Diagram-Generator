import { useState, useRef, useEffect } from 'react'
import { Save, FolderOpen, FileImage, Download, ChevronDown } from 'lucide-react'
import './TopNav.css'

interface TopNavProps {
  onSave: () => void
  onLoad: () => void
  onExportPNG: () => void
  onExportSVG: () => void
}

function TopNav({ onSave, onLoad, onExportPNG, onExportSVG }: TopNavProps) {
  const [fileOpen, setFileOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const fileRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fileRef.current && !fileRef.current.contains(event.target as Node)) {
        setFileOpen(false)
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="top-nav">
      <div className="top-nav-content">
        <div className="top-nav-menu" ref={fileRef}>
          <button
            className="top-nav-menu-button"
            onClick={() => {
              setFileOpen(!fileOpen)
              setExportOpen(false)
            }}
          >
            <span>File</span>
            <ChevronDown size={14} className={fileOpen ? 'rotated' : ''} />
          </button>
          {fileOpen && (
            <div className="top-nav-dropdown">
              <button
                className="top-nav-dropdown-item"
                onClick={() => {
                  onSave()
                  setFileOpen(false)
                }}
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              <button
                className="top-nav-dropdown-item"
                onClick={() => {
                  onLoad()
                  setFileOpen(false)
                }}
              >
                <FolderOpen size={16} />
                <span>Load</span>
              </button>
            </div>
          )}
        </div>
        <div className="top-nav-menu" ref={exportRef}>
          <button
            className="top-nav-menu-button"
            onClick={() => {
              setExportOpen(!exportOpen)
              setFileOpen(false)
            }}
          >
            <span>Export</span>
            <ChevronDown size={14} className={exportOpen ? 'rotated' : ''} />
          </button>
          {exportOpen && (
            <div className="top-nav-dropdown">
              <button
                className="top-nav-dropdown-item"
                onClick={() => {
                  onExportPNG()
                  setExportOpen(false)
                }}
              >
                <FileImage size={16} />
                <span>PNG</span>
              </button>
              <button
                className="top-nav-dropdown-item"
                onClick={() => {
                  onExportSVG()
                  setExportOpen(false)
                }}
              >
                <Download size={16} />
                <span>SVG</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default TopNav
