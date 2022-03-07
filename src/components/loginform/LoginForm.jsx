import React, {useState, useEffect} from 'react'
import firebase from './firebase'
import {db} from '../../firebase'
import {set, ref, onValue} from 'firebase/database'
import {uid} from "uid"

import './loginform.css'

const LoginForm = ({ isShowLogin }) => {
  const [user, setUser] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [emailError, setemailError] = useState('')
  const [passwordError, setpasswordError] = useState('')
  const [hasAccount, setHasAccount] = useState(false)

  const handleLogin = () => {
    
  }

  return (
    <div className={`${isShowLogin ? "active" : ""} show`}>
      <div className="login-form">
        <div className="form-box solid">
          <form>
            <h1 className="login-text">Sign In</h1>
            <label>Username</label>
            <br/>
            <input type="text" name="username" className="login-box" />
            <br/>
            <label>Password</label>
            <br/>
            <input type="password" name="password" className="login-box" />
            <br/>
            <input type="submit" value="LOGIN" className="login-btn" />
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm 