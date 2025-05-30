import React, { useEffect,useContext } from "react"; 
import LeftLayout from "./LeftLayout";  
import { useState} from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import { FaTrash } from "react-icons/fa"; 
import { AuthContext } from "../provider/AuthProvider";
import { Link } from "react-router-dom";

function ReviewsPage(){    
     const { session, } = useContext(AuthContext); 
    axios.defaults.withCredentials = true; 
    const { id } = useParams();  
    const [limit, setLimit] = useState(20) 
    const [loading,setLoading] = useState(true); 
    const [reviews,setReviews] = useState(); 
    const [hasMore,setHasMore] = useState(true)
     
    const getReview = async()=>{ 
        try{ 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getUserReviews`,{
                params: { userId:id, limit:limit } 
            });   
            console.log(response.data.response.data)
       
          setReviews(response.data.response.data);
            
            
              
        }catch(error){ 
            console.error('Error fetching session:', error);  
           
        }finally{ 
            setLoading(false) 
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
    useEffect(()=>{ 
                const timer = setTimeout(()=>{ 
                    if(id){ 
                        getReview(); 
                    }
                },0) 
                return () => clearTimeout(timer);
    },[id])
   
    return (  
     
        <div className="main">  
             <LeftLayout/>  
            {loading ? ( 
                <div> 

                </div>
             ) 
            :(   
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center",width:"40%",height:"auto"}}> 
                     {reviews.map((data,index)=> (  
                        data.review !== "" && ( 
                        <Link style={{position:"relative",width:"100%",height:"auto",backgroundColor:"#202020",margin:"10px",borderRadius:"10px",textDecoration:"none"}} to={`/GameDetailPage/${data.games.game_id}/${data.games.game_name}`} state={{gameImage:data.games.game_image}} key={index}>   
                            <img style={{position:"absolute",width:"100%",height:"100%",objectFit:"cover",zIndex:1,filter: "brightness(30%)",borderTopLeftRadius:"10px",borderTopRightRadius:"10px"}} src={data.games.game_image}></img> 
                            <div style={{position: "relative",zIndex:5}}>  
                                
                                 <h1 style={{color:"white",padding:"10px"}}>{data.games.game_name}</h1> 
                              
                                <div style={{maxWidth:"100%",overflow:"hidden"}}>  
                                    <p style={{color:"white",padding:"10px",margin:0,marginTop:"20px"}}>{data.review}</p> 
                                    <p style={{margin:0,color:"grey",marginLeft:"10px"}}>{data.like_count} Likes</p>
                                </div> 
                                   
                                <div style={{display:"flex",padding:"10px",}}>  
                                    <img src={session.user_avatar} style={{width:"50px",height:"50px",borderRadius:"50%",objectFit:"cover"}}></img>  
                                    <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                                    <div style={{display:"flex",flexDirection:"column",marginLeft:"10px"}}> 
                                        <p style={{margin:0,marginBottom:"6px",color:"white"}}>{session.userName}</p>  
                                        <p style={{margin:0,color:"grey"}}>{new Date(data.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                                })}</p> 
                                       
                                    </div>  
                                    {data.user_id === session.userId && (   
                                        
                                        <FaTrash onClick={(e)=>{e.preventDefault();deleteReview(data.id) }} style={{cursor:"pointer"}} color="red"></FaTrash> 
                                    ) } 
                                    
                                    </div>
                                </div>
                                
                            </div> 
                        </Link>
                        )
                   
                ))}
                </div>
               
               
            )}
           
           
        </div>
    )
} 
export default ReviewsPage