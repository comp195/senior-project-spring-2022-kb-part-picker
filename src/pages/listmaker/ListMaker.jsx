import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { useParams, useNavigate, Prompt } from "react-router-dom"
import { db, useAuth } from '../../firebase'
import { set, ref, onValue } from 'firebase/database'
import { uid } from "uid"

import './listmaker.scss'

const ListMaker = () => {
  const navigate = useNavigate()
  const { state } = useParams()
  const listSelected = useRef(false)
  const editingEnabled = useRef(true)
  
  const [curListObj, setCurListObj] = useState({
    current_uid: 'Unknown',
    list_id: uid(),
    list_name: 'Unknown',
    housing: 'Unknown',
    switches: 'Unknown',
    keycaps: 'Unknown',
    pcb: 'Unknown',
    plate: 'Unknown',
    stabs: 'Unknown'
  })

  const [isBlocking, setIsBlocking] = useState(true)
  const listObtained = useRef(false)
  const wantNewList = useRef(false)

  const [curListID, setCurListID] = useState("")
  const [curListName, setCurListName] = useState('')

  const [keycaps, setKeycaps] = useState("")
  const [housing, setHousing] = useState("")
  const [switches, setSwitches] = useState("")
  const [pcb, setPCB] = useState("")
  const [plate, setPlate] = useState("")
  const [stabs, setStabs] = useState("")

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
            <button className="add-item-button" onMouseDown={() => handleAccessPagination()} onMouseUp={() => handleGoToPagination(newTo)} onMouseLeave={() => handleSussyMouseMovement()}> 
              Add
            </button>
            </>
          )}
        </td>
      </tr>
    )
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

  const handleSussyMouseMovement = () => setIsBlocking(true)
  const handleAccessPagination = () => setIsBlocking(false)
  const handleGoToPagination = (newTo) => {
    navigate(newTo)
    setIsBlocking(true)
  }

  const handleNothing = () => {
    console.log(isBlocking.current)
    console.log(editingEnabled.current)
    return
  }

  const handleWriteList = () => {
    console.log({curListObj})
    return
  }

  const handleChangeList = async (e, ee, i=null, ls=null) => {
    if (editingEnabled.current) {
      listSelected.current = false
    }
    
    editingEnabled.current = ee
    if(!editingEnabled.current) {
      listSelected.current = true
    }

    if(ls) {
      listSelected.current = ls
    }

    setCurListID(e)
    setCurListName(e.list_name)

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
      console.log({item})
    }
    else if (e === 'Edit') {
      item = i
    }

    console.log({item})
    console.log({curListObj})

    setKeycaps(makeBasicPartComponent("Keycaps"))
    setHousing(makeBasicPartComponent("Housing"))
    setSwitches(makeBasicPartComponent("Switches"))
    setPCB(makeBasicPartComponent("PCB"))
    setPlate(makeBasicPartComponent("Plate"))
    setStabs(makeBasicPartComponent("Stabilizers"))
    
    if (e === 'New' && !editingEnabled.current) {
      editingEnabled.current = true
      wantNewList.current = true
      listSelected.current = false
      return
    }

    if (!item.housing.includes("Unknown")) getPartFromDatabase('Housing/', item.housing)
    if (!item.switches.includes("Unknown")) getPartFromDatabase('Switches/', item.switches)
    if (!item.keycaps.includes("Unknown")) getPartFromDatabase('Keycaps/', item.keycaps)
    if (!item.pcb.includes("Unknown")) getPartFromDatabase('PCB/', item.pcb)
    if (!item.plate.includes("Unknown")) getPartFromDatabase('Plate/', item.plate)
    if (!item.stabs.includes("Unknown")) getPartFromDatabase('Stabilizers/', item.stabs)
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
              setHousing(makeSpecificPartComponent(childSnapshot.val(), 'Housing'))
              break
            case 'Switches/':
              setSwitches(makeSpecificPartComponent(childSnapshot.val(), 'Switches'))
              break
            case 'Keycaps/':
              setKeycaps(makeSpecificPartComponent(childSnapshot.val(), 'Keycaps'))
              break
            case 'PCB/':
              setPCB(makeSpecificPartComponent(childSnapshot.val(), 'PCB'))
              break
            case 'Plate/':
              setPlate(makeSpecificPartComponent(childSnapshot.val(), 'Plate'))
              break
            case 'Stabilizers/':
              setStabs(makeSpecificPartComponent(childSnapshot.val(), 'Stabilizers'))
              break
            default:
              console.log('Problem in getPartFromDatabase()')
              return
          }
          return
        }
      })
    })
    
  }

  // write
  const writeToDatabase = () => {
    const list_id = uid()
    const current_uid = accountName.uid
    var listToSave = curListObj
    listToSave.list_name = curListName
    listToSave.current_uid = current_uid
    listToSave.list_id = list_id
    set (ref(db, `PartList/${list_id}`), {
      current_uid: listToSave.current_uid,
      list_id: listToSave.list_id,
      list_name: listToSave.list_name,
      housing: listToSave.housing,
      switches: listToSave.switches,
      keycaps: listToSave.keycaps,
      pcb: listToSave.pcb,
      plate: listToSave.plate,
      stabs: listToSave.stabs
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
      {accountName ? getPartListsFromDatabase():setDBUpdating(false)}
      setDBUpdating(false)

      setKeycaps(makeBasicPartComponent("Keycaps"))
      setHousing(makeBasicPartComponent("Housing"))
      setSwitches(makeBasicPartComponent("Switches"))
      setPCB(makeBasicPartComponent("PCB"))
      setPlate(makeBasicPartComponent("Plate"))
      setStabs(makeBasicPartComponent("Stabilizers"))
    }
  })

  useEffect(() => {
    if ((state !== null && state !== "makelist") && !listObtained.current && !wantNewList.current) {
      var item = JSON.parse(state)
      window.history.replaceState(null, '',  "/list-maker/makelist")

      setCurListObj(item)

      listObtained.current = true
      handleChangeList('Edit', true, item)
      .then(() => console.log('resolved!'))
    }
  }, [curListObj])
  
  return (
    <>
    { editingEnabled.current ?
        <Prompt when={isBlocking} message='Are you sure you want to leave? Any unsaved progress will be lost!' /> 
      :
      <></>
    }
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

        {(editingEnabled.current) ? <input type="text" name='New List' required className="list-name" value={curListName} onChange={(e)=>{setCurListName(e.target.value)}}/> : <></> }
        <table>
          <tbody>
            {keycaps}
            {housing}
            {switches}
            {pcb}
            {plate}
            {stabs}
          </tbody>
        </table>

        <div className="makelist-button">
          {accountName ? (
            <>
            {(listSelected.current && !editingEnabled.current) ? 
              <button onClick={() => handleChangeList(curListID, true, null, true)}>Edit List</button>
            :
              <button onClick={writeToDatabase}>Make List</button>
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