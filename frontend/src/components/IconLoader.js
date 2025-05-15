import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import myPhoto from "../images/avatar.png";
import "../styles/bannerUploader.css";
import { AuthContext } from "../provider/AuthProvider";
import { Slider, Button, Dialog } from '@mui/material'; 
import { AiOutlinePicture } from "react-icons/ai";

const IconLoader = ({ image_url ,onUploadSuccess,uploadReady,dataLoading ,postId,openiconcrop }) => {
  const { session } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState(image_url);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [openCrop, setOpenCrop] = useState(false); 
  const [file,setFile] = useState("");
  const [croppedBlob, setCroppedBlob] = useState(null);
    dataLoading(true);
   
  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    setFile(file)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); 
        setOpenCrop(true); 
   
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCropSave = async () => { 
    
    const blob = await getCroppedImg(selectedImage, croppedAreaPixels);   
   
    const tempUrl = URL.createObjectURL(blob);
    setCroppedBlob(blob); 
    onUploadSuccess(tempUrl); 
    setOpenCrop(false); 
  }
    
 const handleDataSave = async () =>{  
    if (!croppedBlob) {
        alert('Lütfen bir resim seçin!');
        return;
      }    
    dataLoading(false);
    const formData = new FormData(); 
   
    formData.append('image', croppedBlob, 'avatar.jpg');
    formData.append('postId',postId)
    console.log(croppedBlob)
        try {
            setLoading(true);
            const response = await axios.post(`http://localhost:5000/com/iconUploader`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }); 
            console.log(response)

          } catch (error) {
            console.error('Resim yükleme hatası:', error);
            setLoading(false);
          }
          finally{ 
            
            setCroppedBlob(null) ;
            setFile(""); 
            setCroppedAreaPixels(null); 
            setSelectedImage(null); 
            setOpenCrop(false); 
            setLoading(false); 
            dataLoading(true);  
            onUploadSuccess("");
          } 
       
 } 
 useEffect(()=>{   
    if(uploadReady && file && postId) { 
        handleDataSave();
    }
    
 },[uploadReady,postId])
  return (
    <div className="bannerUploader"> 
        <div style={{display:"flex",width:"100%",justifyContent:"space-between",alignItems:"center"}}>
        <p style={{margin:0}}>Icon</p>
        <div className="uploadContainer" onClick={handleUploadClick}>
            <AiOutlinePicture size={25} /> 
            <p>upload</p>
        </div>
        <input
            style={{ display: "none" }}
            
            ref={fileInputRef}
            type="file"
            onChange={handleImageChange}
        /> 
       
    </div>  
    
      <Dialog open={openCrop} onClose={() => setOpenCrop(false)} fullWidth maxWidth="sm">
        <div style={{ position: 'relative', height: 400 }}>
          <Cropper
            image={selectedImage}
            crop={crop} 
            
            zoom={zoom}
            aspect={3/ 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div style={{ padding: 16 }}>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(_, value) => setZoom(value)}
          />
          <Button variant="contained" onClick={handleCropSave} disabled={loading}>
            {loading ? 'Yükleniyor...' : 'Kaydet'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default IconLoader;
