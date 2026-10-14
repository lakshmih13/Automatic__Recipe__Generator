import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './RecipeList.css';
import CommentsModal from './CommentsModal';
import { Spinner } from 'react-bootstrap'; // Import Spinner from Bootstrap

const RecipeList = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState({ title: '', description: '', nutritionaldescription: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState([]);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true); // Start spinner
      const email = sessionStorage.getItem('email');
      if (!email) {
        toast.error("User email not found in session storage.");
        setLoading(false); // Stop spinner
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/getRecipesByEmail/${email}`);
        setUserRecipes(response.data);
        await fetchRatings(response.data);
      } catch (error) {
        const errorMessage = error.response?.data || 'Error fetching recipes';
        toast.error(errorMessage);
      } finally {
        setLoading(false); // Stop spinner
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

  const handleImageClick = (recipe) => {
    setSelectedRecipe(recipe);
    setRecipeDetails({ title: recipe.title, description: recipe.description, nutritionaldescription: recipe.nutritionaldescription });
    setIsApproved(recipe.approved);
    setIsModalOpen(true);
  };

  const handleCommentsClick = async (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();

    const fetchedComments = await fetchComments(recipeId);
    setComments(fetchedComments);
    setIsCommentsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedRecipe) return;

    try {
      const response = await axios.put(`http://localhost:8080/recipesUser/${selectedRecipe.recipeId}`, recipeDetails);
      if (response.status === 200) {
        setUserRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe.recipeId === selectedRecipe.recipeId ? { ...recipe, ...recipeDetails } : recipe
          )
        );
        toast.success('Recipe updated successfully!');
        setSelectedRecipe(null);
        setIsModalOpen(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Error updating recipe';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/rejectRecipe/${id}`);
      if (response.status === 200) {
        setUserRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.recipeId !== id));
        toast.success('Recipe deleted successfully!');
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Error deleting recipe';
      toast.error(errorMessage);
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    await handleUpdate();
    setIsEditModalOpen(false);
  };

  return (
    <div className="container">
       {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" role="status" variant="danger">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
        <>
      {userRecipes.length > 0 ? (
        <div className="recipe-card-container">
          {userRecipes.map(recipe => {
            const averageRating = ratings[recipe.recipeId] || 0;

            return (
              <div 
                key={recipe.recipeId} 
                className="recipe-card" 
                onClick={() => handleImageClick(recipe)}
              >
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
      ) : (
        <p>No recipes found.</p>
      )}
       </>
      )}
      <ToastContainer />
      
      {/* Recipe Update Modal */}
      {isModalOpen && selectedRecipe && (
        <div className="recipe-update-modal-overlay">
          <div className="recipe-update-modal-content">
            <button className="recipe-update-close-button" onClick={() => setIsModalOpen(false)}>×</button>
            <div className="recipe-update-modal-body">
              <div className="recipe-update-modal-info">
                <h2>{selectedRecipe.title}</h2>
                <p>{selectedRecipe.description}</p>
                <p>Nutritional Info: {selectedRecipe.nutritionaldescription}</p>
                <p>Date Submitted: {selectedRecipe.dateSubmitted}</p>
                <p>Category: {selectedRecipe.category.categoryName}</p>
                <p>Subcategory: {selectedRecipe.subcategory.subcategoryName}</p>
                <div className="modal-buttons">
  {!isApproved && (
    <>
      <button className="edit-button" onClick={handleEdit}>Edit</button>
      {/* <button className="delete-button" onClick={() => handleDelete(selectedRecipe.recipeId)}>Delete</button> */}
    </>
  )}
  {isApproved && (
    <p style={{ color: 'grey' }}>Edit and Delete options are disabled for approved recipes.</p>
  )}
</div>

              </div>
            </div>
          </div>
        </div>
      )}





{/* Recipe Edit Modal */}
{isEditModalOpen && (
  <div className="edit-recipe-modal-overlay">
    <div className="edit-recipe-modal-content">
      <div className="edit-recipe-modal-header">
        <h2 className="edit-recipe-title">
          Edit Recipe
        </h2>
        <button className="edit-recipe-close-button" onClick={() => setIsEditModalOpen(false)}>×</button>
      </div>
      <div className="edit-recipe-modal-body">
        <label>
          Title:
          <input 
            type="text" 
            value={recipeDetails.title} 
            onChange={(e) => setRecipeDetails({ ...recipeDetails, title: e.target.value })}
            style={{ width: '100%', marginBottom: '10px' }} 
          />
        </label>
        <label>
          Description:
          <textarea 
            value={recipeDetails.description} 
            onChange={(e) => setRecipeDetails({ ...recipeDetails, description: e.target.value })}
            className="edit-recipe-description-textarea"
          />
        </label>
        <label>
          Nutritional Description:
          <textarea 
            value={recipeDetails.nutritionaldescription} 
            onChange={(e) => setRecipeDetails({ ...recipeDetails, nutritionaldescription: e.target.value })}
            className="edit-recipe-description-textarea"
          />
        </label>
        <div className="edit-recipe-modal-buttons">
          <button onClick={handleEditSave} className="save-button">Save</button>
          <button onClick={() => setIsEditModalOpen(false)} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}



      {/* Comments Modal */}
      <CommentsModal 
        isOpen={isCommentsModalOpen} 
        onClose={() => setIsCommentsModalOpen(false)} 
        comments={comments} 
      />
    </div>
  );
};

export default RecipeList;
