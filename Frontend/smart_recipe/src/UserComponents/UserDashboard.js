import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './UserDashboard.css';

const AdminDashboard = () => {
    const contextValue = {
        setResponseMessage: (message) => toast(message),
    };
    const headerStyle = {
                backgroundColor: '#343a40', // Dark background for header
                color: 'white',
            };
    return (
        <div   className="user-dashboard">
            <ToastContainer />

            <header style={headerStyle} className="header p-4">
                <h1 className="header-title">User Dashboard</h1>
                <nav className="navbar">
                    <Link to="generateRecipe" className="nav-link">Generate Recipe</Link>
                    <Link to="recipeList" className="nav-link">View My Recipes</Link>
                    <Link to="recipeForm" className="nav-link">Create & Submit Recipe</Link>
                    <Link to="RecipeSearch" className="nav-link"> Search Recipe </Link>
                    <Link to="mealPlan" className="nav-link">MealPlan</Link>
                    <Link to="updateProfile" className="nav-link">Update Profile</Link>
                    <Link to="/" className="nav-link logout">Logout</Link>
                </nav>
            </header>

            <main  className="main-content">
                <Outlet context={contextValue} />
            </main>
        </div>
    );
};

export default AdminDashboard;