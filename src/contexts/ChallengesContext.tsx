import { createContext, useState, ReactNode, useEffect, FormEvent, } from 'react'
import Cookies from 'js-cookie'
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal'
import axios from 'axios'

interface Challenge {
  type: 'body' | 'eye'
  description: string
  amount: number
}

interface ChallengesContextData {
  github: string
  loggedIn: boolean
  level: number
  currentExperience: number
  experienceToNextLevel: number
  challengesCompleted: number
  activeChallenge: Challenge
  levelUp: () => void
  startNewChallenge: () => void
  resetChallenge: () => void
  completeChallenge: () => void
  closeLevelUpModal: () => void
  handleLoginGithub: (event: FormEvent) => void
  loginGithub: (login: string) => void
}

interface ChallengesProviderProps {
  children: ReactNode
  level: number
  currentExperience: number
  challengesCompleted: number
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({
  children,
  ...rest
}: ChallengesProviderProps) {
  const [github, setGithub] = useState('')
  const [loggedIn, setloggedIn] = useState(false)

  const [level, setlevel] = useState(rest.level ?? 1)
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)

  const [activeChallenge, setActiveChallenge] = useState(null)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  useEffect(() => {
    axios.get(`/api/${github}`).then(response => response.data).then(data => {
      setCurrentExperience(data.currentExperience)
      setChallengesCompleted(data.challengesCompleted)
      setlevel(data.level)
    }).catch(error => console.log(error))

    axios.put(`api/${github}`, { level, currentExperience, challengesCompleted }).catch(error => console.log(error))
  }, [currentExperience])

  function handleLoginGithub(event: FormEvent) {
    event.preventDefault()
    axios.post('/api/login', { github }).catch(error => console.log(error))
    setloggedIn(true)
  }

  function loginGithub(login: string) {
    setGithub(login)
  }

  // -----------------------------------------------------------------------------

  function levelUp() {
    setlevel(level + 1)
    setIsLevelUpModalOpen(true)
  }

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false)
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex]

    setActiveChallenge(challenge)

    new Audio('/notification.mp3').play

    if (Notification.permission === 'granted') {
      new Notification('Novo desafio! 🎉'), {
        body: `Valendo ${challenge.amount}xp!`
      }
    }
  }

  function resetChallenge() {
    setActiveChallenge(null)
  }

  function completeChallenge() {
    if (!activeChallenge) {
      return
    }

    const { amount } = activeChallenge

    let finalExperience = currentExperience + amount

    if (finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel
      levelUp()
    }

    setCurrentExperience(finalExperience)
    setActiveChallenge(null)
    setChallengesCompleted(challengesCompleted + 1)
  }

  return (
    <ChallengesContext.Provider
      value={ {
        github,
        loggedIn,
        level,
        currentExperience,
        experienceToNextLevel,
        challengesCompleted,
        levelUp,
        startNewChallenge,
        activeChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal,
        handleLoginGithub,
        loginGithub
      } }
    >
      { children }

      { isLevelUpModalOpen && <LevelUpModal /> }
    </ChallengesContext.Provider>
  )
}