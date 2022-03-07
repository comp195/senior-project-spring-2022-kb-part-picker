import React from 'react'
import './loginform.css'

const LoginForm = ( isShowLogin, props ) => {
  const {
    email, 
    password, 
    hasAccount, 
    setEmail, 
    setPassword, 
    setHasAccount,
    handleSignin, 
    handleSignup, 
    emailError, 
    passwordError } = props
  
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
            name="password" className="login-box" 
            />
            <p className='errorMessage'>{passwordError}</p>
            <br/>
            <div className="login-btn">
              {hasAccount ?  (
                <>
                  <button onClick={handleSignin}>Sign in</button>
                  <p>or sign up 
                    <span onClick={() => setHasAccount(!hasAccount)}>here!</span>
                  </p>
                </>
              ) : (
                <>
                  <button onClick={handleSignup}>Sign up</button> 
                  <p>or sign in 
                    <span onClick={() => setHasAccount(!hasAccount)}>here!</span>
                  </p>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm 