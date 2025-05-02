import React from 'react';  
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom'; 
import axios from 'axios'; 
import "../styles/showlist.css";
function ShowListPage() {  
    axios.defaults.withCredentials = true;
    const location = useLocation();  
    console.log(location.state)
    const  listId  = location.state.list.id ; 
    const [showList, setShowList] = useState([]); 
    const [loading, setLoading] = useState(false);  
    const [userData, setUserData] = useState("");
    const getUser = async () => { 
        try { 
            const response = await axios.post("http://localhost:5000/user/getUser", { 
                 id: location.state.list.user_id 
            }); 
            setUserData(response.data[0]);
            console.log("User data:", response.data); 
        } catch (error) { 
            console.error('Error fetching user:', error); 
        } 
    } 

    const getList = async () => { 
        setLoading(true); 
        try { 
            const response = await axios.get("http://localhost:5000/api/getGameFromList", { 
                params: { listId } 
            });
            setShowList(response.data.data); 
            console.log("List data:", response.data); 
        } catch (error) { 
            console.error('Error fetching list:', error); 
        } finally { 
            setLoading(false); 
        } 
    } 
    useEffect(() => { 
        if (listId) { 
            getList();  
            getUser();
        } 
    }, [listId]); 
   
  return (
    <div className="showlist-container"> 
        {loading ? (
            <div>Loading...</div>
        ) : ( 
            <div className='showlist' > 
                 
                 
                <div className='user-info'>  
                    <div style={{ display: "flex", alignItems: "center",width: "70%" }}> 

                    
                        {userData.avatar_url && ( 
                            <img src={userData.avatar_url} alt="User Avatar" className="avatar" /> 
                        )}
                        { userData && (  
                            <div style={{ display: "flex",  marginLeft: "3px" }}> 
                                <p> List by</p>  
                                <p style={{fontWeight:"bold"}}>{userData.userName}</p>
                            </div>
                            
                        )}  
                    </div> 
                    { location.state.list.created_at && ( 
                        <p>Created at: {new Date(location.state.list.created_at).toLocaleDateString()}</p> 
                    )} 
                </div>
                
                
              <div className="list-info"> 
                <h1>{location.state.list.name}</h1>  
                { location.state.list.description && ( 
                        <h2>{location.state.list.description}</h2> 
                    )} 
              </div>
               
              
                
              
                <div className="game-grid">
                    {showList.map((game) => (
                        <div key={game.id} className="game-item"> 
                        <Link to={`/GameDetailPage/${game.game_id}`} state={{ gameId: game.game_id }}>  
                            <img src={game.game_picture} alt={game.game_name} />
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