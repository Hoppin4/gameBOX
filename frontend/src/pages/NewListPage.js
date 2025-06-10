import React from 'react'; 
import "../styles/ListEditCreate.css"; 
import axios from 'axios'; 
import { useState,useEffect,useContext } from 'react'; 
import { IoCloseCircle } from "react-icons/io5";
import { AuthContext } from '../provider/AuthProvider';  
import { useNavigate } from 'react-router-dom'; 
import { Toaster, toast } from 'react-hot-toast';

function NewListPage() {  
    const { loggedIn,loading, setLoggedIn,session, } = useContext(AuthContext); 
    const navigate = useNavigate();
    if (!loggedIn) { 
        navigate("/signup"); 
    }
    axios.defaults.withCredentials = true;  
    const [listName, setListName] = useState(""); 
    const [listDescription, setListDescription] = useState(""); 
    const [gameList, setGameList] = useState([]);  
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]); 
    const [searchLoading, setSearchLoading] = useState(false);
   

    const fetchGames = async (term) => {
        try {
          setSearchLoading(true);
          const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/getMainGames`,{
            params: { search:term } 
        });  
          setSearchResults(response.data.results);
        } catch (error) {
          console.error('API error:', error);
        } finally {
          setSearchLoading(false);
        }
      };
     useEffect(() => {
            const delayDebounce = setTimeout(() => {
              if (searchTerm.length > 1) {
                fetchGames(searchTerm);
              } else {
                setSearchResults([]);
              }
            }, 500); 
        
            return () => clearTimeout(delayDebounce);
    }, [searchTerm]); 

          const handleSelect = (game) => {
            setGameList((prev) => {
                const alreadyExists = prev.some((item) => item.id === game.id);
                if (alreadyExists) return prev;
                return [...prev, { id: game.id, name: game.name, image_url: game.background_image }];
            });
        }; 
        const handleRemove = (gameId) => { 
            setGameList((prev) => prev.filter((game) => game.id !== gameId));
        } 
        const handleSave = async () => { 
          
          if(!listName) { 
            toast.error('Please Enter list name', {
              position: 'top-left', 
              duration: 4000, 
              style: {
                background: 'red', 
                color: 'white', 
              },
            });
            return;
          }
           try{ 
                const response = await axios.post(`${process.env.REACT_APP_BACKEND}/api/createList`, { 
                    listName: listName, 
                    description: listDescription,  
                    userId: session.userId,
                   
                });   
               
                toast.success(`Your ${listName} list was saved!`, {
                  position: 'top-left',  
                  duration: 4000, 
                  style: {
                    background: 'green', 
                    color: 'white', 
                  }, 
                }); 
                if(gameList.length > 0) {   
                  
                  const listId = response.data.data[0].id; 
                const gamePromises = gameList.map((game) => { 
                      return axios.post(`${process.env.REACT_APP_BACKEND}/api/insertGameToList`, { 
                          listId: listId, 
                          gameId: game.id,   
                          gameName: game.name, 
                          gameImage: game.image_url,

                      }); 
                  });
                  await Promise.all(gamePromises);    
                }  
                setTimeout(() => {
                  navigate(`/user/${session.userName}/Lists`);
                }, 1500);

               
            
           }catch(error){ 
                console.error("Error saving list:", error); 
                toast.error('BError saving list', {
                  position: 'top-left', 
                  duration: 4000, 
                  style: {
                    background: 'red', 
                    color: 'white', 
                  },
                });
           }
        }
           
        const handleCancel = () => { 
            setListName(""); 
            setListDescription(""); 
            setGameList([]);  
            navigate(`/${session.userName}`);
        }
  console.log(gameList)
  return (
    <div className="newListPage">   
      <Toaster position="top-left" />
        <div className="header"> 
                <p>New List </p>
        </div> 
        <div className="newListPageContainer"> 
                    <form className="newListForm"> 
                        <div className="inputContainer"> 
                            <label>List Name</label> 
                            <input type="text" value={listName} onChange={(e)=>setListName(e.target.value)}/> 
                        </div>
                        <div className="inputContainer"> 
                            <label>List Description</label> 
                            <textarea value={listDescription} onChange={(e)=>setListDescription(e.target.value)} ></textarea> 
                        </div>                    
                    </form>                              
            </div>  
            <div className="searchContainer">  
                <div className='searchInputContainer'> 
                    <button className='addButton'>Add Game</button>
                    <input onChange={(e)=>setSearchTerm(e.target.value)} value={searchTerm} placeholder='Enter name of Game'></input>  
                    {searchTerm && (  
                       <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"10px"} }> 
                            <IoCloseCircle color='red' style={{cursor:"pointer"}} onClick={()=>{setSearchTerm("")}} /> 
                       </div>
                    )} 
                    {searchResults && ( 
                          <div className='searchResultsContainer'>
                          {searchLoading ? (
                          <p style={{ color: "#7F91AA", textAlign: "center", marginTop: "10px" }}>Yükleniyor...</p>
                          ) : (
                          <ul className='searchList'>
                              {searchResults.map((game) => (
                              <li className='searchListItem' key={game.id} onClick={()=>{handleSelect(game);setSearchTerm("")}}>
                                  <p>{game.name}</p>  
                                  <p style={{marginLeft:"2px"}}>({game.released?.slice(0, 4)})</p>         
                              </li>
                              ))}
                          </ul>
                          )}
                      </div>
                    )}
                </div>
                <div className="saveButtonContainer">  
                    <button className='cancelButton' onClick={()=>handleCancel()}>Cancel</button>
                    <button className='saveButton1' onClick={()=>handleSave()}>Save</button>
                </div>
            </div>  
            {gameList.length === 0 ? (   
                    <div className="emptyListContainer">  
                        <text>Your List is empty</text> 
                    </div>
                ) : ( 
                    <div className="gameListContainer">  
                        {gameList.map((game) => ( 
                            <div className="gameItem"> 
                                <img src={game.image_url} alt={game.name} /> 
                                <div className='closeIcon'>
                                  <IoCloseCircle  size={20} color='red' style={{cursor:"pointer"}} onClick={()=>handleRemove(game.id)} /> 
                                </div> 
                            </div>
                        ))}
                    </div>
                )}
            
        
    </div>
   
      
      
  );
} 
export default NewListPage;