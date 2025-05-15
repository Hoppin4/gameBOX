const { createClient } = require('@supabase/supabase-js');
const axios = require('axios'); 
const dotenv = require('dotenv'); 
const bcrypt = require('bcrypt'); 
const session = require('express-session'); 
const multer = require('multer');
dotenv.config();
 



  
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
dotenv.config();
  
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);   
 
const iconUploader = async (req, res) => {
  if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
  
    try { 
      const postId  = req.body.postId; 
      const filePath = `icons/${Date.now()}-${req.file.originalname}`;
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
        .from('Communities')
        .update({ icon_image: imageUrl }) 
        .eq('id', postId);
      res.json({ postId});
    } catch (error) {
      res.status(500).send("Error uploading to Supabase.");
    }
  
};  
 
const createCommunity = async(req,res)=>{ 
    const { communityName, description, userId, tags } = req.body;   
    const numericTags = tags.map(tag => parseInt(tag, 10)); 
    try{
        const { data, error } = await supabase
        .from('Communities') 
        .insert([ 
          { 
              name:communityName, 
              description:description, 
              tag:numericTags, 
              creator_user_id:userId, 
          }
        ]).select()
        
    
          return res.status(201).json({message:"Community created successfully",
            data
          });
    }catch(error){ 
        return res.status(500).json({ message: "Error inserting data", error: error.message });
    }
    
   

} 
const bannerUploader = async (req, res) => {
  if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
  
    try { 
      const postId  = req.body.postId; 
      const filePath = `banners/${Date.now()}-${req.file.originalname}`;
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
        .from('Communities')
        .update({ banner_image: imageUrl }) 
        .eq('id', postId);
      res.json({ postId});
    } catch (error) {
      res.status(500).send("Error uploading to Supabase.");
    }
  
};   
const postImageUploader = async (req, res) => {
  if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
  
    try { 
      const postId  = req.body.postId; 
      const filePath = `posts/${Date.now()}-${req.file.originalname}`;
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
        .from('Posts')
        .update({ post_image: imageUrl }) 
        .eq('id', postId);
      res.json({ postId});
    } catch (error) {
      res.status(500).send("Error uploading to Supabase.");
    }
  
};   
const createPost = async (req,res)=>{ 
  const { title, 
    content,  
    community_id ,
    user_id } = req.body;
  try{ 
    const { data, error } = await supabase
  .from('Posts')
  .insert([{community_id: community_id,user_id: user_id,title:title,content:content}]) 
  .select(); 
  res.json({data})
  }catch(error){ 
    res.json(500).send("error joining communities")
  }
} 

const checkComName = async (req,res)=>{ 
  const comName = req.query.comName
  try{ 
    const{ data, error } = await supabase 
    .from('Communities') 
    .select('name') 
    .eq('name',comName)  
    .maybeSingle(); 
     
    if (data) {
      res.status(201).send("community name already taken");
    } else {
      res.status(200).send("community name avaiable");
    }
  }catch(error){ 
    res.status(500).send("error getting communities")
  }
} 
 
