import styles from '../styles/components/DarkMode.module.css'
import { useContext } from 'react'
import { DarkmodeContext } from '../contexts/DarkModeContext'


export function DarkMode() {
  const { darkmode } = useContext(DarkmodeContext)

  return (
    <button type="button" onClick={ darkmode } className={ styles.toggleContainer }>
      <div className={ styles.toggleButton }></div>
    </button>
  )
}