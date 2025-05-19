import React, { useState,useRef,useEffect,useContext } from 'react';
import axios from 'axios';
import myPhoto from "../images/avatar.png"; 
import "../styles/imageUploader.css";  
import { AuthContext } from "../provider/AuthProvider"; 

const PostImgageLoader = ({image_url,postId,uploadReady,dataLoading}) => {  
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
    if (file) {
      setImage(file);
      const tempUrl = URL.createObjectURL(file); // Geçici bir blob URL'si oluştur
      setImageUrl(tempUrl); // Önizleme olarak göster
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click(); 
  }; 

  const handleImageUpload = async () => {
    if (!image) {
      alert('Lütfen bir resim seçin!');
      return;
    }
    dataLoading(false);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('postId', postId);
    try {
      setLoading(true);
      const response = await axios.post('https://moviebox2-1084798053682.europe-west1.run.app/com/postImageLoader', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImageUrl(response.data.imageUrl); 
      setLoading(false); 
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      setLoading(false);
    }finally{ 
        dataLoading(true);
    }
  }; 
  useEffect(() => {
    if (uploadReady&& image && postId) {
      handleImageUpload();
    }
  }, [uploadReady,postId]);

  return (
    
    <div style={{ display: "flex", width: "100%", position: "relative" }} className="imgup">
  {imageUrl ? (
    <img src={imageUrl} style={{ width: "100%", height: "auto" }} />
  ) : (
    <div
      onClick={handleUploadClick}
      style={{
        width: "100%",
        border: "1px solid grey",
        borderRadius: "15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <p>Click here to upload photo</p>
    </div>
  )}

  
  <div className="upload" onClick={handleUploadClick}>
    ✏️
  </div>

 
  <input
    type="file"
    ref={fileInputRef}
    style={{ display: "none" }}
    onChange={handleImageChange}
  />
</div>

  );
};

export default PostImgageLoader;