import React from 'react';
import "./navBar.css";

export default function NavBar() {
  return (
    <div>
      <div className='nav-bar'>
        <span className='nav-title'> ClickBoard</span>
        <span className='nav-title'>IMAGE READER</span>
        <div style={{ display: "flex" }}>
          <button className='signIn-button'>Sign In</button>
          <button className='signUp-button'>Sign Up</button>
        </div>
      </div>
      <span className='company-name'>Image to Text Converter</span>
      <span className='company-name-text'>Convert image to text in seconds with ClickBoard. Trusted by 1000 enterprises to extract text from images online.</span>
    </div>
  )
}