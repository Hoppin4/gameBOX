import React, { useEffect } from "react"; 
import CommunityLeftLayout from "./CommunityLeftLayout";
import { useState } from "react";
import axios from "axios"; 
import { useContext } from "react"; 
import { AuthContext } from "../provider/AuthProvider";  
import { Link } from "react-router-dom"; 
import { useNavigate } from "react-router-dom";


function MyCommunitiesPage(){   
  const navigate = useNavigate();
    const [Loading,setLoading] = useState(true); 
    const [communities,setCommunities] = useState(null); 
     const { myCommunityList,getMyList,removeFromList,addToList,loggedIn,listLoading,session } = useContext(AuthContext);  
    const getCommunities = async()=>{   
      if(!session){ 
        navigate('/');
      }
        try {  
            
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND}/com/getMyCommunities`,{ 
              params:{ 
                userId:session.userId
              }
            });
            
            if (loggedIn && myCommunityList.length>0) {
            
              const updatedCommunities = response.data.data.map((community) => ({
                ...community,
                isJoined: myCommunityList.some((item) => item.community_id === community.community_id
)
              }));
              setCommunities(updatedCommunities);
            } else {
              
              setCommunities(response.data.data);
            }
          } catch (error) {
            console.error("Failed to fetch communities:", error);
          } finally {
            setLoading(false);
          }
    }    
  

    useEffect(() => {
        
        if (!listLoading && session) {
          getCommunities();
        }
      }, [loggedIn, listLoading,session]);
    const handleJoin = (communityId) => { 
      if (!session) {
    navigate('/signup'); 
    return;
  }
        setCommunities(communities.map(c => 
            c.community_id === communityId ? { ...c, isJoined: true } : c
          ));
      }; 
      const handleunJoin = (communityId) => { 
        if (!session) {
    navigate('/signup'); 
    return;
  }
        setCommunities(communities.map(c => 
            c.community_id === communityId ? { ...c, isJoined: false } : c
          ));
      };
      
    console.log("communities",communities)
    return( 
        <div className="main">    
       
                <CommunityLeftLayout/>   
            
            {Loading ? ( 
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
                    <div className="spinner"></div>
                </div>
            ) : (  
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",width:"80%",marginLeft:"13.5%"}}> 
                <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",width:"100%",borderBottom:"1px solid grey"}}>
                  <p style={{color:"white",fontSize:"30px",margin:0,marginBottom:"10px"}}>My Communities</p> 
                </div>
                    <div className="communities" >  
                        {communities.map((data, index) => (
                        <Link to={`/c/${data.community.id}`} style={{textDecoration:"none"}} key={data.id} className="communities-container">  
                            <div className="communities-container-img" >  
                            {data.community.icon_image ? (<img src={data.community.icon_image}></img> ):( 
                                            <div style={{display:"flex",width:"40px",height:"40px",borderRadius:"50%",objectFit:"cover",backgroundColor:"yellow",justifyContent:"center",alignItems:"center"}}>  
                                                <p style={{fontSize:"25px",fontWeight:"bold",color:"black",margin:0}}>{data.community.name.charAt(0)}</p>
                                            </div>
                                        )}
                                <div className="community-name-container">
                                    <p className="community-name">{data.community.name}</p> 
                                    <p >{data.community.member_count} Members</p> 
                                </div>  
                                {!data.isJoined ? ( 
                                    <button className="com-joinbutton" onClick={(e)=>{e.stopPropagation();e.preventDefault();addToList(data.community.id,"Member");handleJoin(data.community.id)}}> 
                                        Join
                                    </button>
                                ) : ( 
                                    <button className="com-joinedbutton" onClick={(e)=>{e.stopPropagation();e.preventDefault();removeFromList(data.community.id);handleunJoin(data.community.id)}}> 
                                    Joined
                                </button>
                                )}
                                
                            </div>
                           
                            <div style={{display: "flex",flexDirection: "column",width: "100%",wordWrap: "break-word",overflowWrap: "break-word",wordBreak: "break-word",overflow: "hidden"}}>
                              <p style={{ color: "#8BA2AD", margin: 0, marginTop: "15px", fontSize: "12px" }}>
                                {data.community.description}
                              </p>
                            </div>
                              
                        </Link>
                        ))}
                        
                    </div> 
                </div>
            )}

        

        </div>
    )
} 
export default MyCommunitiesPage