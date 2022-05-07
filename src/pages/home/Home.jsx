import React, {useState, useRef, useLayoutEffect} from 'react'
import { Howl } from 'howler';

import { db, useAuth } from '../../firebase'
import { ref, onValue } from 'firebase/database'
import { TypeTest, Keyboard } from '../../components'
import { uid } from "uid"

// clicky
import clicky_keyPress from "../../assets/audio/clicky/key_press.mp3"
import clicky_keyRelease from "../../assets/audio/clicky/key_release.mp3"
import clicky_plastic_brass_keyPress from "../../assets/audio/clicky/plastic/brass/key_press.mp3"
import clicky_alu_brass_keyPress from "../../assets/audio/clicky/alu/brass/key_press.mp3"
import clicky_alu_pc_keyPress from "../../assets/audio/clicky/alu/pc/key_press.mp3"
import clicky_plastic_brass_keyRelease from "../../assets/audio/clicky/plastic/brass/key_release.mp3"
import clicky_alu_brass_keyRelease from "../../assets/audio/clicky/alu/brass/key_release.mp3"
import clicky_alu_pc_keyRelease from "../../assets/audio/clicky/alu/pc/key_release.mp3"
import clicky_shiftPress from "../../assets/audio/clicky/shift_press.mp3"
import clicky_shiftRelease from "../../assets/audio/clicky/shift_release.mp3"
import clicky_plastic_brass_shiftPress from "../../assets/audio/clicky/plastic/brass/shift_press.mp3"
import clicky_alu_brass_shiftPress from "../../assets/audio/clicky/alu/brass/shift_press.mp3"
import clicky_alu_pc_shiftPress from "../../assets/audio/clicky/alu/pc/shift_press.mp3"
import clicky_plastic_brass_shiftRelease from "../../assets/audio/clicky/plastic/brass/shift_release.mp3"
import clicky_alu_brass_shiftRelease from "../../assets/audio/clicky/alu/brass/shift_release.mp3"
import clicky_alu_pc_shiftRelease from "../../assets/audio/clicky/alu/pc/shift_release.mp3"
import clicky_spacePress from "../../assets/audio/clicky/space_press.mp3"
import clicky_spaceRelease from "../../assets/audio/clicky/space_release.mp3"
import clicky_plastic_brass_spacePress from "../../assets/audio/clicky/plastic/brass/space_press.mp3"
import clicky_alu_brass_spacePress from "../../assets/audio/clicky/alu/brass/space_press.mp3"
import clicky_alu_pc_spacePress from "../../assets/audio/clicky/alu/pc/space_press.mp3"
import clicky_plastic_brass_spaceRelease from "../../assets/audio/clicky/plastic/brass/space_release.mp3"
import clicky_alu_brass_spaceRelease from "../../assets/audio/clicky/alu/brass/space_release.mp3"
import clicky_alu_pc_spaceRelease from "../../assets/audio/clicky/alu/pc/space_release.mp3"


