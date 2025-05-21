import React, { useEffect, useState,useContext,useRef } from "react"; 
import { useParams,Link } from "react-router-dom";
import CommunityLeftLayout from "./CommunityLeftLayout"; 
import { AuthContext } from "../provider/AuthProvider";   
import axios from "axios"; 
import "../styles/mainCom.css"
import Modal from 'react-modal';
import PostImgageLoader from "../components/PostImageLoader"; 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';  
import { BiUpvote,BiDownvote} from "react-icons/bi";
import { CiChat1 } from "react-icons/ci";   
import { useNavigate } from "react-router-dom"; 
import { BsThreeDotsVertical } from "react-icons/bs";
import Swal from 'sweetalert2'; 
import { GiCakeSlice } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import { GiJetPack } from "react-icons/gi"; 
import { FaHotjar } from "react-icons/fa";  
import { FaBoxArchive } from "react-icons/fa6"; 
import { IoMdArrowDropdown } from "react-icons/io";
import { set } from "lodash"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/leftLayout.css" 


function MainCommunityPage(){   
     const [message,setMessage] = useState(""); 
    const { id } = useParams();  
    const [searchTerm,setSearchTerm] = useState("");  
     const [open, setOpen] = useState(false);
      const ref = useRef(null); 
       const [searchResults,setSearchResults] = useState([]);  
       const [searchLoading,setSearchLoading] = useState(false);
   const [loading,setLoading] = useState(true);   
   const [comData,setComData] = useState(); 
   const [isJoined,setIsJoined] = useState(false);  
   const [isOpenList, setIsOpenList] = useState(false);   
   const [isOpenModal, setIsOpenModal] = useState(false); 
   const [postTitle,setPostTitle]=useState("");
   const [description,setDescription]=useState("");
   const closeList = () => setIsOpenList(false) ;   
   const closeModal = () => setIsOpenModal(false) ; 
   const [postId,setPostId] = useState(); 
   const [ready,setReady] = useState(false); 
   const [imageLoading,setImageLoading] = useState(true); 
   const [page,setPage] = useState(1);  
   const [postLoading,setPostLoading] = useState(true);
    const [posts,setPosts] = useState([]);
   const [url,setUrl] = useState(); 
   const [comId,setComId] = useState();  
   const [hasMore,setHasMore] = useState(true); 
   const [moreLoading,setMoreLoading] = useState(false);
   const [userCom,setUserCom] = useState();  
   const [updateName,setUpdateName] = useState();    
    const [updateDescription,setUpdateDescription] = useState();
   const [votedPosts, setVotedPosts] = useState({}); 
   const [selectedSort, setSelectedSort] = useState("New");  
   const [direction,setDirection] = useState("desc"); 
    const [order,setOrder] = useState("created_at"); 
    const [name,setName] = useState(); 
    const [comDescription,setcomDescription]=useState();
    const previousOrder = useRef(selectedSort);
   const { myCommunityList,removeFromList,addToList,session } = useContext(AuthContext);  
   const navigate = useNavigate();  
   const [isFetching, setIsFetching] = useState(false);
    const [saving, setSaving] = useState(false); 
    const [selectedGame, setSelectedGame] = useState(null);  
    const [formData, setFormdata] = useState(); 
    const [imageUrl, setImageUrl] = useState(null); 
    const [saveClicked,setSaveClicked] = useState(false);
 
   dayjs.extend(relativeTime); 
    const timeago = (time) =>dayjs(time).fromNow() 
    
   const fetchData =async()=>{   
    console.log(page)
    setLoading(true)
    try{   
        console.log("mylist",myCommunityList)
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/com/getCommunityInfo` ,{ 
            params:{ 
                comId:id
            }
        })  
        setComData(response.data.data)   
        setComId(response.data.data.id)
        setName(response.data.data.name) 
        setcomDescription(response.data.data.description)
        if(myCommunityList){  
            console.log(myCommunityList)
            const matchedItem = myCommunityList.find(
                (item) => item.community_id === response.data.data.id
                ); 
            setIsJoined(!!matchedItem); 
            setUserCom(matchedItem);
        }
        
        console.log(response)
    }catch(error){ 
        console.log(error)
    }finally{ 
        setLoading(false)
    }
   }  
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
   useEffect(()=>{ 
    if(id){ 
        fetchData();
    }
   },[id])  
   const deletePost = async(postId)=>{  
        const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });
    if(result.isConfirmed){ 
        try{ 
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/com/deletePost` ,{   
                params:{ 
                    postId:postId }
            });
        }catch(error){ 
            console.log(error)
        }finally{ 
            setPosts((prevPosts) => prevPosts.filter((item) => item.id !== postId));
        }
    }
    }
   
   const handleSavePost = async()=>{  
    let uploadedImageUrl = null;  
   console.log("formdata",formData)
    setReady(false) 
    if(!postTitle  || !selectedGame){ 
        toast.error("Please fill in all fields.", {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return;
    } 
    setSaveClicked(true);
    try{   
        if(formData) {  
            const postResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/com/postImageLoader`, formData, {
             headers: {
                'Content-Type': 'multipart/form-data',
                },
            }); 
            setImageUrl(postResponse.data.imageUrl)  
            uploadedImageUrl = postResponse.data.imageUrl;
            console.log("imageurl",postResponse.data.imageUrl)
        }
          
       
        
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/createPost` ,{ 
            title:postTitle, 
            content:description,  
            community_id:comData.id, 
            user_id:session.userId,   
            gameId:selectedGame.id, 
            gameName:selectedGame.name,  
            gameImage:selectedGame.background_image, 
            post_image:uploadedImageUrl, 

           
        })   
       
        setTimeout(()=>{ 
                    setPosts((prev) => [{...response.data.data[0],user:{id:session.userId,userName: session.userName,avatar_url: session.user_avatar,}, 
                    game:{game_id:selectedGame.id,game_name:selectedGame.name,game_image:selectedGame.background_image}}, ...prev]);

        },500)
    }catch(error){ 
        console.log(error)
    }finally{ 
        setReady(true);  
        setSaveClicked(false); 
        setDescription(""); 
        setFormdata();  
        setSelectedGame("");
        setSearchTerm(""); 
        setPostTitle(""); 
        closeList();
    }
       
   } 
   console.log(posts)
    const getPosts = async(page)=>{    
        if(isFetching) return;
        setIsFetching(true); 

        console.log("aaaaaa",page)
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/com/getPosts` ,{ 
                params:{
                    comId:comId,
                    page:page ,
                    order:order, 
                    direction:direction,
                }
            })    
            console.log("posts",response) 
             if(response.data.data.length<20){ 
                setHasMore(false);
            }
              if (page=== 1) {
            setPosts(response.data.data);
            } else {
            setPosts((prev) => {
                const newPosts = response.data.data.filter(
                (item) => !prev.some((existing) => existing.id === item.id)
                );
                return [...prev, ...newPosts];
            });  
           }
        }catch(error){ 
            console.log(error) 
            setIsFetching(false);
        }finally{ 
         setPostLoading(false); 
         setMoreLoading(false);  
         setIsFetching(false); 
        }
       
   }  
   const skipNextPageEffect = useRef(false);
   useEffect(()=>{  
     if (skipNextPageEffect.current) {
        skipNextPageEffect.current = false;
        return; 
  }
    if(page>1){  
        console.log("içeri giriyo",comId)
        getPosts(page);
    }
   },[page])    

   useEffect(()=>{  
    if(comId){    
         setPostLoading(true); 
         setPosts([]);  
        setPage(1); 
        setHasMore(true);
        
        
        const timer = setTimeout(() => {  
            if(comId){ 
                getPosts(1);
            }
        },0);  
         
        return () => clearTimeout(timer);
        
    }
   },[selectedSort,comId])
    
   const upvote = async(postId)=>{  
    if (votedPosts[postId]) return;   
        setVotedPosts((prev) => ({ ...prev, [postId]: "up" }));
        setPosts(posts.map(c =>
        c.id === postId ? { ...c, upvotes: c.upvotes + 1 } : c
    ));
    try{ 
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/upvote` ,{
            postId:postId
        }) 
    }catch(error){
        console.log(error);
    }
   }  
    const downvote = async(postId)=>{  
        if (votedPosts[postId]) return;   
        setVotedPosts((prev) => ({ ...prev, [postId]: "down" }));
        setPosts(posts.map(c =>
        c.id === postId ? { ...c, upvotes: c.upvotes - 1 } : c
    ));  
    try{ 
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/downvote` ,{
            postId:postId
        }) 
    }catch(error){
        console.log(error);
    }
   }  
   const updateCommunity = async()=>{  
        setName(updateName); 
        setcomDescription(updateDescription);
        
        try{ 
            const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/updateComm` ,{ 
                communityId:comData.id, 
                name:updateName, 
                description:updateDescription, 
            }) 
        }catch(error){ 
                console.log(error) 
        }finally{ 
                setIsOpenModal(false);   
        }
    }
    console.log(posts)
   console.log(userCom)
    return( 
        <div className="main"> 
        <CommunityLeftLayout /> 
        {loading ? ( 
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                <div className="spinner"></div>
            </div>
        ) : ( 
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",width:"80%",marginLeft:"13.5%"}}> 
            <ToastContainer position="top-left" autoClose={3000} />  
                <div className="maincom-container">    
                    {comData.banner_image ? ( 
                        <img className="maincom-img1" src={comData.banner_image} ></img>  
                    ): ( 
                        <div className="maincom-img1">  
                        </div>
                    )}  
                    {comData.icon_image ? ( 
                        <img className="maincom-img2" src={comData.icon_image} ></img>
                    ): ( 
                        <div className="maincom-img2">  
                        </div>
                    )} 
                    
                    <div className="maincom_nameCon">  
                        <div style={{width:"100%"}}>
                            <p style={{color:"white"}}>{name}</p>  
                        </div> 
                        <button onClick={()=>{ if (!session) {navigate('/signup'); return;}setIsOpenList(true);}} className="maincom-createpost"><p style={{marginRight:"5px",fontWeight:"100"}}>+</p>Create Post</button>  
                        {isJoined ? ( 
                            <button className="maincom-joined" onClick={()=>{removeFromList(comData.id);setIsJoined(false)}}>Joined</button>
                        ) : ( 
                            <button className="maincom-join" onClick={()=>{if (!session) {
                                navigate('/signup'); 
                                return;
                            }addToList(comData.id,"Member");setIsJoined(true)}}>Join</button>
                        )}
                        
                    </div>  
                    
                    <Modal 
                        isOpen={isOpenList} 
                        onRequestClose={closeList} 
                        contentLabel="Information Modal"
                        ariaHideApp={false} 
                        className="community_modal-content"
                        overlayClassName="community_modal-overlay" 
                        >   
                            <div className="modal-container">   
                                <h1>Create Post</h1> 
                                        <div className="modalcont"> 
                                            <div className="modalcont-input" style={{width:"70%"}}> 
                                                    <div style={{display:"flex",alignItems:"center",marginBottom:"15px",width:"100%"}}>  
                                                        <div>
                                                            <p style={{fontSize:"12px",margin:0,color:"grey"}}>You can select the game you wanna talk about.</p>
                                                            <input className="input3" style={{width:"50%",height:"10px",marginTop:2}}  onFocus={() => setOpen(true)} value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search for games..."></input>   
                                                            {open && ( 
                                                            <div ref={ref} className="searchContainer2" style={{position:"absolute",backgroundColor:"black",width:"20%",maxHeight:"50%",overflowX:"hidden",overflow:"auto",overflowY:"scroll",zIndex:999}}> 
                                                                {searchResults.map((data,index)=>( 
                                                                <div onClick={()=>{setSelectedGame(data);setOpen(false)}} key={index}  className="searchContainer3" style={{width:"100%",display:"flex",marginBottom:"10px",alignItems:"center",cursor:"pointer",textDecoration:"none"}}> 
                                                                    <img style={{width:"30%",height:"60px",borderRadius:"8px",objectFit:"cover"}} src={data.background_image}></img> 
                                                                    <p style={{color:"white",fontSize:"15px"}}>{data.name}</p>
                                                                </div>
                                                                ))}
                                                            </div>
                                                            )}  
                                                        </div> 
                                                        {selectedGame && (  
                                                            <div style={{display:"flex",alignItems:"center",marginTop:"10px"}}> 
                                                                <p style={{marginLeft:"15px",marginRight:"5px"}}>- </p>
                                                                <p> {selectedGame.name}</p> 
                                                            </div>
                                                        )}   
                                                       
                                                    </div>  
                                        <p style={{fontSize:"12px",margin:0,color:"grey"}}>What you wanna talk about.</p>
                                        <input style={{marginTop:0}}  maxLength="100" value={postTitle}  onChange={(e)=>setPostTitle(e.target.value)} placeholder="Title*"></input>  
                                                        
                                        <div style={{width:"100%",display:"flex",justifyContent:"flex-end"}}> 
                                            <p style={{margin:1,color:"grey"}}>{100-postTitle.length}</p> 
                                        </div>  
                                            <PostImgageLoader  formdata={setFormdata}/> 
                                            <p style={{fontSize:"12px",margin:0,color:"grey",marginTop:"10px"}}>Describe the topic you wanna talk about.</p>
                                            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} style={{height:"150px",marginTop:2}}className="description" placeholder="Description*"/> 
                                    </div>  
                                </div>  
                                
                                
                                <div className="cancelnextButton"> 
                                    <button onClick={()=>closeList()} style={{backgroundColor:"grey"}}>Cancel</button>   
                                    {saveClicked ? ( 
                                        <button disabled={true} style={{backgroundColor:"grey"}}> 
                                            <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"30px"}}> 
                                                <div className="spinner" style={{height:"30px",width:"30px"}}></div>
                                            </div> 
                                        </button>
                                    ) : ( 
                                        <button onClick={()=>handleSavePost()} style={{backgroundColor:"blue"}}>Save</button>
                                    )}
                                    
                                </div> 
                            </div>  
                     </Modal> 
                   </div>  
                   <div style={{display:"flex",flexDirection:"row",width:"100%",marginTop:"20px"}}>  
                          <div style={{}} class="dropdown2">   
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"5px"}}>
                                            <p style={{margin:0,color:"white",color:"grey"}}>Sort By:</p>
                                            <p style={{margin:0,color:"white",color:"grey"}}>{selectedSort}</p>  
                                            <IoMdArrowDropdown color="grey" style={{marginTop:"5px"}}/>   
                            </div>
                                            <div class="dropdown-content2" >  
                                                    <div onClick={()=>{setDirection("desc");setOrder("upvotes");setSelectedSort("Top");}} className="dropdown-item"> 
                                                        <GiJetPack color="white" size={20} /> 
                                                        <p>Top</p> 
                                                    </div> 
                                                    <div  onClick={()=>{setDirection("desc");setOrder("created_at");setSelectedSort("New");}} className="dropdown-item">
                                                        <FaHotjar color="white" size={20} />
                                                        <p>New</p>  
                                                    </div>   
                                                    <div onClick={()=>{setDirection("asc");setOrder("created_at");setSelectedSort("Oldest");}} className="dropdown-item"> 
                                                        <FaBoxArchive color="white" size={20}/>
                                                        <p>Oldest</p> 
                                                    </div>  
                                            </div> 
                            </div> 
                    </div>  
                   {postLoading ? ( 
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                        <div className="spinner"></div>
                    </div>
                   ):(  
                    <div style={{display:"flex",flexDirection:"row",width:"100%"}}> 
                        <div style={{display:"flex",flexDirection:"column",width:"70%"}} >
                     {posts.map((data,index)=>(  
                        <Link to={`/c/comment/${data.id}`} style={{textDecoration:"none",padding:"10px",borderBottom:"1px solid grey",display:"flex",justifyContent:"center",alignItems:"center"}}>
                        <div key={index} className="post-con">  
                            <div className="post-username-con">
                                <Link style={{display:"flex",alignItems:"center",textDecoration:"none"}} to={`/user/${data.user.userName}`}>
                                    <img className="post-con-avatar" src={data.user.avatar_url}></img>
                                                                    
                                    <p>{data.user.userName}</p>  
                                </Link>  
                                <p>-</p>
                                <p style={{fontWeight:"100",color:"grey"}}>{timeago(data.created_at)}</p> 
                                {data.game&& ( 
                                    <p>{data.game.game_name}</p>
                                )} 
                                {session && myCommunityList && ( 
                                     (userCom?.Authorization === "Admin" || session.userId === data.user_id) && ( 
                                        <div onClick={(e)=>{e.stopPropagation();e.preventDefault();}} style={{position:"absolute",right:0,cursor:"pointer"}} class="dropdown"> 
                                            <p style={{margin:0}}><BsThreeDotsVertical size={18} /></p>  
                                            <div class="dropdown-content" > 
                                                    <p onClick={()=>{deletePost(data.id)}}>Delete</p> 
                                                    <p>Edit</p>    
                                            </div>
                                        </div> 
                                        ) 
                                )} 
                               
                            </div>  
                            <div className="post-title-con"> 
                                <p>{data.title}</p>
                            </div> 
                            {data.post_image ? ( 
                                <div className="postimage-con"> 
                                    <img src={data.post_image}></img>
                                </div>
                            ) : ( 
                                <div className="postdescription-con"> 
                                    <p style={{color:"grey",marginTop:0}}>{data.content}</p>
                                </div>
                            )}  
                            <div style={{display:"flex",gap:"20px"}}> 
                                <div className="post-icon-con"> 
                                    <BiUpvote className={`upvote ${votedPosts[data.id] === "up" ? "disabled" : ""}`} onClick={(e)=>{e.stopPropagation();e.preventDefault();upvote(data.id)}}  size={18} />  
                                    <p>{data.upvotes}</p>
                                    <BiDownvote  className={`downvote ${votedPosts[data.id] === "down" ? "disabled" : ""}`} onClick={(e)=>{e.stopPropagation();e.preventDefault();downvote(data.id)}}  size={18} />
                                </div>  
                                <div className="post-icon-con">  
                                    <CiChat1 color="grey" size={20}/> 
                                    <p style={{marginLeft:"3px"}}>{data.comment_count}</p>
                                </div>
                            </div>
                            
                            
                        </div> 
                    </Link>
                   ))}  
                    {moreLoading ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                            <div className="spinner"></div>
                        </div>
                        ) : hasMore && ( 
                        <div className="post-loadmore"> 
                                <button onClick={() => {
                                setPage((prev) => prev + 1);
                                setMoreLoading(true);
                            }}>
                                Load More
                            </button>
                        </div>
                        
                    )}  
                    </div>  
                    <div style={{display:"flex",justifyContent:"center",width:"30%",marginTop:"50px",maxHeight:"300px",overflow:"hidden"}}>
                        <div className="com-info">  
                            <div className="post-pencilcon">  
                                <p style={{fontSize:"18px",fontWeight:"bold"}}>{name}</p> 
                                
                                {userCom?.Authorization === "Admin" || comData.creator_user_id === session?.userId &&  ( 
                                        <FaPencilAlt onClick={()=>{setUpdateName(name);setUpdateDescription(comDescription);setIsOpenModal(true)}} className="post-pencil" />
                                )} 
                                
                            </div>
                            
                            <p style={{margin:0,marginBottom:"15px"}} className="post-info-description">{comDescription}</p>   
                            <div className="post-cakecon"> 
                                <GiCakeSlice className="post-cake" />
                                <p>Created At {new Date(comData.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",})}
                                </p> 
                            </div> 
                            <div style={{display:"flex"}}>
                                <p style={{marginRight:"6px",color:"blue"}}>{comData.member_count} </p> 
                                <p>Members</p> 
                            </div>
                        </div> 
                        <Modal 
                        isOpen={isOpenModal} 
                        onRequestClose={closeModal} 
                        contentLabel="Information Modal"
                        ariaHideApp={false} 
                        className="community_modal-content"
                        overlayClassName="community_modal-overlay" 
                        >   
                            <div className="modal-container">    
                                <p style={{fontSize:"30px",margin:0}}>Edit community details</p>
                               <textarea maxLength={20} value={updateName} onChange={(e)=>setUpdateName(e.target.value)} style={{height:"30px"}}className="description" placeholder="Community Name*"/> 
                                <p style={{margin:0,color:"grey",fontSize:"14px"}}>Change your community name.</p>
                               <textarea maxLength={300} value={updateDescription} onChange={(e)=>setUpdateDescription(e.target.value)} style={{height:"150px"}}className="description" placeholder="Description*"/>   
                                <p style={{margin:0,color:"grey",fontSize:"14px"}}>Describe your community to visitors.</p>
                                 <div className="cancelnextButton" style={{marginTop:"10px"}}> 
                                        <button onClick={()=>closeModal()} style={{backgroundColor:"grey"}}>Cancel</button>  
                                        <button onClick={()=>{updateCommunity()}} style={{backgroundColor:"blue"}}>Save</button>
                                  </div>
                            </div>  
                     </Modal> 
                    </div>
                   </div>
                   )}  
                   
                  
                  
                    
                </div> 
              
        )}

        </div>
    )

} 
export default MainCommunityPage