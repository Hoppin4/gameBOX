import React, { use } from "react";  
import { useState } from "react"; 
import axios from "axios";
import Swal from "sweetalert2"; 
import "../styles/auth.css";  
import myPhoto from "../images/sonic2.webp"; 
import genshin from "../images/genshin.jpg"; 
import { useNavigate } from "react-router-dom"; 
import { useEffect } from "react"; 
import { AuthContext } from "../provider/AuthProvider"; 
import { useContext } from "react";
 const RegisterPage = () => {      
const { loggedIn, setLoggedIn, session } = useContext(AuthContext);
  const nav = useNavigate();
const [user_email, setEmail] = useState("");
  const [user_password, setPassword] = useState(""); 
    const [userName, setUsername] = useState(""); 
    const [birthday, setBirthday] = useState("");
  const [message, setMessage] = useState("");
  
  useEffect(() => {  
    if(session){ 
      nav('/')
    }
  }, []);

    const handleRegister = async (e) => { 
        e.preventDefault();
        try { 
            const response = await axios.post("https://moviebox2-1084798053682.europe-west1.run.app/user/register", {userName,user_email,user_password,birthday }); 
            console.log(response.data.message)
            setMessage(response.data.message);  
            Swal.fire({
                icon: 'success',
                title: 'Successfully Saved!',
                text: response.data.message,
                confirmButtonText: 'OK'
              });
        } catch (error) { 
            console.log(error.response.data.message)
            setMessage(error.response.data.message || "Register Failed");  
            Swal.fire({
                icon: 'error',
                title: 'Register Failed!',
                text: error.response.data.message || "Register Failed",
                confirmButtonText: 'OK'
              });
        }finally{ 
          nav('/signup')
        }
    };
    return (  

        <div className="auth-page"> 
                   <img src={genshin} alt="my photo" className="backGenshin"/>  

  
        <form className="auth-form"> 
            <div> 
          <div className="form-group">  
            <label htmlFor="username">Username</label>  
            <input type="text" value={userName} onChange={(e) => setUsername(e.target.value)} id="username" name="username" required />  
          </div>  
          <div className="form-group">  
            <label htmlFor="email">Email</label>  
            <input type="email" value={user_email} onChange={(e) => setEmail(e.target.value)} id="email" name="email" required />  
          </div>  
          <div className="form-group">  
            <label htmlFor="password">Password</label> 
            <input type="password" value={user_password} onChange={(e) => setPassword(e.target.value)} id="password" name="password" required />  
          </div>  
          <div className="form-group"> 
            <label htmlFor="birthday">Birthday</label>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} id="birthday" name="birthday" required /> 
          </div> 
          <button type="submit" onClick={handleRegister} className="auth-button">Register</button>  
          </div> 
          <div>
           <img src={myPhoto} alt="my photo" className="sonicImg"/>  
           </div>
        </form>  
            
      </div> 

    );  

} 
export default RegisterPage;