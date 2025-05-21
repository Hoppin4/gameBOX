import React from "react"; 
import { useState, useEffect,useContext,useRef } from "react"; 
import { useParams } from "react-router-dom";  
import axios from "axios"; 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';   
import { Link } from "react-router-dom";
 import { AuthContext } from "../provider/AuthProvider";  
 import { BsThreeDotsVertical } from "react-icons/bs"; 
import { BiUpvote,BiDownvote} from "react-icons/bi";
import { CiChat1 } from "react-icons/ci";  
import Swal from 'sweetalert2'; 
import CommunityLeftLayout from "../communitypages/CommunityLeftLayout";
import { GiCakeSlice } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import { GiJetPack } from "react-icons/gi"; 
import { FaHotjar } from "react-icons/fa";   
import { FaBoxArchive } from "react-icons/fa6"; 
import { IoMdArrowDropdown } from "react-icons/io"; 
import { useNavigate } from "react-router-dom"; 
import { FaBirthdayCake } from "react-icons/fa"; 
import blackScreen from "../images/black.jpg";



function UserPage() {     
    const { userName } = useParams(); 
    const nav = useNavigate()
    const { myCommunityList,removeFromList,addToList,session,loggedIn } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);  
    const [selectedSort, setSelectedSort] = useState("New");
    const [postLoading,setPostLoading] = useState(true);  
    const [votedPosts, setVotedPosts] = useState({});   
    const [hasMore, setHasMore] = useState(true);  
    const [page, setPage] = useState(1); 
    const [moreLoading, setMoreLoading] = useState(false); 
    const [order, setOrder] = useState("created_at"); 
    const [direction, setDirection] = useState("desc"); 
    const [userId,setUserId] = useState(); 
    const [userData,setUserData] = useState();
   const [listData, setListData] = useState([]);
    const [listLoading, setListLoading] = useState(true);  
    const [selectedButton,SetSelectedButton] = useState(1)
    
    dayjs.extend(relativeTime); 
    const timeago = (time) =>dayjs(time).fromNow()  
  
    console.log(userName); 
     
    const getUser = async()=>{ 
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/user/getUser2`,{ 
                params:{ 
                    userName:userName
                }
                
            })  
            console.log(response) 
            setUserData(response.data[0])
            setUserId(response.data[0].id)
        }catch(error){
            console.log(error)
        }
    }
    const getPopularPosts = async (page) => {  
        try{ 
             const response = await axios.get(`${process.env.REACT_APP_BACKEND}/com/getMyPosts`,{ 
                params:{  
                    userId:userId,
                    page:page, 
                    order:order, 
                    direction:direction,
                }
             });  
             
            if (response.data.data.length < 19) { 
                setHasMore(false); 
            } 
            if (page === 1) {  
                setPosts(response.data.data);    
            }else{ 
                setPosts((prev) => [...prev, ...response.data.data]); 
            }
       
        }catch(err){
            console.log(err);
        }finally{ 
            setPostLoading(false); 
            setMoreLoading(false);
        }
        
    }  
    const getList = async () => {    
        if(listData.length>0){ 
            return
        }
        setListLoading(true);
        try { 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getList`, { 
                params: { userId: userId } 
            });
            setListData(response.data.data);
            console.log("List data:", response);
        }catch(error) { 
            console.error('Error fetching list:', error); 
        }  
        finally { 
            setListLoading(false); 
        }
    }
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
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/downvote`,{
            postId:postId
        }) 
    }catch(error){
        console.log(error);
    }
   }   
   const skipNextPageEffect = useRef(false);
   useEffect(() => {  
    if(userId){  
        setPostLoading(true); 
        setPosts([]);  
        setPage(1); 
        setHasMore(true);
        const timer = setTimeout(() => {  
            
                getPopularPosts(1);
            
        },0);  
         
        return () => clearTimeout(timer);

    }  
        
    }, [selectedSort,userId]);  
    useEffect(() => {   
        if (skipNextPageEffect.current) {
        skipNextPageEffect.current = false;
        return; 
  }
        if (page > 1) { 
            getPopularPosts(page); 
        }
    }, [page]); 

    useEffect(()=>{ 
        getUser();
    },[userName])
    return(
        <div className="main">   
      
            <CommunityLeftLayout />
            {postLoading ? (  
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                    <div className="spinner"></div>
                </div>
                ):(  
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",width:"60%"}}>  
                    <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center",gap:"5px",width:"100%",marginTop:"20px",borderBottom:"1px solid grey",padding:"10px",position:"relative",paddingBottom:"30px"}}>  
                        <img style={{width:"80px",height:"80px",borderRadius:"50%",objectFit:"fill"}} src={userData.avatar_url}></img> 
                        <div style={{display:"flex",flexDirection:"column"}}>  
                            <p style={{color:"white",margin:0,marginLeft:"10px",marginBottom:"10px",fontSize:"20px"}}>{userData.userName}</p>  
                            <p style={{color:"grey",margin:0,marginLeft:"10px"}}>{userData?.firstName}{userData?.lastName}</p>  
                            <p>{userData?.bio}</p> 
                        </div>   
                        <div style={{position:"absolute",display:"flex",right:0,justifyContent:"center",alignItems:"center"}}>
                        <FaBirthdayCake color="grey" />
                            <p style={{color:"white",color:"grey",margin:0,marginLeft:"10px"}}>{new Date(userData.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",})}
                                    </p>  
                        </div>  
                       
                    </div>  
                    <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center",width:"100%",padding:"10px"}}>
                        <button className={selectedButton === 1 ? "users-button-active": "users-button"} onClick={()=>SetSelectedButton(1)}>Posts</button> 
                        <button className={selectedButton === 2 ? "users-button-active": "users-button"} onClick={()=>{SetSelectedButton(2);getList();}}>Lists</button> 
                     </div> 
                     {selectedButton === 1 && ( 
                        <div>
                      <div style={{display:"flex",flexDirection:"row",width:"100%",marginTop:"20px"}}>  
                                  <div  class="dropdown2">   
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
                            
                              
                                <div>
                                {posts.map((data,index)=>(  
                                    <Link key={index} to={`/c/comment/${data.id}`} style={{textDecoration:"none",padding:"10px",borderBottom:"1px solid grey",display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>
                                    <div className="post-con">  
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
                                            {data.game&& ( 
                                                <p>{data.game.game_name}</p>
                                            )} 
                                            {session && myCommunityList && ( 
                                                (session.userId === data.user_id) && ( 
                                                    <div onClick={(e)=>{e.stopPropagation();e.preventDefault();}} style={{position:"absolute",right:0,cursor:"pointer"}} class="dropdown"> 
                                                        <p style={{margin:0}}><BsThreeDotsVertical size={18} /></p>  
                                                        <div className="dropdown-content" > 
                                                                <p onClick={()=>{deletePost(data.id)}}>Delete</p> 
                                                                <p>Edit</p>    
                                                        </div>
                                                    </div> 
                                                    ) 
                                            )} 
                                        
                                        </div>    
                                        <Link to={`/c/${data.community.id}`} style={{textDecoration:"none"}}>
                                            <p style={{color:"blue",fontSize:"13px",margin:0}}>c/{data.community.name}</p>  
                                        </Link>
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
                            {hasMore && (  
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
                    </div>
                        )}
                    {selectedButton === 2 && (  
                        listLoading ? (  
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                                <div className="spinner"></div>
                            </div>

                        ) : ( 
                            <div className="listItemsContainer" style={{backgroundColor:"black"}}>  
                                                        {listData.length > 0 ? (   
                                                            listData.map((list) => list.gamecount > 0 && ( 
                                                                <div key={list.id} className="listItem" >  
                                                                 
                                                                     
                                                                        <Link className="listImageContainer" to={`/list/${list.id}`} style={{textDecoration:"none"}}>
                                                                            <div className="imageCover"> <img src={list.first_four_images && list.first_four_images.length > 0 ? list.first_four_images[0] : blackScreen }  /></div> 
                                                                            <div className="imageCover"> <img src={list.first_four_images && list.first_four_images.length > 1 ? list.first_four_images[1] : blackScreen }  /></div> 
                                                                            <div className="imageCover"><img src={list.first_four_images && list.first_four_images.length > 2 ? list.first_four_images[2] : blackScreen }  /></div> 
                                                                            <div className="imageCover"><img src={list.first_four_images && list.first_four_images.length > 3 ? list.first_four_images[3] : blackScreen }  /></div> 
                                                                        </Link> 
                                                                  
                                                                    <div className="listNameContainer" > 
                                                                        <p style={{marginTop:"5px",color:"white",fontSize:"20px",fontWeight:"bold"}}>{list.name}</p>    
                                                                        <div style={{display:"flex",alignItems:"center",padding:"6px 0px 5px 0px",borderRadius:"10px"}}> 
                                                                            <p style={{padding:"0px",margin:"0px 10px 0px 0px"}}>{list.gamecount} Games</p>   
                                                                            
                                                                        </div>
                                                                        <p>{list.description}</p>  
                                                                    </div>
                                                                    
                                                                
                                                                </div> 
                                                            )) 
                                                        ) : ( 
                                                            <p>No lists available</p> 
                                                        )}
                                                       </div>
                        )
                        
                    )}
                            
                   </div>
                )}
          
           
        </div>
    )
}export default UserPage;
