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
 
import { useNavigate } from 'react-router-dom';

function CommunityLeftLayout(){    
    const navigate = useNavigate();
    const { loggedIn, setLoggedIn,session,addToList,listLoading } = useContext(AuthContext);
    const [isOpenList, setIsOpenList] = useState(false);   
    const closeList = () => {setIsOpenList(false);setCommunityName("");setDescription("");setPage(1);setReady(false)} ;   
    const [communityName,setCommunityName] = useState("");   
    const [description,setDescription] = useState("") 
    const [page,setPage] = useState(1); 
    const [icon,setIcon] = useState(""); 
    const [banner,setBanner]=useState(""); 
    const [ready,setReady] = useState(false); 
    const [imageLoading,setImageLoading] = useState(true); 
    const [nameAlert,setNameAlert] = useState(true); 
    const [checkName,setCheckName] = useState(false)  
    const [selectedTag,setSelectedTag] = useState([])  
    const [setDataTag,setSelectedDataTag] = useState([]);  
    const [save,setSave] = useState(false); 
    const [tags,setTags] = useState([ 
        {id:1,name:"Gaming Consoles"},{id:2,name:"Adventure Games"},{id:3,name:"Gaming News"},{id:4,name:"Action Games"}, 
        {id:5,name:"Strategy Games"},{id:6,name:"Simulation Games"},{id:7,name:"Role-Playing Games"},{id:8,name:"Game Discussion"}, 
        {id:9,name:"Esports"},{id:10,name:"Mobile Games"},{id:11,name:"Racing Games"},{id:12,name:"Other Games"},{id:13,name:"Online Games"}
    ])  
    const [message,setMessage] = useState("");
    const [postId,setPostId] = useState(); 
    const [createLoading,setCreateLoading]=useState(true); 
    const[bannerLoading,setBannerLoading]=useState(true);
    
     
    useEffect(()=>{  
        if(checkName){ 
            if(communityName.length<3){   
                setNameAlert(true); 
                setMessage("Please lengthen this text to 3 characters or more")
            }else{ 
                const timer = setTimeout(() => {
                    const runCheck = async () => {
                      const exists = await check(); 
                      console.log("exists", exists);
                
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
            const response = await axios.get("http://localhost:5000/com/check", {
                params:{ 
                    comName:communityName
                }          
              })  
              console.log(response) 
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
    console.log(setDataTag)
   const createCommunity = async()=>{  
    setCreateLoading(true)
        try{ 
            const response = await axios.post("http://localhost:5000/com/createCommunity", {
                communityName: communityName, 
                description: description,    
                userId: session.userId,     
                tags: setDataTag            
              })  
              console.log(response) 
              if(response.status === 201){ 
                toast.success(response.data.message);
              }
            setPostId(response.data.data[0].id)
        }catch(error){ 
            console.log(error) 
            toast.error("Error creating Community");
        }finally{  
           
            setCreateLoading(false); 
             
        }
   }  
  useEffect(() => {  
    const run = async () => {
        if (postId && !createLoading) {
            const ready = await addToList(postId, "Admin");  
            if (ready===true) { 
                setTimeout(()=>{ 
                    navigate(`/c/${postId}`);
                },1000)
                
            }
        }
    };

    run(); 
}, [postId, createLoading]);
   useEffect(()=>{  
    if(save) { 
        createCommunity();  
        setSave(false);
    }
        
   },[ready]) 
   const handleSaveClick = () => {
    setReady(true); 
    setImageLoading(false); 
    setSave(true); 
   
    if (imageLoading) { 
        
      setTimeout(() => { 
        closeList(); 
      
      
      }, 1000); 
    }
  };
console.log(selectedTag)
    return( 
        <div className="main-container1">  
        <ToastContainer position="top-left" autoClose={3000} />
            <Link className="link-container" to={"/"}> 
                
                <h2>Home</h2>  
              
            </Link> 
                <h2>Popular</h2> 
                
            {loggedIn && session && session.userName && ( 
                <div> 
                    <Link style={{textDecoration:"none",color:"white",display:"flex",alignItems:"center"}} to={`/${session.userName}`}>
                    <img  src={session.user_avatar}></img>
                    <h2 style={{fontWeight:"bold",marginLeft:"5px",marginBottom:"0"}}>{session.userName}</h2> 
                    </Link>   
                    <Link className="link-container"  to={`/reviews/${session.userId}`} >  
                        <div className="layoutIcons"> 
                            <BsFillLayersFill size={20} className="layoutI"/>
                        </div>
                        
                        <p>My Posts</p>  
                    </Link> 
                    <Link className="link-container" to={`/${session.userName}`}>  
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
                            <IconLoader postId={postId} uploadReady={ready} dataLoading={setImageLoading} onUploadSuccess={(url)=>setIcon(url)}/>  
                            <BannerLoader postId={postId} uploadReady={ready} dataLoading={setBannerLoading} onBannerUploadSuccess={(url)=>setBanner(url)}/>  
                                
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
                            {!imageLoading ? <button style={{backgroundColor:"blue"}}>Loading...</button> : 
                             <button  onClick={() => {handleSaveClick();}} style={{backgroundColor:"blue"}}>Save</button> }
                           
                        </div>
                        
                    </div> 

                    )}
                        
                </Modal>
                <h2 style={{marginTop:"15px"}}>Explore</h2> 
                <Link style={{textDecoration:"none"}} to={'/communities'}>  
                    <h2 style={{marginTop:"15px"}}>Communities</h2> 
                </Link>
                
                    <div className="link-container" onClick={()=>{if (!session) {
                        navigate('/signup'); 
                        return;
                    };setIsOpenList(true)}}>  
                        <div className="layoutIcons">
                            <AiFillDashboard size={20} className="layoutI" /> 
                        </div>
                        <p>Create a Community</p>  
                        
                    </div>
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
  

            <Outlet/>
        </div>
    )
} 
export default CommunityLeftLayout;