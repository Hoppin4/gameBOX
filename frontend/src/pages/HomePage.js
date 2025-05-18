 import React, { useEffect } from "react"; 
import myPhoto from "../images/witcher3.webp";
import "../styles/styles.css";  
import axios from "axios"; 
import { useState } from "react";  
import { useNavigate } from "react-router-dom";

const Home = () => {   
    const nav = useNavigate()
    const [first, setfirst] = useState()
    
    return ( 
        <div className="imageContainer" style={{height:"100vh",width:"100vw",position:"relative"}}> 
            <img src={myPhoto} alt="my photo" className="wImage"/>  
            <div className="overlay">
                <span>Track Games you’ve played.
    Save those you want to play.
    Tell your friends what’s good</span> 
                <button onClick={()=>nav('/MainGamesPage/month-trending')} className="button">Get Started</button> 
            </div>
        </div>
    )
  };
  
  export default Home;