import React from "react"; 
import { useState,useEffect,useContext } from "react";
import axios from "axios"; 
import { AuthContext } from "../provider/AuthProvider";  
import { useParams } from "react-router-dom";
export default function LikesPage(){  
    const { userName } = useParams();  
     const { loggedIn,session } = useContext(AuthContext);  
 
    return( 
        <div className="main"> 

        </div>
    )
}