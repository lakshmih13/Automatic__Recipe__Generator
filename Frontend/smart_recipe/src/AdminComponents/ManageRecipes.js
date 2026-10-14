import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './ManageRecipes.css';

const ManageRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8080/getAllRecipesFalse');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setRecipes(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        toast.error('Error fetching recipes: ' + error.message);
        setLoading(false); // Set loading to false if error occurs
      }
    };

    fetchRecipes();
  }, []);

  const handleCardClick = async (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);

    // Fetch ingredients for the selected recipe
    try {
      const response = await axios.get(`http://localhost:8080/api/recipes/${recipe.recipeId}/ingredients`);
      setIngredients(response.data);
    } catch (error) {
      toast.error('Error fetching ingredients: ' + error.message);
    }
  };

  const handleApprove = async () => {
    if (!selectedRecipe) return;

    try {
      const response = await axios.put(`http://localhost:8080/approveRecipe/${selectedRecipe.recipeId}`, {
        isApproved: true
      });

      if (response.status === 200) {
        toast.success('Recipe approved successfully!');
        setRecipes(prevRecipes => 
          prevRecipes.filter(recipe => recipe.recipeId !== selectedRecipe.recipeId)
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Error approving recipe';
      toast.error(errorMessage);
    }
  };

  const handleReject = async () => {
    if (!selectedRecipe) return;

    try {
      const response = await axios.delete(`http://localhost:8080/rejectRecipe/${selectedRecipe.recipeId}`);

      if (response.status === 204) {
        toast.success('Recipe rejected successfully!');
        setRecipes(prevRecipes => 
          prevRecipes.filter(recipe => recipe.recipeId !== selectedRecipe.recipeId)
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Error rejecting recipe';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container">
      <h1>Manage Recipes</h1>
      
      {/* Show loading spinner while fetching recipes */}
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status" style={{ color: 'red' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : recipes.length === 0 ? (
        <p>No recipes available.</p>
      ) : (
        <div className="recipe-card-container">
          {recipes.map(recipe => (
            <div key={recipe.recipeId} className="recipe-card" onClick={() => handleCardClick(recipe)}>
              <img src={`data:image/png;base64,${recipe.imageData}`} alt={recipe.title} />
              <h2>{recipe.title}</h2>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />

      {isModalOpen && selectedRecipe && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>Close</button>
            <div className="modal-body">
              <h2>{selectedRecipe.title}</h2>
              <div className="modal-grid">
                <div className="details-column">
                  <p><b>Category: </b>{selectedRecipe.category?.categoryName || 'N/A'}</p>
                  <p><b>Subcategory:</b> {selectedRecipe.subcategory?.subcategoryName || 'N/A'}</p>
                  <p><b>Description:</b> {selectedRecipe.description}</p>
                  <p><b>Nutritional Information: </b>{selectedRecipe.nutritionaldescription}</p>
                </div>
                <div className="ingredients-column">
                  <h3 style={{ marginRight: '3px' }}>Ingredients:</h3>
                  <div className="ingredients-container">
                    {ingredients.length > 0 ? (
                      ingredients.map(ingredient => (
                        <span key={ingredient.ingredientId} className="ingredient-item">
                          {ingredient.ingredientName}
                        </span>
                      ))
                    ) : (
                      <span>No ingredients found</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="button-group">
                <button className="approve-button" onClick={handleApprove}>Approve</button>
                <button className="reject-button" onClick={handleReject}>Reject</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRecipes;
