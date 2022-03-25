import React, {useState, useEffect} from 'react'
import {db} from '../../firebase'
import {set, ref, onValue} from 'firebase/database'
import {uid} from "uid"

import './listmaker.css'

const ListMaker = () => {
  const [lists, setLists] = useState([])
  const [list, setList] = useState("")
  const [housing, setHousing] = useState("")
  const [switches, setSwitches] = useState("")
  const [keycap, setKeycap] = useState("")
  const [pcb, setPCB] = useState("")

  const handleListChange = (part, e) => {
    switch(part) {
      case 'name':
        setList(e.target.value)
      case 'housing':
        setHousing(e.target.value)
      case 'switches':
        setSwitches(e.target.value)
      case 'keycap':
        setKeycap(e.target.value)
      case 'pcb':
        setPCB(e.target.value)
    }
  }
  
  // read
  useEffect(() => {
    onValue(ref(db), snapshot => {
      const data = snapshot.val()
      if (data != null) {
        Object.values(data).map(lists => {
          setLists(oldArray => [...oldArray, todo])
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
    <>
    
    </>
  )
}

export default ListMaker 