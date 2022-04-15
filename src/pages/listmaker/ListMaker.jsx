import React, { useState, useRef, useLayoutEffect } from 'react'
import { NavLink } from "react-router-dom";
import {db, useAuth} from '../../firebase'
import {set, ref, onValue} from 'firebase/database'
import {uid} from "uid"

import './listmaker.scss'

const ListMaker = () => {
  const [curList, setCurList] = useState("")
  
  const [keycap, setKeycap] = useState("")
  const [housing, setHousing] = useState("")
  const [switches, setSwitches] = useState("")
  const [pcb, setPCB] = useState("")

  const [dbUpdating, setDBUpdating] = useState(true)
  const [lists, setLists] = useState([])

  const accountName = useAuth()

  // make sure account auth is checked before getting list from db
  const firstUpdate = useRef(true)
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }

    if (dbUpdating) {
      {accountName ? (getPartListFromDatabase()):(handleNothing())}
      setDBUpdating(false)
      setKeycap(makeBasicPartComponent("Keycaps"))
      setHousing(makeBasicPartComponent("Housing"))
      setSwitches(makeBasicPartComponent("Switches"))
      setPCB(makeBasicPartComponent("PCB"))
    }
  });

  const makeBasicPartComponent = (category) => {
    console.log({category})
    var link = '/' + category.toLowerCase()
    return(
      <tr className="list-item">
        <td className="item-category">{category}</td>
        <td className="item-add-button"><NavLink to ={link}><button className="add-item-button" onClick={handleGoToPartPage(category)}>Add {category}</button></NavLink></td>
      </tr>
    )
  }
  
  const handleGoToPartPage = (category) => {
    //<NavLink to ='/list-maker'>
  }

  const handleNothing = () => {
    return 0
  }

  const handleChangeList = (e) => {
    setCurList(e)

    var item = lists[lists.findIndex(l => l.list_id === e)]
    //   housing,
    if (!item.housing.includes("Unknown")) {
      var h = getPartFromDatabase('Housing/', item.housing)
      setHousing(
        <tr className="list-item">
          <td className="item-category">Case</td>
          <td className="item-image"><img src={h.img_url} alt={h.product_name}/></td>
          <td className="item-name">{h.product_name}</td>
          <td className="item-size">{h.size}</td>
          <td className="item-price">{h.price}</td>
        </tr>
      )
    }
    //   switches,
    if (!item.switches.includes("Unknown")) {
      var sw = getPartFromDatabase('Switches/', item.housing)
      setSwitches(
        <tr className="list-item">
          <td className="item-category">Switches</td>
          <td className="item-image"><img src={sw.img_url} alt={sw.product_name}/></td>
          <td className="item-name">{sw.product_name}</td>
          <td className="item-material">{sw.material}</td>
          <td className="item-price">{sw.price}</td>
        </tr>
      )
    }
    //   keycap,
    if (!item.keycap.includes("Unknown")) {
      var kc = getPartFromDatabase('Keycaps/', item.housing)
      setKeycap(
        <tr className="list-item">
          <td className="item-category">Keycaps</td>
          <td className="item-image"><img src={kc.img_url} alt={kc.product_name}/></td>
          <td className="item-name">{kc.product_name}</td>
          {/*change to type when ya get there
          <td className="item-material">{kc.material}</td>*/}
          <td className="item-price">{kc.price}</td>
        </tr>
      )
    }
    //   pcb
    if (!item.pcb.includes("Unknown")) {
      var p = getPartFromDatabase('pcb/', item.housing)
      setPCB(
        <tr className="list-item">
          <td className="item-category">PCB</td>
          <td className="item-image"><img src={p.img_url} alt={p.product_name}/></td>
          <td className="item-name">{p.product_name}</td>
          <td className="item-size">{p.size}</td>
          <td className="item-price">{p.price}</td>
        </tr>
      )
    }

  }

  // read
  async function getPartListFromDatabase() {
    if (dbUpdating) {
      const list_ref = ref(db, 'PartList/')
      await onValue(list_ref, (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
          if (childSnapshot.child('current_uid').val() === accountName.uid)
            setLists(old =>[...old, childSnapshot.val()])
        })
      })
      console.log({lists})
      setDBUpdating(false)
    }
  }

  function getPartFromDatabase(category, part_name) {
    const part_ref = ref(db, category)
    part_ref.child(part_name)
    .once('value')
    .then(function(snapshot) {
      return snapshot.val()
    })
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
    console.log({lists})
  }
  
  // update
  // delete

  return (
    
    <>
    {dbUpdating ? (<p>Loading...</p>):(
      <div className="list-maker">
        {/* <input type="text" name='New List' required className="list-name" placeholder="New List" onChange={(e) => setList(e.target.value)} /> */}
        <select name="Lists" id="lists" value={curList} onChange={(e) => handleChangeList(e)} >
          <option key='default' className='default' value="default">user lists</option>
          {dbUpdating ? (<></>): (
              lists.map((l,i) => (
                <option key={i} value={l.list_id}>{l.list_name}</option>
              ))
            )
          }  
        </select> 
        <tbody>
          {keycap}
          {housing}
          {switches}
          {pcb}
        </tbody>
        {/* <select name="Keycaps" id="keycaps" value={keycap} onChange={(e) => setKeycap(e.target.value)} >
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
        </select> <br/> */}
        {accountName ? (
          <button onClick={writeToDatabase}>Make List</button>
        ) : (
          <button disabled className='disabled' onClick={handleNothing}>Make List</button>
        )}
        
    </div>
    )}
    
  </>
  )
}

export default ListMaker 