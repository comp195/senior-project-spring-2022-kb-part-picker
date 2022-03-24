import React, {useState} from 'react'

import { NavLink } from "react-router-dom";
import list from '../../assets/nav/list.png'
import search from '../../assets/nav/search.png'
import user from '../../assets/nav/user.png'
import './navbar.css'

const Navbar = () => {
  const [accountName, hasAccountName] = useState('SIGN IN/SIGN UP')
  return (
    <div className="navbar">
        <div className='navbar-links_container'>
          <div className='home'>
            <p><NavLink to ='/'>KB PART PICKER</NavLink></p>
          </div>
          <div className="navbar-links">
        <NavLink to ='/list-maker'>
          <div className='makelist_img'>
            <img src={list} alt='Make List'/>
          </div>
          <p> MAKE LIST </p>
        </NavLink>
        <a href='#features'>
          <div className='search_img'>
            <img src={search} alt='Search' />
          </div>
          <p> SEARCH </p>
        </a>
        <NavLink to ='/login-form'>
          <div className='user_img'>
            <img src={user} alt='Sign In/Sign Up' />
            <p className='login-icon'> {accountName} </p>
          </div>
        </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar