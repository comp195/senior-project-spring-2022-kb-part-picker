import React, {useState, useRef} from 'react'
import { signup, login, logout, useAuth } from "../../firebase";

import './loginform.scss'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasAccount, setHasAccount] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const accountName = useAuth()

  const emailRef = useRef()
  const passwordRef = useRef()

  const clearInputs = () => {
    emailRef.current = ''
    passwordRef.current = ''
  }

  const clearErrors = () => {
    setEmailError('')
    setPasswordError('')
  }

  async function handleSignup() {
    clearErrors()
    
    try {
      await signup(email, password)
    } catch(e) {
      switch (e.code) {
        case 'auth/invalid-email':
        case 'auth/email-already-in-use':
          setEmailError(e.message)
          break
        case 'auth/weak-password':
          setPasswordError(e.message)
          break
      }
    }
    clearInputs()
  }

  async function handleLogin() {
    clearErrors()
    try {
      await login(email, password)
    } catch(e) {
      switch (e.code) {
        case 'auth/invalid-email':
        case 'auth/user-disabled':
        case 'auth/user-not-found':
          setEmailError(e.message)
          break
        case 'auth/wrong-password':
          setPasswordError(e.message)
          break
      }
    }
    clearInputs()
  }
  
  async function handleLogout() {
    try {
      await logout();
    } catch(e) {
      alert("Error logging out!");
    }
  }

  return (
    <>
    {accountName ? (
      <div className="login">
        <div className="loginContainer">
        <label>Logged in: {accountName.email}</label>
          <div className="btnContainer">
            <button onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </div>
    ) : (
      <div className="login">
        <div className="loginContainer">
          <label>E-mail</label>
            <input 
              name="e-mail" 
              autoFocus
              required
              value={email}
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          <p className='errorMsg'>{emailError}</p>
          <label>Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className='errorMsg'>{passwordError}</p>
          <div className="btnContainer">
            {hasAccount ?  (
              <>
                <button className='lf-button' onClick={handleLogin}>Sign in</button>
                <p className = 'signInUpToggle'>or sign up
                  <span onClick={() => setHasAccount(!hasAccount)}>here!</span>
                </p>
              </>
            ) : (
              <>
                <button className='lf-button' onClick={handleSignup}>Sign up</button> 
                <p className = 'signInUpToggle'>or sign in
                  <span onClick={() => setHasAccount(!hasAccount)}>here!</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      )}
    </>
  )
}

export default LoginForm 