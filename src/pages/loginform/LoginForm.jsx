import React, {useState, useRef} from 'react'
import { signup, login, logout, useAuth } from "../../firebase";
import './loginform.css'

const LoginForm = () => {

    // sign in/sign up handlers
    const [hasAccount, setHasAccount] = useState(false)
    const [ loading, setLoading ] = useState(false);
    const currentUser = useAuth();
  
    const emailRef = useRef();
    const passwordRef = useRef();
  
    async function handleSignup() {
      setLoading(true);
      // try {
        await signup(emailRef.current.value, passwordRef.current.value);
      // } catch {
        // alert("Error!");
      // }
      setLoading(false);
    }
  
    async function handleLogin() {
      setLoading(true);
      try {
        await login(emailRef.current.value, passwordRef.current.value);
      } catch {
        alert("Error!");
      }
      setLoading(false);
    }
  
    async function handleLogout() {
      setLoading(true);
      try {
        await logout();
      } catch {
        alert("Error!");
      }
      setLoading(false);
    }

  return (
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
  )
}

export default LoginForm 