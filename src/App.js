import React from 'react';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Navbar } from './components'
import { Home, LoginForm, ListMaker } from './pages'
import './App.css'

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/list-maker' element={<ListMaker />}/>
          <Route path='/login-form' element={<LoginForm />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App