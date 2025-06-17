import React from 'react';
import drOfferLogo from '../../assets/dr-offer-logo.png';
import './homePage.styles.css';

function HomePage() {
  return (
    <div className="homepage-main-div">
      <a href="#" rel="noreferrer" className="logo-container">
        <img src={drOfferLogo} className="logo" alt="Dr.Offers logo" />
      </a>
    </div>
  );
}

export default HomePage;
