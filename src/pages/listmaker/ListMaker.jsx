import React, { useState, useRef, useLayoutEffect } from 'react'
import { NavLink, useParams } from "react-router-dom";
import {db, useAuth} from '../../firebase'
import {set, ref, onValue, child} from 'firebase/database'
import {uid} from "uid"

import './listmaker.scss'

const ListMaker = () => {
  const { state } = useParams()
  const listSelected = useRef(false)
  const editingEnabled = useRef(false)
  
  const [curListObj, setCurListObj] = useState({
    current_uid: 'Unknown',
    list_id: uid(),
    list_name: 'Unknown',
    housing: 'Unknown',
    switches: 'Unknown',
    keycap: 'Unknown',
    pcb: 'Unknown'
  })

  const listObtained = useRef(false)


  const [curListID, setCurListID] = useState("")
  const [curListName, setCurListName] = useState('')

  const [keycap, setKeycap] = useState("")
  const [housing, setHousing] = useState("")
  const [switches, setSwitches] = useState("")
  const [pcb, setPCB] = useState("")

  const [dbUpdating, setDBUpdating] = useState(true)
  const [lists, setLists] = useState([])

  const accountName = useAuth()

  const makeBasicPartComponent = (category) => {
    var link = '/' + category.toLowerCase() + '/' + JSON.stringify(curListObj)
    const newTo = {
      pathname: link,
      category,
    }
    return(
      <tr className="list-item">
        <td className="item-category">{category}</td>
        <td className="item-add-button">
          {(listSelected.current && !editingEnabled.current) ? (<></>):(
            <>
            <NavLink to = {newTo}>
              <button className="add-item-button" onClick={test}>
                Add
              </button>
            </NavLink>
          </>
          )}
        </td>
      </tr>
    )
  }
  const test = () => {
    console.log({curListObj})
  }
  const makeSpecificPartComponent = (p, category) => {
    return (
      <tr className="list-item">
        <td className="item-category">{category}</td>
        <td className="item-image"><img src={p.img_url} alt={p.product_name}/></td>
        <td className="item-name"><a href={p.link}>{p.product_name}</a></td>
        <td className="item-price">{Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(p.product_price)}</td>
        {listSelected.current ? <></> : <td className="item-remove" onClick={handleDeletePart}>X</td>}
      </tr>
    )
  }

  const handleNothing = () => {
    return
  }

  const handleWriteList = () => {
    console.log({curListObj})
    return
  }

  const handleChangeList = async (e, ee) => {
    setKeycap(makeBasicPartComponent("Keycaps"))
    setHousing(makeBasicPartComponent("Housing"))
    setSwitches(makeBasicPartComponent("Switches"))
    setPCB(makeBasicPartComponent("PCB"))
    if (editingEnabled.current) {
      listSelected.current = false
    }
    else {
      listSelected.current = true
    }
    
    editingEnabled.current = ee

    setCurListID(e)
    setCurListName(e.list_name)

    console.log('listObtained: ' + listObtained.current)
    console.log('listSelected: ' + listSelected.current)
    console.log('editingEnabled: ' + editingEnabled.current)
    if (e === 'New' && !editingEnabled.current) {
      editingEnabled.current = true
      setKeycap(makeBasicPartComponent("Keycaps"))
      setHousing(makeBasicPartComponent("Housing"))
      setSwitches(makeBasicPartComponent("Switches"))
      setPCB(makeBasicPartComponent("PCB"))
      return
    }

    if(editingEnabled.current && listObtained.current) {
      setCurListName('New List')
    }
    else if (editingEnabled.current) {
      setCurListID(uid())
      setCurListName('New List')
    }
    
    var item
    if (!listObtained.current) {
      await getPartFromDatabase('PartList/', e)
      item = lists[lists.findIndex(l => l.list_id === e)]
    }
    else {
      item = curListObj
    }

    console.log({item})
    console.log({curListObj})

    setKeycap(makeBasicPartComponent("Keycaps"))
    setHousing(makeBasicPartComponent("Housing"))
    setSwitches(makeBasicPartComponent("Switches"))
    setPCB(makeBasicPartComponent("PCB"))
    
    //   housing,
    if (!item.housing.includes("Unknown")) getPartFromDatabase('Housing/', item.housing)
    else setHousing(makeBasicPartComponent('Housing'))
    
    //   switches,
    if (!item.switches.includes("Unknown")) getPartFromDatabase('Switches/', item.switches)
    else setSwitches(makeBasicPartComponent('Switches'))
    
    //   keycap,
    if (!item.keycap.includes("Unknown")) getPartFromDatabase('Keycaps/', item.keycap)
    else setKeycap(makeBasicPartComponent('Keycaps'))
    
    //   pcb
    if (!item.pcb.includes("Unknown")) getPartFromDatabase('PCB/', item.pcb)
    else setPCB(makeBasicPartComponent('PCB'))
    
  }

  // read
  async function getPartListsFromDatabase() {
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

  async function getPartFromDatabase(category, product_name) {
    const part_ref = await ref(db, category)

    await onValue(part_ref, (snapshot) => {
      snapshot.forEach(function(childSnapshot) {
        if (category === 'PartList/') {
          if (childSnapshot.child('list_id').val() === product_name)
            setCurListObj(childSnapshot.val())
            return
        }
        if (childSnapshot.child('product_name').val() === product_name){
          switch(category) {
            case 'Housing/':
              setHousing(makeSpecificPartComponent(childSnapshot.val(), 'Switches'))
              break
            case 'Switches/':
              setSwitches(makeSpecificPartComponent(childSnapshot.val(), 'Switches'))
              break
            case 'Keycaps/':
              setKeycap(makeSpecificPartComponent(childSnapshot.val(), 'Switches'))
              break
            case 'PCB/':
              setPCB(makeSpecificPartComponent(childSnapshot.val(), 'Switches'))
              break
            default:
              console.log('Problem in getPartFromDatabase()')
              return
          }
        }
      })
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

  const handleDeletePart = () => {
    return
  }

  // make sure account auth is checked before getting list from db
  const firstUpdate = useRef(true)
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }
    
    if (dbUpdating) {
      {accountName ? getPartListsFromDatabase():handleNothing()}
      setDBUpdating(false)

      setKeycap(makeBasicPartComponent("Keycaps"))
      setHousing(makeBasicPartComponent("Housing"))
      setSwitches(makeBasicPartComponent("Switches"))
      setPCB(makeBasicPartComponent("PCB"))

      if ((state != null && state != "makelist") && !listObtained.current) {
        var test = JSON.parse(state)
        console.log({test})
        setCurListObj(JSON.parse(state))
        console.log({state})
        console.log({curListObj})
        listObtained.current = true
        editingEnabled.current = true
        handleChangeList('New', true)
        window.history.replaceState(null, '',  "/list-maker/makelist")
      }
    }
  })

  return (
    <>
      <div className="list-maker">
      {dbUpdating ? (<p>Loading...</p>):(
        <>
        <select className='list-select' name="Lists" id="lists" value={curListID} onChange={(e) => handleChangeList(e.target.value, false)} >
          <option default value='New'>New List</option>
          {dbUpdating ? (<></>): (
              lists.map((l,i) => (
                <option key={i} value={l.list_id}>{l.list_name}</option>
              ))
            )
          }  
        </select> 

        {(editingEnabled.current || listSelected.current) ? <input type="text" name='New List' required className="list-name" /> : <></> }
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
            {(listSelected.current && !editingEnabled.current) ? 
              <button onClick={() => handleChangeList(curListID, true)}>Edit List</button>
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