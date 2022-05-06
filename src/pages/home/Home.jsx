import React, {useState, useRef, useLayoutEffect} from 'react'

import { db, useAuth } from '../../firebase'
import { ref, onValue } from 'firebase/database'
import { TypeTest, Keyboard } from '../../components'
import { uid } from "uid"

import './home.css'

const Home = () => {

  const [keycaps, setKeycaps] = useState("None")
  const [housing, setHousing] = useState("None")
  const [switches, setSwitches] = useState("Linear")
  const [plate, setPlate] = useState("None")

  const [dbUpdating, setDBUpdating] = useState(true)
  const [curListID, setCurListID] = useState("")
  const [curListName, setCurListName] = useState('')
  const [lists, setLists] = useState([])

  const accountName = useAuth()

  const handleChangeList = (e) => {
    setCurListID(e)
    console.log({e})
    var temp = lists.find(obj => obj.list_id.includes(e))

    if (!temp.housing.includes('Unknown')) {}
  }

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
        if (childSnapshot.child('product_name').val() === product_name){
          switch(category) {
            case 'Housing/':
              setHousing(childSnapshot.child('material').val())
              break
            case 'Switches/':
              setSwitches(childSnapshot.child('type').val())
              break
            case 'Keycaps/':
              setKeycaps(childSnapshot.child('material').val())
              break
            case 'Plate/':
              setPlate(childSnapshot.child('material').val())
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

    }
  })
  
  return (
    <div>
      <TypeTest />
      <div className="kb-container">
        <Keyboard 
          physicalKeyboardHighlight={true}
          layout = {{
            'default': [
              '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
              '{tab} q w e r t y u i o p [ ] \\',
              '{lock} a s d f g h j k l ; \' {enter}',
              '{shift} z x c v b n m , . / {shift}',
              '{space}'
            ]
        }}/>
      </div>
      <div className="dropdown-container">   
        <select className='list-select' name="Lists" id="lists" value={curListID} onChange={(e) => handleChangeList(e.target.value)} >
            <option default value='Choose'>Choose a List</option> 
            {dbUpdating ? (<></>): (
                lists.map((l,i) => (
                  <option key={i} value={l.list_id}>{l.list_name}</option>
                ))
              )
            }  
          </select> 
      </div>
      <div className="current-config">
        <div className="item"> Keycap Material: {keycaps}</div>
        <div className="item"> Housing Material: {housing}</div>
        <div className="item"> Switch Type: {switches} </div>
        <div className="item"> Plate: {plate} </div>
      </div>
    </div>
  )
}

export default Home 