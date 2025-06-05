import { Outlet, Link,useNavigate } from "react-router-dom";
import "../styles/styles.css";  
import { useEffect,useState , useContext} from "react";
import axios from "axios";  
import { AuthContext } from "../provider/AuthProvider"; 
import gameboxLogo from "../images/gameboxes.jpg"; 
import { IoIosNotifications } from "react-icons/io"; 
import myPhoto from "../images/cat.png"; 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';   


const Layout = () => {    

  const { loggedIn, setLoggedIn,session,notifications } = useContext(AuthContext);    
  dayjs.extend(relativeTime);  
const timeago = (time) =>dayjs(time).fromNow() 
console.log(notifications)
 axios.defaults.withCredentials = true; 
  const handleread = async()=>{ 
    try{ 
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/user/handleread`,{
        userId:session.userId
      })
    }catch(error){
      console.log(error)
    }

  }
  return ( 
    <div> 
      <nav className="nav">    
        <ul className="navbar">  
         
          <li > <Link style={{display:"flex",justifyContent:"center",alignItems:"center"}} to="/"><img style={{height:"40px",borderRadius:"50%",marginRight:"10px"}} src={gameboxLogo}></img>GameBOX</Link></li>
          <li><Link to="/MainGamesPage/month-trending">Games</Link></li>
          <li><Link to="/c/popular">Community</Link></li>  
          {!loggedIn ? (  
            <div style={{display:"flex"}}>
              <li><Link to="/signup">Sign In</Link></li>
              <li><Link to="/register">Register</Link></li> 
            </div>
           ) : (
            session && session.userName && ( 
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}> 
                <li><Link to={`/${session.userName}`}>Profile</Link></li> 
   
                    <div class="dropdown-notifications">  
                            <IoIosNotifications onClick={()=>handleread()} className="notifications" color="gold" size={25}/> 
                            <div class="dropdown-notifications-content" > 
                              {notifications.length>0 ? ( 
                                notifications.map((data,index)=>(
                                  <Link className="notifications"  style={{textDecoration:"none"}} to={data.type==="comment" ? (`/c/comment/${data.reference_id}`) :(``) } key={index}>   
                                    <p style={{color:"white",fontSize:"bold",marginRight:"5px",fontSize:"12px"}}>{data.user.userName}</p>  
                                    <p style={{color:"grey",fontSize:"12px"}}>{data.message}.</p> 
                                    <p style={{fontSize:"12px",marginLeft:"5px"}}>{timeago(data.created_at)}</p>
                                  </Link>

                                ))
                              ) : ( 
                                <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}> 
                                  
                                    <img src={myPhoto} style={{width:"80px",borderRadius:"50%"}}></img> 
                                      <p style={{color:"white"}}>You dont have any news.</p> 
                                </div>
                              )}
                                
                            </div>
                        </div>
            </div>
              
            )
          )}
          
        </ul>
      </nav>

      <Outlet/>
    </div> 
  )
};

export default Layout;