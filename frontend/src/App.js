import React from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout'; 
import Home from './pages/HomePage'; 
import Community from './pages/CommunityPage'; 
import SingupPage from './pages/SigninPage'; 
import RegisterPage from './pages/RegisterPage'; 
import ProfilePage from './pages/ProfilePage'; 
import AuthProvider from './provider/AuthProvider';
 import ProfileEditPage from './pages/ProfileEditPage'; 
import MainGamesPage from './pages/MainGamesPage'; 
import GameDetailPage from './pages/GameDetailPage'; 
import PublisherPage from './pages/PublisherPage'; 
import PlatformsPage from './pages/PlatformsPage';  
import NewListPage from './pages/NewListPage'; 
import ShowListPage from './pages/ShowListPage'; 
import ListEditPage from './pages/ListEditPage'; 
import LeftLayout from './pages/LeftLayout'; 
import ReviewsPage from './pages/ReviewsPage';
function App() {
   

  return ( 
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}> 
            
            <Route index element={<Home />} /> 
            <Route path="community" element={<Community />} /> 
            <Route path="signup" element={<SingupPage />} /> 
            <Route path='register' element={<RegisterPage />} /> 
            <Route path='/:name' element={<ProfilePage />} />
            <Route path='/:name/edit' element={<ProfileEditPage />} /> 
            <Route path='/MainGamesPage/:slug' element={<MainGamesPage/>}/> 
            <Route path='/GameDetailPage/:gameId/:gameTitle' element={<GameDetailPage/>}/> 
            <Route path='/PublisherPage/:name' element={<PublisherPage/>}/> 
            <Route path='/PlatformsPage/:name' element={<PlatformsPage/>}/> 
            <Route path='/list/new' element={<NewListPage/>}/> 
            <Route path='/list/:id' element={<ShowListPage/>}/>  
            <Route path='/list/:id/edit' element={<ListEditPage/>}/>  
            <Route path='/reviews/:id' element={<ReviewsPage/>}/>
            
          </Route> 
          
        </Routes>
      </BrowserRouter> 
    </AuthProvider>
  );
}

export default App;
