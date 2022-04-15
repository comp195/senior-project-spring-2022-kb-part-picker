import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import {db, useAuth} from '../../firebase'
import {set, ref, onValue} from 'firebase/database'
import {uid} from "uid"

import './listmaker.scss'

const ListMaker = () => {
  const [curList, setCurList] = useState("")
  
  const [housing, setHousing] = useState("")
  const [switches, setSwitches] = useState("")
  const [keycap, setKeycap] = useState("")
  const [pcb, setPCB] = useState("")

  const [dbUpdating, setDBUpdating] = useState(true)
  const [lists, setLists] = useState([])

  const accountName = useAuth()
  const gettingDB = useRef(true)

  // make sure account auth is checked before getting list from db
  const firstUpdate = useRef(true)
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      
      return
    }
    {accountName ? (getPartListFromDatabase()):(handleDisabledButton())}
    
  });
  
  const handleDisabledButton = () => {
    return 0
  }

  // read
  async function getPartListFromDatabase() {
    if (gettingDB.current) {
      const list_ref = ref(db, 'PartList/')
      await onValue(list_ref, (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
          if (childSnapshot.child('current_uid').val() === accountName.uid)
            setLists(old =>[...old, childSnapshot.val()])
        })
      })
      gettingDB.current = false
    }
    
    
    
    console.log({lists})
    
    setDBUpdating(false)
  }

  // write
  const writeToDatabase = () => {
    // const list_id = uid()
    // const current_uid = accountName.uid
    // set (ref(db, `PartList/${list_id}`), {
    //   current_uid,
    //   list_id,
    //   list_name: lists,
    //   housing,
    //   switches,
    //   keycap,
    //   pcb
    // })
  }
  
  // update
  // delete

  return (
    <>
    <div className="list-maker">
      {/* <input type="text" name='New List' required className="list-name" placeholder="New List" onChange={(e) => setList(e.target.value)} /> */}
      <select name="Lists" id="lists" value={curList} onChange={(e) => setCurList(e.target.value)} >
        <option className='default' value="default">user lists</option>
        {dbUpdating ? (<></>): (
            lists.map(l => (
              <option key={l.list_id} value={l.list_name}>{l.list_name}</option>
            ))
          )
        }  
      </select> 
      <select name="Keycaps" id="keycaps" value={keycap} onChange={(e) => setKeycap(e.target.value)} >
        <option className='default' value="default">keycaps</option>
        <option value="abs">ABS</option>
      </select> <br/>
      <select name="Case" id="case" value={housing} onChange={(e) => setHousing(e.target.value)} >
        <option className='default' value="default">case</option>
        <option value="Aluminum">Aluminum</option>
      </select> <br/>
      <select name="Switch" id="switch" value={switches} onChange={(e) => setSwitches(e.target.value)}>
        <option className='default'value="default">switch</option>
        <option value="MX Blue">MX Blue</option>
      </select> <br/>
      <select name="PCB" id="pcb" value={pcb} onChange={(e) => setPCB(e.target.value)}>
        <option className='default'value="default">pcb</option>
        <option value="65%">65%</option>
      </select> <br/>
      {accountName ? (
        <button onClick={writeToDatabase}>Make List</button>
      ) : (
        <button disabled className='disabled' onClick={handleDisabledButton}>Make List</button>
      )}
      
  </div>
  </>
  )
}

export default ListMaker 