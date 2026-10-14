import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const contextValue = {
        setResponseMessage: (message) => toast(message),
    };
    const headerStyle = {
                backgroundColor: '#343a40', // Dark background for header
                color: 'white',
            };

    return (
        <div   className="admin-dashboard">
            <ToastContainer />

            <header style={headerStyle} className="header p-4">
                <h1 className="header-title">Admin Dashboard</h1>
                <nav className="navbar">
                <Link to="adminrecipeForm" className="nav-link">Create Recipe</Link>
                    <Link to="manageRecipes" className="nav-link">Manage Recipes</Link>
                    <Link to="manageCategories" className="nav-link">Manage Categories</Link>
                    <Link to="manageIngredients" className="nav-link">Manage Ingredients </Link>
                   
                    <Link to="updatePassword" className="nav-link">Update Password</Link>
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