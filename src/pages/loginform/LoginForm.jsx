import React, {useState, useRef} from 'react'
import { signup, login, logout, useAuth } from "../../firebase";

import './loginform.css'

const LoginForm = () => {

  // sign in/sign up handlers
  const [hasAccount, setHasAccount] = useState(false)
  const accountName = useAuth()

  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleSignup() {
    // try {
      await signup(emailRef.current.value, passwordRef.current.value);
    // } catch {
      // alert("Error!");
    // }
  }

  async function handleLogin() {
    try {
      await login(emailRef.current.value, passwordRef.current.value);
    } catch {
      alert("Error!");
    }
  }
  
  async function handleLogout() {
    try {
      await logout();
    } catch {
      alert("Error!");
    }
  }

  return (
    <>
    {accountName ? (
    <div className="login">
      <div className="loginContainer">
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
            required
            ref={emailRef}
            placeholder="email"
          />
        <label>Password</label>
          <input 
            type="password" 
            required 
            ref={passwordRef}
            name="password" 
            placeholder="password"
          />
        <div className="btnContainer">
          {hasAccount ?  (
            <>
              <button onClick={handleLogin}>Sign in</button>
              <p className = 'signInUpToggle'>or sign up
                <span onClick={() => setHasAccount(!hasAccount)}>here!</span>
              </p>
            </>
          ) : (
            <>
              <button onClick={handleSignup}>Sign up</button> 
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