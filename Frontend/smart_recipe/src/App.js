import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer for global notifications
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Visitor from './Visitor';

import ManageRecipes from './AdminComponents/ManageRecipes';
import ManageCategories from './AdminComponents/ManageCategories';

import UpdatePassword from './AdminComponents/UpdatePassword';
import UserDashboard from './UserComponents/UserDashboard';
import RecipeList from './UserComponents/RecipeList';

import RecipeForm from './UserComponents/RecipeForm';



import UpdateProfile from './UserComponents/UpdateProfile';
import AdminDashboard from './AdminComponents/AdminDashboard';
import ManageIngredients from './AdminComponents/ManageIngredients';
import RecipeSearch from './UserComponents/RecipeSearch';
import AdminRecipeForm from './AdminComponents/AdminRecipeForm';
import GenerateRecipe from './UserComponents/GenerateRecipe';
import MealPlan from './UserComponents/MealPlan';
;

export default function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/visitor" element={<Visitor/>}/>
                <Route path="/login" element={<Login />} />
                
             
                <Route path="/adminDashboard" element={<AdminDashboard />}>
                <Route path="adminrecipeForm" element={<AdminRecipeForm />} /> 
                <Route path="manageRecipes" element={<ManageRecipes/>} />
                <Route path="manageIngredients" element={<ManageIngredients />} />
                <Route path="manageCategories" element={<ManageCategories />} />
            
                <Route path="updatePassword" element={<UpdatePassword />} />
                    
                </Route>
                
              
                <Route path="/userDashboard" element={<UserDashboard />}>GenerateRecipe
                <Route path="generateRecipe" element={<GenerateRecipe/>} />
                <Route path="recipeList" element={<RecipeList/>} />
                <Route path="recipeForm" element={<RecipeForm />} /> 
                <Route path="recipeSearch" element={<RecipeSearch />} /> 
                <Route path="mealPlan" element={<MealPlan/>}/>
          
               
                
                <Route path="updateProfile" element={<UpdateProfile />} />

                   
                </Route>
                
            </Routes>
            </BrowserRouter>
    </div>
  );
}
