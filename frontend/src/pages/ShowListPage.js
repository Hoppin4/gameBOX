import React from 'react';  
import { useContext, useEffect, useState } from "react";
import { Link, useLocation,useParams } from 'react-router-dom'; 
import axios from 'axios'; 
import "../styles/showlist.css";
function ShowListPage() {  
    axios.defaults.withCredentials = true;
    const {id}=useParams(); 
    const [showList, setShowList] = useState([]); 
    const [loading, setLoading] = useState(true);  


    const getList = async () => { 
        setLoading(true); 
        try { 
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getUserList`, { 
                params: { 
                    listId:id
                }
            }); 

            setShowList(response.data.data[0]); 
            console.log("List dataaaa:", response); 
        } catch (error) { 
            console.error('Error fetching list:', error); 
        } finally { 
            setLoading(false); 
        } 
    } 
    useEffect(() => { 
        if (id) { 
            getList();  
          
        } 
    }, [id]); 
   console.log("dsadasda",showList)
  return (
    <div className="showlist-container"> 
        {loading ? (
            <div>Loading...</div>
        ) : ( 
            <div className='showlist' > 
                 
                 
                <div className='user-info'>  
                    <div style={{ display: "flex", alignItems: "center",width: "70%" }}> 

                    
                        {showList.user.avatar_url && ( 
                            <img src={showList.user.avatar_url} alt="User Avatar" className="avatar" /> 
                        )}
                         
                            <div style={{ display: "flex",  marginLeft: "3px" }}> 
                                <p> List by</p>  
                                <p style={{fontWeight:"bold"}}>{showList.user.userName}</p>
                            </div>
                            
                        
                    </div> 
                    
                        <p>Created at: {new Date(showList.created_at).toLocaleDateString()}</p> 
                
                </div>
                
                
              <div className="list-info"> 
                <h1>{showList.name}</h1>  
                { showList.description && ( 
                        <h2>{showList.description}</h2> 
                    )} 
              </div>
                <div className="game-grid">
                    {showList.gameList.map((game) => (
                        <div key={game.id} className="game-item"> 
                        <Link to={`/GameDetailPage/${game.Games.game_id}/${game.Games.game_name}`} state={{gameImage:game.Games.game_picture}}>  
                            <img src={game.Games.game_image} alt={game.Games.game_name} />
                        </Link>
                        
                        </div>
                    ))}
                </div>
            </div>
            
        )}
    </div>
  );
} 
export default ShowListPage;