// tactile
import tactile_keyPress from "../../assets/audio/tactile/key_press.mp3"
import tactile_keyRelease from "../../assets/audio/tactile/key_release.mp3"
import tactile_plastic_brass_keyPress from "../../assets/audio/tactile/plastic/brass/key_press.mp3"
import tactile_alu_brass_keyPress from "../../assets/audio/tactile/alu/brass/key_press.mp3"
import tactile_plastic_pc_keyPress from "../../assets/audio/tactile/plastic/pc/key_press.mp3"
import tactile_alu_pc_keyPress from "../../assets/audio/tactile/alu/pc/key_press.mp3"
import tactile_plastic_brass_keyRelease from "../../assets/audio/tactile/plastic/brass/key_release.mp3"
import tactile_alu_brass_keyRelease from "../../assets/audio/tactile/alu/brass/key_release.mp3"
import tactile_plastic_pc_keyRelease from "../../assets/audio/tactile/plastic/pc/key_release.mp3"
import tactile_alu_pc_keyRelease from "../../assets/audio/tactile/alu/pc/key_release.mp3"
import tactile_shiftPress from "../../assets/audio/tactile/shift_press.mp3"
import tactile_shiftRelease from "../../assets/audio/tactile/shift_release.mp3"
import tactile_plastic_brass_shiftPress from "../../assets/audio/tactile/plastic/brass/shift_press.mp3"
import tactile_alu_brass_shiftPress from "../../assets/audio/tactile/alu/brass/shift_press.mp3"
import tactile_plastic_pc_shiftPress from "../../assets/audio/tactile/plastic/pc/shift_press.mp3"
import tactile_alu_pc_shiftPress from "../../assets/audio/tactile/alu/pc/shift_press.mp3"
import tactile_plastic_brass_shiftRelease from "../../assets/audio/tactile/plastic/brass/shift_release.mp3"
import tactile_alu_brass_shiftRelease from "../../assets/audio/tactile/alu/brass/shift_release.mp3"
import tactile_plastic_pc_shiftRelease from "../../assets/audio/tactile/plastic/pc/shift_release.mp3"
import tactile_alu_pc_shiftRelease from "../../assets/audio/tactile/alu/pc/shift_release.mp3"
import tactile_spacePress from "../../assets/audio/tactile/space_press.mp3"
import tactile_spaceRelease from "../../assets/audio/tactile/space_release.mp3"
import tactile_plastic_brass_spacePress from "../../assets/audio/tactile/plastic/brass/space_press.mp3"
import tactile_alu_brass_spacePress from "../../assets/audio/tactile/alu/brass/space_press.mp3"
import tactile_plastic_pc_spacePress from "../../assets/audio/tactile/plastic/pc/space_press.mp3"
import tactile_alu_pc_spacePress from "../../assets/audio/tactile/alu/pc/space_press.mp3"
import tactile_plastic_brass_spaceRelease from "../../assets/audio/tactile/plastic/brass/space_release.mp3"
import tactile_alu_brass_spaceRelease from "../../assets/audio/tactile/alu/brass/space_release.mp3"
import tactile_plastic_pc_spaceRelease from "../../assets/audio/tactile/plastic/pc/space_release.mp3"
import tactile_alu_pc_spaceRelease from "../../assets/audio/tactile/alu/pc/space_release.mp3"

// linear
import linear_keyPress from "../../assets/audio/linear/key_press.mp3"
import linear_keyRelease from "../../assets/audio/linear/key_release.mp3"
import linear_plastic_brass_keyPress from "../../assets/audio/linear/plastic/brass/key_press.mp3"
import linear_alu_brass_keyPress from "../../assets/audio/linear/alu/brass/key_press.mp3"
import linear_plastic_pc_keyPress from "../../assets/audio/linear/plastic/pc/key_press.mp3"
import linear_alu_pc_keyPress from "../../assets/audio/linear/alu/pc/key_press.mp3"
import linear_plastic_brass_keyRelease from "../../assets/audio/linear/plastic/brass/key_release.mp3"
import linear_alu_brass_keyRelease from "../../assets/audio/linear/alu/brass/key_release.mp3"
import linear_plastic_pc_keyRelease from "../../assets/audio/linear/plastic/pc/key_release.mp3"
import linear_alu_pc_keyRelease from "../../assets/audio/linear/alu/pc/key_release.mp3"
import linear_shiftPress from "../../assets/audio/linear/shift_press.mp3"
import linear_shiftRelease from "../../assets/audio/linear/shift_release.mp3"
import linear_plastic_brass_shiftPress from "../../assets/audio/linear/plastic/brass/shift_press.mp3"
import linear_alu_brass_shiftPress from "../../assets/audio/linear/alu/brass/shift_press.mp3"
import linear_plastic_pc_shiftPress from "../../assets/audio/linear/plastic/pc/shift_press.mp3"
import linear_alu_pc_shiftPress from "../../assets/audio/linear/alu/pc/shift_press.mp3"
import linear_plastic_brass_shiftRelease from "../../assets/audio/linear/plastic/brass/shift_release.mp3"
import linear_alu_brass_shiftRelease from "../../assets/audio/linear/alu/brass/shift_release.mp3"
import linear_plastic_pc_shiftRelease from "../../assets/audio/linear/plastic/pc/shift_release.mp3"
import linear_alu_pc_shiftRelease from "../../assets/audio/linear/alu/pc/shift_release.mp3"
import linear_spacePress from "../../assets/audio/linear/space_press.mp3"
import linear_spaceRelease from "../../assets/audio/linear/space_release.mp3"
import linear_plastic_brass_spacePress from "../../assets/audio/linear/plastic/brass/space_press.mp3"
import linear_alu_brass_spacePress from "../../assets/audio/linear/alu/brass/space_press.mp3"
import linear_plastic_pc_spacePress from "../../assets/audio/linear/plastic/pc/space_press.mp3"
import linear_alu_pc_spacePress from "../../assets/audio/linear/alu/pc/space_press.mp3"
import linear_plastic_brass_spaceRelease from "../../assets/audio/linear/plastic/brass/space_release.mp3"
import linear_alu_brass_spaceRelease from "../../assets/audio/linear/alu/brass/space_release.mp3"
import linear_plastic_pc_spaceRelease from "../../assets/audio/linear/plastic/pc/space_release.mp3"
import linear_alu_pc_spaceRelease from "../../assets/audio/linear/alu/pc/space_release.mp3"

