import React from "react"; 
import { useContext } from "react"; 
import { AuthContext } from "../provider/AuthProvider";

function MyCommunitiesPage(){ 
     const { myCommunityList,getMyList,removeFromList,addToList } = useContext(AuthContext);  
     return( 
        <div> 
            <div> 
                
            </div>
        </div>
     )
} 
export default MyCommunitiesPage