import { useState,useEffect } from 'react';
import { createContext } from 'react'; 
import axios from 'axios';
export const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {  
  axios.defaults.withCredentials = true; 
  const [session, setSession] = useState(null); 
  const [loading, setLoading] = useState(true); 
   const [loggedIn, setLoggedIn] = useState(); 
  useEffect(()=>{  
    const getSession = async () => { 
        try { 
            const response = await axios.get("http://localhost:5000/user/getSession"); 
           
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
  return <div>Loading...</div>; 
}

 
  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn,loading,session }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;