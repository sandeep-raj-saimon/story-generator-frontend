import { createContext } from 'react'

export const NavigationContext = createContext(null)

export const NavigationProvider = ({ children, navigate }) => {
  return (
    <NavigationContext.Provider value={navigate}>
      {children}
    </NavigationContext.Provider>
  )
}