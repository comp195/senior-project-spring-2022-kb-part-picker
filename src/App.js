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
          <Route path='/' element={<Home />}/>
          <Route path='/list-maker/:state' element={<ListMaker />}/>
          <Route path='/housing/:state' element={<Paging category={'Housing/'}/>}/>
          <Route path='/keycaps/:state' element={<Paging category={'Keycaps/'} />}/>
          <Route path='/switches/:state' element={<Paging category={'Switches/'}/>}/>
          <Route path='/pcb/:state' element={<Paging category={'PCB/'}/>}/>
          <Route path='/login-form' element={<LoginForm />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App