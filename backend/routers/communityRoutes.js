const express = require('express');
const {iconUploader,createCommunity,upload,bannerUploader,getCommunities,getMyCommunities 
    ,joinCommunity,deleteMemberCommunity,checkComName,getCommunityInfo,createPost,
    postImageUploader,getPostbyComId,deletePost,
    downVote,
    upVote,createComment,deleteComment,
    PostInfo,getComments,commentUpVote,
    commentDownVote,updateCommunity,getPopularPost,myCommunities,getMyPosts,getPopularGames} = require('../controllers/communityController'); 

const router = express.Router();  
 
router.post('/iconUploader',upload.single('image'),iconUploader)  
router.post('/createCommunity',createCommunity)  
router.post('/bannerUploader',upload.single('image'),bannerUploader)  
router.get('/getCommunities',getCommunities)  
router.get('/getMyCommunities',getMyCommunities) 
router.post('/joinCommunity',joinCommunity) 
router.delete('/deleteCom',deleteMemberCommunity)  
router.get('/check',checkComName); 
router.get('/getCommunityInfo',getCommunityInfo) 
router.post('/createPost',createPost) 
router.post('/postImageLoader',upload.single('image'),postImageUploader)    
router.get('/getPosts', getPostbyComId); 
router.delete('/deletePost',deletePost);
router.post('/downvote',downVote); 
router.post('/upvote',upVote); 
router.get('/postInfo', PostInfo); 
router.post('/createComment', createComment);
router.delete('/deleteComment', deleteComment); 
router.get('/getComments', getComments); 
router.post('/commentUpVote', commentUpVote);
router.post('/commentDownVote', commentDownVote); 
router.post('/updateComm',updateCommunity)
router.get('/getPopularPost', getPopularPost); 
router.get('/myCommunities',myCommunities)   
router.get('/getMyPosts',getMyPosts)  
router.get('/getPopularGames',getPopularGames)


module.exports = router;