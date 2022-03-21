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
        setUser("")
      }
    })
  }

  return (
    <div className={`${isShowLogin ? "active" : ""} show`}>
      <div className="login-form">
        <div className="form-box solid">
          <form>
            <h1 className="login-text">Sign In</h1>
            <label>Username</label>
            <br/>
            <input 
            type="text" 
            name="username" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-box" 
            />
            <p className='errorMessage'>{emailError}</p>
            <br/>
            <label>Password</label>
            <br/>
            <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password" 
            className="login-box" 
            />
            <p className='errorMessage'>{passwordError}</p>
            <br/>
            {hasAccount ?  (
              <>
                <button onClick={handleLogin}>Sign in</button>
                <p>or sign up 
                  <span onClick={() => setHasAccount(!hasAccount)}> here!</span>
                </p>
              </>
            ) : (
              <>
                <button onClick={handleSignup}>Sign up</button> 
                <p>or sign in 
                  <span onClick={() => setHasAccount(!hasAccount)}> here!</span>
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm 