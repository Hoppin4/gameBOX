 import axios from "axios"; 
 import CommunityLeftLayout from "./CommunityLeftLayout";
 const Community = () => {  
   
 
  axios.defaults.withCredentials = true;
    return  ( 
    <div className="main"> 
      <CommunityLeftLayout/>
    </div>
    )
  };
  
  export default Community;