import React from "react"
import { Outlet, Link } from "react-router-dom";
import "../styles/leftLayout.css"  
import { useEffect,useState , useContext} from "react";
import axios from "axios";  
import { AuthContext } from "../provider/AuthProvider";
import { BsCollection } from "react-icons/bs"; 
import { FaHeart,FaHotjar,FaCrown,FaWindows,FaPlaystation,FaXbox,FaApple } from "react-icons/fa"; 
import { AiFillDashboard } from "react-icons/ai"; 
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { GiTrophyCup } from "react-icons/gi";  
import { BsNintendoSwitch,BsAndroid2 } from "react-icons/bs";

function LeftLayout(){   
    const { loggedIn, setLoggedIn,session } = useContext(AuthContext);
  
    console.log(session)

    return( 
        <div className="main-container1"> 
            <Link className="link-container" to={"/"}>
                <h2>Home</h2> 
            </Link> 
           
            {loggedIn && session && session.userName && ( 
                <div> 
                    <Link style={{textDecoration:"none",color:"white",display:"flex",alignItems:"center"}} to={`/${session.userName}`}>
                    <img  src={session.user_avatar}></img>
                    <h2 style={{fontWeight:"bold",marginLeft:"5px",marginBottom:"0"}}>{session.userName}</h2> 
                    </Link>   
                    <Link className="link-container"  to={`/reviews/${session.userId}`} >  
                        <div className="layoutIcons"> 
                            <FaHeart size={20} className="layoutI"/>
                        </div>
                        
                        <p>My Reviews</p>  
                    </Link> 
                    <Link className="link-container" to={`/${session.userName}`}>  
                    <div className="layoutIcons"> 
                        <BsCollection size={20} className="layoutI"/>   
                    </div>
                        <p>My Lists</p>
                    </Link>
                    
                </div>  
                )}
           
                <h2 style={{marginTop:"15px"}}>New Releases</h2>   
                    <Link className="link-container" to={"/MainGamesPage/month-trending"}>  
                        <div className="layoutIcons">
                            <AiFillDashboard size={20} className="layoutI" /> 
                        </div>
                        <p>Last 30 Days</p> 
                    </Link>
                    <Link className="link-container" to={"/MainGamesPage/this-week"}>  
                        <div className="layoutIcons">
                            <FaHotjar size={20} className="layoutI"/> 
                        </div>
                        <p>This Week</p>
                    </Link> 
                    <Link className="link-container" to={"/MainGamesPage/next-week"}>  
                        <div className="layoutIcons">
                            <TbPlayerTrackNextFilled size={20} className="layoutI"/> 
                        </div>
                        <p>Next Week</p>
                    </Link> 

                    <h2 style={{marginTop:"15px"}}>Top</h2>   
                    <Link className="link-container" to={"/MainGamesPage/best-of-the-year"} >  
                        <div className="layoutIcons">
                            <GiTrophyCup size={20} className="layoutI"/> 
                        </div>
                        <p>Best of the Year</p> 
                    </Link>
                    <Link className="link-container" to={"/MainGamesPage/all-time-top"}>  
                        <div className="layoutIcons">
                            <FaCrown size={20} className="layoutI"/> 
                        </div>
                        <p>All time Bests</p>
                    </Link>  

                    <h2 style={{marginTop:"15px"}}>Platforms</h2> 
                    <Link className="link-container" to={"/MainGamesPage/pc"}>  
                        <div className="layoutIcons">
                            <FaWindows size={20} className="layoutI"/> 
                        </div>
                        <p>PC</p> 
                    </Link>   
                    <Link className="link-container" to={"/MainGamesPage/playstation5"}>  
                        <div className="layoutIcons">
                            <FaPlaystation size={20} className="layoutI"/> 
                        </div>
                        <p>PlayStation 5</p> 
                    </Link>
                    <Link className="link-container" to={"/MainGamesPage/xbox-one"}>  
                        <div className="layoutIcons">
                            <FaXbox size={20} className="layoutI"/> 
                        </div>
                        <p>Xbox Series S/X</p>
                    </Link> 
                    <Link className="link-container" to={"/MainGamesPage/nintendo"}>  
                        <div className="layoutIcons">
                            <BsNintendoSwitch size={20} className="layoutI"/> 
                        </div>
                        <p>Nintendo Switch</p>
                    </Link> 
                    <Link className="link-container" to={"/MainGamesPage/ios"}>  
                        <div className="layoutIcons">
                            <FaApple size={20} className="layoutI"/> 
                        </div>
                        <p>IOS</p>
                    </Link>   
                    <Link className="link-container" to={"/MainGamesPage/android"}>  
                        <div className="layoutIcons">
                            <BsAndroid2 size={20} className="layoutI"/> 
                        </div>
                        <p>Android</p>
                    </Link>    

            <Outlet/>
        </div>
    )
} 
export default LeftLayout;