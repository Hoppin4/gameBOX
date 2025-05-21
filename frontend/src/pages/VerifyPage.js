// src/pages/VerifyPage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Doğrulama işlemi sürüyor...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/user/verify?token=${token}`);
        setMessage(res.data); 
      } catch (err) {
        const msg = "An error occurred.";
        setMessage(msg);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className='main'> 
        <img style={{width:"300px",height:"300px",borderRadius:"15px"}} src='/gameboxes.jpg'></img>
      <h2 style={{color:"white",fontSize:"50px"}}>{loading ? "Verifying..." : message}</h2>
    </div>
  );
};

export default VerifyPage;
