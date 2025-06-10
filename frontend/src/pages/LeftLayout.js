import React from "react"
import { Outlet, Link } from "react-router-dom";
import "../styles/leftLayout.css"  
import { useEffect,useState , useContext,useRef} from "react";
import axios from "axios";  
import { AuthContext } from "../provider/AuthProvider";
import { BsCollection } from "react-icons/bs"; 
import { FaHeart,FaHotjar,FaCrown,FaWindows,FaPlaystation,FaXbox,FaApple } from "react-icons/fa"; 
import { AiFillDashboard } from "react-icons/ai"; 
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { GiTrophyCup } from "react-icons/gi";  
import { BsNintendoSwitch,BsAndroid2 } from "react-icons/bs"; 
import { CiLogout } from "react-icons/ci"; 
import { useNavigate } from "react-router-dom";

function LeftLayout(){   
    const { loggedIn, setLoggedIn,session,setSession } = useContext(AuthContext);
    const navigate = useNavigate()
   
    const [searchResults,setSearchResults] = useState([]); 
    const [searchLoading,setSearchLoading] = useState(false); 
    const [searchTerm,setSearchTerm] = useState(""); 
  
    
    const fetchGames = async (term) => {
      try {
        setSearchLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getMainGames`,{
          params: { search:term } 
      });  
        setSearchResults(response.data.results);
      } catch (error) {
        console.error('API error:', error);
      } finally {
        setSearchLoading(false);
      }
    }; 
    const logOut = async () => {        
        try{ 
            const response = await axios.post(`${process.env.REACT_APP_BACKEND}/user/logout`);  
            
        }catch(error){ 
            console.error('Error fetching session:', error); 
        }finally{
            setLoggedIn(false) 
            setSession(null)
            navigate("/signup"); 
        }
        console.log("User logged out");     
    }; 
   useEffect(() => {
          const delayDebounce = setTimeout(() => {
            if (searchTerm.length > 2   ) {
              fetchGames(searchTerm);
            } else {
              setSearchResults([]);
            }
          }, 500); 
      
          return () => clearTimeout(delayDebounce);
  }, [searchTerm]); 
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {

      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
    return( 
        <div className="main-container1"> 
            <Link className="link-container" to={"/"}>
                <h2>Home</h2> 
            </Link> 
            <div style={{marginBottom:"15px"}}> 
                <input className="input3"  onFocus={() => setOpen(true)} value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search for games..."></input>   
                {open && ( 
                    <div ref={ref} className="searchContainer2" style={{position:"absolute",backgroundColor:"black",width:"100%",maxHeight:"50%",overflowX:"hidden",overflow:"auto",overflowY:"scroll"}}> 
                         {searchResults.map((data,index)=>( 
                            <Link key={index} state={{gameImage:data.background_image}} to={`/GameDetailPage/${data.id}/${data.name}`} className="searchContainer3" style={{width:"100%",display:"flex",marginBottom:"10px",alignItems:"center",cursor:"pointer",textDecoration:"none"}}> 
                                <img style={{width:"30%",height:"60px",borderRadius:"8px",objectFit:"cover"}} src={data.background_image}></img> 
                                <p style={{color:"white",fontSize:"15px"}}>{data.name}</p>
                            </Link>
                         ))}
                     </div>
                )}
               
                
            </div> 
            {loggedIn && session && session.userName && ( 
                <div> 
                    <Link style={{textDecoration:"none",color:"white",display:"flex",alignItems:"center"}} to={`/user/${session.userName}/Posts`}>
                        <img  src={session.user_avatar}></img>
                        <h2 style={{fontWeight:"bold",marginLeft:"5px",marginBottom:"0"}}>{session.userName}</h2> 
                    </Link>   
                    <Link className="link-container"  to={`/user/${session.userName}/Reviews`} >  
                        <div className="layoutIcons"> 
                            <FaHeart size={20} className="layoutI"/>
                        </div>
                        
                        <p>My Reviews</p>  
                    </Link> 
                    <Link className="link-container" to={`/user/${session.userName}/Lists`}>  
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
                    {session && ( 
                                            <div className="link-container" onClick={()=>logOut()}>  
                                                <div className="layoutIcons1">
                                                    <CiLogout  size={20} className="layoutI" /> 
                                                </div>
                                                <p>Logout</p>  
                                            
                                        </div>
                                        )}
            <Outlet/>
        </div>
    )
} 
export default LeftLayout;