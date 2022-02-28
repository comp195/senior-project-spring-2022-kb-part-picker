import React from 'react'
import list from '../../assets/nav/list.png'
import search from '../../assets/nav/search.png'
import user from '../../assets/nav/user.png'
import './navbar.css'

const Navbar = ({ handleLoginClick }) => {
  const handleClick = () => {
    handleLoginClick();
  };
  return (
    <div className="kbpp__navbar">
      <div className="kbpp__navbar-links">
        <div className='kbpp__navbar-links_container'>
          <div className='kbpp__home'>
            <p><a href='#home'> KB PART PICKER  </a></p>
          </div>
        <a href='#makelist'>
          <div className='kbpp__makelist_img'>
            <img src={list} alt='Make List'/>
          </div>
          <p> MAKE LIST </p>
        </a>
        <a href='#features'>
          <div className='kbpp__search_img'>
            <img src={search} alt='Search' />
          </div>
          <p>  SEARCH </p>
        </a>
        {/* <a href='#features'>
          <div className='kbpp__user_img'>
            <img src={user} alt='Sign In/Sign Up' />
            <p> SIGN IN/SIGN UP </p>
          </div>
        </a> */}
          <div className='kbpp__user_img' onClick={handleClick}>
            <img src={user} alt='Sign In/Sign Up' onClick={handleClick} />
            <p className='login-icon'> SIGN IN </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar