import { Outlet, Link } from "react-router-dom";
import "../styles/styles.css";  
import { useEffect,useState , useContext} from "react";
import axios from "axios";  
import { AuthContext } from "../provider/AuthProvider"; 
import gameboxLogo from "../images/gameboxes.jpg";


const Layout = () => {   
  const { loggedIn, setLoggedIn,session } = useContext(AuthContext);
 
  
  return ( 
    <div> 
      <nav className="nav">    
        <ul className="navbar">  
         
          <li > <Link style={{display:"flex",justifyContent:"center",alignItems:"center"}} to="/"><img style={{height:"40px",borderRadius:"50%",marginRight:"10px"}} src={gameboxLogo}></img>GameBOX</Link></li>
          <li><Link to="/MainGamesPage/month-trending">Games</Link></li>
         
          <li><Link to="/community">Community</Link></li>  
         
          {!loggedIn ? (  
            <div style={{display:"flex"}}>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/register">Register</Link></li> 
            </div>
           ) : (
            session && session.userName && (
              <li><Link to={`/${session.userName}`}>Profile</Link></li>
            )
          )}
          
        </ul>
      </nav>

      <Outlet/>
    </div> 
  )
};

export default Layout;