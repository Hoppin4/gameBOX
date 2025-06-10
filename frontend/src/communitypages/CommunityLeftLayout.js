import React from "react"
import { Outlet, Link } from "react-router-dom";
import "../styles/communityHome.css"  
import { useEffect,useState , useContext,useRef} from "react";
import axios from "axios";  
import { AuthContext } from "../provider/AuthProvider";
import { BsCollection } from "react-icons/bs"; 
import { FaHeart,FaHotjar,FaCrown,FaWindows,FaPlaystation,FaXbox,FaApple } from "react-icons/fa"; 
import { AiFillDashboard } from "react-icons/ai"; 
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { GiTrophyCup } from "react-icons/gi";  
import { BsNintendoSwitch,BsAndroid2 } from "react-icons/bs"; 
import { IoHomeOutline } from "react-icons/io5";
import { BsFillLayersFill } from "react-icons/bs";  
import Modal from 'react-modal';  
import IconLoader from "../components/IconLoader"; 
import BannerLoader from "../components/BannerLoader"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/leftLayout.css"  
import { TbBuildingBroadcastTowerFilled } from "react-icons/tb";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

function CommunityLeftLayout(){    
    const navigate = useNavigate();
    const { loggedIn,session,addToList,setSession,setLoggedIn } = useContext(AuthContext);
    const [isOpenList, setIsOpenList] = useState(false);   
    const closeList = () => {setIsOpenList(false);setCommunityName("");setDescription("");setPage(1);} ;   
    const [communityName,setCommunityName] = useState("");   
    const [description,setDescription] = useState("") 
    const [page,setPage] = useState(1); 
    const [icon,setIcon] = useState(""); 
    const [banner,setBanner]=useState(""); 
    const [nameAlert,setNameAlert] = useState(true); 
    const [checkName,setCheckName] = useState(false)  
    const [selectedTag,setSelectedTag] = useState([])  
    const [setDataTag,setSelectedDataTag] = useState([]);  
     const [formIconData, setFormIconData] = useState(); 
     const [formBannerData, setFormBannerData] = useState();
    const [saveClicked,setSaveClicked] = useState(false); 
    const [tags,setTags] = useState([ 
        {id:1,name:"Gaming Consoles"},{id:2,name:"Adventure Games"},{id:3,name:"Gaming News"},{id:4,name:"Action Games"}, 
        {id:5,name:"Strategy Games"},{id:6,name:"Simulation Games"},{id:7,name:"Role-Playing Games"},{id:8,name:"Game Discussion"}, 
        {id:9,name:"Esports"},{id:10,name:"Mobile Games"},{id:11,name:"Racing Games"},{id:12,name:"Other Games"},{id:13,name:"Online Games"}
    ])  
    const [message,setMessage] = useState("");
   
   
    
     
    useEffect(()=>{  
        if(checkName){ 
            if(communityName.length<3){   
                setNameAlert(true); 
                setMessage("Please lengthen this text to 3 characters or more")
            }else{ 
                const timer = setTimeout(() => {
                    const runCheck = async () => {
                      const exists = await check(); 
                  
                
                      if (!exists) {
                        setMessage("This Community name already taken");
                        setNameAlert(true);
                      } else {
                        setMessage("");
                        setNameAlert(false);
                      }
                    };
                
                    runCheck();
                  }, 500);
                
                  return () => clearTimeout(timer); 
                   
            }
        }
        
    },[communityName]) 
    const check = async () =>{ 
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/com/check`, {
                params:{ 
                    comName:communityName
                }          
              })  
        
              if(response.status === 201){ 
                return false
              }else{ 
                return true
              }
          
        }catch(error){ 
            console.log(error) 
            return false;
        } 

    }
   const handleAdd = (id,name) =>{  
        if(selectedTag.length<3) {  
            setSelectedDataTag((prev)=>[...prev,id])
            setTags((prev)=>prev.filter((tag) => tag.id !== id));
        setSelectedTag((prev) => [...prev, { id: id, name: name }]);
        }  
   } 
   const handleCancel = (id,name)=>{  
        setSelectedDataTag((prev) => prev.filter(item => item !== id));
        setSelectedTag((prev)=>prev.filter((tag) => tag.id !== id));
        setTags((prev) => [...prev, { id: id, name: name }]);
   }

   const createCommunity = async()=>{  
        setSaveClicked(true)
        let iconurl = null; 
        let bannerurl= null;
        let postid1=null;
        try{  
            if(formIconData) {  
                const postResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/com/iconUploader`, formIconData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    },
                }); 
               
                iconurl = postResponse.data.imageUrl;
                console.log("imageurl",postResponse.data.imageUrl)
            } 
            if(formBannerData){ 
                 const postResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/com/bannerUploader`, formBannerData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    },
                }); 
               
                bannerurl = postResponse.data.imageUrl;
                console.log("imageurl",postResponse.data.imageUrl)
            }
            const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/createCommunity`, {
                communityName: communityName, 
                description: description,    
                userId: session.userId,     
                tags: setDataTag, 
                icon_image:iconurl, 
                banner_image:bannerurl      
              })  
          
              if(response.status === 201){ 
                toast.success(response.data.message);
              }
           
            postid1=response.data.data[0].id
        }catch(error){ 
            console.log(error) 
            toast.error("Error creating Community");
        }finally{  
            const ready = await addToList(postid1, "Admin");
            navigate(`/c/${postid1}`)  
            setSaveClicked(false);
            closeList(); 
    
        }
   }  
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


    return( 
        <div className="main-container1">  
        <ToastContainer position="top-left" autoClose={3000} />
            <Link className="link-container" to={"/"}> 
                
                <h2>Home</h2>  
              
            </Link>  
            <Link to={"/c/popular"} style={{textDecoration:"none",color:"white",display:"flex",alignItems:"center",margin:0}}>
                <h2 style={{margin:0}}>Popular</h2> 
            </Link>    
            {loggedIn && session && session.userName && ( 
                <div style={{marginTop:"10px"}}> 
                    <Link style={{textDecoration:"none",color:"white",display:"flex",alignItems:"center"}} to={`/user/${session.userName}/Posts`}>
                    <img  src={session.user_avatar}></img>
                    <h2 style={{fontWeight:"bold",marginLeft:"5px",marginBottom:"0"}}>{session.userName}</h2> 
                    </Link>   
                    <Link className="link-container"  to={`/c/myposts`} >  
                        <div className="layoutIcons"> 
                            <BsFillLayersFill size={20} className="layoutI"/>
                        </div>
                        
                        <p>My Posts</p>  
                    </Link> 
                    <Link className="link-container" to={`/mycommunities`}>  
                    <div className="layoutIcons"> 
                        <BsCollection size={20} className="layoutI"/>   
                    </div>
                        <p>My Communities</p>
                    </Link>
                    
                </div>  
                )} 
                <Modal 
                    isOpen={isOpenList} 
                    onRequestClose={closeList} 
                    contentLabel="Information Modal"
                    ariaHideApp={false} 
                    className="community_modal-content"
                    overlayClassName="community_modal-overlay" 
                    >    
                    {page === 1 && (
                        <div className="modal-container">   
                        <h1>Create a Community</h1> 
                        <p>A name and description help people understand what your community is all about.</p> 
                        <div className="modalcont"> 
                            <div className="modalcont-input">
                                <input onFocus={()=>{setCheckName(true)}} maxlength="20" value={communityName} onChange={(e)=>setCommunityName(e.target.value)} placeholder="Community Name*"></input>  
                                {nameAlert && communityName.length > 0 && (<p style={{color:"red",margin:0,fontSize:"12px"}}>{message}</p>)}
                                <div style={{width:"100%",display:"flex",justifyContent:"flex-end"}}> 
                                    <p style={{margin:1,color:"grey"}}>{20-communityName.length}</p> 
                                </div> 
                                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} style={{height:"150px"}}className="description" placeholder="Description*"/> 
                                <div style={{width:"100%",display:"flex",justifyContent:"flex-end"}}> 
                                    <p style={{margin:1,color:"grey"}}>{300-description.length}</p> 
                                </div> 
                            </div>  
                            <div className="example-container">  
                                <div style={{padding:"8px"}}>
                                        <h3 style={{margin:0}}>{communityName.length>0 ? communityName : "communityname"}</h3>
                                    <p style={{margin:0,marginTop:"5px",color:"grey",fontSize:"12px"}}>1 Members</p>  

                                    <div style={{margin:0,marginTop:"10px",display:"flex",flexDirection:"column",maxWidth:"100%",overflowWrap: "break-word"}}> 
                                        <p style={{ margin: 0 }}>{description.length>0 ? description : "Your Community Description"}</p>
                                    </div> 
                                </div> 
                            </div>
                        </div>   
                        <div className="cancelnextButton"> 
                            <button onClick={()=>closeList()} style={{backgroundColor:"grey"}}>Cancel</button>  
                            {!nameAlert ? ( 
                                <button onClick={()=>{setPage((prev)=>prev+1)}} style={{backgroundColor:"blue"}}>Next</button>
                            ) : (<button disabled style={{backgroundColor:"grey"}}>Next</button> )}
                            
                        </div>
                        
                    </div>  

                    )}
                    {page === 2 && (  
                        <div className="modal-container">   
                        <h1>Style Your Community</h1> 
                        <p style={{margin:0,color:"grey"}}>Visual elements help attract new members and showcase your community’s vibe. Feel free to update them whenever you like!</p> 
                        <div className="modalcont"> 
                            <div className="modalcont-input"> 
                            <IconLoader formicondata={setFormIconData} onUploadSuccess={(url)=>setIcon(url)}/>  
                            <BannerLoader formbannerdata={setFormBannerData}  onBannerUploadSuccess={(url)=>setBanner(url)}/>  
                                
                            </div> 
                       
                            <div className="example-container">  
                                {banner ? (<img src={banner} style={{width:"100%",height:"40px",borderTopLeftRadius:"8px",borderTopRightRadius:"8px",objectFit:"cover"}}/> ) : ( 
                                    <div style={{width:"100%",height:"40px",borderTopLeftRadius:"8px",borderTopRightRadius:"8px",objectFit:"cover",backgroundColor:"blue"}} ></div>
                                )}
                                
                                <div style={{padding: "10px"}}>  
                                    
                                    <div style={{display:"flex",alignItems:"center"}}> 
                                        {icon ? (<img style={{width:"40px",height:"40px",borderRadius:"50%",objectFit:"cover"}} src={icon}></img>):( 
                                            <div style={{display:"flex",width:"40px",height:"40px",borderRadius:"50%",objectFit:"cover",backgroundColor:"yellow",justifyContent:"center",alignItems:"center"}}>  
                                                <p style={{fontSize:"25px",fontWeight:"bold",color:"black"}}>{communityName.charAt(0)}</p>
                                            </div>
                                        )}
                                        
                                            <h3 style={{margin:0,marginLeft:"10px"}}>/{communityName.length>0 ? communityName : "communityname"}</h3> 
                                    </div>
                                    <p style={{margin:0,marginTop:"5px",color:"grey",fontSize:"12px"}}>1 Members</p>  
                                    {selectedTag.length>0 && (  
                                         <div style={{display:"flex",marginTop:"5px",gap:"5px",height:"20px"}}>
                                         {selectedTag.map((data,index)=> ( 
                                             <div className="tagContainer2"  onClick={()=>handleCancel(data.id,data.name)}   > 
                                                 <p style={{margin:0,fontSize:"8px",textAlign:"center"}}>{data.name}</p>
                                             </div>
                                         ))}  
                                     </div>
                                    )}    
                                   {description.length>0 && ( 
                                        <div style={{margin:0,marginTop:"10px",display:"flex",flexDirection:"column",maxWidth:"100%",overflowWrap: "break-word"}}> 
                                            <p style={{ margin: 0 }}>{description}</p>
                                        </div>
                                   )}
                                    
                                </div> 
                            </div>
                        </div>  
                        <div style={{margin:0,maxWidth:"55%"}} >   
                            <p style={{margin:0,marginBottom:"5px",color:"grey"}}>Add topics to help interested redditors find your community.
                            </p> 
                            <p style={{margin:0,fontSize:"18px",fontWeight:"bold"}}>Topics {selectedTag.length}/3</p> 
                            <div style={{margin:0,display:"flex",maxWidth:"100%",flexWrap:"wrap"}}>
                            {tags.map((data,index)=> ( 
                                <div className="tagContainer" onClick={()=>handleAdd(data.id,data.name)}  > 
                                    <p style={{margin:4}}>{data.name}</p>
                                </div>
                            ))} 
                            </div>
                        </div>  
                        <div className="cancelnextButton"> 
                            <button onClick={()=>setPage((prev)=>prev-1)} style={{backgroundColor:"grey"}}>Back</button>  
                       
                            <button
                                disabled={saveClicked} 
                                onClick={createCommunity}
                                style={{backgroundColor: "blue",color: "white",border: "none",padding: "10px 20px",borderRadius: "5px",cursor: saveClicked ? "not-allowed" : "pointer",display: "flex",justifyContent: "center",alignItems: "center",height: "40px"}}>
                                {saveClicked ? (
                                    <div style={{display: "flex",justifyContent: "center",alignItems: "center",width: "100%",height: "30px",}}>
                                        <div className="spinner" style={{ height: "30px", width: "30px" }}></div>
                                    </div>
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                        </div> 
                    </div> 

                    )}
                        
                </Modal> 
                 <Link style={{textDecoration:"none"}} to={'/communities'}>  
                    <h2 style={{marginTop:"15px",marginBottom:0}}>Explore</h2>  
                 </Link>
                <div style={{display:"flex",alignItems:"center",marginTop:"15px"}}>  
                    <h2 style={{marginBottom:0}}>Communities</h2> 
                </div>
                
                    <div className="link-container" onClick={()=>{if (!session) {
                            navigate('/signup'); 
                            return;
                        };setIsOpenList(true)}}>  
                            <div className="layoutIcons">
                                <TbBuildingBroadcastTowerFilled  size={20} className="layoutI" /> 
                            </div>
                            <p>Create a Community</p>  
                        
                    </div> 
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
export default CommunityLeftLayout;