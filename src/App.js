import React, {useState, useEffect} from 'react';
import fire from './firebase'

import { Article, Brand, CTA, Feature, Navbar, LoginForm } from './components';
import { Blog, Features, Footer, Header, Possibility, WhatGPT3 } from './containers'
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


      {/* <Brand />
      <Footer /> */}
    </div>
  )
}

export default App