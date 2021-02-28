import Head from 'next/head'
import { GetServerSideProps } from 'next'

import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import { ChallengeBox } from "../components/ChallengeBox";

import styles from '../styles/pages/Home.module.css'
import { CountdownProvider } from '../contexts/CountdownContext';
import { ChallengesContext, ChallengesProvider } from '../contexts/ChallengesContext';
import axios from 'axios'
import { FormEvent, useContext, useEffect, useState } from 'react';

interface HomeProps {
  level: number
  currentExperience: number
  challengesCompleted: number
}

export default function Home(props: HomeProps) {

  const { loggedIn, github, loginGithub, handleLoginGithub } = useContext(ChallengesContext)


  return (
    <>
      <ChallengesProvider
        level={ props.level }
        currentExperience={ props.currentExperience }
        challengesCompleted={ props.challengesCompleted }
      >
        { loggedIn ?
          (
            <div className={ styles.container }>
              <Head>
                <title>Inicio | move.it</title>
              </Head>

              <ExperienceBar />

              <CountdownProvider>
                <section>
                  <div>
                    <Profile />
                    <CompletedChallenges />
                    <Countdown />
                  </div>
                  <div>
                    <ChallengeBox />
                  </div>
                </section>
              </CountdownProvider>
            </div>
          ) : (
            <form className={ styles.container } onSubmit={ handleLoginGithub }>
              <label htmlFor="github">Github</label>
              <input type="text" name="github" value={ github } onChange={ e => loginGithub(e.target.value) } />
              <button type="submit">Login</button>
            </form>
          ) }
      </ChallengesProvider>
    </>
  )
}