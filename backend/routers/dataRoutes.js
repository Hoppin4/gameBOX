const express = require('express');
const { getGames,getPopularGames,getGamebyId,sentReview,getReview,searchGame,getMainGames, 
    deleteReview,publisher,platforms,createList,deleteList,getList, 
    insertGameToList,deleteGameFromList,getGameFromList,getListbyId,updateList, 
    getGameFromListbyUserId,getMostPopularGames,getUserReviews,getGamebyGenres, 
    getGamebyGenresout,getGamebyTags,getGamebyTagsout,getGamebydeveloper,getGamebydeveloperout,getUserList} = require('../controllers/dataController'); 

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

router.get('/getUserReviews',getUserReviews);  
router.get('/genres',getGamebyGenres); 
router.get('/genresout',getGamebyGenresout); 
router.get('/getTags',getGamebyTags)  
router.get('/getTagsout',getGamebyTagsout) 
router.get('/getdeveloper',getGamebydeveloper) 
router.get('/getdeveloperout',getGamebydeveloperout) 
router.get('/getUserList',getUserList)








module.exports = router;