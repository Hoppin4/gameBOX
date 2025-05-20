import React from 'react'; 
import {  useParams } from 'react-router-dom';
import axios from 'axios'; 
import { useEffect,useState } from 'react'; 
import "../styles/publisherPage.css"; 
import { GiPc } from "react-icons/gi";
import { SiMacos,SiIos } from "react-icons/si";
import { FaPlaystation } from "react-icons/fa";  
import { FaXbox } from "react-icons/fa"; 

import { Link } from 'react-router-dom';  
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';  
import { BsAndroid, BsNintendoSwitch } from "react-icons/bs";  
import LeftLayout from './LeftLayout';
 




 function PublisherPage() {  
    const { slug } = useParams(); 
    const [moreLoading,setMoreLoading] = useState(false)
    const [data, setData] = useState([])    
    const [page,setPage]= useState(1);
    const [loading, setLoading] = useState(true); 
    const [hasMore, setHasMore] = useState(true);
    axios.defaults.withCredentials = true;

    
     
    const fetchData = async () => {    
        setMoreLoading(true)
        try{  
            
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/publisher`, {
                params: {
                  publishers: slug, 
                  page:page,
                 
                }
              });   
              if(data.length === 0) { 
                setData(response.data.results); 
              }else{ 
                setData(prevData => [...prevData,...response.data.results]); 
              }
              
              
        }catch(error){ 
            console.error('Error fetching data:', error);  
            setHasMore(false);
        } 
        finally { 
            setLoading(false); 
            setMoreLoading(false) 
        }
        
    } 
    useEffect(() => {  
        
        fetchData(); 
    }, [page]);   


    function slugToTitle(slug) {
        return slug
          .replace(/-/g, ' ')                     
          .toLowerCase()                          
          .replace(/\b\w/g, char => char.toUpperCase()); 
      } 
      const title = slugToTitle(slug); 
    
      console.log(title);
  return (
    <div className='main'>  
         <LeftLayout></LeftLayout>
        {loading ? ( 
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
            <div className="spinner"></div>
        </div>
        ) : 
        ( 
            <div className="main-container">   
            <div style={{display:"flex",justifyContent:"space-between", width:"100%"}}> 
            <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",alignItems:'flex-end' ,width:"86.5%",marginLeft:"13.5%"}}>
            <div style={{width:"100%"}}>
                    <p style={{color:"white",fontSize:"30px",margin:0,marginTop:"5px",marginBottom:"10px"}}>{title} Games</p>
            </div>
            <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"auto",borderTop:"2px grey solid",marginTop:"15px"}}> 
                <div className="games-grid"> 
                    {data.map((item,index)=>(   
                        <div className="game-card" key={index}>   
                            <Link style={{textDecoration:"none"}} state={{gameImage:item.background_image}} to={`/GameDetailPage/${item.id}/${item.name}`}> 
                            <div className="gameItemImg-wrapper">
                                <img src={`${item.background_image}?w=300&q=50`} className="gameItemImg" loading="lazy"></img>  
                                {item.short_screenshots !== null && (  
                                     <div className="carousel-container"> 
                                     <div style={{width:"100%",height:"100%"}}>
                                         <Swiper
                                             modules={[Pagination]}
                                             pagination={{ clickable: true }} 
                                             spaceBetween={10}
                                             slidesPerView={1}
                                             >
 
                                                 {item.short_screenshots.map((img, idx) => (
                                             idx > 0 && ( 
                                                 <SwiperSlide style={{width: '100%', height: '100%'}} key={idx}>
                                                    <img src={`${img.image}?w=300`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                                 </SwiperSlide>
                                             )
                                             ))}
                                             
                                         </Swiper>
                                     </div>
                                 </div>

                                )} 
                                 
                            </div> 
                            {item.platforms !==null && item.platforms.length > 0 && ( 
                                <div style={{display:"flex"}}> 
                                <div className="icon-container">
                                {item.platforms.map((item,index)=>(  
                                    <div>
                                        {item.platform.id === 5 ? <SiMacos size={20} color="white" /> : null} 
                                        {item.platform.id === 4 ? <GiPc size={20} color="white" /> : null}  
                                        {item.platform.id === 187 ? <FaPlaystation size={20} color="white" /> : null}   
                                        {item.platform.id === 186 ? <FaXbox size={17} color="white" /> : null}   
                                        {item.platform.id === 7 ? <BsNintendoSwitch size={18} color="white" /> : null}  
                                        {item.platform.id === 3 ? <SiIos size={18} color="white" /> : null}  
                                        {item.platform.id === 21 ? <BsAndroid size={18} color="white" /> : null} 
                                    </div>  
                                    
                                ))}  
                                </div>  
                                <div >
                                {item.metacritic !== null && (  
                                   <div
                                   style={{
                                                backgroundColor: item.metacritic > 75 
                                                ? "#008000"  
                                                : (item.metacritic >= 50 && item.metacritic <= 75) 
                                                ? "#FFFF00" 
                                                : "#FF0000" , 
                                                paddingBottom:"1px", 
                                                paddingTop:"1px",
                                                borderRadius: "5px",
                                                paddingLeft: "7px",
                                                paddingRight: "7px", 
                                                marginTop:"5px"
                                            }}
                                            > 
                                        <p style={{
                                        color: "white",padding:0,margin:4
                                      }}>{item.metacritic}</p>
                                    </div>
                                    
                                )}  
                                </div> 
                                
                             </div>  

                            )}
                            
                            <p  className="gameName"style={{fontSize: item.name.length > 20 ? '14px' : '18px'}}>{item.name}</p> 
                           
                            <div className="extra-container">  
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px"}}> 
                                    <p style={{color:"grey",fontSize:"12px"}}>Release Date: </p>   
                                    <p style={{color:"white",fontSize:"12px"}}>{new Date(item.released).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                        })}</p>
                                </div>
                                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px"}}>
                                    <p style={{color:"grey",fontSize:"12px",width:"50%"}}>Genres:</p> 
                                        {item.genres.map((data,index)=>( 
                                            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}> 
                                                <p style={{color:"white",fontSize:"12px",padding:"2px"}}>{data.name}</p>
                                            </div>
                                        ))} 
                                    </div>
                                
                            </div> 
                            </Link> 
                        </div>  
                    ))}  
                    
                </div>   
                {hasMore && ( 
                     <div className="load-more-button">
                     {!moreLoading ?  (
                     <button onClick={()=>{setPage((prev)=>prev+1)}}>Load More</button> 
                     ) : ( 
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                            <div className="spinner"></div>
                        </div>
                     )}
                 </div>  

                )}
                  
            </div>
            

           
            </div>  
            </div> 
        </div>
        )}
     
    </div>
  );
} 
export default PublisherPage;