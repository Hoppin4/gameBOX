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
import CommunityLeftLayout from "./CommunityLeftLayout"; 
import { GiCakeSlice } from "react-icons/gi";
import { FaPencilAlt } from "react-icons/fa";
import { GiJetPack } from "react-icons/gi"; 
import { FaHotjar } from "react-icons/fa";   
import { FaBoxArchive } from "react-icons/fa6"; 
import { IoMdArrowDropdown } from "react-icons/io"; 
import { MdKeyboardArrowRight } from "react-icons/md"; 
import { useNavigate } from "react-router-dom";



function PopularPostsPage() {     
    const nav = useNavigate();
    const { myCommunityList,removeFromList,addToList,session } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);  
    const [selectedSort, setSelectedSort] = useState("New");
    const [postLoading,setPostLoading] = useState(true);  
    const [votedPosts, setVotedPosts] = useState({});   
    const [hasMore, setHasMore] = useState(true);  
    const [page, setPage] = useState(1); 
    const [games,setGameData] = useState();  
    const [mostPopular,setMostPopular] = useState();
    const [gameLoading, setGameLoading] = useState(true);
    const [moreLoading, setMoreLoading] = useState(false); 
    const [order, setOrder] = useState("upvotes"); 
    const [direction, setDirection] = useState("desc"); 
    const today = new Date();
    const lastMonth = new Date();   
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const formatDate = (date) => date.toISOString().split("T")[0];
    const startDate = formatDate(lastMonth);
    const endDate = formatDate(today);
   console.log("startDate",startDate);   
    console.log("endDate",endDate);
    dayjs.extend(relativeTime); 
    const timeago = (time) =>dayjs(time).fromNow() 
    const getPopularPosts = async (page) => {  
        try{ 
             const response = await axios.get('https://moviebox2-1084798053682.europe-west1.run.app/com/getPopularPost',{ 
                params:{ 
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
            const response = await axios.delete("https://moviebox2-1084798053682.europe-west1.run.app/com/deletePost" ,{   
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
        const response = await axios.post("https://moviebox2-1084798053682.europe-west1.run.app/com/upvote" ,{
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
        const response = await axios.post("https://moviebox2-1084798053682.europe-west1.run.app/com/downvote" ,{
            postId:postId
        }) 
    }catch(error){
        console.log(error);
    }
   }    
   const getPopularGames = async()=>{ 
        try{ 
            const response = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/com/getPopularGames",{ 
                params:{   
                    startDate:startDate, 
                    endDate:endDate,
                }
            });    
            console.log("response",response)
            setGameData(response.data.popular.results); 
            setMostPopular(response.data.bestseller.results);
           
        }catch(error){ 
            console.log(error); 
        } finally{ 
            setGameLoading(false);
        }
   }
   const skipNextPageEffect = useRef(false);
   useEffect(() => {  
        setPostLoading(true); 
        setPosts([]);  
        setPage(1); 
        setHasMore(true);
        const timer = setTimeout(() => {  
            
                getPopularPosts(1);
            
        },0);  
         
        return () => clearTimeout(timer);
    }, [selectedSort]);  
    useEffect(() => {   
        if (skipNextPageEffect.current) {
        skipNextPageEffect.current = false;
        return; 
  }
        if (page > 1) { 
            getPopularPosts(); 
        }
    }, [page]); 
    useEffect(()=>{ 
        getPopularGames();
    },[])
   console.log(games);
    return(
        <div className="main">   
      
            <CommunityLeftLayout />
            {postLoading && gameLoading ? (  
                <div style={{display:"flex",justifyContent:"center",alignItems:"center", width:"100%",height:"100%"}}> 
                    <div className="spinner"></div>
                </div>
                ):(  
                   <div style={{display:"flex",flexDirection:"row",justifyContent:"center",width:"100%",marginLeft:"10%"}}>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",width:"60%"}}>  
                      <div style={{display:"flex",flexDirection:"row",width:"100%",marginTop:"20px"}}>  
                                  <div class="dropdown2">   
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
                     {posts.map((data,index)=>(  
                        <Link key={index} to={`/c/comment/${data.id}`} style={{textDecoration:"none",padding:"10px",borderBottom:"1px solid grey",display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>
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
                                {data.game&& ( 
                                    <p>{data.game.game_name}</p>
                                )} 
                                {session && myCommunityList && ( 
                                     (session.userId === data.user_id) && ( 
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
                   ))}    {hasMore && (  
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
                   {gameLoading ? ( 
                    <div></div>
                   ) : (  
                  <div style={{width:"20%"}}> 
                    <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "10px",
                        width: "100%",
                        marginTop: "20px",
                        padding: "20px", 
                        justifyContent:"flex-start", 
                        height:"250px", 
                        backgroundColor:"#0E1113", 
                        borderTopLeftRadius:"15px",  
                        borderTopRightRadius:"15px",
                        marginLeft:"20px",
                    }}
                    > 
                    <div onClick={()=>nav('/MainGamesPage/month-trending')} style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "5px" ,justifyContent:"center",cursor:"pointer"}}>
                        <h2 style={{  fontSize: "16px",color:"white" }}>
                            Look at the Recently Popular Games
                        </h2> 
                        <MdKeyboardArrowRight size={20} color="white" />
 
                    </div>

                    {games &&
                        games.slice(0, 4).map((data, index) => (
                        <Link
                            key={index}
                            to={`/GameDetailPage/${data.id}/${data.name}`} 
                           state={{gameImage:data.background_image}}
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            <div style={{ textAlign: "center" }}>
                            <img
                                src={data.background_image}
                                alt={data.name}
                                style={{
                                width: "100%",
                                height: "80px",
                                borderRadius: "10px",
                                objectFit: "cover",
                                }}
                            />
                           
                            </div>
                        </Link>
                        ))}
                    </div>
                  
                         <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "10px",
                        width: "100%",
                
                        padding: "20px", 
                        justifyContent:"flex-start", 
                        height:"250px", 
                        backgroundColor:"#0E1113", 
                        borderBottomLeftRadius:"15px", 
                        borderBottomRightRadius:"15px",
                        marginLeft:"20px",
                    }}
                    > 
                    <div onClick={()=>nav('/MainGamesPage/all-time-top')} style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "5px" ,justifyContent:"center",cursor:"pointer"}}>
                        <h2 style={{  fontSize: "16px",color:"white" }}>
                            Look at the All Time Best Games
                        </h2> 
                        <MdKeyboardArrowRight size={20} color="white" />
 
                    </div>

                    {mostPopular &&
                        mostPopular.map((data, index) => (
                        <Link
                            key={index}
                            to={`/GameDetailPage/${data.id}/${data.name}`} 
                           state={{gameImage:data.background_image}}
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            <div style={{ textAlign: "center" }}>
                            <img
                                src={data.background_image}
                                alt={data.name}
                                style={{
                                width: "100%",
                                height: "80px",
                                borderRadius: "10px",
                                objectFit: "cover",
                                }}
                            />
                           
                            </div>
                        </Link>
                        ))}
                    </div> 
                    </div>
                   )} 
                   
                </div> 
                )}
          
           
        </div>
    )
}export default PopularPostsPage;
