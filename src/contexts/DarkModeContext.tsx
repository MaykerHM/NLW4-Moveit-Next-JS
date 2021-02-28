import { createContext, ReactNode, useState } from "react";

interface DarkModeContextData {
  toggle: boolean
  darkmode: () => void
}

interface DarkModeProviderProps {
  children: ReactNode
}

export const DarkmodeContext = createContext({} as DarkModeContextData)

export function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [toggle, setToggle] = useState(true)

  function darkmode() {
    setToggle(!toggle)
    if (toggle) {
      document.documentElement.style.setProperty('--background', '#1A1A1A');
      document.documentElement.style.setProperty('--text', '#f2f3f5');
      document.documentElement.style.setProperty('--title', '#fff');
      document.documentElement.style.setProperty('--white', '#2e384d');
      document.documentElement.style.setProperty('--right-border', '#1A1A1A');
      document.documentElement.style.setProperty('--blue', '#4cd62b');
      document.documentElement.style.setProperty('--blue-dark', '#24ED3C');
      document.documentElement.style.setProperty('--dark-mode-button', '#24ED3C');
      document.documentElement.style.setProperty('--dark-mode-button-background', '#3BA321');
      document.documentElement.style.setProperty('--toggle-position', '0 0 0 auto');
    } else {
      document.documentElement.style.setProperty('--background', '#f2f3f5');
      document.documentElement.style.setProperty('--text', '#666666');
      document.documentElement.style.setProperty('--title', '#2e384d');
      document.documentElement.style.setProperty('--white', '#fff');
      document.documentElement.style.setProperty('--right-border', '#f2f3f5');
      document.documentElement.style.setProperty('--blue', '#5965e0');
      document.documentElement.style.setProperty('--blue-dark', '#4953b8');
      document.documentElement.style.setProperty('--dark-mode-button', '#8257e6');
      document.documentElement.style.setProperty('--dark-mode-button-background', '#b59fea');
      document.documentElement.style.setProperty('--toggle-position', '0 auto 0 0');
    }
  }

  return (
    <DarkmodeContext.Provider value={ { toggle, darkmode } }>
      {children }
    </DarkmodeContext.Provider>
  )
}