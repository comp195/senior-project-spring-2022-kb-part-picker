import React, {useState, useEffect} from 'react'

import { TypeTest, Keyboard } from '../../components'

import './home.css'

const Home = () => {
  const [housing, setHousing] = useState("")
  const [switches, setSwitches] = useState("")
  const [keycap, setKeycap] = useState("")
  const [pcb, setPCB] = useState("")
  
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
      </div>
    </div>
  )
}

export default Home 