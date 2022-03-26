import React, {useState, useEffect} from 'react'
import fire, {db, useAuth} from '../../firebase'
import {set, ref, onValue} from 'firebase/database'
import {uid} from "uid"

import './listmaker.scss'

const ListMaker = () => {
  const [enableList, setEnableList] = useState(false)
  const [lists, setLists] = useState([])
  const [list, setList] = useState("")
  const [housing, setHousing] = useState("")
  const [switches, setSwitches] = useState("")
  const [keycap, setKeycap] = useState("")
  const [pcb, setPCB] = useState("")

  const accountName = useAuth()

  const handleListChange = (part, e) => {
    switch(part) {
      case 'name':
        setList(e.target.value)
        break
      case 'housing':
        setHousing(e.target.value)
        break
      case 'switches':
        setSwitches(e.target.value)
        break
      case 'keycap':
        setKeycap(e.target.value)
        break
      case 'pcb':
        setPCB(e.target.value)
        break
      case 'default':
        break
    }
  }
  
  // read
  async function getListFromDatabase() {
    return fire.database().ref('lists/keycaps').once('value').then(function(snapshot) {
        var items = [];
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          items.push(childData);
        }); 
        console.log("items: " + items);
        return items;
    })
  }

  useEffect(() => {
    onValue(ref(db), snapshot => {
      const data = snapshot.val()
      if (data != null) {
        Object.values(data).map(lists => {
          setLists(oldArray => [...oldArray, list])
        })
      }
    })
  }, [])

  // write
  const writeToDatabase = () => {
    const list_id = uid()
    set (ref(db, `/${list_id}`), {
      list_id,
      list,
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
      <input type="text" required className="list-name" placeholder="New List" onChange={(e) => setList(e.target.value)} />
      <div className="dropdown-container">
        <select name="Keycaps" id="keycaps" value={keycap} onChange={(e) => setKeycap(e.target.value)} >
          <option value="default">--keycaps--</option>
          <option value="abs">ABS</option>
        </select>
        <select name="Case" id="case" value={housing} onChange={(e) => setHousing(e.target.value)} >
          <option value="default">-case--</option>
          <option value="Aluminum">Aluminum</option>
        </select>
        <select name="Switch" id="switch" value={switches} onChange={(e) => setSwitches(e.target.value)}>
          <option value="default">--switch--</option>
          <option value="MX Blue">MX Blue</option>
        </select>
        <select name="PCB" id="pcb" value={pcb} onChange={(e) => setPCB(e.target.value)}>
          <option value="default">--pcb--</option>
          <option value="65%">65%</option>
        </select>
        {accountName ? (
          <button  onClick={writeToDatabase}>Make List</button>
        ) : (
          <button disabled onClick={writeToDatabase}>Make List</button>
        )}
        
      </div>
    </div>
    </>
  )
}

export default ListMaker 