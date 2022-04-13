import React, {useState, useRef, useLayoutEffect} from 'react'
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

  const accountName = useAuth()
  var lists = []

  // make sure account auth is checked before getting list from db
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    {accountName ? (getPartListFromDatabase()):(handleDisabledButton())}
  });
  
  const handleDisabledButton = () => {
    return 0
  }

  // read
  async function getPartListFromDatabase() {
    const list_ref = ref(db, 'PartList/')
    await onValue(list_ref, (snapshot) => {
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.child('current_uid').val() === accountName.uid)
          var list = {
            current_uid : childSnapshot.child('current_uid').val(),
            housing : childSnapshot.child('housing').val(),
            keycap : childSnapshot.child('keycap').val(),
            list_id : childSnapshot.child('list_id').val(),
            list_name : childSnapshot.child('list_name').val(),
            pcb : childSnapshot.child('pcb').val(),
            switches : childSnapshot.child('switches').val()
          }
          lists.push(list)
      })
    })
    console.log({lists})
  }

  // write
  const writeToDatabase = () => {
    const list_id = uid()
    const current_uid = accountName.uid
    set (ref(db, `PartList/${list_id}`), {
      current_uid,
      list_id,
      list_name: lists,
      housing,
      switches,
      keycap,
      pcb
    })
  }
  
  // update
  // delete

  return (
    <>
    <div className="list-maker">
      {/* <input type="text" name='New List' required className="list-name" placeholder="New List" onChange={(e) => setList(e.target.value)} /> */}
      <select name="Lists" id="lists" value={curList} onChange={(e) => setCurList(e.target.value)} >
          <option value="default">--user lists--</option>
          {accountName ? (
            <>
            {lists.map((item, index) => <option key={item.list_id} value={item.list_name}>{item.list_name}</option>)}  
            </>
          ) : ( 
            <> </>
          )}
            </select> 
      <div className="slide">
        <select name="Keycaps" id="keycaps" value={keycap} onChange={(e) => setKeycap(e.target.value)} >
          <option value="default">keycaps</option>
          <option value="abs">ABS</option>
        </select> <br/>
        <select name="Case" id="case" value={housing} onChange={(e) => setHousing(e.target.value)} >
          <option value="default">case</option>
          <option value="Aluminum">Aluminum</option>
        </select> <br/>
        <select name="Switch" id="switch" value={switches} onChange={(e) => setSwitches(e.target.value)}>
          <option value="default">switch</option>
          <option value="MX Blue">MX Blue</option>
        </select> <br/>
        <select name="PCB" id="pcb" value={pcb} onChange={(e) => setPCB(e.target.value)}>
          <option value="default">pcb</option>
          <option value="65%">65%</option>
        </select> <br/>
        {accountName ? (
          <button onClick={writeToDatabase}>Make List</button>
        ) : (
          <button disabled className='disabled' onClick={handleDisabledButton}>Make List</button>
        )}
        
      </div>
    </div>
    </>
  )
}

export default ListMaker 