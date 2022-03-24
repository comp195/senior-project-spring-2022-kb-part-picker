import React, {useState, useEffect} from 'react'
import {db} from '../../firebase'
import {set, ref, onValue} from 'firebase/database'
import {uid} from "uid"

import './listmaker.css'

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
  return 
}

export default ListMaker 