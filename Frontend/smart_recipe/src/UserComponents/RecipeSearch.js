import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './RecipeSearch.css';
import Modal from './Modal';
import CommentsModal from './CommentsModal'; // Import CommentsModal
import { Spinner } from 'react-bootstrap'; // Import Spinner from Bootstrap

const RecipeSearch = () => {
    const [allRecipes, setAllRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState([]); // State for comments
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false); // State for comments modal
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get('http://localhost:8080/getAllRecipes');
                setAllRecipes(response.data);
                setFilteredRecipes(response.data);
                await fetchRatings(response.data);
            } catch (error) {
                const errorMessage = error.response?.data || 'Error fetching recipes';
                toast.error(errorMessage);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchRecipes();
    }, []);

    const fetchRatings = async (recipes) => {
        const newRatings = {};
        for (const recipe of recipes) {
            const comments = await fetchComments(recipe.recipeId);
            if (comments.length > 0) {
                const sum = comments.reduce((acc, curr) => acc + curr.rating, 0);
                newRatings[recipe.recipeId] = (sum / comments.length).toFixed(1);
            } else {
                newRatings[recipe.recipeId] = 0;
            }
        }
        setRatings(newRatings);
    };

    const fetchComments = async (recipeId) => {
        try {
            const response = await axios.get(`http://localhost:8080/comments/${recipeId}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data || 'Error fetching comments';
            toast.error(errorMessage);
            return [];
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = allRecipes.filter(recipe =>
            recipe.title.toLowerCase().includes(term)
        );
        setFilteredRecipes(filtered);
    };

    const handleCardClick = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const handleSeeCommentsClick = async (recipeId) => {
        const fetchedComments = await fetchComments(recipeId);
        setComments(fetchedComments);
        setIsCommentsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    };

    const closeCommentsModal = () => {
        setIsCommentsModalOpen(false);
        setComments([]);
    };

    return (
        <div className="container">
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', textAlign: 'center' }}>
                <h1 style={{ color: 'red', textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}>
                    Recipe Search
                </h1>
            </div>
            <input
                type="text"
                placeholder="Search for a recipe..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" role="status" variant="danger">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : filteredRecipes.length > 0 ? (
                <div className="recipe-card-container">
                    {filteredRecipes.map(recipe => (
                        <div key={recipe.recipeId} className="recipe-card" onClick={() => handleCardClick(recipe)}>
                            <img
                                src={recipe.imageData ? `data:image/png;base64,${recipe.imageData}` : ''}
                                alt={recipe.title}
                            />
                            <h2>{recipe.title}</h2>
                            <div className="rating">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <span key={index} className={index < (ratings[recipe.recipeId] || 0) ? 'star filled' : 'star'}>
                                        ★
                                    </span>
                                ))}
                                <span className="average-rating"> ({ratings[recipe.recipeId] || 0})</span>
                                <button className="btn btn-link" onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering card click
                                    handleSeeCommentsClick(recipe.recipeId);
                                }}>
                                    See Comments
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No recipes found.</p>
            )}
            <ToastContainer />
            <Modal isOpen={isModalOpen} onClose={closeModal} recipe={selectedRecipe} />
            <CommentsModal isOpen={isCommentsModalOpen} onClose={closeCommentsModal} comments={comments} /> {/* Integrate CommentsModal */}
        </div>
    );
};

export default RecipeSearch;
