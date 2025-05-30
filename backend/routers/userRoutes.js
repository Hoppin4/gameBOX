const express = require('express');
const {registerUser,userLogin,getSession,logOut,updateProfile,getUser,upload,uploadImage, 
    verify,getUser2,getNotifications,handleread,handlefollow,handleunfollow,checkfollows,getFollowers,getFollowings} = require('../controllers/userController');
const router = express.Router();

router.post('/upload', upload.single('image'), uploadImage);
router.post('/getUser', getUser);
router.post('/register',registerUser) 
router.post('/login',userLogin)  
router.get('/getSession',getSession)
router.post('/logout', logOut) 
router.post('/updateProfile',updateProfile) 
router.get('/verify',verify) 
router.get('/getUser2',getUser2) 
router.get('/getNotifications',getNotifications) 
router.post('/handleread',handleread)  
router.post('/handlefollow', handlefollow);
router.delete('/handleunfollow', handleunfollow); 
router.get('/checkfollows',checkfollows); 
router.get('/getFollowers',getFollowers);
router.get('/getFollowings',getFollowings)
module.exports = router;