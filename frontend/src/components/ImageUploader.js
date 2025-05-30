import React, { useState,useRef,useEffect,useContext } from 'react';
import axios from 'axios';
import myPhoto from "../images/avatar.png"; 
import "../styles/imageUploader.css";  
import { AuthContext } from "../provider/AuthProvider"; 

const ImageUploader = ({image_url}) => {  
  const { session } = useContext(AuthContext);
  const [image, setImage] = useState(null); 
  const [imageUrl, setImageUrl] = useState(image_url); 
  const [loading, setLoading] = useState(false); 
  const fileInputRef = useRef(null); 
   
  useEffect(() => {
    setImageUrl(image_url)
  }, [image_url]);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    
    setImage(file); 
   
  };

  const handleUploadClick = () => {
    fileInputRef.current.click(); 
  }; 

  const handleImageUpload = async () => {
    if (!image) {
      alert('Lütfen bir resim seçin!');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', session.userId);
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/user/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImageUrl(response.data.imageUrl); 
      setLoading(false); 
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      setLoading(false);
    }
  }; 
  useEffect(() => {
    if (image) {
      handleImageUpload();
    }
  }, [image]);

  return (
    
    <div className="avatar-wrapper">
            <img className="profile-pic" src={imageUrl?imageUrl:myPhoto} />
        <div className="upload-button" onClick={handleUploadClick}>
            <i className="fa fa-arrow-circle-up" aria-hidden="true"></i>
        </div>
        <input style={{display:"none"}} className="file-upload"  ref={fileInputRef} type="file" onChange={handleImageChange}/>
    
    </div>
  );
};

export default ImageUploader;