import React, {useState, useEffect} from 'react'

import { TypingTest, Keyboard } from '../../components'

import './home.css'

const Home = () => {
  return (
    <div>
      <TypingTest />
      <Keyboard />
    </div>
  )
}

export default Home 