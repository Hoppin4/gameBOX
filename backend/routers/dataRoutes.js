const express = require('express');
const { getGames,getPopularGames,getGamebyId,sentReview,getReview,searchGame,getMainGames, 
    deleteReview,publisher,platforms,createList,deleteList,getList, 
    insertGameToList,deleteGameFromList,getGameFromList,getListbyId,updateList, 
    getGameFromListbyUserId,getMostPopularGames,getReviewComp,getUserReviews,insertGame} = require('../controllers/dataController'); 

const router = express.Router(); 

router.get('/games', getGames);  
router.get('/popularGames',getPopularGames); 
router.get('/gamebyId',getGamebyId); 
router.post('/sentReview',sentReview);  
router.get('/getReview',getReview);  
router.get('/searchGame',searchGame);  
router.get('/getMainGames',getMainGames); 
router.delete('/deleteReview',deleteReview);  
router.get('/publisher',publisher);
router.get('/platforms',platforms);  
router.post('/createList',createList); 
router.delete('/deleteList',deleteList); 
router.get('/getList',getList); 
router.post('/insertGameToList',insertGameToList); 
router.delete('/deleteGameFromList',deleteGameFromList); 
router.get('/getGameFromList',getGameFromList);  
router.get('/getListbyId',getListbyId);
router.post('/updateList',updateList);  
router.get('/getGameFromListbyUserId',getGameFromListbyUserId); 
router.get('/getMostPopular',getMostPopularGames); 
router.get('/getReviewComp',getReviewComp); 
router.get('/getUserReviews',getUserReviews); 







module.exports = router;