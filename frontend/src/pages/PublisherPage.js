import React from 'react'; 
import { useLocation } from 'react-router-dom';
import axios from 'axios'; 
import { useEffect,useState,useRef } from 'react'; 
import "../styles/publisherPage.css"; 
import { GiPc } from "react-icons/gi";
import { SiMacos } from "react-icons/si";
import { FaPlaystation } from "react-icons/fa";  
import { FaXbox } from "react-icons/fa"; 
import { FaSteam } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si"; 
import { FaAppStoreIos } from "react-icons/fa";  
import { Link } from 'react-router-dom'; 



 function PublisherPage() {  
    const location = useLocation(); 
    const { id, name } = location.state || {};
    console.log(name);
    const [data, setData] = useState([])    
    const [page,setPage]= useState(1);
    const [loading, setLoading] = useState(true); 
    const [hasMore, setHasMore] = useState(true);
    axios.defaults.withCredentials = true;
    console.log(id);   
    const scrollPosition = useRef(0);
    
     
    const fetchData = async () => {    
        setLoading(true);
        try{  
            
            const response = await axios.get("http://localhost:5000/api/publisher", {
                params: {
                  publishers: id, 
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
        }
        
    } 
    useEffect(() => { 
        fetchData(); 
    }, [page]);   
    useEffect(() => {
        window.scrollTo(0, scrollPosition.current);  
      }, [data]); 

    const loadMore = () => {
        if (!loading && hasMore) { 
            scrollPosition.current = window.scrollY; 
          setPage(prevPage => prevPage + 1); 
           
        }
      }; 
      console.log(data);
  return (
    <div className='publisherPage'> 
        {loading ? ( 
            <div> 

            </div>
        ) : 
        ( 
            <div className='publisherPageContent'>  
                <div style={{borderBottom:"1px solid grey",}}> 
                    <h1 style={{color:"white"}}>{name}</h1> 
                </div>
                 
                 {data && data.map((item) => (  
                    <Link to={`/GameDetailPage/${item.id}`} state={{ gameId: item.id,gameTitle: item.name }} style={{textDecoration:"none",color:"white",width:"65%"}} >
                    <div className='publisherPageContentItem' key={item.id} >  
                        <div style={{width:"30%",height:"150px",overflow:"hidden"}}>
                            <img style={{marginRight:"20px"}} src={item.background_image} />  
                        </div>  
                        <div style={{width:"60%",display:"flex",flexDirection:"column",marginLeft:"20px"}}>  
                            <div style={{display:"flex",alignItems:"center"}}> 
                                <h2 style={{marginRight:"20px",color:"white"}}>{item.name}</h2>  
                                <p style={{color:"grey"}}>{item.released}</p>  
                                
                            </div>   
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",flexWrap:"wrap"}}>  
                                {item.genres.map((data,index)=>(   
                                    <div style={{backgroundColor:"grey",padding:0,margin:0,height:"auto",borderRadius:"5px",width:"fit-content",marginRight:"5px"}} key={index}> 
                                        <p key={index} style={{backgroundColor:"transparent",border:"none",margin:10}}>{data.name}</p>
                                    </div>
                                ))}
                            </div> 
                        </div>
                       
                        <div style={{display:"flex",flexDirection:"column"}}> 
                            {item.platforms.map((data,index)=>(                                           
                                <div style={{display:"flex",backgroundColor:"transparent",border:"none",marginBottom:"2px"}} key={index}>                                                               
                                    {data.platform.name === "PC" ? <GiPc size={30} color="white" /> : null}
                                    {data.platform.name === "macOS" ? <SiMacos size={30} color="white" /> : null}    
                                    {data.platform.name === "PlayStation 4" ? <FaPlaystation size={30} color="white" /> : null}   
                                    {data.platform.name === "Xbox One"? <FaXbox size={30} color="white" /> : null}                                                    
                                </div>                               
                            ))}             
                        </div>   
                       
                    </div> 
                    </Link>
                 ))}
                {hasMore && (
                    <button onClick={loadMore} style={{backgroundColor:"grey",border:0,borderRadius:"10px",color:"white"}}>Load More</button>
                )}
            </div>
        )}
     
    </div>
  );
} 
export default PublisherPage;