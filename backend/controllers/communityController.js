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
     res.json({ imageUrl });
    } catch (error) {
      res.status(500).send("Error uploading to Supabase.");
    }
  
};   
const createPost = async (req,res)=>{ 
  const { title, 
    content,  
    community_id ,
    user_id,gameId,gameName,gameImage,post_image } = req.body; 
     
    const { data: existing } = await supabase
        .from('Games')
        .select('game_id')
        .eq('game_id', gameId)
        .maybeSingle(); 
        if (!existing) {
            await supabase.from('Games').insert([
              {
                game_id: gameId, 
                game_name: gameName, 
                game_image: gameImage,

              },
            ]);
            
          }
  try{  
    
      const { data, error } = await supabase
      .from('Posts')
      .insert([{community_id: community_id,user_id: user_id,title:title,content:content,gameID:gameId,post_image:post_image}]) 
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
  const order = req.query.order; 
  const direction = req.query.direction === 'asc';
  const limit = 20;  

  const from = (page - 1) * limit; 
  const to = from + limit - 1; 
    try{ 
      const { data, error } = await supabase
      .from('Posts')
      .select(`
        *,
        user:Users (id, userName, avatar_url), 
        game:Games (game_id, game_name, game_image)`)
      .eq('community_id', comId)  
      .order(order, { ascending:direction })
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
        creator:Users!Posts_user_id_fkey (id, userName, avatar_url), 
        game:Games (game_id, game_name, game_image)`) 
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
const commentUpVote = async(req,res)=>{  
  const { commentId } = req.body;
  try { 
    const {data,error}=await supabase 
    .rpc('increment_upvote_comment_count', { comment_id: commentId })
  }catch(error){ 
    res.json(error)
  }
} 
const commentDownVote = async(req,res)=>{  
  const { commentId } = req.body; 
  try { 
    const {data,error}=await supabase 
    .rpc('decrease_upvote_comment_count', { comment_id: commentId })
  }catch(error){ 
    res.json(error)
  }
} 
const updateCommunity = async (req, res) => { 
  const { communityId, name, description } = req.body; 
 
  try {
    const { data, error } = await supabase
      .from('Communities')
      .update({ name:name, description:description })
      .eq('id', communityId)
      .select();
    
    if (error) {
      return res.status(500).json({ message: "Error updating community", error: error.message });
    }
    
    return res.status(200).json({ message: "Community updated successfully", data });
  } catch (error) {
    return res.status(500).json({ message: "Error updating community", error: error.message });
  }
} 
const getPopularPost = async (req, res) => {  
  const page = req.query.page;  
  const order = req.query.order; 
  const direction = req.query.direction === 'asc';
  const limit = 20;  

  const from = (page - 1) * limit; 
  const to = from + limit - 1; 
    
  try{ 
      const { data, error } = await supabase
    .from('Posts')
    .select(`
      *,
      user:Users (id, userName, avatar_url), 
      game:Games (game_id, game_name, game_image), 
      community:Communities (id, name, icon_image)`)
    .order(order, { ascending: direction })
    .range(from, to); 
   res.json({data})
  }
catch(error){
    res.json(error)
  }
  
}  
const getPopularGames = async (req, res) => {    
  const startDate = req.query.startDate; 
  const endDate = req.query.endDate;
  try{ 
    const response = await axios.get('https://api.rawg.io/api/games', { 
                params: {
                    key: process.env.API_KEY, 
                    page_size: 4, 
                    dates:`${startDate},${endDate}`,
                   
                }
            });  
       
  const response1 = await axios.get('https://api.rawg.io/api/games',{ 
            params:{ 
                key: process.env.API_KEY, 
                page_size: 4 ,  
                ordering:"-reviews_count", 
            }
        }) 
        
  
    res.json({ 
  popular: response.data, 
  bestseller: response1.data,
});
  }catch(error){  
    res.json(error)
  }
   
} 

const myCommunities = async (req, res) => { 
   
  const userId = req.query.userId; 
  try {
    const { data, error } = await supabase
      .from('Community_Members')
      .select(`
        *,
        community:Communities (id, name, icon_image)`) 
      .order(order, { ascending: direction })
      .range(from, to)
      .eq('user_id', userId);
    
    return res.status(200).json({ message: "Communities fetched successfully", data });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching communities", error: error.message });
  } 
} 
const getMyPosts = async (req, res) => { 
  const userId = req.query.userId;  
  const page = req.query.page; 
  const order = req.query.order; 
  const direction = req.query.direction === 'asc'; 
  const limit = 20; 
  const from = (page - 1) * limit;
  const to = from + limit - 1; 

  try {
    const { data, error } = await supabase
      .from('Posts')
      .select(`
        *,
        user:Users (id, userName, avatar_url), 
        game:Games (game_id, game_name, game_image), 
        community:Communities (id, name, icon_image)`) 
      .order(order, { ascending: direction })
      .range(from, to)
      .eq('user_id', userId);
    
    return res.status(200).json({ message: "Posts fetched successfully", data });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching posts", error: error.message });
  } 
} 
const getMostPopularGames =async(req,res) =>{  
    
}
module.exports = {iconUploader,createCommunity,upload,bannerUploader,getCommunities,getMyCommunities,joinCommunity 
  ,deleteMemberCommunity,checkComName,getCommunityInfo,createPost,postImageUploader,getPostbyComId,deletePost, 
  upVote,downVote,PostInfo,createComment,deleteComment,getComments,commentUpVote, 
  commentDownVote,updateCommunity,getMyPosts,getPopularPost,myCommunities,getPopularGames}