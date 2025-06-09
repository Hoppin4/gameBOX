import React from "react"; 
import { useState, useEffect,useContext,useRef } from "react"; 
import { useParams,useLocation } from "react-router-dom";  
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
import Modal from 'react-modal';
import { FaTrash } from "react-icons/fa"; 
import { FaHeart } from "react-icons/fa";

function UserPage() {     
    const { userName } = useParams(); 
    const nav = useNavigate()
    const { myCommunityList,session,loggedIn } = useContext(AuthContext);
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
    const [followStatus,setFollowStatus] = useState(null) 
    const [followers,setFollowers]=useState();    
     const closeList = () => setIsOpenList(false) ;   
     const [followerPage,setFollowerPage]=useState(1); 
     const [followerLoading,setFollowerLoading]=useState(true)  
     const[fstatus,setFstatus]=useState() 
     const [followersCount,setFollowersCount] = useState(); 
     const [followingCount,setFollowingCount] = useState();  
     const [likedGames,setLikedGames] = useState([]); 
     const [likedGamesLoading,setLikedGamesLoading]= useState(true)
    const [userLoading,setUserLoading]=useState(true);
    const [isOpenList, setIsOpenList] = useState(false);  
    const [likedLists,setLikedLists] = useState([]) 
    const [liketype,setlikeType] = useState(1) 
    const [reviews,setReviews] = useState([]) 
    const [likedReviews,setLikedReviews]= useState([])
    dayjs.extend(relativeTime); 
    const timeago = (time) =>dayjs(time).fromNow()  
  
    console.log(userName); 
     
    const getUser = async()=>{  
        let userid; 
        setUserLoading(true)
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/user/getUser2`,{ 
                params:{ 
                    userName:userName
                }
                
            })  
            console.log(response)  
            userid=response.data[0].id
            setUserData(response.data[0])
            setUserId(response.data[0].id)   
            setFollowersCount(response.data[0].follower_count) 
            setFollowingCount(response.data[0].following_count)
            if(session?.userId === userid || !loggedIn){ 
                return;
            }else{ 
                try{
                    const response = await axios.get(`${process.env.REACT_APP_BACKEND}/user/checkfollows`,{
                        params:{ 
                            followerId:session.userId, 
                            followingId:userid
                        } 
                    })    
                    if(response.data !== null){  
                       
                        setFollowStatus(response.data)
                    }
                    
                   
                }catch(error){ 
                    console.log(error)
                }
            }
            
           
        }catch(error){
            console.log(error)
        }finally{ 
            setUserLoading(false)
        }
    } 
     const getGames = async()=>{   
        setLikedGamesLoading(true);
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/user/getLikedGames`,{ 
                params:{
                    userId:userId
                }
            })  
          
            setLikedGames(response.data)
        }catch(error){ 
            console.log(error)
        }finally{ 
              setLikedGamesLoading(false);
        }
    }   
     const getLikedLists = async()=>{   
        setLikedGamesLoading(true);
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/user/getLikedLists`,{ 
                params:{
                    userId:userId
                }
            })  
            console.log(response)
            setLikedLists(response.data.data)
        }catch(error){ 
            console.log(error)
        }finally{ 
              setLikedGamesLoading(false);
        }
    }  
    
    const getPopularPosts = async (page) => {   
        setPostLoading(true)
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
        setPosts(posts.map(post =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
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
        setPosts(posts.map(post =>
        post.id === postId ? { ...post, upvotes: post.upvotes - 1 } : post
    ));  
    try{ 
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/downvote`,{
            postId:postId
        }) 
    }catch(error){
        console.log(error);
    }
   }    
   const handlefollow = async()=>{  
    if(!session){ 
        return nav("/signup")
    }  
        setFollowersCount((prev)=>prev+1)
        try{
            const response = await axios.post(`${process.env.REACT_APP_BACKEND}/user/handlefollow`,{ 
                followerId:session.userId,
                followingId:userId
        })  
            console.log(response.data.data[0]) 
            setFollowStatus(response.data.data[0])
        }catch(error){ 
            console.log(error);
        }
   } 
   const handleunfollow = async()=>{ 
          console.log(followStatus.id)
        setFollowStatus(null) 
        setFollowersCount((prev)=>prev-1)
       try{
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/user/handleunfollow`,{   
                params:{
                     id:followStatus.id
                }
               
        })
        }catch(error){ 
            console.log(error);
        }
   } 
   const openmodal = async()=>{  
    setFollowerLoading(true)
    setIsOpenList(true) 
    try{ 
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/user/getFollowers`,{
            params:{ 
                followingId:userId ,
                page:followerPage,
            }
        })  
        setFollowers(response.data)
        
    }catch(error){ 
        console.log(error)
    }finally{
        setFollowerLoading(false)
    }
   } 
   const openmodal2 = async()=>{  
    setFollowerLoading(true)
    setIsOpenList(true) 
    try{ 
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/user/getFollowings`,{
            params:{ 
                followingId:userId ,
                page:followerPage,
            }
        })  
        setFollowers(response.data)
        
    }catch(error){ 
        console.log(error)
    }finally{
        setFollowerLoading(false)
    }
   } 
   const getUserReviews = async()=>{  
    let commentIds; 
    let likedIds; 
    let comments;
        setLikedGamesLoading(true); 
        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getUserReviews`,{
                params:{
                    userId:userId, 
                    limit:20
                }
            })     
            if(session){  
                comments = response.data.response.data
                commentIds = response.data.response.data.map(c=>c.id) 
                const response2 = await axios.get(`${process.env.REACT_APP_BACKEND}/user/checkReviewLiked`,{
                    params:{
                        userId:session.userId, 
                        commentIds:commentIds
                    }
                })    
                likedIds = new Set(response2.data.data.map(r => r.review_id));  
                const reviewsWithLikes = comments.map(comment => ({
                    ...comment,
                    isLiked: likedIds.has(comment.id)
                })); 
                  setReviews(reviewsWithLikes) 
              
            }else{ 
                setReviews(response.data.response.data)
            }
        }catch(error){
            console.log(error)
        }finally{ 
            setLikedGamesLoading(false);
        }
   } 
   const deleteReview = async(reviewId) => { 
        try{ 
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/api/deleteReview`, { 
                params: { reviewId: reviewId } 
            }); 
          
            if(response.data.message === "Review deleted successfully"){  
                setReviews(reviews.filter((data)=>data.id !== reviewId));
            }else{ 
                console.error("Error deleting review:", response.data.message); 
            } 
        }catch(error){ 
            console.error('Error deleting review:', error); 
        } 
    } 
    const handlereviewlike= async(reviewId,creator_id,gameId)=>{  
        if(!session){ 
            return nav('/signup');
        }   
        setLikedReviews((prev)=>prev.map((r)=>r.review_id===reviewId ? {...r,isLiked:true,review:{...r.review,like_count:r.review.like_count+1}} : r))
       
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/reviewlike`,{ 
                params:{ 
                    userId:session.userId, 
                    reviewId:reviewId, 
                    gameId:gameId, 
                    creator_id:creator_id, 
                    
                }
            }) 
            
        }catch(error){ 
            console.log(error)
        }finally{ 
           
        }
    } 
    const handlereviewunlike = async(reviewId)=>{ 
          if(!session){ 
            return nav('/signup');
        }   
        setLikedReviews((prev)=>prev.map((r)=>r.review_id===reviewId ? {...r,isLiked:false,review:{...r.review,like_count:r.review.like_count-1}} : r))
        try{ 
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/user/unreviewlike`,{ 
                params:{ 
                    userId:session.userId, 
                    review_id:reviewId
                }
            })
        }catch(error){ 
            console.log(error)
        }finally{ 
            
        }
    } 
    const getLikedReviews= async()=>{ 
        setLikedGamesLoading(true) 
        let commentIds; 
        let comments;  
        let likedIds;
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/user/getLikedReviews`,{ 
                params:{ 
                    userId:userId, 
                }
            })   
            if(session){  
                comments = response.data.data
                commentIds = response.data.data.map(c=>c.review.id)  
                console.log(commentIds)
                const response2 = await axios.get(`${process.env.REACT_APP_BACKEND}/user/checkReviewLiked`,{
                    params:{
                        userId:session.userId, 
                        commentIds:commentIds
                    }
                })    
                likedIds = new Set(response2.data.data.map(r => r.review_id));  
                const reviewsWithLikes = comments.map(comment => ({
                    ...comment,
                    isLiked: likedIds.has(comment.review.id)
                }));  
                console.log(reviewsWithLikes)
                  setLikedReviews(reviewsWithLikes) 
              
            }else{ 
                setLikedReviews(response.data.data)
            }
            
            console.log(response)
        }catch(error){ 
            console.log(error)
        }finally{ 
            setLikedGamesLoading(false)
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
        setPosts([])
        setLikedGames([])
        setLikedReviews([]) 
        setLikedLists([]) 
        setListData([])
        SetSelectedButton(1)  
        setlikeType(1) 

        getUser();
    },[userName]) 
   console.log(likedReviews)
    return(
        <div className="main">   
      
            <CommunityLeftLayout />
            {postLoading && userLoading ? (  
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                    <div className="spinner"></div>
                </div>
                ):(  
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",width:"60%"}}>  
                    <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center",gap:"5px",width:"100%",marginTop:"20px",borderBottom:"1px solid grey",padding:"10px",position:"relative",paddingBottom:"30px"}}>  
                        <img style={{width:"80px",height:"80px",borderRadius:"50%",objectFit:"fill"}} src={userData.avatar_url}></img> 
                        <div style={{display:"flex",flexDirection:"column"}}>   
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px"}}>
                                <p style={{color:"white",margin:0,marginLeft:"10px",marginBottom:"10px",fontSize:"20px"}}>{userData.userName}</p>     
                                {session?.userId !== userId && (  
                                    followStatus === null ? ( 
                                        <button className="followbutton" onClick={()=>handlefollow()}>Follow</button>
                                    ) : ( 
                                        <button className="unfollowbutton" onClick={()=>handleunfollow()}>Unfollow</button>
                                    )   
                                ) }
                            </div>
                          
                            <p style={{color:"grey",margin:0,marginLeft:"10px"}}>{userData?.firstName} {userData?.lastName}</p>  
                            <p>{userData?.bio}</p> 
                        </div>   
                        <div style={{marginLeft:"150px",display:"flex"}}>  
                            <p style={{color:"grey",cursor:"pointer"}} onClick={()=>{setFstatus("Followers");openmodal2()}}>{followersCount} Followers</p> 
                            <p style={{color:"grey",marginLeft:"10px",cursor:"pointer"}}onClick={()=>{setFstatus("Following");openmodal()}}>{followingCount} Following</p> 
                            <Modal 
                                    isOpen={isOpenList} 
                                    onRequestClose={closeList} 
                                    contentLabel="Information Modal"
                                    ariaHideApp={false} 
                                    className="follower_modal-content"
                                    overlayClassName="follower_modal-overlay" 
                                    >  
                                    <div style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",borderBottom:"1px solid grey"}}> 
                                        <p style={{margin:0,marginTop:"10px",marginBottom:"10px"}}>{fstatus}</p> 
                                    </div>  
                                {followerLoading ? (  
                                    <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                                        <div className="spinner"></div>
                                    </div>

                                ) : (  
                                    <div className="followers_container_up">
                                     {followers.map((data,index)=>( 
                                        <Link key={index} className="followers_container" onClick={()=>closeList()} to={`/user/${data.user.userName}`}>   
                                            <img src={data.user.avatar_url} style={{width:"50px",height:"50px",borderRadius:"50%"}}></img>
                                            <p style={{marginLeft:"10px",fontSize:"16px",fontWeight:"600"}}>{data.user.userName}</p>
                                        </Link>
                                     ))} 
                                     </div>
                                )}  
                                
                            </Modal> 
                        </div> 
                        <div style={{position:"absolute",display:"flex",right:0,justifyContent:"center",alignItems:"center"}}> 
                        
                        <FaBirthdayCake color="grey" />
                            <p style={{color:"white",color:"grey",margin:0,marginLeft:"10px"}}>{new Date(userData.birthday).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",})}
                            </p>  
                        </div>  
                       
                    </div>  
                    <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center",width:"100%",padding:"10px"}}>
                        <button style={{cursor:"pointer"}} className={selectedButton === 1 ? "users-button-active": "users-button"} onClick={()=>SetSelectedButton(1)}>Posts</button> 
                        <button style={{cursor:"pointer"}} className={selectedButton === 2 ? "users-button-active": "users-button"} onClick={()=>{SetSelectedButton(2);getList();}}>Lists</button>  
                        <button style={{cursor:"pointer"}} className={selectedButton === 4 ? "users-button-active": "users-button"} onClick={()=>{SetSelectedButton(4);getUserReviews();}}>Reviews</button> 
                        <button style={{cursor:"pointer"}} className={selectedButton === 3 ? "users-button-active": "users-button"} onClick={()=>{SetSelectedButton(3);getGames();}}>Likes</button>  
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
                                        <p style={{color:"blue",fontSize:"13px",margin:0}}>   
                                            <Link to={`/c/${data.community.id}`} style={{textDecoration:"none",color:"blue"}}>
                                                c/{data.community.name}
                                            </Link> 
                                        </p>  
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
                    {selectedButton === 3 && (  
                        likedGamesLoading ? ( 
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                                <div className="spinner"></div>
                            </div>
                        ): (   
                            <div style={{width:"100%"}}>  
                            <div style={{display:"flex",gap:"10px"}}>
                                <p className={liketype===1 ? "active-user-liked-type" : "user-liked-type"} onClick={()=>setlikeType(1)}>Games</p> 
                                <p className={liketype===2 ? "active-user-liked-type" : "user-liked-type"} onClick={()=>{getLikedLists();setlikeType(2);}}>Lists</p>  
                                <p className={liketype===3 ? "active-user-liked-type" : "user-liked-type"} onClick={()=>{getLikedReviews();setlikeType(3);}}>Reviews</p> 
                            </div>
                            {liketype === 1 && ( 
                                 <div className="likedgamecontainer">  
                                    {likedGames.map((data,index)=>( 
                                        <Link to={`/GameDetailPage/${data.game.game_id}/${data.game.game_name}`} state={{gameImage:data.game.game_image}}>
                                            <img className="likedgame-img" src={data.game.game_image}></img> 
                                        </Link>
                                    ))}
                                    
                                </div>
                            )}
                            {liketype === 2 && (  
                               <div className="listItemsContainer" style={{backgroundColor:"black"}}>  
                                                        {likedLists.length > 0 ? (   
                                                            likedLists.map((list) => list.list.gamecount > 0 && ( 
                                                                <div key={list.id} className="listItem" >  
                                                              
                                                                     
                                                                        <Link className="listImageContainer" to={`/list/${list.list_id}`} style={{textDecoration:"none"}}>
                                                                            <div className="imageCover"> <img src={list.list.first_four_images && list.list.first_four_images.length > 0 ? list.list.first_four_images[0] : blackScreen }  /></div> 
                                                                            <div className="imageCover"> <img src={list.list.first_four_images && list.list.first_four_images.length > 1 ? list.list.first_four_images[1] : blackScreen }  /></div> 
                                                                            <div className="imageCover"><img src={list.list.first_four_images && list.list.first_four_images.length > 2 ? list.list.first_four_images[2] : blackScreen }  /></div> 
                                                                            <div className="imageCover"><img src={list.list.first_four_images && list.list.first_four_images.length > 3 ? list.list.first_four_images[3] : blackScreen }  /></div> 
                                                                        </Link> 
                                                                  
                                                                    <div className="listNameContainer" > 
                                                                        <p style={{marginTop:"5px",color:"white",fontSize:"20px",fontWeight:"bold"}}>{list.list.name}</p>    
                                                                        <div style={{display:"flex",alignItems:"center",padding:"6px 0px 5px 0px",borderRadius:"10px"}}>  
                                                                            <Link style={{display:"flex",alignItems:"center",textDecoration:"none"}} to={`/user/${list.list.user.userName}`}>
                                                                                <img src={list.list.user.avatar_url} style={{width:"30px",height:"30px",objectFit:"contain",borderRadius:"50%",marginRight:"5px"}}></img>  
                                                                                <p style={{fontSize:"12px",margin:0,marginRight:"15px"}}>{list.list.user.userName}</p>
                                                                            </Link> 
                                                                             <p style={{fontSize:"12px",margin:0}}>{list.list.gamecount} Games</p>   
                                                                            
                                                                        </div>
                                                                        <p>{list.list.description}</p>  
                                                                    </div>
                                                                    
                                                                
                                                                </div> 
                                                            )) 
                                                        ) : ( 
                                                            <p>No lists available</p> 
                                                        )}
                                                       </div>

                            )} 
                            {liketype === 3 && ( 
                                <div style={{display:"flex",flexDirection:"column",justifyContent:"center",width:"100%",height:"auto",marginTop:"30px",alignItems:"center"}}> 
                                                 {likedReviews.map((data,index)=> (  
                                                    data.review.review !== "" && ( 
                                                    <Link style={{position:"relative",width:"70%",height:"auto",backgroundColor:"#202020",margin:"10px",borderRadius:"10px",textDecoration:"none",paddingBottom:"50px",marginBottom:"10px"}} to={`/GameDetailPage/${data.game.game_id}/${data.game.game_name}`} state={{gameImage:data.game.game_image}} key={index}>   
                                                        <img style={{position:"absolute",width:"100%",height:"100%",objectFit:"cover",zIndex:1,filter: "brightness(30%)",borderTopLeftRadius:"10px",borderTopRightRadius:"10px"}} src={data.game.game_image}></img> 
                                                        <div style={{position: "relative",zIndex:5}}>  
                                                            
                                                             <h1 style={{color:"white",padding:"10px"}}>{data.game.game_name}</h1> 
                                                          
                                                            <div style={{maxWidth:"100%",overflow:"hidden"}}>  
                                                                <p style={{color:"white",padding:"10px",margin:0,marginTop:"20px"}}>{data.review.review}</p> 
                                                                <div style={{display:"flex",alignItems:"center",marginLeft:"10PX",marginBottom:"10px"}}>  
                                                                    <Link  to={`/user/${data.review.creator.userName}`} >
                                                                        <img style={{width:"40px",borderRadius:"50%",height:"40px"}} src={data.review.creator.avatar_url}></img> 
                                                                    </Link>   
                                                                    <div style={{marginLeft:"10px"}}>
                                                                        <p style={{margin:0,color:"white",fontWeight:"600"}}>{data.review.creator.userName}</p>
                                                                        <p style={{margin:0,color:"grey"}}>{new Date(data.review.created_at).toLocaleDateString("en-US", {
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric"
                                                                            })}</p> 
                                                                    </div>  
                                                                </div> 
                                                                
                                                            </div> 
                                                               
                                                            <div style={{position:"absolute",right:10,bottom:10}}>  
                                                                {data.review.creator.id === session?.userId && (   
                                                                    <FaTrash onClick={(e)=>{e.preventDefault();deleteReview(data.review.id) }} style={{cursor:"pointer"}} color="red"></FaTrash> 
                                                                ) }    
                                                            </div>
                                                            <div style={{display:"flex",alignItems:"center",marginTop:"10px",marginLeft:"10PX"}}> 
                                                                    {data.isLiked ?   
                                                                        <div  className="review-hearth-container-liked" onClick={(e)=>{e.preventDefault();handlereviewunlike(data.review_id)}}>
                                                                            <FaHeart className="hearth-review" style={{marginTop:"3px"}} size={15} color="red"  /> 
                                                                            <p>Liked</p>   
                                                                        </div>
                                                                            :     
                                                                        <div className="review-hearth-container" onClick={(e)=>{e.preventDefault();handlereviewlike(data.review_id,data.user_id,data.game_id)}}>
                                                                            <FaHeart  style={{marginTop:"3px"}}  size={15} color="grey" />  
                                                                            <p>Like Review</p>
                                                                        </div>  }  
                                                                                                    
                                                                   <p style={{margin:0,color:"grey",fontSize:"14px",marginTop:"3px",marginLeft:"5px"}}>{data.review.like_count} likes</p> 
                                                            </div>
                                                        </div> 
                                                    </Link>
                                                    )
                                               
                                            ))}
                                            </div>
                            )}
                           </div>
                        )
                        
                    )}  
                    {selectedButton === 4 && ( 
                        likedGamesLoading ? (  
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                                <div className="spinner"></div>
                            </div>

                        ) : 
                        ( 
                            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",width:"70%",height:"auto",marginTop:"30px"}}> 
                                                 {reviews.map((data,index)=> (  
                                                    data.review !== "" && ( 
                                                    <Link style={{position:"relative",width:"100%",height:"auto",backgroundColor:"#202020",margin:"10px",borderRadius:"10px",textDecoration:"none",paddingBottom:"50px",marginBottom:"10px"}} to={`/GameDetailPage/${data.games.game_id}/${data.games.game_name}`} state={{gameImage:data.games.game_image}} key={index}>   
                                                        <img style={{position:"absolute",width:"100%",height:"100%",objectFit:"cover",zIndex:1,filter: "brightness(30%)",borderTopLeftRadius:"10px",borderTopRightRadius:"10px"}} src={data.games.game_image}></img> 
                                                        <div style={{position: "relative",zIndex:5}}>  
                                                            
                                                             <h1 style={{color:"white",padding:"10px"}}>{data.games.game_name}</h1> 
                                                          
                                                            <div style={{maxWidth:"100%",overflow:"hidden"}}>  
                                                                <p style={{color:"white",padding:"10px",margin:0,marginTop:"20px"}}>{data.review}</p> 
                                                                <p style={{margin:0,color:"grey",marginLeft:"10px"}}>{new Date(data.created_at).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric"
                                                                })}</p> 
                                                            </div> 
                                                               
                                                            <div style={{position:"absolute",right:10,bottom:10}}>  
                                                                {data.user_id === session?.userId && (   
                                                                    <FaTrash onClick={(e)=>{e.preventDefault();deleteReview(data.id) }} style={{cursor:"pointer"}} color="red"></FaTrash> 
                                                                ) }    
                                                            </div>
                                                            <div style={{display:"flex",alignItems:"center",marginTop:"10px",marginLeft:"10PX"}}> 
                                                                    {data.isLiked ?   
                                                                        <div  className="review-hearth-container-liked" onClick={(e)=>{e.preventDefault();handlereviewunlike(data.review_id.id)}}>
                                                                            <FaHeart className="hearth-review" style={{marginTop:"3px"}} size={15} color="red"  /> 
                                                                            <p>Liked</p>   
                                                                        </div>
                                                                            :     
                                                                        <div className="review-hearth-container" onClick={(e)=>{e.preventDefault();handlereviewlike(data.review_id,data.user_id,data.game_id)}}>
                                                                            <FaHeart  style={{marginTop:"3px"}}  size={15} color="grey" />  
                                                                            <p>Like Review</p>
                                                                        </div>  }  
                                                                                                    
                                                                   <p style={{margin:0,color:"grey",fontSize:"14px",marginTop:"3px",marginLeft:"5px"}}>{data.like_count} likes</p> 
                                                            </div>
                                                        </div> 
                                                    </Link>
                                                    )
                                               
                                            ))}
                                            </div>
                        )
                    )}   

                   </div>
                )}
          
           
        </div>
    )
}export default UserPage;
