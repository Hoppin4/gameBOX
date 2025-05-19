import { useLocation } from "react-router-dom"; 
import axios from "axios"; 
import { use, useState,useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap'; 
import "../styles/profile.css";  
import ImageUploader from "../components/ImageUploader";



function ProfileEditPage() {   
 
    const navigate = useNavigate();
    const location = useLocation();   
    console.log(location)
    axios.defaults.withCredentials = true;
    const { userData } = location.state || {};   
    const [id, setUserId] = useState(userData.id);
    const [userName, setUserName] = useState();  
    const [firstName, setFirstName] = useState(); 
    const [lastName, setLastName] = useState( ); 
    const [user_email, setEmail] = useState(); 
    const [bio, setBio] = useState(); 
    const [birthday, setBirthday] = useState(); 
    const [gender, setGender] = useState(); 
    const [userInfo, setUserInfo] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [image_url,setImageUrl] = useState(null);
    console.log("aaa"+userData)  
      
    useEffect(() => {
      if (!userData) {
        navigate("/profile"); 
      }
    }, [userData, navigate]);  
     
    const tooltip = (
      <Tooltip id="tooltip" style={{color:'white',fontSize:"10px",width:"120px",backgroundColor:'#2C3440',textAlign:'center',borderRadius:"8px",height:"20px",display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'}}>
        You can't change email
      </Tooltip>
    );
     
    useEffect(()=>{  
      const getUserInfo = async () => {   
          try{  
            const response = await axios.post("https://moviebox2-1084798053682.europe-west1.run.app/user/getUser", { id: id });   
            console.log("aaaaaaa",response.data[0]); 
            setUserName(response.data[0].userName); 
            setFirstName(response.data[0].firstName); 
            setLastName(response.data[0].lastName); 
            setEmail(response.data[0].user_email); 
            setBio(response.data[0].bio); 
            setBirthday(response.data[0].birthday); 
            setGender(response.data[0].gender) 
            setImageUrl(response.data[0].avatar_url)
          }catch(error){   
            console.error('Error fetching user info:', error); 
          }finally{ 
            setLoading(false);  
          }
          
        }  
        getUserInfo();
  },[]);


    const handleUpdate = async (e) => { 
        e.preventDefault(); 
        try { 
            const response = await axios.post("https://moviebox2-1084798053682.europe-west1.run.app/user/updateProfile", {id,user_email,userName,firstName,lastName,bio,birthday,gender});  
            alert("Profile updated successfully!")
        } catch (error) { 
            console.log(error.response.data.message)
            alert(error.response.data.message || "Update Failed");  
        }
    }
  return (
    <div>  
      {loading & userName ? ( 
        <div>Loading...</div>
      ) : ( 
          <div style={{overflowY: 'auto'}} className="profileEditPage">   
            <div className="profileEditContainer">    
            <h1>Account Settings</h1>  
            <div style={{ marginTop:'20px',borderBottom: '1px solid #313B48',display: 'flex',justifyContent: 'space-around' }}>
              <button className="changeButtons">Profile</button> 
              <button className="changeButtons">Auth</button> 
            </div>
              <ImageUploader image_url={image_url}></ImageUploader> 
                
           
            <div>
              <p>Username</p>
              <input value={userName} onChange={(e)=>setUserName(e.target.value)}></input> 
            </div> 
            <div className="nameInput">  
              <div >
                <p>First Name</p>
                <input className="nameInput1"  style={{ marginRight: "10px" }} value={firstName} onChange={(e)=>setFirstName(e.target.value)}></input>  
              </div> 
              <div >
                <p>Last Name</p> 
                <input  className="nameInput1" value={lastName} onChange={(e)=>setLastName(e.target.value)}></input> 
              </div>
            </div> 
            <div>  
              <div style={{ display: "flex", width: "380px", justifyContent: "space-between", alignItems: "center" }}>
                <p>Email address</p>
                <OverlayTrigger placement="top" overlay={tooltip}> 
                  <div className="infoButton"> 
                    <span  variant="secondary">?</span>
                  </div>
                 
                </OverlayTrigger>
              </div>
              <input  disabled={true}value={user_email} onChange={(e)=>setEmail(e.target.value)}></input>
            </div> 
            <div> 
              <p>Bio</p> 
              <input style={{height:"100px",textAlign:"start",lineHeight: "normal"}} value={bio} type="text" onChange={(e)=>setBio(e.target.value)}></input>
            </div>  
            <div> 
              <p>Birthday</p>
              <input type="date" value={birthday} onChange={(e)=>setBirthday(e.target.value)}></input>
            </div>
            <div> 
              <p>Gender</p> 
              <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="select"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            </div> 
            
            <button className="saveButton"onClick={handleUpdate}>Save Changes</button> 
            </div>
          </div>
      )}
      
    </div>
  );
}    
export default ProfileEditPage;