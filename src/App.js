import React from 'react';

import { Article, Brand, CTA, Feature, Navbar } from './components';
import { Blog, Features, Footer, Header, Possibility, WhatGPT3 } from './containers'

const App = () => {
  return (
    <div className='App'>
      <div className="gradient_bg">
        <Navbar />
        <Header />

        <Brand />
        <WhatGPT3 />
        <Features />
        <Possibility />
        <Blog />
        <Footer />
      </div>
    </div>
  )
}

export default App