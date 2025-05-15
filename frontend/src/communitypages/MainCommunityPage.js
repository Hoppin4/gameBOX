import React, { useEffect, useState,useContext } from "react"; 
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

function MainCommunityPage(){   
    const { id } = useParams(); 
   const [loading,setLoading] = useState(true);  
   const [comData,setComData] = useState(); 
   const [isJoined,setIsJoined] = useState(false);  
   const [isOpenList, setIsOpenList] = useState(false);  
   const [postTitle,setPostTitle]=useState("");
   const [description,setDescription]=useState("");
   const closeList = () => setIsOpenList(false) ;  
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
   const [votedPosts, setVotedPosts] = useState({});
   const { myCommunityList,removeFromList,addToList,session } = useContext(AuthContext);  
   const navigate = useNavigate(); 

   dayjs.extend(relativeTime); 
    const timeago = (time) =>dayjs(time).fromNow() 
    
   const fetchData =async()=>{  
    setLoading(true)
    try{   
        console.log("mylist",myCommunityList)
        const response = await axios.get("http://localhost:5000/com/getCommunityInfo" ,{ 
            params:{ 
                comId:id
            }
        })  
        setComData(response.data.data)   
        setComId(response.data.data.id)
     
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
            const response = await axios.delete("http://localhost:5000/com/deletePost" ,{   
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
   
    setReady(false)
    try{ 
        const response = await axios.post("http://localhost:5000/com/createPost" ,{ 
            title:postTitle, 
            content:description,  
            community_id:comData.id, 
            user_id:session.userId,  
           
        })   
        setPostId(response.data.data[0].id)
    }catch(error){ 
        console.log(error)
    }finally{ 
        setReady(true); 
        closeList();
    }
       
   }
    const getPosts = async()=>{   
        
        try{ 
            const response = await axios.get("http://localhost:5000/com/getPosts" ,{ 
                params:{
                    comId:comId,
                    page:page
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
            console.log(response.data.data.length)  
           
    }
        }catch(error){ 
            console.log(error)
        }finally{ 
         setPostLoading(false); 
         setMoreLoading(false);
        }
       
   } 
   useEffect(()=>{  
    
    if(comId){  
        console.log("içeri giriyo",comId)
        getPosts();
    }
   },[comId,page]) 
    
   const upvote = async(postId)=>{  
    if (votedPosts[postId]) return;   
        setVotedPosts((prev) => ({ ...prev, [postId]: "up" }));
        setPosts(posts.map(c =>
        c.id === postId ? { ...c, upvotes: c.upvotes + 1 } : c
    ));
    try{ 
        const response = await axios.post("http://localhost:5000/com/upvote" ,{
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
        const response = await axios.post("http://localhost:5000/com/downvote" ,{
            postId:postId
        }) 
    }catch(error){
        console.log(error);
    }
   } 

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
                            <p style={{color:"white"}}>{comData.name}</p>  
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
                                        <input  maxLength="100" value={postTitle}  onChange={(e)=>setPostTitle(e.target.value)} placeholder="Title*"></input>  
                                                        
                                        <div style={{width:"100%",display:"flex",justifyContent:"flex-end"}}> 
                                            <p style={{margin:1,color:"grey"}}>{100-postTitle.length}</p> 
                                        </div>  
                                            <PostImgageLoader postId={postId} uploadReady={ready} dataLoading={setImageLoading}/>
                                            <textarea value={description} onChange={(e)=>setDescription(e.target.value)} style={{height:"150px"}}className="description" placeholder="Description*"/> 
                                    </div>  
                                </div>  
                                <div className="cancelnextButton"> 
                                    <button onClick={()=>closeList()} style={{backgroundColor:"grey"}}>Cancel</button>  
                                    <button onClick={()=>handleSavePost()} style={{backgroundColor:"blue"}}>Save</button>
                                </div>
                            </div>  
                     </Modal> 
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
                                {data.user.avatar_url ? ( 
                                    <img className="post-con-avatar" src={data.user.avatar_url}></img>
                                ) : ( 
                                    <div style={{display:"flex",backgroundColor:"yellow",justifyContent:"center",alignItems:"center",width:"40px",height:"40px"}}>   
                                        <p>{data.user.userName.charAt(0)}</p>
                                    </div>
                                )} 
                                <p>{data.user.userName}</p>  
                                <p>-</p>
                                <p style={{fontWeight:"100",color:"grey"}}>{timeago(data.created_at)}</p>  
                                {session && myCommunityList && ( 
                                     (userCom?.Authorization === "Admin" || session.userId === data.user_id) && ( 
                                        <div style={{position:"absolute",right:0,cursor:"pointer"}} class="dropdown"> 
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
                                    <BiUpvote className={`upvote ${votedPosts[data.id] === "up" ? "disabled" : ""}`} onClick={()=>upvote(data.id)}  size={18} />  
                                    <p>{data.upvotes}</p>
                                    <BiDownvote  className={`downvote ${votedPosts[data.id] === "down" ? "disabled" : ""}`} onClick={()=>downvote(data.id)}  size={18} />
                                </div>  
                                <div className="post-icon-con">  
                                    <CiChat1 color="grey" size={20}/> 
                                    <p style={{marginLeft:"3px"}}>6</p>
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
                                <p style={{fontSize:"18px",fontWeight:"bold"}}>{comData.name}</p> 
                                
                                {userCom?.Authorization === "Admin" && ( 
                                        <FaPencilAlt className="post-pencil" />
                                )} 
                                
                            </div>
                            
                            <p style={{margin:0,marginBottom:"15px"}} className="post-info-description">{comData.description}</p>   
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
                    </div>
                   </div>
                   )}  
                   
                  
                  
                    
                </div> 
              
        )}

        </div>
    )

} 
export default MainCommunityPage