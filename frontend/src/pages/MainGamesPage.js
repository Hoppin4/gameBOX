import { useEffect, useState,useContext ,useRef} from "react";
import React from "react" 
import axios from "axios" 
import "../styles/mainGamesPage.css";  
import { AuthContext } from "../provider/AuthProvider";  
import { Link, useParams } from "react-router-dom"; 
import { GiPc } from "react-icons/gi";
import { SiIos, SiMacos } from "react-icons/si";
import { FaPlaystation } from "react-icons/fa";  
import { FaXbox } from "react-icons/fa"; 
 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import LeftLayout from "./LeftLayout"; 

import { BsAndroid, BsNintendoSwitch } from "react-icons/bs"; 

function MainGamesPage(){    
    const { slug } = useParams();

axios.defaults.withCredentials = true;
const [popularGames, setpopularGames] = useState([]);
const [hasMore, setHasMore] = useState(true);
const supportedSlugs = ['pc', 'playstation5', 'xbox-one', 'nintendo-switch', 'ios', 'android','xbox-series-x','macos','playstation4'];
const [loading, setLoading] = useState(true);
const [moreLoading, setMoreLoading] = useState(false);
const [page, setPage] = useState(1);
const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
const formatDate = (date) => date.toISOString().split("T")[0];
const startDate = formatDate(lastMonth);
const endDate = formatDate(today);
const [selected, setSelected] = useState("Popularity");
const [order, setOrder] = useState("reviews_count");
const previousSlug = useRef(slug);
const previousOrder = useRef(order);
const previousPage = useRef(page);
const [isFetching, setIsFetching] = useState(false);

const lastWeek = new Date();
const nextWeek1 = new Date();
lastWeek.setDate(today.getDate() + 7);
nextWeek1.setDate(today.getDate() + 14);
const startWeek = formatDate(lastWeek);
const nextWeek = formatDate(nextWeek1);
const [sliderRef, setSliderRef] = useState(null);

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  lazy: true,
  appendDots: dots => <ul style={{ color: "white" }}>{dots}</ul>,
  customPaging: i => (
    <div
      onMouseEnter={() => sliderRef?.slickGoTo(i)}
      style={{
        width: "10px",
        height: "10px",
        background: "#fff",
        cursor: "pointer",
      }}
    />
  )
};

const fetchData = async (currentPage, currentSlug, currentOrder) => {
  if (isFetching) return;
  setIsFetching(true);
  setMoreLoading(true);
  
  try {
    
    let response;
    if (currentSlug === 'month-trending') {
      response = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/api/popularGames", {
        params: { startDate, endDate, search: null, page: currentPage, order: currentOrder }
      });
    } else if (currentSlug === 'best-of-the-year') {
      response = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/api/popularGames", {
        params: { startDate: "2025-01-01", endDate: "2025-12-31", search: null, page: currentPage, order: currentOrder }
      });
    } else if (currentSlug === 'this-week') {
      response = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/api/popularGames", {
        params: { startDate: endDate, endDate: startWeek, search: null, page: currentPage, order: currentOrder }
      });
    } else if (currentSlug === 'all-time-top') {
      response = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/api/getMostPopular", {
        params: { page: currentPage }
      });
    } else if (currentSlug === 'next-week') {
      response = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/api/popularGames", {
        params: { startDate: startWeek, endDate: nextWeek, search: null, page: currentPage, order: currentOrder }
      });
    } else if (supportedSlugs.includes(currentSlug)) {
      let platform = 0;
      if (currentSlug === 'pc') {
        platform = 4;
      } else if (currentSlug === 'playstation5') {
        platform = 187;
      } else if (currentSlug === 'xbox-series-x') {
        platform = 186;
      } else if (currentSlug === 'nintendo-switch') {
        platform = 7;
      } else if (currentSlug === 'ios') {
        platform = 3;
      } else if (currentSlug === 'android') {
        platform = 21;
      }else if(currentSlug === 'xbox-one'){ 
        platform = 1;
      }else if(currentSlug === 'playstation4'){ 
        platform =18;
      }else if(currentSlug === 'macos'){ 
        platform =5;
      }
      
      response = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/api/platforms", {
        params: { platforms: platform, page: currentPage, order: currentOrder }
      });
    } else {
     
      setIsFetching(false);
      setMoreLoading(false);
      setLoading(false);
      return;
    }
    
    if (response.data.count < 20) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    
    if (currentPage === 1) {
      setpopularGames(response.data.results);
    } else {
      setpopularGames((prev) => {
        const newGames = response.data.results.filter(
          (item) => !prev.some((existing) => existing.id === item.id)
        );
        return [...prev, ...newGames];
      });
    }
    
  } catch (error) {
    console.error('Error fetching games:', error);
    setHasMore(false);
  } finally {
    setLoading(false);
    setMoreLoading(false);
    setIsFetching(false);
  }
};


useEffect(() => {
  console.log("Slug or order changed:", slug, order);
  setLoading(true);
  setpopularGames([]);
  setPage(1);
  

  const timer = setTimeout(() => {
    if (slug) {
      fetchData(1, slug, order);
    }
  }, 0);
    console.log("aaa",timer)
  return () => clearTimeout(timer);
}, [slug, order]);


useEffect(() => {
 
  if (previousSlug.current !== slug || previousOrder.current !== order) {
    previousSlug.current = slug;
    previousOrder.current = order;
    return;
  }
  
 
  if (page > 1) {
    fetchData(page, slug, order);
  }
  
  previousPage.current = page;
}, [page]);


    
    return( 
        <div className="main">     
             <LeftLayout></LeftLayout>
            {loading?(  
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                    <div className="spinner"></div>
                </div>

            ) : (   
                <div className="main-container">   
                    <div style={{display:"flex",justifyContent:"space-between", width:"100%"}}> 
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",alignItems:'flex-end' ,width:"86.5%",marginLeft:"13.5%"}}>
                    <div style={{width:"100%"}}>
                        <p style={{color:'white',fontSize:"50px",marginBottom:"20px"}}> {slug === 'month-trending' ? 'Trending this month' :
                            slug === 'all-time-top' ? 'All time Bests' :
                            slug === 'next-week' ? 'Next Week' :
                            supportedSlugs.includes(slug) ? 'Platforms game' :  
                            slug === 'best-of-the-year' ? 'Best of the 2025' :
                            ''} 
                        </p>    
                        <div class="dropdown"> 
                            <div className="dropbtn">
                                <p style={{margin:0}}>Order by: </p> 
                                <p style={{margin:0,marginLeft:"5px",fontWeight:"bold"}}> {selected}</p>  
                                <p style={{margin:0,marginLeft:"5px"}}>-</p>
                            </div>
                            <div class="dropdown-content" >
                                <p  className={selected === "Popularity" ? "active" : ""} onClick={()=>{setSelected("Popularity");setOrder("reviews_count")}}>Popularity</p>
                                <p className={selected === "Name" ? "active" : ""} onClick={()=>{setSelected("Name");setOrder("name");}}>Name</p>
                                <p  className={selected === "Release Date" ? "active" : ""} onClick={()=>{setSelected("Release Date");setOrder("-released");}}>Release Date</p>
                            </div>
                        </div>
                    </div>
                    <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"auto",borderTop:"2px grey solid",marginTop:"15px"}}> 
                        <div className="games-grid"> 
                            {popularGames.map((item,index)=>(   
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
    )

} 
export default React.memo(MainGamesPage)