 import React, { useEffect } from "react"; 
import myPhoto from "../images/witcher3.webp";
import "../styles/styles.css";  
import axios from "axios"; 
import { useState } from "react"; 

const Home = () => {  
    const [first, setfirst] = useState()
    
    return ( 
        <div className="imageContainer"> 
            <img src={myPhoto} alt="my photo" className="wImage"/>  
            <div className="overlay">
                <span>Track Games you’ve played.
    Save those you want to play.
    Tell your friends what’s good</span> 
                <button className="button">Get Started</button> 
            </div>
        </div>
    )
  };
  
  export default Home;