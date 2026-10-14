import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Modal from './Modal';
import CommentsModal from './CommentsModal';
import 'react-toastify/dist/ReactToastify.css';
import './GenerateRecipe.css';

const GenerateRecipe = () => {
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [suggestedRecipes, setSuggestedRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [ratings, setRatings] = useState({});
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const recipeContainerRef = useRef(null);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get('http://localhost:8080/getingredients');
                setAvailableIngredients(response.data);
            } catch (error) {
                console.error('Error fetching ingredients', error);
                toast.error('Error fetching ingredients');
            }
        };
        fetchIngredients();
    }, []);

    const handleIngredientChange = (ingredientId) => {
        setSelectedIngredients((prev) => 
            prev.includes(ingredientId) ? prev.filter(id => id !== ingredientId) : [...prev, ingredientId]
        );
    };

    const handleGenerateRecipes = async (e) => {
        e.preventDefault();
        if (selectedIngredients.length === 0) {
            toast.error("Please select at least one ingredient.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/generateRecipes', selectedIngredients);
            setSuggestedRecipes(response.data);
            await fetchRatings(response.data);
            if (response.data.length === 0) {
                alert("No recipes matched, please select more ingredients.");
            } else {
                toast.success("Recipes generated successfully!");
                recipeContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
            setSelectedIngredients([]);
            setSearchTerm('');
        } catch (error) {
            const errorMessage = error.response?.data || 'Error generating recipes';
            toast.error(errorMessage);
        }
    };

    const fetchRatings = async (recipes) => {
        const newRatings = {};
        for (const recipe of recipes) {
            const comments = await fetchComments(recipe.recipeId);
            newRatings[recipe.recipeId] = comments.length > 0 ? 
                (comments.reduce((acc, curr) => acc + curr.rating, 0) / comments.length).toFixed(1) : 0;
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

    const filteredIngredients = availableIngredients.filter(ingredient =>
        ingredient.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRecipe(null);
    };

    const handleCommentsClick = async (e, recipeId) => {
        e.preventDefault();
        e.stopPropagation();
        const fetchedComments = await fetchComments(recipeId);
        setComments(fetchedComments);
        setIsCommentsModalOpen(true);
    };

    return (
        <div className="container">
            <div className="c-card">
                <form onSubmit={handleGenerateRecipes}>
                    <div>
                        <label>Search Ingredients:</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search ingredients..."
                            style={{ marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label>Available Ingredients:</label>
                        <div className="ingredient-grid">
                            {filteredIngredients.map((ingredient) => (
                                <div key={ingredient.ingredientId} style={{ width: '33.33%', display: 'flex', alignItems: 'center', padding: '5px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIngredients.includes(ingredient.ingredientId)}
                                        onChange={() => handleIngredientChange(ingredient.ingredientId)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    <span>{ingredient.ingredientName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        style={{ backgroundColor: '#007BFF', color: 'white', border: 'none', padding: '10px 20px', fontSize: '19px', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
                    >
                        Generate Recipes
                    </button>
                </form>
            </div>

            {suggestedRecipes.length > 0 && (
                <div ref={recipeContainerRef} className="recipe-card-container">
                    {suggestedRecipes.map((recipe) => {
                        const averageRating = ratings[recipe.recipeId] || 0;
                        return (
                            <div key={recipe.recipeId} className="recipe-card" onClick={() => openModal(recipe)}>
                                <img
                                    src={recipe.imageData ? `data:image/png;base64,${recipe.imageData}` : ''}
                                    alt={recipe.title}
                                />
                                <h2>{recipe.title}</h2>
                                <div className="rating">
                                    {[...Array(5)].map((_, index) => (
                                        <span key={index} className={index < averageRating ? 'star filled' : 'star'}>
                                            ★
                                        </span>
                                    ))}
                                    <span className="average-rating"> ({averageRating})</span>
                                </div>
                                <a 
                                    href="#"
                                    className="text-primary mt-2" 
                                    onClick={(e) => handleCommentsClick(e, recipe.recipeId)}
                                >
                                    See Comments
                                </a>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal} recipe={selectedRecipe} />
            <CommentsModal 
                isOpen={isCommentsModalOpen} 
                onClose={() => setIsCommentsModalOpen(false)} 
                comments={comments} 
            />
            <ToastContainer />
        </div>
    );
};

export default GenerateRecipe;
