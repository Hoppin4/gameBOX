 import axios from "axios"; 
 import { useNavigate } from "react-router-dom"; 
 import { AuthContext } from "../provider/AuthProvider"; 
 import { useContext,useEffect,useState } from "react"; 
import "../styles/profile.css"; 
import { Link } from "react-router-dom"; 
import blackScreen from "../images/black.jpg";
import { FaPencilAlt,FaTrashAlt  } from "react-icons/fa";  
import Swal from 'sweetalert2'; 


 function ProfilePage()  {   
    const { loggedIn,loading, setLoggedIn,session, } = useContext(AuthContext);   
    const [listData, setListData] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [userData, setUserData] = useState("")
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();    
    
     
    const getList = async () => {   
        setListLoading(true);
        try { 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getList`, { 
                params: { userId: session.userId } 
            });
            setListData(response.data.data);
            console.log("List data:", response.data);
        }catch(error) { 
            console.error('Error fetching list:', error); 
        }  
        finally { 
            setListLoading(false); 
        }
    }
    
    const logOut = async () => {        
        try{ 
            const response = await axios.post(`${process.env.REACT_APP_BACKEND}/user/logout`);  
            setLoggedIn(false)
            navigate("/signup"); 
        }catch(error){ 
            console.error('Error fetching session:', error); 
        }
        console.log("User logged out");     
    };   
    useEffect(() => {
        const getUserInfo = async () => {   
            try {   
                const response = await axios.post(`${process.env.REACT_APP_BACKEND}/user/getUser`, { id: session.userId }); 
                setUserData(response.data[0]);
                
            } catch (error) {   
                console.error('Error fetching user info:', error); 
            }
        };
    
        if (session?.userId) {  
            getUserInfo();   
            getList();
        }
    }, [session]);  
    const handleClick = (id) => {
        Swal.fire({
          title: 'Are You Sure?',
          text: "You can't take it back!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            
            handledelete(id);
          } 
        }); 
    }
    const handledelete = async (id) => { 
        try {  
            
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/api/deleteList`, { params :{listId: id }}); 
            console.log("List deleted:", response.data); 
            setListData((prevList) => prevList.filter((list) => list.id !== id)); 
        } catch (error) { 
            console.error('Error deleting list:', error); 
        } 
    }
    
    if (!loggedIn) { 
        return navigate("/signup"); 
    }
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (        
        <div className="profilePage">
          
                <div style={{width:"50%",height:"50%"}}>   
                    <div className="imageContainer">
                        <img src={userData.avatar_url}></img> 
                        <div className="userNameContanier">  
                            <p className="userName">{userData.userName}</p>   
                            <div class="name" style={{display:"flex"}}>
                                <p style={{marginRight:"10px"}}>{userData.firstName}</p>  
                                <p>{userData.lastName}</p>  
                                 
                            </div>  
                            <div style={{height:"50px"}}>
                                <p className="bio" style={{fontSize:"15px",color:"#7F91AA"}}>{userData.bio===""?"There is no information given":userData.bio}</p> 
                            </div>
                        </div>
                          
                        <button>
                            <Link to={`/${session.userName}/edit`} state={{ userData: userData }}>EDIT PROFILE</Link>
                        </button>   
                        
                    </div>               
                     
                     <div className="listContainer" style={{marginTop:"20px",display:"flex",flexDirection:"column",width:"100%",height:"100%"}}>   
                        <div className="list-header">  
                            <p style={{color:"grey",fontSize:"25px"}}>Your Lists</p> 
                        
                            <Link to={`/list/new`} state={{ userData: userData }} className="create-list">CREATE LIST</Link>
                        </div> 
                        
                       
                        {listLoading ? ( 
                            <div>Loading...</div>
                        ) : ( 
                           <div className="listItemsContainer">  
                            {listData.length > 0 ? (   
                                listData.map((list) => ( 
                                    <div key={list.id} className="listItem">  
                                     
                                         
                                            <Link className="listImageContainer" to={`/list/${list.id}`} style={{textDecoration:"none"}}>
                                                <div className="imageCover"> <img src={list.first_four_images && list.first_four_images.length > 0 ? list.first_four_images[0] : blackScreen }  /></div> 
                                                <div className="imageCover"> <img src={list.first_four_images && list.first_four_images.length > 1 ? list.first_four_images[1] : blackScreen }  /></div> 
                                                <div className="imageCover"><img src={list.first_four_images && list.first_four_images.length > 2 ? list.first_four_images[2] : blackScreen }  /></div> 
                                                <div className="imageCover"><img src={list.first_four_images && list.first_four_images.length > 3 ? list.first_four_images[3] : blackScreen }  /></div> 
                                            </Link> 
                                      
                                        <div className="listNameContainer"> 
                                            <p style={{marginTop:"5px",color:"white",fontSize:"20px",fontWeight:"bold"}}>{list.name}</p>    
                                            <div style={{display:"flex",alignItems:"center",padding:"6px 0px 5px 0px",borderRadius:"10px"}}> 
                                                <p style={{padding:"0px",margin:"0px 10px 0px 0px"}}>{list.gamecount} Games</p>   
                                                <Link to={`/list/${list.id}/edit`} state={{ list: list }} style={{textDecoration:"none",color:"white"}}> 
                                                    <FaPencilAlt size={15}  style={{cursor:"pointer"}} className="pencil" /> 
                                                </Link>
                                                
                                            </div>
                                            <p>{list.description}</p>  
                                        </div>
                                        
                                    <FaTrashAlt style={{cursor:"pointer"}} onClick={()=>handleClick(list.id)} />
                                    </div> 
                                )) 
                            ) : ( 
                                <p>No lists available</p> 
                            )}
                           </div>
                        )}
                        
                      
                     </div>
    
                </div>
                
        </div>
    ); 
 } 
 export default ProfilePage;