import './home.css'

const press_sfx = (source) => {
  new Howl ( {
    src: source
  }).play()
}

const release_sfx = (source) => {
  new Howl ( {
    src: source
  }).play()
}

const Home = () => {

  const [housing, setHousing] = useState("None")
  const [switches, setSwitches] = useState("Linear")
  const [plate, setPlate] = useState("None")
  var h, s, p

  const [dbUpdating, setDBUpdating] = useState(true)
  const [curListID, setCurListID] = useState("")
  const [lists, setLists] = useState([])

  const [press, setPress] = useState(linear_alu_pc_keyPress)
  const [release, setRelease] = useState(linear_alu_pc_keyRelease)

  const [shiftPress, setShiftPress] = useState(linear_alu_pc_shiftPress)
  const [shiftRelease, setShiftRelease] = useState(linear_alu_pc_shiftRelease)

  const [spacePress, setSpacePress] = useState(linear_alu_pc_spacePress)
  const [spaceRelease, setSpaceRelease] = useState(linear_alu_pc_spaceRelease)

  const accountName = useAuth()

  const handleChangeList = async(e) => {
    setCurListID(e)
    console.log({e})
    var temp = lists.find(obj => obj.list_id.includes(e))

    if (!temp.housing.includes('Unknown')) 
      await getPartFromDatabase('Housing/', temp.housing)
    if (!temp.switches.includes('Unknown')) 
      await getPartFromDatabase('Switches/', temp.switches)
    if (!temp.plate.includes('Unknown')) 
      await getPartFromDatabase('Plate/', temp.plate)

    console.log({switches})
    console.log({housing})
    console.log({plate})
    switch(switches){
      case 'Linear':
        if(housing==='Plastic') {
          if (plate==='Brass'){
            setPress(linear_plastic_brass_shiftPress)
            setRelease(linear_plastic_brass_shiftRelease)
            setShiftPress(linear_plastic_brass_shiftPress)
            setShiftRelease(linear_plastic_brass_shiftRelease)
            setSpacePress(linear_plastic_brass_spacePress)
            setSpaceRelease(linear_plastic_brass_spaceRelease)
          }
          else {
            setPress(linear_plastic_pc_keyPress)
            setRelease(linear_plastic_pc_keyRelease)
            setShiftPress(linear_plastic_pc_shiftPress)
            setShiftRelease(linear_plastic_pc_shiftRelease)
            setSpacePress(linear_plastic_pc_spacePress)
            setSpaceRelease(linear_plastic_pc_spaceRelease)
          }
        }
        else if(housing==='Aluminum') {
          if (plate==='Brass'){
            setPress(linear_alu_brass_keyPress)
            setRelease(linear_alu_brass_keyRelease)
            setShiftPress(linear_alu_brass_shiftPress)
            setShiftRelease(linear_alu_brass_shiftRelease)
            setSpacePress(linear_alu_brass_spacePress)
            setSpaceRelease(linear_alu_brass_spaceRelease)
          }
          else {
            setPress(linear_alu_pc_keyPress)
            setRelease(linear_alu_pc_keyRelease)
            setShiftPress(linear_alu_pc_shiftPress)
            setShiftRelease(linear_alu_pc_shiftRelease)
            setSpacePress(linear_alu_pc_spacePress)
            setSpaceRelease(linear_alu_pc_spaceRelease)
          }
        }
        else {
          setPress(linear_keyPress)
          setRelease(linear_keyRelease)
          setShiftPress(linear_shiftPress)
          setShiftRelease(linear_shiftRelease)
          setSpacePress(linear_spacePress)
          setSpaceRelease(linear_spaceRelease)
          
        }
        break
      case 'Tactile':
        if(housing==='Plastic') {
          if (plate==='Brass'){
            setPress(tactile_plastic_brass_keyPress)
            setRelease(tactile_plastic_brass_keyRelease)
            setShiftPress(tactile_plastic_brass_shiftPress)
            setShiftRelease(tactile_plastic_brass_shiftRelease)
            setSpacePress(tactile_plastic_brass_spacePress)
            setSpaceRelease(tactile_plastic_brass_spaceRelease)
          }
          else {
            setPress(tactile_plastic_pc_keyPress)
            setRelease(tactile_plastic_pc_keyRelease)
            setShiftPress(tactile_plastic_pc_shiftPress)
            setShiftRelease(tactile_plastic_pc_shiftRelease)
            setSpacePress(tactile_plastic_pc_spacePress)
            setSpaceRelease(tactile_plastic_pc_spaceRelease)
          }
        }
        else if(housing==='Aluminum') {
          if (plate==='Brass'){
            setPress(tactile_alu_brass_keyPress)
            setRelease(tactile_alu_brass_keyRelease)
            setShiftPress(tactile_alu_brass_shiftPress)
            setShiftRelease(tactile_alu_brass_shiftRelease)
            setSpacePress(tactile_alu_brass_spacePress)
            setSpaceRelease(tactile_alu_brass_spaceRelease)
          }
          else {
            setPress(tactile_alu_pc_keyPress)
            setRelease(tactile_alu_pc_keyRelease)
            setShiftPress(tactile_alu_pc_shiftPress)
            setShiftRelease(tactile_alu_pc_shiftRelease)
            setSpacePress(tactile_alu_pc_spacePress)
            setSpaceRelease(tactile_alu_pc_spaceRelease)
          }
        }
        else {
          setPress(tactile_keyPress)
          setRelease(tactile_keyRelease)
          setShiftPress(tactile_shiftPress)
          setShiftRelease(tactile_shiftRelease)
          setSpacePress(tactile_spacePress)
          setSpaceRelease(tactile_spaceRelease)
        }
        break
      case 'Clicky':
        if(housing==='Plastic') {
          setPress(clicky_plastic_brass_keyPress)
          setRelease(clicky_plastic_brass_keyRelease)
          setShiftPress(clicky_plastic_brass_shiftPress)
          setShiftRelease(clicky_plastic_brass_shiftRelease)
          setSpacePress(clicky_plastic_brass_spacePress)
          setSpaceRelease(clicky_plastic_brass_spaceRelease)
        }
        else if(housing==='Aluminum') {
          setPress(clicky_alu_brass_keyPress)
          setRelease(clicky_alu_brass_keyRelease)
          setShiftPress(clicky_alu_brass_shiftPress)
          setShiftRelease(clicky_alu_brass_shiftRelease)
          setSpacePress(clicky_alu_brass_spacePress)
          setSpaceRelease(clicky_alu_brass_spaceRelease)
        }
        else {
          setPress(clicky_keyPress)
          setRelease(clicky_keyRelease)
          setShiftPress(clicky_shiftPress)
          setShiftRelease(clicky_shiftRelease)
          setSpacePress(clicky_spacePress)
          setSpaceRelease(clicky_spaceRelease)
        }
        break
      default:
        setPress(linear_keyPress)
        setRelease(linear_keyRelease)
        setShiftPress(linear_shiftPress)
        setShiftRelease(linear_shiftRelease)
        setSpacePress(linear_spacePress)
        setSpaceRelease(linear_spaceRelease)
    }
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
              if (childSnapshot.val().material) {
                console.log('house')
                if (!childSnapshot.val().material.includes('Unknown')) {
                  h = childSnapshot.val().material
                  setHousing(h)
                }
              }
              break
            case 'Switches/':
              console.log('switch')
              s = childSnapshot.val().type
              if (!childSnapshot.val().type.includes('Unknown')) setSwitches(s)
              break
            case 'Plate/':
              console.log('plate')
              p = childSnapshot.val().material
              if (!childSnapshot.val().material.includes('Unknown')) setPlate(p)
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

  const handleKeyPress = (e) => {
    if(e.key==='Space') {
      press_sfx(spacePress)
    }
    else if (e.key==='Shift') {
      press_sfx(shiftPress)
    }
    else {
      press_sfx(press)
    }
  }

  const handleKeyRelease = (e) => {
    if(e.keyCode===32) {
      release_sfx(spaceRelease)
    }
    else if (e.key==='Shift') {
      release_sfx(shiftRelease)
    }
    else {
      release_sfx(release)
    }
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
    <div onKeyDown={(e) => handleKeyPress(e)} onKeyUp={(e) => handleKeyRelease(e)}>
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
            <option selected hidden value='Choose'>Choose a List</option> 
            {dbUpdating ? (<></>): (
                lists.map((l,i) => (
                  <option key={i} value={l.list_id}>{l.list_name}</option>
                ))
              )
            }  
          </select> 
      </div>
      <div className="current-config">
        <div className="item"> Housing Material: {housing}</div>
        <div className="item"> Switch Type: {switches} </div>
        <div className="item"> Plate: {plate} </div>
      </div>
    </div>
  )
}

export default Home 