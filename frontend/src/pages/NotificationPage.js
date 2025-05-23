import React from "react"; 

 import { AuthContext } from "../provider/AuthProvider";
import { useContext,useEffect } from "react";
function NotificationPage(){  
    const { loggedIn,session,addToList,notifications } = useContext(AuthContext); 
    useEffect(()=>{
        alert(notifications.message)
    },[notifications])
    return( 
        <div>  


        </div>
    )
} 
export default NotificationPage