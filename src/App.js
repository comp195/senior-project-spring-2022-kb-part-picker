import React, {useState, useEffect} from 'react';
import fire from './firebase'

import { BrowserRouter as Router, Routes, Route, Switch} from 'react-router-dom'
import { Navbar } from './components'
import { Home, LoginForm, ListMaker } from './pages'
import './App.css'

const App = () => {
  // sign-in/sign-up pop up toggle
  const [isShowLogin, setIsShowLogin] = useState(true)

  const handleLoginClick = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin)
  }

  return (
    <div className='App'>
      <Router>
        <Navbar handleLoginClick={handleLoginClick}/>
        <Routes>
          <Route exactpath='/' exactelement={<Home />}/>
          <Route path='/list-maker' element={<ListMaker />}/>
          <Route path='/login-form' element={<LoginForm />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App