import React from "react"; 
import { Link } from "react-router-dom";  
import { useLocation} from "react-router-dom";   
import { useState,useEffect,useContext,useRef,useCallback } from "react";
import axios from "axios";  
import { useParams } from "react-router-dom";
import "../styles/gameDetail.css";   
import { Rating } from "react-simple-star-rating"; 
import Modal from 'react-modal'; 
import { IoGameController } from "react-icons/io5"; 
import { FaHeart } from "react-icons/fa"; 
import { TbClockHour8Filled } from "react-icons/tb";
import { AuthContext } from "../provider/AuthProvider"; 
import { debounce, set } from 'lodash';  
import { GiPc } from "react-icons/gi";
import { SiMacos } from "react-icons/si";
import { FaPlaystation } from "react-icons/fa";  
import { FaXbox } from "react-icons/fa"; 
import { FaSteam } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";  
import { useNavigate } from "react-router-dom"; 
import avatar from "../images/avatar.png"; 
import { FaTrash } from "react-icons/fa";  
import blackScreen from "../images/black.jpg";
import { FaCircleCheck } from "react-icons/fa6"; 
import LeftLayout from "./LeftLayout";   


 function GameDetailPage() {  
    
    const { gameId,gameTitle } = useParams();   
    console.log(gameId)
    const navigate = useNavigate();  
    const { loggedIn,session } = useContext(AuthContext);   
    const [isOpen, setIsOpen] = useState(false); 
    const [isOpenList, setIsOpenList] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false); 
    const openList = () => setIsOpenList(true);
    const closeList = () => setIsOpenList(false);
    const location = useLocation();   
    const image = location.state.gameImage
   
    axios.defaults.withCredentials = true;
   
    console.log("aaa",location)  
    const [reviewInput, setReviewInput] = useState();
    const [showInput, setShowInput] = useState(false);
    const [gameData, setGameData] = useState(null);  
    const [reviews, setReviews] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [liked, setLiked] = useState(false); 
    const [played, setPlayed] = useState(false); 
    const [rating, setRating] = useState(null); 
    const [review, setReview] = useState("");   
    const [slider,setSlider] = useState();
    const isFirstRender = useRef(true); 
    const [series, setSeries] = useState(null);  
    const [userReview,setUserReview] = useState(null);
    const [listData, setListData] = useState([]); 
    const [listLoading, setListLoading] = useState(false); 
    const [isExist,setIsExist] = useState([]);  
    const [expand,setExpand] = useState(false) 
    const [stores,setStores] = useState([]); 
     const [posts,setPosts] = useState([]); 
     const [reviewsLoading,setReviewLoading] = useState(true);
  

      const getLists = async () => {   
       
        setListLoading(true);
        try { 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getList`, { 
                params: { userId: session.userId } 
            }); 
            console.log("List data:", response.data);
            setListData(response.data.data); 
            for (let list of response.data.data) {
               
                await getListGames(list.id); 
            }
            console.log("List data:", response.data);
        }catch(error) { 
            console.error('Error fetching list:', error); 
        }  
       
    } 
    const getListGames = async (listId) => { 
       
        try { 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getGameFromListbyUserId`, { 
                params: { listId: listId, gameId: gameId } 
            });  
           const exists = response.data.exists;  
           
            setIsExist((prev) => { 
                const alreadyExists = prev.some((item) => item.listId === listId);
                if (alreadyExists) return prev; 
                else return [...prev, { listId: listId, existing: exists }];
            } );
            console.log("List dataaaaa:", response.data);  
            
        }catch(error) { 
            console.error('Error fetching list:', error); 
        }  
        finally { 
            setListLoading(false); 
        }
       
    }  
    const insertGameToList = async (listId) => { 
        try {  
            const response = await axios.post(`${process.env.REACT_APP_BACKEND}/api/insertGameToList`, { 
                 
                    gameId: gameId,
                    listId:listId, 
                    gameName:gameData.name, 
                    gameImage:gameData.background_image, 
            } );
        }catch(error) { 
            console.error('Error inserting game to list:', error); 
        } 
    }
        
                

   console.log("isExist",stores)
  
    useEffect(()=>{ 
        setRating("") 
        setLiked(false) 
        setPlayed(false)  
        setLoading(true);
        const getGamebyId = async () => {  
            
            setLoading(true);       
            try{ 
                const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/gamebyId`, {
                    params: { gameId: gameId , gameName: gameTitle , gameImage:image } 
                });   
                console.log(response)
                setGameData(response.data.game); 
                setReviews(response.data.reviews); 
                setSlider(response.data.screenshots); 
                setSeries(response.data.series); 
                setUserReview(response.data.userReview);  
                setStores(response.data.stores); 
                setPosts(response.data.posts); 

                 
                
            }catch(error){ 
                console.error('Error getting game:', error); 
            }finally{ 
                setLoading(false)
            }
        };  
        getGamebyId();
    },[gameId]) 
     console.log("posts",posts)
    useEffect(()=>{ 
        const getReview = async (gameId, userId) => {  
            setReviewLoading(true);
            try{ 
                const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getReview`, { 
                    params: { gameId: gameId, userId: userId } 
                });  
                console.log("AAAA",response) 
                if(response.data.review !== null){ 
        
                    setRating(response.data.review.rating);
                    setReview(response.data.review.review); 
                    setLiked(response.data.review.liked); 
                    setPlayed(response.data.review.played); 
                } 
            }catch(error){ 
                console.error('Error getting review:', error); 
            }  finally{ 
                setReviewLoading(false);
            }
        } 
        if(loggedIn){
            getReview(gameId,session.userId);
        }
        
    },[loggedIn]);
     
    const deleteReview = async(reviewId) => { 
        try{ 
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND}/api/deleteReview`, { 
                params: { reviewId: reviewId } 
            }); 
          
            if(response.data.message === "Review deleted successfully"){  
                setUserReview(userReview.filter((data)=>data.id !== reviewId));
            }else{ 
                console.error("Error deleting review:", response.data.message); 
            } 
        }catch(error){ 
            console.error('Error deleting review:', error); 
        } 
    }
   

      const sentReview = async (gameId, userId, rating, review,liked,played) => {   
  
        try{  
            const response = await axios.post(`${process.env.REACT_APP_BACKEND}/api/sentReview`, { 
                gameId: gameId, 
                userId: userId, 
                rating: rating, 
                review: review, 
                liked:liked, 
                played:played,  
                
            });  
            
                 setUserReview((prev) => { 
                    const existingReview = prev.find((item) => item.id === response.data.data[0].id);

                    if (existingReview) { return prev.map((item) =>item.id === existingReview.id
                        ? { ...response.data.data[0], user: { id: session.userId, avatar_url: session.user_avatar, userName: session.userName } }
                                : item
                        ); 
                    } else { 
                        return [
                           
                            {
                                ...response.data.data[0],
                                user: {
                                    id: session.userId,
                                    avatar_url: session.user_avatar,
                                    userName: session.userName,
                                },
                            }, ...prev,
                        ]; 
                    } 
                });
            
         
            console.log("Response:", response);
        }catch(error){ 
            console.error('Error sending review:', error); 
        }
      }  

     
     console.log(session)
     
    useEffect(() => {  
       
        const timer = setTimeout(() => {
            if (session) {
              getLists();
            }
          }, 0);
            console.log("aaa",timer)
         
        
    },[])

       
      const handleRating = (rate) => {
        setRating(rate)
      }
     console.log(gameData)
  return (
    <div className="gameDetailPage">   
        <div style={{marginTop:"90px"}}>
            <LeftLayout></LeftLayout> 
        </div>
        {loading?(  
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                    <div className="spinner"></div>
                </div>
            ):( 
                <div style={{display:"flex",flexDirection:"column",width:"100%",alignItems:"center"}}>   
                    
                    <img className="backgroundImg"src={gameData.background_image}></img>  
                    <div style={{display:"flex",justifyContent:"space-around",width:"70%",marginTop:"40px",zIndex:"5",marginTop:"100px"}}> 
                
                        <div className="gameNameContainer">   
                            <div style={{display:"flex"}}>  
                                <div style={{backgroundColor:"white",borderRadius:"8px",paddingLeft:"10px",paddingRight:"10px",marginRight:"10px"}}> 
                                    <p style={{margin:0,color:"black"}}>{new Date(gameData.released).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                        })}</p>
                                </div>
                            {gameData.platforms.length > 0 && ( 
                                    gameData.platforms.map((data,index)=>(  
                                        <Link to={`/MainGamesPage/${data.platform.slug}`} state={{id:data.platform.id,name:data.platform.name}} style={{textDecoration:"none",color:"white"}}>
                                            <button style={{display:"flex",alignItems:"center",justifyContent:"space-between",backgroundColor:"transparent",border:"none",cursor:"pointer"}} key={index} > 
                                            
                            
                                                {data.platform.name === "PC" ? <GiPc size={30} color="white" /> : null}
                                                {data.platform.name === "macOS" ? <SiMacos size={30} color="white" /> : null}    
                                                {data.platform.name === "PlayStation 5" ? <FaPlaystation size={30} color="white" /> : null}   
                                                {data.platform.name === "Xbox Series S/X" ? <FaXbox size={27} color="white" /> : null}   
                                            
                                            </button>   
                                        </Link>
                                    
                                    ))
                            )}     
                           
                            </div>
                   
                      
                            <p style={{fontSize:"40px",margin:"20px 0px 10px 0px"}}>{gameData.name}</p>    
                            {gameData.publishers.length > 0 && ( 
                                <Link to={`/PublisherPage/${encodeURIComponent(gameData.publishers[0].slug)}`} state={{id:gameData.publishers[0].id,name:gameData.publishers[0].name}} style={{textDecoration:"none",color:"white",display:"flex",flexWrap:"wrap"}}>
                                    <p style={{ margin: 0, fontWeight: "bold" }}>{gameData.publishers[0].name}</p>
                                </Link> 
                            )}
                            
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"150px",margin:0,cursor:"pointer"}} onClick={()=>window.scrollTo(0, 600)}> 
                                <p style={{fontSize:"20px",marginRight:"10px",marginTop:"16px"}}>{Math.round(reviews[0].average_rating * 100) / 100}</p>
                                <Rating  size={"30px"} initialValue={Math.round(reviews[0].average_rating * 100) / 100} readonly={true}  /> 
                                <p style={{fontSize:"20px",marginRight:"5px",marginTop:"16px",marginLeft:15}}>{reviews[0].total_reviews}</p>  
                                <p style={{fontSize:"20px",marginTop:"16px"}}>Rating</p>
                            </div>    
                            <p style={{fontSize:"27px",padding:0,marginBottom:10,fontWeight:"bold"}}>About</p> 
                            <div style={{maxHeight:!expand?"120px":"300px",overflow:"hidden",width:"80%",borderBottom:"2px solid rgb(95, 125, 158)",marginBottom:"20px"}}>
                                <button style={{backgroundColor:"transparent",border:"0px",color:'white',textAlign:'start',fontFamily:"Segoe UI",fontSize:"14px"}} onClick={()=>setExpand(!expand)}> {gameData.description_raw}</button>
                            </div> 

                            <div className="gameratingContainer">   
                                {loggedIn ? (  
                                    <div> 
                                        <div className="gamePlayedContainer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"10%",width:"100%",borderBottom:"3px solid rgb(95, 125, 158)"}}>   
                                    <div> 
                                        <button style={{cursor:"pointer"}}  onClick={()=>setPlayed(!played)}>  
                                            {played ? <IoGameController size={50} color="green" /> : <IoGameController size={50} color="white" />}
                                        </button>  
                                        <p>Played</p>
                                    </div>
                                    <div>
                                        <button style={{cursor:"pointer"}} onClick={()=>setLiked(!liked)}>  
                                            {liked ? <FaHeart size={50} color="red"  /> : <FaHeart size={50} color="white" />}
                                        </button>   
                                        <p>Liked</p>
                                    </div> 
                                    <div > 
                                        <button style={{cursor:"pointer"}}  onClick={openList}> 
                                            <TbClockHour8Filled size={50}  className="clock" />
                                        </button>  
                                        <p>PlayList</p>
                                    </div> 
                                        <Modal 
                                        isOpen={isOpenList} 
                                        onRequestClose={closeList} 
                                        contentLabel="Information Modal"
                                        ariaHideApp={false} 
                                        className="modal-content"
                                        overlayClassName="modal-overlay"
                                    >    
                                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginLeft:"10px"}}>
                                        <p>Your Lists</p> 
                                        <button className="create" onClick={()=>navigate("/list/new")}>Create New List</button> 
                                    </div>
                                    {listLoading ? (  
                                        <p></p>
                                        ):( 
                                            listData.map((list,index)=>(  
                                                <div className="lists" key={index}>  
                                                
                                                    <div style={{display:"flex",alignItems:"center",width:"90%"}}>
                                                        <div className="listContainer">                                      
                                                            <div className="imageCover"> <img src={list.first_four_images && list.first_four_images.length > 0 ? list.first_four_images[0] : blackScreen }  /></div> 
                                                            <div className="imageCover"> <img src={list.first_four_images && list.first_four_images.length > 1 ? list.first_four_images[1] : blackScreen }  /></div> 
                                                            <div className="imageCover"><img src={list.first_four_images && list.first_four_images.length > 2 ? list.first_four_images[2] : blackScreen }  /></div> 
                                                            <div className="imageCover"><img src={list.first_four_images && list.first_four_images.length > 3 ? list.first_four_images[3] : blackScreen }  /></div>                                       
                                                        </div>  
                                                        <p>{list.name}</p>  
                                                    </div>  
                                                    
                                                    {isExist.map((item, index) => (
                                                        <div key={index}> 
                                                            {item.listId === list.id  ? (  
                                                                item.existing ? (  
                                                                    <FaCircleCheck className="check" size={30} color="green"/>
                                                                ):( 
                                                                    <div style={{height:"30px",width:"30px",border:"1px solid black",borderRadius:"50%"}} onClick={() =>{
                                                                        setIsExist((prevState) =>
                                                                            prevState.map((stateItem) =>
                                                                                stateItem.listId === item.listId
                                                                                    ? { ...stateItem, existing: true }
                                                                                    : stateItem
                                                                            )
                                                                        );insertGameToList(item.listId);}
                                                                    }></div>
                                                                ) 
                                                                    
                                                                ):null}
                                                        </div>
                                                    ))}
                                                </div>
                                                ))
                                        
                                        )}
                                    
                                        
                                    </Modal>
                                
                                </div> 
                                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:"10px"}}> 
                                    <Rating  size={"30px"} initialValue={rating} onClick={(rate)=>{handleRating(rate);setShowInput(true);setPlayed(true)}}/>  
                                    <p style={{margin:4,color:"#CED2D7"}}>Rated</p> 
                                </div>  
                            
                                <Modal 
                                    isOpen={showInput} 
                                    onRequestClose={closeModal} 
                                    contentLabel="Information Modal"
                                    ariaHideApp={false} 
                                    className="modal-content"
                                    overlayClassName="modal-overlay"
                                >
                                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>  
                                    <p>Write your comment here</p>
                                    <textarea onChange={(e)=>setReviewInput(e.target.value)}style={{width:"80%",height:"150px",backgroundColor:"#171719",color:'white',fontFamily:"monospace" }}></textarea>  
                                    <button onClick={()=>{sentReview(gameId,session.userId,rating, reviewInput,liked,played);setShowInput(false)}}style={{margin:10,backgroundColor:'green',border:"none",borderRadius:"10px",fontSize:"15px",color:"white",width:"80px",height:"30px "}}>Save</button>
                                </div>
                                </Modal>
                                    </div>
                                    
                                ) 
                                : ( 
                                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",maxWidth:"150px"}}> 
                                        <button style={{backgroundColor:"transparent",border:"none",fontSize:"15px",color:"grey",padding:"6px",cursor:"pointer"}}>You must log in or register to comment.</button>
                                    </div>
                                )}
                        

                        
                    </div>
                            <div className="updetailContainer">  
                                <div className="detailContainer"> 
                                    <p className="detailHeaders">Platforms</p>  
                                    <div style={{display:"flex",flexWrap:"wrap"}}>
                                    {gameData.platforms.map((data,index)=>(   
                                        index<gameData.platforms.length-1 ? ( 
                                            <Link to={`/MainGamesPage/${data.platform.slug}`} style={{color:"grey"}}>
                                            
                                                <p style={{margin:0,padding:2,fontSize:"14px"}}>{data.platform.name},</p> 
                                            
                                            </Link>
                                        ) : ( 
                                            <Link style={{color:"grey"}}>
                                            
                                                <p style={{margin:0,padding:2,fontSize:"14px"}}>{data.platform.name}</p> 
                                            
                                            </Link>
                                        )
                                        
                                    
                                    ))} 
                                    </div> 
                                </div> 
                                <div className="detailContainer"> 
                                    <p className="detailHeaders">Genres</p>  
                                    <div style={{display:"flex",flexWrap:"wrap"}}>
                                    {gameData.genres.map((data,index)=>(   
                                        index<gameData.genres.length-1 ? ( 
                                            <Link  to={`/games/${data.slug}`}  style={{color:"grey"}}>
                                            
                                                <p style={{margin:0,padding:2,fontSize:"14px"}}>{data.name},</p> 
                                            
                                            </Link>
                                        ) : ( 
                                            <Link to={`/games/${data.slug}`} style={{color:"grey"}}>
                                            
                                                <p style={{margin:0,padding:2,fontSize:"14px"}}>{data.name}</p> 
                                            
                                            </Link>
                                        )
                                        
                                    
                                    ))} 
                                    </div> 
                                </div> 
                            </div>  
                            <div className="updetailContainer">  
                                <div className="detailContainer"> 
                                    <p className="detailHeaders">Release Date</p>  
                                    <p style={{margin:0,padding:2,fontSize:"14px"}}>{new Date(gameData.released).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                        })}</p>
                                </div> 
                                <div className="detailContainer"> 
                                    <p className="detailHeaders">Developer</p>  
                                    <div style={{display:"flex"}}>
                                    {gameData.developers.map((data,index)=>(   
                                        index<gameData.developers.length-1 ? ( 
                                            <Link to={`/developer/${data.slug}`} style={{color:"grey"}}>
                                            
                                                <p style={{margin:0,padding:2,fontSize:"14px"}}>{data.name},</p> 
                                            
                                            </Link>
                                        ) : ( 
                                            <Link  to={`/developer/${data.slug}`} style={{color:"grey"}}>
                                            
                                                <p style={{margin:0,padding:2,fontSize:"14px"}}>{data.name}</p> 
                                            
                                            </Link>
                                        )
                                        
                                    
                                    ))} 
                                    </div> 
                                </div> 
                            </div>  
                            <div className="updetailContainer">  
                                <div className="detailContainer"> 
                                    <p className="detailHeaders">Publisher</p>  
                                    {gameData.publishers.map((data,index)=>(   
                                        index<gameData.publishers.length-1 ? ( 
                                            <Link  to={`/publishers/${data.slug}`}  style={{color:"grey"}}>
                                            
                                                <p style={{margin:0,padding:2,fontSize:"14px"}}>{data.name},</p> 
                                            
                                            </Link>
                                        ) : ( 
                                            <Link to={`/publishers/${data.slug}`} style={{color:"grey"}}>
                                            
                                                <p style={{margin:0,padding:2,fontSize:"14px"}}>{data.name}</p> 
                                            
                                            </Link>
                                        )
                                        
                                    
                                    ))} 
                                </div>  
                               
                                <div className="detailContainer"> 
                                    <p className="detailHeaders">Age Rating</p>  
                                    <div style={{display:"flex"}}> 
                                        {gameData.esrb_rating === null ?  ( 
                                                <p style={{margin:0,padding:2,fontSize:"14px"}}>Not Rated</p>
                                        ) : ( 
                                            <p style={{margin:0,padding:2,fontSize:"14px"}}>{gameData.esrb_rating.name}</p>
                                        )}
                                      
                                    </div> 
                                </div> 
                            </div> 
                            <div style={{width:"80%",display:"flex",flexDirection:"column"}}> 
                                    <p className="detailHeaders">Tags</p>  
                                    <div style={{display:"flex",flexWrap:"wrap"}}> 
                                        {gameData.tags.map((data,index)=>( 
                                          
                                          <Link to={`/tags/${data.slug}`} style={{color:"grey"}}>
                                                <p style={{margin:0,fontSize:"14px"}}>{data.name},</p> 
                                        
                                            </Link>
                                        ))}
                                               
                                      
                                    </div> 
                            </div>  
                            {gameData.website !== null && (  
                                <div style={{width:"80%",display:"flex",flexDirection:"column"}}> 
                                <p className="detailHeaders">Website</p>  
                                <div style={{display:"flex",flexWrap:"wrap"}}>  
                                    <Link to={gameData.website} style={{color:"grey"}}>  
                                        <p  style={{margin:0,fontSize:"14px"}}>{gameData.website}</p> 
                                        
                                    </Link>
                                   
                                           
                                  
                                    </div> 
                            </div>

                            )}
                             
                           
                        </div>   
                        <div style={{width:"40%",height:"auto"}}>  
                        {slider.results.length > 0 && (  
                            <div style={{width:"100%",height:"%100"}}>  
                                <img style={{width:"100%",height:"200px",borderRadius:"8px",objectFit:"cover"}} src={slider.results[0].image}></img>
                                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",width:"100%",gap:"10px"}}>   
                                    {slider.results.map((data, index) => ( 
                                        index>0&&( 
                                            <div key={index}>       
                                                <img style={{width:"100%",height:"100%",borderRadius:"8px"}} src={data.image} alt={`Fotoğraf ${index + 1}`} />
                                            </div> 
    
                                        )
                                        
                                    ))}  
                                </div>
                            </div> 
                          

                        )}   
                        {gameData.stores.length > 0 && (  
                            <div style={{ display: "flex", flexDirection: "column" }}>
                            <p style={{ fontSize: "18px", color: "grey" }}>Where to Buy</p> 
                            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",width:"100%",gap:"10px"}}> 
                                {gameData.stores.map((storeItem) => {
                                    const matchedUrlObj = stores.results.find(
                                    (urlItem) => urlItem.store_id === storeItem.store.id); 
                                    return (
                                    <Link key={storeItem.id} to={matchedUrlObj.url} style={{display:"flex", color: "white",textDecoration:"none",alignItems:"center" }}>
                                            
                                            {storeItem.store.name === "PC" ? <GiPc size={30} color="white" /> : null}
                                            {storeItem.store.name=== "Steam" ? <FaSteam size={30} color="white" /> : null}    
                                            {storeItem.store.name === "PlayStation Store" ? <FaPlaystation size={30} color="white" /> : null}
                                            {storeItem.store.name === "Epic Games" ? <SiEpicgames size={30} color="white" /> : null}   
                                            {storeItem.store.name === "Xbox Store" ? <FaXbox size={30} color="white" /> : null}  
                                            <p style={{margin:5}}>{storeItem.store.name} </p>
                                            
                                            
                                    </Link>
                                    );
                                })} 
                            </div>
                        </div>

                        )} 
                        {posts.length > 0 && (  
                            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",marginTop:"20px"}}> 
                                <p style={{fontSize:"20px",color:"white"}}>Latest Posts</p>
                                <div style={{width:"100%",gap:"10px"}}> 
                                    {posts.map((data,index)=>(  
                                        <Link to={`/c/comment/${data.id}`} className="game-post-link2"  key={index}>   
                                            <Link className="game-post-link" to={`/c/${data.community.id}`} >
                                                <img style={{width:"30px",borderRadius:"50%"}} src={data.community.icon_image}></img>
                                                <p>/{data.community.name}</p> 
                                            </Link>  
                                            <p style={{margin:0,marginTop:"5px"}}>{data.title}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    
                       </div>  
                        
                      
                    </div>
                  
                   
                    
                   {series.results.length !== 0 && (   
                    <div style={{marginTop:"50px"}}> 
                        <p style={{margin:0,color:"White",borderBottom:"2px solid grey",fontSize:"20px"}}>Game Series</p>
                        <div className="seriesContainer">  
                            
                            {series.results.map((data,index)=>(  
                                <Link className="serieslink" to={`/GamedetailPage/${data.id}/${data.slug}`} state={{ gameImage: data.background_image }}key={index} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"white",backgroundColor:"transparent",border:"none",cursor:"pointer",textDecoration:"none",marginLeft:"10px"}}> 
                                    <div style={{height:"60px"}}>  
                                        <p style={{fontSize:"15px",marginTop:20,color:"grey"}}>{data.name}</p> 
                                    </div> 
                                    <img src={data.background_image} alt={`Fotoğraf ${index + 1}`} />
                                </Link>
                                ))}
                        </div> 
                    </div>
                    )}   
                  
                        { userReview !== null && ( 
                        <div style={{width:"55%",marginTop:"50px",justifyContent:"center",alignItems:"center",marginBottom:"50px"}}>  
                            <p style={{borderBottom:"2px solid grey",color:"white",fontSize:"20px"}}>Reviews</p>
                            {userReview.map((data,index)=>(  
                                <div key={index} style={{display:"flex",alignItems:"center",justifyContent:"flex-start",width:"100%",borderBottom:"0.5px solid grey",marginTop:"20px",paddingBottom:"20px"}}>  
                                    <Link to={`/user/${data.user.userName}`} style={{width:"100px",textDecoration:"none"}}>
                                        <img style={{width:"60px",height:"60px",objectFit:"cover",objectPosition:"center",borderRadius:"50%"}} src={data.user.avatar_url?data.user.avatar_url:avatar  }></img>
                                    </Link> 
                                    <div>
                                        <div style={{display:"flex",alignItems:"center",justifyContent:"flex-start",width:"100%",marginBottom:"10px"}}>
                                            <p style={{margin:0,color:"grey"}}>Reviewed by </p>  
                                            <Link to={`/user/${data.user.userName}`} style={{textDecoration:"none",marginRight:"10px"}}> 
                                                <p style={{margin:0,color:"white",marginLeft:"5px"}}> {data.user.userName}</p>
                                            </Link> 
                                            
                                            <Rating  size={"30px"} initialValue={data.rating} readonly={true}  />  
                                        </div>  
                                        
                                        <p style={{margin:0,color:"#99c9c9"}}>{data.review}</p> 
                                       
                                    </div>  
                                     <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100px",marginLeft:"auto"}}>   
                                     
                                     {session && data.user_id === session.userId && (  
                                        <button style={{backgroundColor:"transparent",border:"none",cursor:"pointer"}} onClick={()=>deleteReview(data.id)} >
                                            <FaTrash color="red" size={15} /> 
                                        </button>
                                        )}
                                        <p style={{color:"grey"}}>{new Date(data.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                ))}
                        </div>
                    )

                        }
                   
                </div> 
                
            )}
     
    </div>
  );
} 
export default GameDetailPage;