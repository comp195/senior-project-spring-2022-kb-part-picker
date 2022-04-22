import React from 'react';
import { Howl } from 'howler';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Navbar, Paging } from './components'
import { Home, LoginForm, ListMaker } from './pages'

import keyPress from "./assets/audio/nk-cream_press_KEY.mp3"
import keyRelease from "./assets/audio/nk-cream_release_KEY.mp3"
import './App.css'

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

const App = () => {
  const handleKeyPress = () => {
    press_sfx(keyPress)
  }

  const handleKeyRelease = () => {
    release_sfx(keyRelease)
  }
  return (
    <div className='App' onKeyDown={() => handleKeyPress()} onKeyUp={() => handleKeyRelease()}>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/list-maker/:state' element={<ListMaker />}/>
          <Route path='/housing/:state' element={<Paging category={'Housing/'}/>}/>
          <Route path='/keycaps/:state' element={<Paging category={'Keycaps/'} />}/>
          <Route path='/switches/:state' element={<Paging category={'Switches/'}/>}/>
          <Route path='/pcb/:state' element={<Paging category={'PCB/'}/>}/>
          <Route path='/login-form' element={<LoginForm />}/>
          <Route exact path='/' element={<Home />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App