import React, {useState, useEffect} from 'react';
import fire from './firebase'

import { TypingTest, Keyboard, Navbar, LoginForm } from './components';
import './App.css'

const App = () => {
  // sign-in/sign-up pop up toggle
  const [isShowLogin, setIsShowLogin] = useState(true)

  const handleLoginClick = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin)
  }

  return (
    <div className='App'>

        <Navbar handleLoginClick={handleLoginClick}/>
        <LoginForm 
          isShowLogin={isShowLogin}  />

      <TypingTest />
      <Keyboard />
    </div>
  )
}

export default App