import React, {useState, useEffect} from 'react'
import fire from '../../firebase'
import './loginform.css'

const LoginForm = ( {isShowLogin} ) => {

  // sign in/sign up handlers
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [hasAccount, setHasAccount] = useState(true)

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
      .signInWithEmailAndPassword(fire.getAuth(), email, password)
  
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
      .createUserWithEmailAndPassword(fire.getAuth(), email, password)
      .then()
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

  // useEffect(() => (
  //   fire.onAuthStateChanged((user) => {
  //     if (user) {
  //       clearInputs()
  //       setUser(user)
  //     }
  //     else {
  //       setUser("")
  //     }
  //   })
  // ), [])

return (

  <div className="login">
    <div className="loginContainer">
      <form>
        <label>Username</label>
          <input 
            type="text" 
            name="username" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-box" 
          />
          <p className='errorMessage'>{emailError}</p>
        <label>Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password" 
            className="login-box" 
          />
          <p className='errorMessage'>{passwordError}</p>
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
      </form>
    </div>
  </div>

  )
}

export default LoginForm 