import React from 'react'
import { NavLink } from "react-router-dom";
import { useAuth } from '../../firebase'

import list from '../../assets/nav/list.png'
import user from '../../assets/nav/user.png'
import './navbar.css'

const Navbar = () => {
  const accountName = useAuth()
  
  return (
    <div className="navbar">
        <div className='home'>
          <p><NavLink to ='/'>KB PART PICKER</NavLink></p>
        </div>
        <div className="navbar-links">
      <NavLink to ='/list-maker/makelist'>
        <div className='makelist_img'>
          <img src={list} alt='Make List'/>
          <p> MAKE LIST </p>
        </div>
      </NavLink>
      <NavLink to ='/login-form'>
        <div className='user_img'>
          <img src={user} alt='Sign In/Sign Up' />
          <p className='login-icon'> 
          {accountName ? (
            <>
              {accountName.email.split('@')[0].toUpperCase()}
            </>
          ) : (
            <>
              SIGN IN/SIGN UP
            </>
          )} 
          </p>
        </div>
      </NavLink>
      </div>
    </div>
  )
}

export default Navbar