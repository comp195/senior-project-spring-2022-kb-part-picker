import React, {useState, useEffect} from 'react'
import {db} from '../../firebase'
import {set, ref, onValue} from 'firebase/database'
import {uid} from "uid"

import './loginform.css'

const ListMaker = () => {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])

  const handleTodoChange = (e) => {
    setTodo(e.target.value)
  }
  
  // read
  useEffect(() => {
    onValue(ref(db), snapshot => {
      const data = snapshot.val()
      if (data != null) {
        Object.values(data).map(todo => {
          setTodos(oldArray => [...oldArray, todo])
        })
      }
    })
  }, [])
  // write
  const writeToDatabase = () => {
    const uuid = uid()
    set ( ref(db, `/${uuid}`), {
      todo,
      uuid,

    })
    setTodo("")
  }
  
  // update
  // delete
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