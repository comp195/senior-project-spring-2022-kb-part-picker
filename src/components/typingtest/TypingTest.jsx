import React from 'react'
import { TypingTest } from 'react-typing-test';
import './typingtest.css'

const TypeTest = () => {
  return (
    <TypingTest language='english' wordLimit={80} theme='Miami' />
  )
}

export default TypeTest