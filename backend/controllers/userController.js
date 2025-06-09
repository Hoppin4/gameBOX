const { createClient } = require('@supabase/supabase-js');
const axios = require('axios'); 
const dotenv = require('dotenv'); 
const bcrypt = require('bcrypt'); 
const session = require('express-session'); 
const multer = require('multer');  
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid');
dotenv.config();
 


 
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);   
const saltRounds = 10;  
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }); 
const token = uuidv4();
 
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
const getUser2 = async (req, res) => {    
  const  userName  = req.query.userName;  
    const { data, error } = await supabase.from('Users').select('*').eq('userName', userName); 
    if (error) {
      console.error('Veri çekme hatası:', error);
    } else {
      res.json(data);
    }
} 
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
        const { data, error } = await supabase.from('Users').insert([{userName,user_email, user_password: hashedPassword,birthday,avatar_url:"https://npwzobqbmzgdelhofxum.supabase.co/storage/v1/object/public/images/images/avatar.png",is_verified: false,verification_token: token, }]);  
        
    if (error) { 
        console.error(error)
        if (error.message === 'duplicate key value violates unique constraint "Users_userName_key1"') {
          return res.status(409).json({ message: 'This Username aldready exist,Choose another username!' });
        }else if (error.message === 'duplicate key value violates unique constraint "Users_user_email_key1"') {
          return res.status(409).json({ message: 'This Email aldready exist,Choose another email!' });
        }
        console.error('Kullanıcı kaydetme hatası:', error);
        return res.status(500).json({ message: 'An error occurred while saving the user.' });
      } else  { 
        const link = `https://gamebox-2ccdf.web.app/verify?token=${token}`; 
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user_email,
          subject: 'Email Verification',
          html: `<p>Hello! Verify your email by clicking the link below:</p>
                <a href="${link}">${link}</a>`,
        });
        
        return res.status(201).json({ message: 'User registered,Please confirm your email!', user: data });
      }
    }catch(error){ 
        console.error('Kayıt işlemi sırasında bir hata oluştu:', error); 
        
        return res.status(500).json({ message: 'Server error, registration failed.' }); 
        
    }
    
}  
const verify = async(req,res)=>{ 
   const { token } = req.query;
try{
  const { data, error } = await supabase 
    .from('Users')
    .update({ is_verified: true, verification_token: null })
    .eq('verification_token', token);  
     res.send("Email verified successfully!");
}
  catch(error){
    res.send(error)
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
    if(data.is_verified === false){ 
      return res.status(401).json({ message: 'Please confirm your email!' });
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
const getNotifications = async(req,res)=>{  
  const userId =req.query.userId  
  const page = req.query.page 
  const limit = 20; 
  const from = (page - 1) * limit;
  const to = from + limit - 1; 
  try{
    const response = await supabase.from('Notifications') 
    .select('*,user:Users!sender_id(userName)')  
    .order("created_at", { ascending: false }) 
    .range(from, to)
    .eq('receiver_id',userId) 
    .eq('is_read',false) 
    .eq('is_read', false);
    
    res.json({response}) 

  }catch(error){
    console.log(error)
  }
} 
const handleread = async(req,res)=>{ 
  const {userId} = req.body
  try{ 
    const response = await supabase.from('Notifications') 
    .update({is_read:true}) 
    .eq('receiver_id', userId)
    .eq('is_read', false);
  }catch(error){
    res.json(error)
  }
} 
const handlefollow = async (req, res) => {  
  const {followerId,followingId} = req.body; 
  try{
    const response = await supabase.from('Followers') 
    .insert([{ follower_id: followerId, following_id: followingId }]) 
    .select('*'); 
     
    res.json(response);
  }catch(error){ 
    res.status(500).json(error)
  }
} 
const handleunfollow = async (req, res) => {  
  const id = req.query.id; 
  try{ 
    const response = await supabase.from('Followers') 
    .delete()
    .eq('id', id); 

  }catch(Error){ 
    res.status(500).json(Error)
  }
} 
const checkfollows = async (req,res)=>{ 
  const follower_id = req.query.followerId 
  const following_id = req.query.followingId 
   
  try{
    const {data,error} = await supabase.from('Followers') 
    .select('*') 
    .eq('follower_id',follower_id) 
    .eq('following_id',following_id) 
     .maybeSingle(); 
    res.json(data)
  }catch(error){  
    res.json(error)
  }
}  
const getFollowers = async (req,res)=>{ 
 
  const follower_id = req.query.followingId
  const page = req.query.page 
  const limit = 20; 
  const from = (page - 1) * limit;
  const to = from + limit - 1; 
   
  try{
    const {data,error} = await supabase.from('Followers') 
    .select('*,user:Users!following_id(id,userName,avatar_url)')  
    .range(from, to)
    .eq('follower_id',follower_id) 
   
    res.json(data)
  }catch(error){  
    res.json(error)
  }
} 
const getFollowings = async (req,res)=>{ 
 
  const following_id = req.query.followingId
  const page = req.query.page 
  const limit = 20; 
  const from = (page - 1) * limit;
  const to = from + limit - 1; 
   
  try{
    const {data,error} = await supabase.from('Followers') 
    .select('*,user:Users!follower_id(id,userName,avatar_url)')  
    .range(from, to)
    .eq('following_id',following_id) 
   
    res.json(data)
  }catch(error){  
    res.json(error)
  }
}   
const getLikedGames = async (req,res)=>{  
    const userId = req.query.userId
      try{ 
        const {data,error}= await supabase.from('LikedGames') 
        .select('*,game:Games(*)') 
        .eq('user_id',userId)
        res.json(data)
      }catch(error){
        res.json(error)
      }
} 
const likeList = async(req,res)=>{ 
  const {userId,listId} = req.body 
      try{ 
        const {data,error}= await supabase.from('lists_like') 
        .insert([{user_id:userId,list_id:listId}]) 

      }catch(error){
        res.json(error)
      }
} 
const unlikeList = async(req,res)=>{ 
  const userId = req.query.userId 
  const listId = req.query.listId
      try{ 
        const {data,error}= await supabase.from('lists_like') 
        .delete() 
        .eq("list_id",listId) 
        .eq('user_id',userId)
      }catch(error){
        res.json(error)
      }
} 
const checkLikedList = async(req,res)=>{ 
  const userId = req.query.userId 
  const listId = req.query.listId 
  try{ 
        const response= await supabase.from('lists_like')  
        .select('*')
        .eq('list_id',listId) 
        .eq('user_id',userId)  
        .maybeSingle();
       
        res.json(response)
      }catch(error){
        res.json(error)
      }
} 
const getLikedLists = async(req,res)=>{ 
  const userId = req.query.userId 

  try{ 
        const response= await supabase.from('lists_like')  
        .select('*,list:GameLists(*,user:Users(id,userName,avatar_url))') 
        .eq('user_id',userId)  
       
        res.json(response)
      }catch(error){
        res.json(error)
      }
}  
const checkReviewLiked = async (req,res)=>{
  const userId = req.query.userId; 
  const commentIds = req.query.commentIds 
   
  try{ 
    const response = await supabase.from('reviews_like') 
    .select('review_id') 
    .eq('user_id',userId) 
    .in('review_id',commentIds) 
    res.json(response)
  }catch(error){
    res.json(error)
  }
} 
const unreviewlike = async(req,res)=>{ 
    const userId = req.query.userId; 
    const  review_id = req.query.review_id  
    
    try{
        const response = await supabase.from('reviews_like') 
        .delete()
        .eq('user_id',userId)  
        .eq('review_id',review_id)
         
        res.json(response)
    }catch(error){ 
        res.json(error)
    }
} 
const getlikedReviews = async(req,res)=>{ 
    const userId = req.query.userId 
     try{
        const response = await supabase
        .from('reviews_like')
        .select('*, game:Games(*), review:Reviews(*, creator:Users(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        res.json(response)
    }catch(error){ 
        res.json(error)
    }
}
module.exports = { getUser,registerUser,userLogin,getSession,logOut,updateProfile,upload, 
   uploadImage,verify,getUser2,getNotifications,handleread ,handlefollow,handleunfollow, 
   checkfollows,getFollowers,getFollowings,getLikedGames,likeList,unlikeList,checkLikedList 
   ,getLikedLists,checkReviewLiked,unreviewlike,getlikedReviews}; 
