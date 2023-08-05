import React from 'react';
import "./navBar.css";

export default function NavBar() {
  return (
    <div>
      <div className='nav-bar'>
        <span className='nav-title'> ClickBoard</span>
        <span className='nav-title'>IMAGE READER</span>
        <div style={{display: "flex"}}>
        <button className='signIn-button'>Sign In</button>
        <button className='signUp-button'>Sign Up</button>
      </div>
      </div>
      <span className='company-name'>ClickBoard Easy Uploadation</span>
    </div>
  )
}