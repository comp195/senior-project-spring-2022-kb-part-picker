import React, { useState, useRef, useLayoutEffect } from 'react'
import { NavLink } from "react-router-dom";
import {db, useAuth} from '../../firebase'
import {set, ref, onValue} from 'firebase/database'
import {uid} from "uid"

import './listmaker.scss'

const ListMaker = () => {
  const [curList, setCurList] = useState("")
  const [curListName, setCurListName] = useState('')
  const listSelected = useRef(false)
  
  const [keycap, setKeycap] = useState("")
  const [housing, setHousing] = useState("")
  const [switches, setSwitches] = useState("")
  const [pcb, setPCB] = useState("")

  const [dbUpdating, setDBUpdating] = useState(true)
  const [lists, setLists] = useState([])

  const accountName = useAuth()

  const makeBasicPartComponent = (category) => {
    var link = '/' + category.toLowerCase()
    
    return(
      <tr className="list-item">
        <td className="item-category">{category}</td>
        <td className="item-add-button">
          {listSelected.current ? (<></>):(
            <NavLink to ={link}>
            <button className="add-item-button">
              Add {category}
            </button>
          </NavLink>
          )}
          
        </td>
      </tr>
    )
  }

  const makeSpecificPartComponent = (p, category) => {
    return (
      <tr className="list-item">
        <td className="item-category">Case</td>
        <td className="item-image"><img src={p.img_url} alt={p.product_name}/></td>
        <td className="item-name"><a href="">{p.product_name}</a></td>
        {category.includes('Housing') ? (<td className="item-size">{p.size}</td>):(<></>)}
        {category.includes('Keycaps') ? (<td className="item-material">{p.material}</td>):(<></>)}
        {category.includes('Switches') ? (<td className="item-size">{p.size}</td>):(<></>)}
        <td className="item-price">{Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(p.product_price)}</td>
      </tr>
    )
  }

  const handleNothing = () => {
    return 0
  }

  const handleWriteList = () => {
    return
  }

  const handleEnableEditList = () => {
    listSelected.current = false 
  }

  const handleChangeList = (e) => {
    listSelected.current = true
    setCurList(e)
    setCurListName(e.list_name)

    var item = lists[lists.findIndex(l => l.list_id === e)]
    
    //   housing,
    if (!item.housing.includes("Unknown")) {
      var h = getPartFromDatabase('Housing/', item.housing)
      setHousing(makeSpecificPartComponent(h, 'Housing'))
    }
    else {
      setHousing(makeBasicPartComponent('Housing'))
    }
    //   switches,
    if (!item.switches.includes("Unknown")) {
      var sw = getPartFromDatabase('Switches/', item.housing)
      setSwitches(makeSpecificPartComponent(sw, 'Switches'))
    }
    else {
      setSwitches(makeBasicPartComponent('Switches'))
    }
    //   keycap,
    if (!item.keycap.includes("Unknown")) {
      var kc = getPartFromDatabase('Keycaps/', item.housing)
      setKeycap(makeSpecificPartComponent(kc, 'Keycaps'))
    }
    else {
      setKeycap(makeBasicPartComponent('Keycaps'))
    }
    //   pcb
    if (!item.pcb.includes("Unknown")) {
      var p = getPartFromDatabase('PCB/', item.housing)
      setPCB(makeSpecificPartComponent(p, 'PCB'))
    }
    else {
      setPCB(makeBasicPartComponent('PCB'))
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

  // make sure account auth is checked before getting list from db
  const firstUpdate = useRef(true)
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }

    if (dbUpdating) {
      {accountName ? getPartListFromDatabase():handleNothing()}
      setDBUpdating(false)
      setKeycap(makeBasicPartComponent("Keycaps"))
      setHousing(makeBasicPartComponent("Housing"))
      setSwitches(makeBasicPartComponent("Switches"))
      setPCB(makeBasicPartComponent("PCB"))
    }
  })

  return (
    <>
      <div className="list-maker">
      {dbUpdating ? (<p>Loading...</p>):(
        <>
        <select className='list-select' name="Lists" id="lists" value={curList} onChange={(e) => handleChangeList(e.target.value)} >
          <option default hidden>user lists</option>
          {dbUpdating ? (<></>): (
              lists.map((l,i) => (
                <option key={i} value={l.list_id}>{l.list_name}</option>
              ))
            )
          }  
        </select> 

        {listSelected.current ? <></> : <input type="text" name='New List' required className="list-name" placeholder={curListName}  />}
        <table>
          <tbody>
            {keycap}
            {housing}
            {switches}
            {pcb}
          </tbody>
        </table>
        
        <div className="makelist-button">
          {accountName ? (
            <>
            {listSelected.current ? 
              <button onClick={handleEnableEditList}>Edit List</button>
            :
              <button onClick={handleWriteList}>Make List</button>
            }
            </>
          ) : 
            <button disabled className='disabled'>Make List</button>
          }
        </div>
        </>
      )
      }
    </div>
  </>
  )
}

export default ListMaker 