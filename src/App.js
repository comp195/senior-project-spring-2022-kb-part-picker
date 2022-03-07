import React, {useState, useEffect} from 'react';
import fire from './firebase'

import { Article, Brand, CTA, Feature, Navbar, LoginForm } from './components';
import { Blog, Features, Footer, Header, Possibility, WhatGPT3 } from './containers'
import './App.css'

const App = () => {
  // sign-in/sign-up pop up toggle
  const [isShowLogin, setIsShowLogin] = useState(true)

  const handleLoginClick = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin)
  }

  // sign in/sign up handlers
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [hasAccount, setHasAccount] = useState(false)

  const clearInputs = () => {
    setEmail('')
    setPassword('')
  }

  const clearErrors = () => {
    setEmailError('')
    setPasswordError('')
  }

  const handleLogin = () => {
    clearErrors()

    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        switch(error.code) {
          case 'auth/invalid-email':
          case 'auth/user-disabled':
          case 'auth/user-not-found':
            setEmailError(error.message)
            break
          case 'auth/wrong-password':
            setPasswordError(error.message)
            break
        }
      })
  }

  const handleSignup = () => {
    clearErrors()

    fire
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        switch(error.code) {
          case 'auth/email-already-in-use':
          case 'auth/invalid-email':
            setEmailError(error.message)
            break
          case 'auth/weak-password':
            setPasswordError(error.message)
            break
        }
      })
  }

  const handleLogout = () => {
    fire.auth().signOut()
  }

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        clearInputs()
        setUser(user)
      }
      else {
        setUser('')
      }
    })
  }

  useEffect(() => {
    authListener()
  }, [])

  return (
    <div className='App'>
      <Navbar handleLoginClick={handleLoginClick}/>
      {/* <Header /> */}
      <LoginForm 
        isShowLogin={isShowLogin} 
        email={email}
        password={password}
        hasAccount={hasAccount}
        setEmail={setEmail}
        setPassword={setPassword}
        setHasAccount={setHasAccount}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        emailError={emailError}
        passwordError={passwordError}
      />
      {/* <Brand />
      <Footer /> */}
    </div>
  )
}

export default App