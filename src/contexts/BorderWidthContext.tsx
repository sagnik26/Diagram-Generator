import { createContext, useContext, useState, ReactNode } from 'react'

interface BorderWidthContextType {
  borderWidth: number
  setBorderWidth: (width: number) => void
}

const BorderWidthContext = createContext<BorderWidthContextType>({
  borderWidth: 2,
  setBorderWidth: () => {},
})

export const useBorderWidthContext = () => useContext(BorderWidthContext)

export const BorderWidthProvider = ({ children }: { children: ReactNode }) => {
  const [borderWidth, setBorderWidth] = useState(2)

  return (
    <BorderWidthContext.Provider value={{ borderWidth, setBorderWidth }}>
      {children}
    </BorderWidthContext.Provider>
  )
}
