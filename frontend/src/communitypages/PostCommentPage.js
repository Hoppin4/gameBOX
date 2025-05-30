import axios from "axios";
import React, { useEffect, useState,useContext,useRef } from "react"; 
import { useParams } from "react-router-dom";
import CommunityLeftLayout from "./CommunityLeftLayout"; 
import { AuthContext } from "../provider/AuthProvider";  
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';  
import Swal from 'sweetalert2'; 
import { BsThreeDotsVertical } from "react-icons/bs"; 
import { BiUpvote,BiDownvote} from "react-icons/bi";
import { CiChat1 } from "react-icons/ci";   
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";


function PostCommentPage(){   
    const navigate = useNavigate();
    const { id } = useParams();  
    const [loading,setLoading] = useState(true); 
    dayjs.extend(relativeTime);  
    const [votedPosts, setVotedPosts] = useState({});  
    const [votedComments, setVotedComments] = useState({});  
    const [comments,setComments] = useState([]); 
    const [commentLoading,setCommentLoading] = useState(true);
    const timeago = (time) =>dayjs(time).fromNow() 
    const [data,setData] = useState();  
    const [focused,setFocused] = useState(false); 
    const [comment,setComment] = useState(); 
    const [commentPage,setCommentPage]= useState(1); 
   
    const { myCommunityList,removeFromList,addToList,session } = useContext(AuthContext);  
    console.log("session",session) 
    
    const fetchData = async()=>{ 
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/com/postInfo`,{  
                params:{ 
                    postId:id
                }
            })  
            setData(response.data.data)
            console.log(response)
        }catch(error){ 
            console.log(error) 
            
        }finally{ 
            setLoading(false)
        }
    }   
    const getComments = async()=>{ 
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/com/getComments`,{  
                params:{ 
                    postId:id,
                    page:commentPage,
                }
            })   
            const sorted = response.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)  );
            setComments(sorted);
        
            console.log(response)
        }catch(error){ 
            console.log(error) 
            
        }finally{ 
            setCommentLoading(false)
        } 

    }
    const deletePost = async(commentId)=>{   

        console.log(commentId)
        const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });
    if(result.isConfirmed){  
        setComments((prev)=>[...prev.filter((comment)=>comment.id !== commentId)])
        try{ 
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/com/deleteComment` ,{   
                params:{ 
                    commentId:commentId }
            });
        }catch(error){ 
            console.log(error)
        }
    }
    }  
    const createComment = async()=>{  
        if(!session){
             navigate("/signup") 
             return
        }
        if(comment.length > 7){  
           
            
            try{
                const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/createComment` ,{ 
                    postId:id, 
                    userId:session.userId,
                    content:comment ,
                    receiver_id:data.user_id
                }) 
                setComments((prev) => [
                    {
                        ...response.data.data[0], 
                        user: {
                        id: session.userId,
                        userName: session.userName,
                        avatar_url: session.user_avatar,
                        },
                    },
                    ...prev,]);
            }catch(error){ 
                console.log(error) 
            }finally{ 
                setComment("")
                setFocused(false) 
            } 
        } 
    }
    useEffect(()=>{ 
        if(id){ 
            fetchData(); 
            getComments();
        }
    },[id]) 
     const upvote = async(postId)=>{  
    if (votedPosts[postId]) return;   
        setVotedPosts((prev) => ({ ...prev, [postId]: "up" }));
        setData({ ...data, upvotes: data.upvotes + 1 });
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
        setData({ ...data, upvotes: data.upvotes - 1 });
    try{ 
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/downvote` ,{
            postId:postId
        }) 
    }catch(error){
        console.log(error);
    }
   }   
    const commentupvote = async(commentId)=>{ 
        if(votedComments[commentId]) return; 
        setVotedComments((prev) => ({ ...prev, [commentId]: "up" })); 
       setComments(comments.map((comment) => 
            commentId === comment.id
                ? { ...comment, upvotes: comment.upvotes + 1 }
                : comment
            ));
        try{ 
                const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/commentUpVote` ,{
                commentId:commentId
            })
        }catch(error){ 
            console.log(error); 
        } 
    } 
     const commentdownvote = async(commentId)=>{ 
        if(votedComments[commentId]) return; 
        setVotedComments((prev) => ({ ...prev, [commentId]: "down" })); 
         setComments(comments.map((comment) => 
            commentId === comment.id
                ? { ...comment, upvotes: comment.upvotes - 1 }
                : comment
            ));
        try{ 
                const response = await axios.post(`${process.env.REACT_APP_BACKEND}/com/commentDownVote` ,{
                commentId:commentId
            })
        }catch(error){ 
            console.log(error); 
        } 
    }
   console.log("aaaa",data)
    return( 
        <div className="main">  
            <CommunityLeftLayout /> 
            {loading ? ( 
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                    <div className="spinner"></div>
                </div>
            ) : ( 
                <div style={{display:"flex",width:"70%",height:"100%"}}>   
                   <div style={{width:"80%",height:"100%"}}> 
                    <div className="post-con">
                     <div className="post-username-con"> 
                        <Link style={{textDecoration:"none",color:"black",display:"flex",alignItems:"center"}} to={`/user/${data.creator.userName}`}>
                            {data.creator.avatar_url ? ( 
                                <img className="post-con-avatar" src={data.creator.avatar_url}></img>
                                ) : ( 
                                <div style={{display:"flex",backgroundColor:"yellow",justifyContent:"center",alignItems:"center",width:"40px",height:"40px"}}>   
                                    <p>{data.creator.userName.charAt(0)}</p>
                                </div>
                            )} 
                            <p>{data.creator.userName}</p> 
                        </Link>  
                            <p>-</p>
                            <p style={{fontWeight:"100",color:"grey"}}>{timeago(data.created_at)}</p>  
                        {session && myCommunityList && ( 
                        (session.userId === data.user_id) && ( 
                            <div style={{position:"absolute",right:0,cursor:"pointer"}} class="dropdown"> 
                                <p style={{margin:0}}><BsThreeDotsVertical size={18} /></p>  
                                <div class="dropdown-content" > 
                                    <p onClick={()=>{deletePost(data.id)}}>Delete</p> 
                                    <p>Edit</p>    
                                </div>
                            </div> 
                    ))} 
                                                   
                    </div> 
                    <div className="post-title-con">  
                        <p className="post-title">{data.title}</p> 
                    </div>   
                    <div className="postdescription-con">  
                        <p style={{color:"grey",marginTop:0}}>{data.content}</p> 
                    </div>   
                    {data.post_image && ( 
                    <div className="postimage-con">  
                            <img className="post-image" src={data.post_image}></img>
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
                                <p style={{marginLeft:"3px"}}>{data.comment_count}</p>
                            </div>
                    </div>
                 </div> 
                 <div className="post-comment-con">  
                    <div style={{ position: 'relative', width: '100%'}}> 
                       <textarea value={comment} onChange={(e)=>{setComment(e.target.value)}} onFocus={()=>{setFocused(true)}} placeholder="Join the conversation..." className="comment-input"/>  
                        <div className={focused ? "post-concan" : "post-concannot"} > 
                            <button onClick={()=>setFocused(false)} className="commentcancelbutton">Cancel</button> 
                            <button onClick={()=>createComment()} className="commentconfirmbutton">Comment</button> 
                        </div>
                         
                    </div>
                 </div>  
                </div>  
                {data.game && (  
                    <Link to={`/GameDetailPage/${data.game.game_id}/${data.game.game_name}`} state={{gameImage:data.game.game_image}} className="game-com-link" > 
                        <img style={{width:"80%",height:"auto",borderRadius:"15px"}} src={data.game.game_image}/>  
                        <p style={{color:"white"}}>{data.game.game_name}</p>

                    </Link>
                    )}
                 
                </div>
            )}  
            {commentLoading ? (  
                <div></div>
                ) : ( 
                     
                 <div style={{display:"flex",alignItems:"center",width:"60%",padding:"10px",flexDirection:"column",marginLeft:"20px"}}>  
                    
                    {comments && comments.map((comment,index)=>(   
                        <div style={{display:"flex",alignItems:"center",width:"100%",padding:"10px",flexDirection:"column"}}>
                        <div key={index} className="comment-con">  
                         {comment.user.avatar_url ? (  
                                    <div style={{display:"flex",justifyContent:"center",marginTop:"5px"}}> 
                                        <img className="post-con-avatar" src={comment.user.avatar_url}></img>
                                    </div>
                                   
                                    ) : ( 
                                    <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"40px",height:"40px"}}>   
                                        <p>{comment.user.userName.charAt(0)}</p>
                                    </div>
                                )}   
                                
                        <div style={{width:"100%",marginLeft:"10px"}}> 
                            <div style={{width:"100%"}} className="post-username-con">
                                {session &&  ( 
                                    (session.userId === comment.user_id) && ( 
                                        <div style={{position:"absolute",right:0,cursor:"pointer"}} class="dropdown"> 
                                            <p style={{margin:0}}><BsThreeDotsVertical size={18} /></p>  
                                            <div class="dropdown-content" > 
                                                <p onClick={()=>{deletePost(comment.id)}}>Delete</p> 
                                                <p>Edit</p>    
                                            </div>
                                        </div> 
                                ))} 
                                <p>{comment.user.userName}</p>  
                                <p>-</p>
                                <p style={{fontWeight:"100",color:"grey"}}>{timeago(comment.created_at)}</p>   
                              
                            </div> 
                                 
                            <div className="postdescription-con" style={{marginLeft:"9px"}}>     
                                <p style={{color:"grey",margin:0}}>{comment.content}</p> 
                            </div>   
                              <div style={{display:"flex",gap:"20px",marginTop:"10px"}}> 
                                    <div className="post-icon-con"> 
                                            <BiUpvote  className={`upvote ${votedComments[comment.id] === "up" ? "disabled" : ""}`}  onClick={()=>commentupvote(comment.id)}   size={18} />  
                                            <p>{comment.upvotes}</p>
                                        <BiDownvote className={`downvote ${votedComments[comment.id] === "down" ? "disabled" : ""}`}  onClick={()=>commentdownvote(comment.id)}   size={18} />
                                    </div>  
                                    <div className="post-icon-con">  
                                        <CiChat1 color="grey" size={20}/> 
                                        <p style={{marginLeft:"3px"}}>Reply</p>
                                    </div>
                            </div>
                        </div>  
                        </div>  
                        
                    </div>
                        
                    ))} 
                    </div> 
                    

                )}
            
        </div>
    )
} 
export default PostCommentPage