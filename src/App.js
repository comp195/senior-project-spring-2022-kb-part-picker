import React, {useState} from 'react';

import { Article, Brand, CTA, Feature, Navbar, LoginForm } from './components';
import { Blog, Features, Footer, Header, Possibility, WhatGPT3 } from './containers'
import './App.css'

const App = () => {
  const [isShowLogin, setIsShowLogin] = useState(true)

  const handleLoginClick = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin)
  }

  return (
    <div className='App'>
      <div className="gradient__bg">
        <Navbar handleLoginClick={handleLoginClick}/>
        <LoginForm isShowLogin={isShowLogin} />
        <Header />
      </div>
      <Brand />
      <Footer />
    </div>
  )
}

export default App