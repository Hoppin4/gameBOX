import { useState,useEffect } from 'react';
import { createContext } from 'react'; 
import axios from 'axios';
export const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {  
  axios.defaults.withCredentials = true; 
  const [session, setSession] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [loggedIn, setLoggedIn] = useState();  
  const [myCommunityList, setMyCommunityList] = useState([]); 
  const [listLoading,setListLoading] = useState(false)

    const addToList = async (communityId,auth) => {
      try{ 
        const response = await axios.post("https://moviebox2-1084798053682.europe-west1.run.app/com/joinCommunity" ,{ 
        
            userId:session.userId,  
            communityId:communityId, 
            Authorization:auth,
         
        })  
        console.log(response) 
        const { id, community_id, user_id, joined_at } = response.data.data[0];
        setMyCommunityList(prev => [...prev, { id, community_id, user_id, joined_at }]); 
        return true
      }catch(error){ 
        console.log(error);
      }
    };

    const removeFromList = async (memberId) => { 
        
      try{  
        const targetItem = myCommunityList.find(item => item.community_id === memberId); 
        console.log("aaa",targetItem)
        const response = await axios.delete(`https://moviebox2-1084798053682.europe-west1.run.app/com/deleteCom`,{  
          params:{ memberId:targetItem.id }
        }) 
        setMyCommunityList((prev) => prev.filter((item) => item.id !== targetItem.id)) 
        console.log(response)
      }catch(error){ 
        console.log(error);
      }
    }; 
  const getMyList = async()=>{   
    setListLoading(true)
    try{ 
      const response = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/com/getMyCommunities" ,{ 
        params:{ 
          userId:session.userId
        }
      })  
      console.log("responseaaaaa",response.data.data)
      setMyCommunityList(response.data.data)
    }catch(error){ 
      console.log(error); 
    }finally{ 
      setListLoading(false)
    }
  } 
  useEffect(()=>{  
    if(loggedIn === true){ 
      getMyList();
    }
  },[session])
  useEffect(()=>{  
    const getSession = async () => { 
        try { 
            const response = await axios.get("https://moviebox2-1084798053682.europe-west1.run.app/user/getSession"); 
           
            if(response.data.session){ 
                console.log(response) 
                setLoggedIn(true) 
                setSession(response.data.session);
            }else{ 
                console.log("No session found") 
               setLoggedIn(false)
            }
        } catch (error) { 
            console.error('Error fetching session:', error); 
        } finally{ 
          setLoading(false);
        }
    };  

    getSession();

},[loggedIn]); 
if (loading) {
  return <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
  <div className="spinner"></div>
</div>; 
}  
if(session){ 
  if(listLoading){ 
    return <div style={{display:"flex",justifyContent:"center",alignItems:"center",  width:"100%",height:"100%"}}> 
    <div className="spinner"></div>
</div>
  }
}


 
  return (
    <AuthContext.Provider value={{myCommunityList,getMyList,removeFromList,addToList,listLoading , loggedIn, setLoggedIn,loading,session}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;