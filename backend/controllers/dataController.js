const { createClient } = require('@supabase/supabase-js');
const axios = require('axios'); 
const dotenv = require('dotenv'); 
const bycrypt = require('bcrypt');
const { search } = require('../routers/dataRoutes');
dotenv.config();
  
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);  
const getMostPopularGames =async(req,res) =>{  
    const page = req.query.page;
    try{ 
        const response = await axios.get('https://api.rawg.io/api/games',{ 
            params:{ 
                key: process.env.API_KEY, 
                page: page,
                page_size: 20 ,  
                ordering:"-reviews_count", 
            }
        }) 
        res.json(response.data);
    }catch(error){ 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
}
const getPopularGames = async(req,res)=>{    
    const page = req.query.page;
    const searchTerm = req.query.search; 
    const startDate = req.query.startDate; 
    const endDate = req.query.endDate;  
    const order = req.query.order;

    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: page,
                page_size: 20 , 
                dates:`${startDate},${endDate}`,
                ordering:order, 
                search:searchTerm
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
} 
const getMainGames = async(req,res)=>{   
    const searchTerm = req.query.search; 
  
    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: 1,
                page_size: 20 , 
                ordering:"-reviews_count", 
                search:searchTerm
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
}


const getGames = async (req, res) => {
    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: 1,
                page_size: 10
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
}; 
const getGamebyId = async (req, res) => { 
    const gameId = req.query.gameId;  
    const gameName = req.query.gameName; 
    const gameImage = req.query.gameImage
    const { data: existing } = await supabase
        .from('Games')
        .select('game_id')
        .eq('game_id', gameId)
        .maybeSingle(); 
        if (!existing) {
            await supabase.from('Games').insert([
              {
                game_id: gameId,  
                game_name:gameName, 
                game_image:gameImage 
                
               

              },
            ]);
            
          } 
        
        
    try {
        const response1 = await axios.get(`https://api.rawg.io/api/games/${gameId}`, { 
            params: {
                key: process.env.API_KEY, 
               
            }
        }); 
        const response2 = await supabase.from('Games').select('*').eq('game_id',gameId); 
        const response3 = await axios.get(`https://api.rawg.io/api/games/${gameId}/screenshots`, { 
            params: {
                key: process.env.API_KEY, 
               
            }
        }); 
      
        const response4 = await axios.get(`https://api.rawg.io/api/games/${gameId}/game-series`, { 
            params: {
                key: process.env.API_KEY, 
               
            }
        });  
        const response5 = await axios.get(`https://api.rawg.io/api/games/${gameId}/stores`, { 
            params: {
                key: process.env.API_KEY, 
               
            }
        });    
        const response6 = await supabase
            .from('Posts')
            .select(`
                id,
                title,
                created_at,
                community_id,
                community:Communities (
                id,
                name,
                icon_image
                )
            `)
            .eq('gameID', gameId)
            .order('created_at', { ascending: false })
            .limit(5);
        const { data, error } = await supabase
            .from('Reviews')
            .select('*')
            .eq('game_id', gameId)
             
            
        res.json({
            game: response1.data,
            reviews : response2.data, 
            screenshots: response3.data,  
            series: response4.data, 
            userReview: data, 
            stores:response5.data, 
            posts: response6.data,
            
          });
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
};

const getReview = async (req, res) => { 
    const gameId = req.query.gameId; 
    const userId = req.query.userId;
    try {
        const { data, error } = await supabase
            .from('Reviews')
            .select('*')
            .eq('user_id', userId)
            .eq('game_id', gameId)
            .maybeSingle();
            return res.status(200).json({ review: data });
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
};
const sentReview = async (req, res) => { 

    const { gameId, userId, rating, review,liked,played,userName,avatar_url} = req.body; 
    const { data: existing } = await supabase
        .from('Reviews')
        .select('user_id')
        .eq('user_id', userId) 
        .eq('game_id', gameId)
        .maybeSingle();  

        if (!existing) {
            try{ 
                const { data, error } = await supabase
                .from('Reviews')
                .insert([
                    {
                        game_id: gameId,
                        user_id: userId,
                        rating: rating,
                        review: review, 
                        liked:liked, 
                        played:played, 
                        user_name:userName, 
                        user_avatar:avatar_url,
                    },
                ]);  
                if (error) {
                    console.error('Error inserting data:', error);
                    res.status(500).json({ message: 'Error inserting data', error });
                } else {
                    res.status(200).json({ message: 'Data inserted successfully', data });
                }
               
           }catch(error){ 
                console.error('Error fetching session:', error);
           }
            
          } else{ 
            try{ 
                const { data, error } = await supabase
                .from('Reviews')
                .update({
                    rating: rating,
                    review: review, 
                    liked:liked, 
                    played:played,
                })
                .eq('user_id', userId)
                .eq('game_id', gameId); 
                if (error) {
                    console.error('Error inserting data:', error);
                    res.status(500).json({ message: 'Error updated data', error });
                } else {
                    res.status(200).json({ message: 'Data updated successfully', data });
                }
           }catch(error){ 
                console.error('Error fetching session:', error);
           }
          } 
   
}; 
const searchGame = async (req, res) => { 
    const searchTerm = req.query.searchTerm; 
    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: 1,
                page_size: 5,
                search: searchTerm
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
}; 
const deleteReview = async (req, res) => { 
    const reviewId = req.query.reviewId; 
    try{ 
        const response = await supabase
            .from('Reviews')
            .delete()
            .eq('id', reviewId);  
        if (response.error) { 
            console.error('Error deleting review:', response.error);
            res.status(500).json({ message: 'Error deleting review', error: response.error });
        } 
        else {
            res.status(200).json({ message: 'Review deleted successfully' });
        }

    }catch(error){ 
        console.error('Error fetching session:', error);
    }  

} 
const publisher = async (req, res) => { 
    const publishers = req.query.publishers;  
    const page = req.query.page;
    
    

    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: page,
                page_size: 20 , 
                ordering:"popularity", 
                publishers:publishers,
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
}
 
const platforms = async (req, res) => { 
    const platforms = req.query.platforms;  
    const page = req.query.page;
    const order = req.query.order;
    

    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: page,
                page_size: 20 , 
                platforms:platforms, 
                ordering:order
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
}  
 
const createList = async (req, res) => { 
    const { description, userId, listName } = req.body; 
    try{ 
        const { data, error } = await supabase
        .from('GameLists')
        .insert([
            {  
                user_id: userId,
                name: listName, 
                description: description,
            },
        ]) 
        .select(); 
        
        if (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ message: 'Error inserting data', error });
        } else {
            res.status(200).json({ message: 'Data inserted successfully', data });
        }
    }catch(error){ 
        console.error('Error fetching session:', error);
    }  
} 
const deleteList = async (req, res) => { 
    const {listId}= req.query; 
    try{ 
        const response = await supabase
            .from('GameLists')
            .delete()
            .eq('id', listId);  
        if (response.error) { 
            console.error('Error deleting review:', response.error);
            res.status(500).json({ message: 'Error deleting review', error: response.error });
        } 
        else {
            res.status(200).json({ message: 'Review deleted successfully' });
        }

    }catch(error){ 
        console.error('Error fetching session:', error);
    }  

} 
const getList = async (req, res) => { 
    const { userId } = req.query;
    try {
        const response = await supabase
            .from('GameLists')
            .select('*')
            .eq('user_id', userId);  
        if (response.error) { 
            console.error('Error deleting review:', response.error);
            res.status(500).json({ message: 'Error getting review', error: response.error });
        } 
        else {
            res.status(200).json({ message: 'Review got successfully', data:response.data });
        }

    }catch(error){ 
        console.error('Error fetching session:', error);
    }  

} 
const insertGameToList = async (req, res) => { 
    const {   gameId, listId,gameName,gameImage } = req.body;  
    const { data: existing } = await supabase
        .from('Games')
        .select('game_id')
        .eq('game_id', gameId)
        .maybeSingle(); 
        if (!existing) {
            await supabase.from('Games').insert([
              {
                game_id: gameId,

              },
            ]);
            
          } 
    try{ 
        const { data, error } = await supabase
        .from('GameListItems')
        .insert([
            {  
                game_id: gameId,
                list_id:listId, 
                game_name:gameName, 
                game_picture:gameImage,
            },
        ]);  
        if (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ message: 'Error inserting data', error });
        } else {
            res.status(200).json({ message: 'Data inserted successfully', data });
        }
    }catch(error){ 
        console.error('Error fetching session:', error);
    }  
} 
const deleteGameFromList = async (req, res) => { 
    const listGameId = req.query.listGameId; 
  
    try{ 
        const response = await supabase
            .from('GameListItems')
            .delete()
            .eq('id', listGameId)  
             
        if (response.error) { 
            console.error('Error deleting review:', response.error);
            res.status(500).json({ message: 'Error deleting review', error: response.error });
        } 
        else {
            res.status(200).json({ message: 'Review deleted successfully' });
        }

    }catch(error){ 
        console.error('Error fetching session:', error);
    }  

} 
const getGameFromList = async (req, res) => { 
    const listId = req.query.listId;  
    try {
        const response = await supabase
            .from('GameListItems')
            .select('*')
            .eq('list_id', listId);  
        if (response.error) { 
            console.error('Error deleting review:', response.error);
            res.status(500).json({ message: 'Error deleting review', error: response.error });
        } 
        else {
            res.status(200).json({ message: 'Review deleted successfully', data:response.data });
        }

    }catch(error){ 
        console.error('Error fetching session:', error);
    }  

}  
const getListbyId = async (req, res) => { 
    const listId = req.query.listId;  
    try {
        const response = await supabase
            .from('GameLists')
            .select('*')
            .eq('id', listId);  
        if (response.error) { 
            console.error('Error getting list:', response.error);
            res.status(500).json({ message: 'Error getting list', error: response.error });
        } 
        else {
            res.status(200).json({ message: 'Review sent successfully', data:response.data });
        }

    }catch(error){ 
        console.error('Error fetching session:', error);
    }  

}

