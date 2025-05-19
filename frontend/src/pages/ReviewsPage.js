import React, { useEffect,useContext } from "react"; 
import LeftLayout from "./LeftLayout";  
import { useState} from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";
import { FaTrash } from "react-icons/fa"; 
import { AuthContext } from "../provider/AuthProvider";


function ReviewsPage(){    
     const { session, } = useContext(AuthContext); 
    axios.defaults.withCredentials = true; 
    const { id } = useParams();  
    const [limit, setLimit] = useState(20) 
    const [loading,setLoading] = useState(true); 
    const [reviews,setReviews] = useState([]); 
    const [hasMore,setHasMore] = useState(true)
     
    const getReview = async()=>{ 
        try{ 
            const response = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/api/getUserReviews",{
                params: { userId:id, limit:limit } 
            });   
            const reviews = response.data.response.data; 
           
            const enrichedReviews = await Promise.all(
                reviews.map(async (review) => {
                  try {
                    const gameRes = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/api/getReviewComp", {
                      params: { gameId: review.game_id },
                    });
                   
                    const gameData = gameRes.data.response.data;
          
                    return {
                      ...review,
                      game_name: gameData.game_name,
                      game_picture: gameData.game_image,
                    };
                  } catch (err) {
                    console.log(err)
                    return review; 
                  }
                })
              );
          
            
              setReviews((prev) => {
                const newReviews = enrichedReviews.filter(
                  (item) => !prev.some((existing) => existing.id === item.id)
                );
                return [...prev, ...newReviews];
              }); 
              
        }catch(error){ 
            console.error('Error fetching session:', error);  
           
        }finally{ 
            setLoading(false) 
        }
    }   
    const deleteReview = async(reviewId) => { 
        try{ 
            const response = await axios.delete("https://moviebox2-1084798053682.europe-west1.run.app/api/deleteReview", { 
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
    console.log("reviews",reviews)
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
                        <div style={{position:"relative",width:"100%",height:"auto",backgroundColor:"#202020",margin:"10px",borderRadius:"10px"}}>   
                            <img style={{position:"absolute",width:"100%",height:"50%",objectFit:"cover",zIndex:1,filter: "brightness(40%)",borderTopLeftRadius:"10px",borderTopRightRadius:"10px"}} src={data.game_picture}></img> 
                            <div style={{position: "relative",zIndex:5}}> 
                                <h1 style={{color:"white",padding:"10px",}}>{data.game_name}</h1> 
                                <div style={{maxWidth:"100%",overflow:"hidden"}}>  
                                    <p style={{color:"white",padding:"10px"}}>{data.review}</p>
                                </div> 
                                   
                                <div style={{display:"flex",padding:"10px",}}>  
                                    <img src={data.user_avatar} style={{width:"50px",height:"50px",borderRadius:"50%",objectFit:"cover"}}></img>  
                                    <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                                    <div style={{display:"flex",flexDirection:"column",marginLeft:"10px"}}> 
                                        <p style={{margin:0,marginBottom:"6px",color:"white"}}>{data.user_name}</p> 
                                        <p style={{margin:0,color:"grey"}}>{new Date(data.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                                })}</p> 
                                       
                                    </div>  
                                    {data.user_id === session.userId && ( 
                                        <FaTrash onClick={()=>{deleteReview(data.id) }} style={{cursor:"pointer"}} color="red"></FaTrash> 
                                    ) } 
                                    
                                    </div>
                                </div>
                                
                            </div> 
                        </div>
                        )
                   
                ))}
                </div>
               
               
            )}
           
           
        </div>
    )
} 
export default ReviewsPage