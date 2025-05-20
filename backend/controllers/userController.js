const { createClient } = require('@supabase/supabase-js');
const axios = require('axios'); 
const dotenv = require('dotenv'); 
const bcrypt = require('bcrypt'); 
const session = require('express-session'); 
const multer = require('multer');
dotenv.config();
 


 
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);   
const saltRounds = 10;  
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
 
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try { 
    const id = req.body.userId; 
    const filePath = `images/${Date.now()}-${req.file.originalname}`;
    const { data, error } = await supabase.storage
      .from('images') 
      .upload(filePath, req.file.buffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return res.status(500).send(error.message);
    }

    
    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${filePath}`; 
    const { error: updateError } = await supabase
      .from('Users')
      .update({ avatar_url: imageUrl }) 
      .eq('id', id);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).send("Error uploading to Supabase.");
  }
};
const getUser = async (req, res) => {    
  const { id } = req.body;  
    const { data, error } = await supabase.from('Users').select('*').eq('id', id); 
    if (error) {
      console.error('Veri çekme hatası:', error);
    } else {
      console.log('Kullanıcılar:', data); 
      res.json(data);
    }
} 
const registerUser = async (req, res) => {  
    const { userName,user_email, user_password,birthday } = req.body;   
    if (!userName || !user_email || !user_password || !birthday) { 
        return res.status(400).json({ message: 'All fields are required!' });
    } 
    if (userName.length < 5) { 
        return res.status(400).json({ message: 'Username must be at least 5 characters long!' });
    } 
    if (user_password.length < 6) { 
        return res.status(400).json({ message: 'Password must be at least 6 characters long!' });
    } 
    if (!user_email.includes('@')) { 
        return res.status(400).json({ message: 'Email is not valid!' });
    } 
    try{ 
        const hashedPassword = await bcrypt.hash(user_password, saltRounds); 
        const { data, error } = await supabase.from('Users').insert([{userName,user_email, user_password: hashedPassword,birthday,avatar_url:"https://npwzobqbmzgdelhofxum.supabase.co/storage/v1/object/public/images/images/avatar.png" }]);  
        
    if (error) { 
        console.error(error)
        if (error.message === 'duplicate key value violates unique constraint "Users_userName_key"') {
          return res.status(409).json({ message: 'This Username aldready exist,Choose another username!' });
        }else if (error.message === 'duplicate key value violates unique constraint "Users_user_email_key"') {
          return res.status(409).json({ message: 'This Email aldready exist,Choose another email!' });
        }
        console.error('Kullanıcı kaydetme hatası:', error);
        return res.status(500).json({ message: 'An error occurred while saving the user.' });
      } else  {
        console.log('Kullanıcı başarıyla kaydedildi:');
        return res.status(201).json({ message: 'User registered', user: data });
      }
    }catch(error){ 
        console.error('Kayıt işlemi sırasında bir hata oluştu:', err); 
        
        return res.status(500).json({ message: 'Server error, registration failed.' }); 
        
    }
    
} 
 
const userLogin = async (req, res) => {  
  const {user_email,user_password} = req.body;
  if (!user_email || !user_password) { 
    return res.status(400).json({ message: 'All fields are required!' }); 
  } 
  try{  
    const {data, error} = await supabase.from('Users').select('*').eq('user_email', user_email).single();
    if (error) { 
      console.error('Kullanıcı bulunamadı:', error); 
      return res.status(404).json({ message: "User doesn't exist" }); 
    }  
    
    const passwordMatch = await bcrypt.compare(user_password, data.user_password); 
    if(!passwordMatch) { 
      return res.status(401).json({ message: 'Invalid password' }); 
    } 
    req.session.user = {  
      userId : data.id,
      userName: data.userName,
      user_email: data.user_email, 
      user_password: data.user_password,
      birthday: data.birthday, 
      user_avatar: data.avatar_url, 
    }; 
    console.log(req.session.user)
    res.status(200).json({ message: 'Logging in!' });

  }catch(error){ 
    return res.status(500).json({ message: 'Server error, login failed.' }); 
    
  }
} 
const getSession = async(req,res)=>{   
  if(req.session.user){ 
    res.status(200).json({loggedIn:true,session: req.session.user}); 
  }else{ 
    res.status(401).json({loggedIn:false}); 
  }


}
const logOut = async(req,res)=>{ 
  req.session.destroy((err)=>{ 
    if(err){ 
      return res.status(500).json({ message: "Oturum sonlandırılırken bir hata oluştu." });
    }else{ 
      res.status(200).json({message: 'Logged out'}); 
    }
  })
} 
const updateProfile = async (req, res) => { 
  const { id,user_email,userName,firstName,lastName,bio,birthday,gender } = req.body; 
  
  try{ 
    const { data, error } = await supabase.from('Users').update({userName:userName,firstName:firstName,lastName:lastName,bio:bio,birthday:birthday,gender:gender }).eq('user_email', user_email);  
    
    if (error) { 
      console.error('Kullanıcı güncelleme hatası:', error); 
      return res.status(500).json({ message: 'An error occurred while updating the user.' });
    }
    res.status(200).json({ message: 'Profile updated successfully', data });
  }catch(error){ 
    console.error('Kayıt işlemi sırasında bir hata oluştu:', error); 
    
    return res.status(500).json({ message: 'Server error, registration failed.' }); 
    
  }
}

module.exports = { getUser,registerUser,userLogin,getSession,logOut,updateProfile,upload, uploadImage }; 
