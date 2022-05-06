import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Navbar, Paging } from './components'
import { Home, LoginForm, ListMaker } from './pages'

import './App.css'

const App = () => {
  
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/list-maker/:state' element={<ListMaker />}/>
          <Route path='/housing/:state' element={<Paging category={'Housing/'}/>}/>
          <Route path='/keycaps/:state' element={<Paging category={'Keycaps/'} />}/>
          <Route path='/switches/:state' element={<Paging category={'Switches/'}/>}/>
          <Route path='/pcb/:state' element={<Paging category={'PCB/'}/>}/>
          <Route path='/plate/:state' element={<Paging category={'Plate/'}/>}/>
          <Route path='/stabilizers/:state' element={<Paging category={'Stabilizers/'}/>}/>
          <Route path='/login-form' element={<LoginForm />}/>
          <Route exact path='/' element={<Home />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App