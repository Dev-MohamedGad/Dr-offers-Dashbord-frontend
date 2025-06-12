import React from 'react';
import propCutLogo from '../../assets/logo.svg';
import './homePage.styles.css';

function HomePage() {
  return (
    <div className="homepage-main-div">
      <a href="#" rel="noreferrer" className="logo-container">
        <img src={propCutLogo} className="logo" alt="PropCut logo" />
      </a>
    </div>
  );
}

export default HomePage;