const updateList = async (req, res) => { 
    const { listId, description, listName } = req.body; 
    try{ 
        const { data, error } = await supabase
        .from('GameLists')
        .update({
            description: description,
            name: listName, 
        })
        .eq('id', listId);  
        
        if (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ message: 'Error inserting data', error });
        } else {
            res.status(200).json({ message: 'Data inserted successfully', data });
        }
    }catch(error){ 
        console.error('Error fetching session:', error);
    }  
} 
const getGameFromListbyUserId = async (req, res) => { 
    const listId = req.query.listId;   
    const gameId = req.query.gameId;


    try {
        const response = await supabase
            .from('GameListItems')
            .select('list_id, game_id')
            .eq('game_id', gameId)  
            .eq('list_id', listId); 

        if (response.error) { 
            console.error('Error fetching data:', response.error);
            res.status(500).json({ message: 'Error fetching data', error: response.error });
        } 
        else {
          
            if (response.data.length > 0) {
                res.status(200).json({ exists: true }); 
            } else {
                res.status(200).json({ exists: false });  
            }
        }
    } catch (error) { 
        console.error('Error fetching session:', error);
        res.status(500).json({ message: 'Server error', error });
    }  
}
const getUserReviews = async(req,res) =>{ 
    const userId = req.query.userId; 
    const limit = req.query.limit 
    try{ 
        const response = await supabase 
        .from('Reviews')  
        .select('*') 
        .eq('user_id',userId) 
        .limit(limit) 
         
        res.status(200).json({ message: 'Data sent successfully', response });
    }catch(error){ 
        res.status(500).json({ message: 'Error fetching data', error: response.error });
    }
    
} 
const getReviewComp = async(req,res)=>{ 
    const gameId = req.query.gameId; 
    try{
        const response = await supabase 
        .from('Games') 
        .select('game_name,game_image') 
        .eq('game_id',gameId) 
        .limit(1) 
        .single(); 

        res.status(200).json({ message: 'Data sent successfully', response });
    }catch(error){ 
        res.status(500).json({ message: 'Error fetching data', error: response.error });
    }
} 
const getGamebyGenres = async(req,res) => { 
    const genre = req.query.genre; 
    const platform = req.query.platform;  
    const page = req.query.page;
    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: page,
                page_size: 20 , 
                ordering:"popularity", 
                genres:genre, 
                platforms:platform
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
} 
const getGamebyGenresout = async(req,res) => { 
    const genre = req.query.genre; 
    const page = req.query.page;
    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: page,
                page_size: 20 , 
                ordering:"popularity", 
                genres:genre, 
              
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
} 
const getGamebyTags = async(req,res) => { 
    const tag = req.query.tags;  
    const platform = req.query.platform;  
    const page = req.query.page;
    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: page,
                page_size: 20 , 
                ordering:"popularity", 
                tags:tag, 
                platforms:platform
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
} 
const getGamebyTagsout = async(req,res) => { 
    const tag = req.query.tags; 
    const page = req.query.page;
    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: page,
                page_size: 20 , 
                ordering:"popularity", 
                tags:tag, 
              
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
} 
const getGamebydeveloper = async(req,res) => { 
    const slug = req.query.slug;  
    const platform = req.query.platform; 
    const page = req.query.page;
    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: page,
                page_size: 20 , 
                ordering:"popularity", 
                developers:slug,  
                platforms:platform,
              
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
} 
const getGamebydeveloperout = async(req,res) => { 
    const slug = req.query.slug; 
    const page = req.query.page;
    try {
        const response = await axios.get('https://api.rawg.io/api/games', { 
            params: {
                key: process.env.API_KEY, 
                page: page,
                page_size: 20 , 
                ordering:"popularity", 
                developers:slug,  
              
            }
        });
        res.json(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Veri çekme hatası', error: error.message });
    }
}
module.exports = { getGames,getPopularGames,getGamebyId,sentReview, 
    getReview,searchGame,getMainGames,deleteReview,publisher, 
    platforms,createList,deleteList,getList,insertGameToList 
    ,deleteGameFromList,getGameFromList,getListbyId,updateList 
,getGameFromListbyUserId,getMostPopularGames,getUserReviews,getReviewComp,  
getGamebyGenres,getGamebyGenresout,getGamebyTags,getGamebyTagsout,getGamebydeveloper,getGamebydeveloperout }; 
