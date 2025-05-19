import "../styles/styles.css";  
import React, { useEffect } from "react"; 
import myPhoto from "../images/games.avif";
import {  Link } from "react-router-dom";   
import { useState } from "react"; 
import axios  from "axios"; 
import Swal from "sweetalert2";  
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { useContext } from "react"; 

const SingupPage = () => {    
    const { loggedIn, setLoggedIn,session } = useContext(AuthContext);
    const navigate = useNavigate();  
    axios.defaults.withCredentials = true;
    const [user_email, setEmail] = useState(""); 
    const [user_password, setPassword] = useState("");
    const [message, setMessage] = useState(""); 
 
 
    const handleSignIn = async (e) => {  
        e.preventDefault(); 
        try { 
            const response = await axios.post("https://moviebox2-1084798053682.europe-west1.run.app/user/login", {user_email,user_password },{withCredentials: true}); 
            setMessage(response.data.message);  
            Swal.fire({
                icon: 'success',
                title: 'Logging In!',
                
              });  
            setLoggedIn(true); 
        
            
              
             
        } catch (error) { 
            console.log(error.response.data.message)
            setMessage(error.response.data.message || "Register Failed");  
            Swal.fire({
                icon: 'error',
                title: error.response.data.message || "Register Failed",
                confirmButtonText: 'OK'
              });
        }
    } 
    useEffect(() => {
        if (loggedIn && session?.userName) { 
            console.log("session",session)
          navigate(`/${session.userName}`);
        }
      }, [loggedIn, session]); 
    
    return (
        <div className="signupContainer"> 
        <img src={myPhoto} className="gImage"></img> 
        <div className="overlay2">  
            <a>Sign In</a>
            <input type="text" value={user_email} onChange={(e)=>setEmail(e.target.value)}placeholder="Email" className="input"></input>
            <input type="password" value={user_password} onChange={(e)=>setPassword(e.target.value)}placeholder="Password" className="input"></input>  
            <span>You're new? <Link to="/register"><span className="cNavi">Create An Account</span></Link></span>
            <button onClick={handleSignIn}>SIGN IN</button>
        </div>
            
        </div>
    );
} 
export default SingupPage;