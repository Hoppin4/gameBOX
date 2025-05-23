import { Outlet, Link,useNavigate } from "react-router-dom";
import "../styles/styles.css";  
import { useEffect,useState , useContext} from "react";
import axios from "axios";  
import { AuthContext } from "../provider/AuthProvider"; 
import gameboxLogo from "../images/gameboxes.jpg"; 
import { IoIosNotifications } from "react-icons/io"; 
import myPhoto from "../images/cat.png";



const Layout = () => {   
  const { loggedIn, setLoggedIn,session,notifications } = useContext(AuthContext);   
  const [Notification,setNotification] = useState([]);
console.log(notifications)
 axios.defaults.withCredentials = true; 
  useEffect(()=>{  
    if(notifications){ 
      const getUser = async()=>{
       try{
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/user/getUser`,{
          id:notifications[0].sender_id
        })  
        setNotification((prev)=>[{...notifications[0],user:response.data[0].userName},...prev])
        console.log(response)
      }catch(error){
        console.log(error)
      }
    }
     getUser();
    }
    
  },[notifications]) 
  console.log(Notification)
  return ( 
    <div> 
      <nav className="nav">    
        <ul className="navbar">  
         
          <li > <Link style={{display:"flex",justifyContent:"center",alignItems:"center"}} to="/"><img style={{height:"40px",borderRadius:"50%",marginRight:"10px"}} src={gameboxLogo}></img>GameBOX</Link></li>
          <li><Link to="/MainGamesPage/month-trending">Games</Link></li>
          <li><Link to="/c/popular">Community</Link></li>  
          {!loggedIn ? (  
            <div style={{display:"flex"}}>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/register">Register</Link></li> 
            </div>
           ) : (
            session && session.userName && ( 
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}> 
                <li><Link to={`/${session.userName}`}>Profile</Link></li> 
   
                    <div class="dropdown-notifications">  
                            <IoIosNotifications className="notifications" color="gold" size={25}/> 
                            <div class="dropdown-notifications-content" > 
                              {Notification.length>0 ? ( 
                                Notification.map((data,index)=>(
                                  <Link className="notifications" style={{textDecoration:"none"}} to={(`/c/comment/${data.post_id}`)} key={index}>   
                                    <p style={{color:"white",fontSize:"bold",marginRight:"5px"}}>{data.user}</p>  
                                    <p style={{color:"grey"}}>{data.message}.</p>
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