const getCommunities = async (req,res) =>{ 
  try{ 
    const{ data, error } = await supabase.rpc('get_random_communities'); 
    res.json({data})
  }catch(error){ 
    res.json(500).send("error getting communities")
  }
} 
const getMyCommunities = async (req,res) =>{  
  const userId = req.query.userId;
  try{ 
    const{ data, error } = await supabase 
    .from('Community_Members')  
    .select('*')
    .eq('user_id',userId);  

    res.json({data})
  }catch(error){ 
    res.json(500).send("error getting communities")
  }
}
const joinCommunity = async (req,res)=>{  
  const { userId, communityId,Authorization } = req.body;
  try{ 
    const { data, error } = await supabase
  .from('Community_Members')
  .insert([{community_id: communityId,user_id: userId,Authorization:Authorization}]) 
  .select(); 
  res.json({data})
  }catch(error){ 
    res.json(500).send("error joining communities")
  }
} 
const deleteMemberCommunity = async (req,res)=>{  
  const memberId = req.query.memberId;
  try{ 
    const { data, error } = await supabase
  .from('Community_Members') 
  .delete()
  .eq('id',memberId); 
  res.json(error)
  }catch(error){ 
    res.json(500).send("error deleting membership")
  }
} 
const getCommunityInfo = async(req,res)=>{ 
  const comId= req.query.comId; 
   
  try{ 
    const { data, error } = await supabase
    .from('Communities')
      .select('*') 
      .eq('id', comId)
      .single()
    res.json({data})
  }catch(error){ 
    res.json(error)
  }
} 
const getPostbyComId = async(req,res)=>{ 
  const comId = req.query.comId; 
  const page = req.query.page; 
  const limit = 20;  

  const from = (page - 1) * limit; 
  const to = from + limit - 1; 
    try{ 
      const { data, error } = await supabase
      .from('Posts')
      .select(`
        *,
        user:Users (id, userName, avatar_url)`)
      .eq('community_id', comId) 
      .range(from, to);
        res.json({data})
    }catch(error){ 
      res.json(error)
    }
} 
const deletePost = async(req,res)=>{ 
  const postId = req.query.postId; 
   try{ 
      const { data, error } = await supabase
      .from('Posts') 
       .delete()
      .eq('id', postId) ;
     
       res.status(201).send("Post deleted successfully");
    }catch(error){ 
      res.json(error)
    }
} 
const upVote = async(req,res)=>{  
  const { postId } = req.body;
  try{
     const { data, error } = await supabase
    .rpc('increment_upvotes', { post_id: postId })
     
       res.status(201).send("Post deleted successfully");
    }catch(error){ 
      res.json(error)
    }
} 
const downVote = async(req,res)=>{  
  const { postId } = req.body;
  try{
     const { data, error } = await supabase
    .rpc('decrease_upvotes', { post_id: postId })
     
       res.status(201).send("Post deleted successfully");
    }catch(error){ 
      res.json(error)
    }
} 
const PostInfo = async(req,res) =>{ 
  const postId = req.query.postId 
  try{ 
    const {data,error}= await supabase 
    .from('Posts') 
    .select(`
        *, 
        creator:Users!Posts_user_id_fkey (id, userName, avatar_url)`) 
    .eq('id', postId)
    .single() 
    res.json({data})
  }catch(error){ 
    res.json(error)
  }
}
const createComment = async(req,res)=>{  
  const { postId, userId, content } = req.body; 
  try{ 
    const { data, error } = await supabase
  .from('Post_Comments')
  .insert([{post_id: postId,user_id: userId,content:content}]) 
  .select(); 
  res.json({data})
  }catch(error){ 
    res.json(500).send("error joining communities")
  }
} 
const deleteComment = async(req,res)=>{ 
  const commentId = req.query.commentId; 
   try{ 
      const { data, error } = await supabase
      .from('Post_Comments') 
       .delete()
      .eq('id', commentId) ;
     
       res.status(201).send("Post deleted successfully");
    }catch(error){ 
      res.json(error)
    }
} 
const getComments = async(req,res)=>{ 
  const postId = req.query.postId; 
  const page = req.query.page; 
  const limit = 20;  

  const from = (page - 1) * limit; 
  const to = from + limit - 1; 
    try{ 
      const { data, error } = await supabase
      .from('Post_Comments')
      .select(`
        *,
        user:Users (id, userName, avatar_url)`)
      .eq('post_id', postId) 
      .range(from, to);
        res.json({data})
    }catch(error){ 
      res.json(error)
    }
}
module.exports = {iconUploader,createCommunity,upload,bannerUploader,getCommunities,getMyCommunities,joinCommunity 
  ,deleteMemberCommunity,checkComName,getCommunityInfo,createPost,postImageUploader,getPostbyComId,deletePost, 
  upVote,downVote,PostInfo,createComment,deleteComment,getComments}