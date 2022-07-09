import React from 'react';
import logo from '../resources/logo2.jpg'
import './Landing.css'
import { bindActionCreators } from 'redux';
import deal from '../resources/business-deal.png'

const Landing = () => {



  return (
      <>
      <div className="landing-container">
        <div className="landing-content">
            <div className="landing-title" style={{fontFamily:"Caveat, cursive",color:"#990000"}}>Easy <span style={{fontFamily:"Comfortaa,cursive",color:"#00008B"}}>Deals</span></div>
            <div className="landing-info">Easy and Genuine Deals for You!</div>
        </div>
        <div className="landing-illustration">
            <img src={deal} alt=""/>
        </div>
    </div>
      </>
  )
};

export default Landing;
