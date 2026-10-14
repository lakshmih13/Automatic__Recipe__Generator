import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MealPlan.css';

const MealPlan = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mealPlans, setMealPlans] = useState([]);
    const [isLoadingMealPlans, setIsLoadingMealPlans] = useState(true);
    const [recipeMap, setRecipeMap] = useState({});
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        Modal.setAppElement('#root');
        fetchRecipes();
        fetchMealPlans();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/getAllRecipes');
            setRecipes(response.data);
            setIsLoading(false);

            const newRecipeMap = {};
            response.data.forEach(recipe => {
                newRecipeMap[recipe.recipeId] = recipe.title;
            });
            setRecipeMap(newRecipeMap);
        } catch (error) {
            toast.error('Error fetching recipes');
            setIsLoading(false);
        }
    };

    const fetchMealPlans = async () => {
        const email = sessionStorage.getItem("email");
        if (!email) {
            toast.error('Email is required to fetch meal plans');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/meal-plans/${email}`);
            setMealPlans(response.data);
            setIsLoadingMealPlans(false);
        } catch (error) {
            toast.error('Error fetching meal plans');
            setIsLoadingMealPlans(false);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleRecipeChange = (recipeId) => {
        setSelectedRecipeIds(prevSelected => 
            prevSelected.includes(recipeId)
                ? prevSelected.filter(id => id !== recipeId)
                : [...prevSelected, recipeId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const email = sessionStorage.getItem("email");
        if (!email) {
            toast.error('Email is required to save the meal plan');
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/meal-plans/${email}`, {
                date: selectedDate,
                recipeIds: selectedRecipeIds
            });
            toast.success('Meal plan saved successfully!');
            setSelectedDate('');
            setSelectedRecipeIds([]);
            fetchMealPlans(); // Refresh meal plans after saving
        } catch (error) {
            toast.error('Error saving meal plan');
        }
    };

    const handleViewIngredients = async (recipeId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/recipes/${recipeId}/ingredients`);
            console.log('Ingredients fetched:', response.data); // Log the response data
            setSelectedIngredients(response.data);
            setIsModalOpen(true);
        } catch (error) {
            toast.error('Error fetching ingredients');
        }
    };

    const handleDeleteMealPlan = async (mealPlanId) => {
        const email = sessionStorage.getItem("email");
        if (!email) {
            toast.error('Email is required to delete the meal plan');
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/meal-plans/${email}/${mealPlanId}`);
            toast.success('Meal plan deleted successfully!');
            fetchMealPlans(); // Refresh meal plans after deletion
        } catch (error) {
            toast.error('Error deleting meal plan');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="meal-plan-container">
            <div className="meal-plan-card">
                <h1>Meal Plan</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="date">Select Date:</label>
                        <input
                            type="date"
                            id="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            required
                        />
                    </div>
                    <div>
    <label>Select Recipes:</label>
    <div className="checkbox-group scrollable-recipes">
        {isLoading ? (
            <p>Loading recipes...</p>
        ) : (
            recipes.map(recipe => (
                <div key={recipe.recipeId} className="checkbox-item">
                    <input
                        type="checkbox"
                        id={`recipe-${recipe.recipeId}`}
                        checked={selectedRecipeIds.includes(recipe.recipeId.toString())}
                        onChange={() => handleRecipeChange(recipe.recipeId.toString())}
                    />
                    <label htmlFor={`recipe-${recipe.recipeId}`}>
                        {recipe.title}
                    </label>
                </div>
            ))
        )}
    </div>
</div>

                    <button type="submit" className="btn btn-success">Save Meal Plan</button>
                </form>
            </div>
            <div className="meal-plans-table-custom">
                <h2>Your Meal Plans</h2>
                {isLoadingMealPlans ? (
                    <p>Loading meal plans...</p>
                ) : mealPlans.length === 0 ? (
                    <p>No meal plans found.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>SL No.</th>
                                <th>Date</th>
                                <th>Recipes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mealPlans.map((mealPlan, index) => (
                                <tr key={mealPlan.meal_plan_id}> {/* Use meal_plan_id */}
                                    <td>{index + 1}</td>
                                    <td>{mealPlan.date}</td>
                                    <td>
    <>
        {mealPlan.recipeIds.length > 0 ? (
            mealPlan.recipeIds.map(id => (
                <div key={id} className="mb-2">
                    {recipeMap[id] || id}
                    <button 
                        className="btn btn-primary btn-sm ml-4" 
                        style={{ marginLeft: '12px' }}
                        onClick={() => handleViewIngredients(id)}
                    >
                        View Ingredients
                    </button>
                </div>
            ))
        ) : (
            'No Recipes'
        )}
    </>
</td>


                                    <td>
                                        <button 
                                            className="btn btn-danger btn-sm" 
                                            onClick={() => handleDeleteMealPlan(mealPlan.meal_plan_id)} // Use meal_plan_id for deletion
                                        >
                                            Delete Meal Plan
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Modal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        style={{
            content: {
                width: '350px', // Set width to a smaller size
                height: '500px', // Optional: set a specific height
                margin: 'auto', // Center the modal
                padding: '20px', // Add some padding
            }
        }}
    >
        <h2>Ingredients</h2>
        <button className="btn btn-secondary" style={{ marginLeft:'230px'}} onClick={closeModal}>Close</button>
        <table className="table">
            <thead>
                <tr>
                    <th>Ingredient</th>
                </tr>
            </thead>
            <tbody>
                {selectedIngredients.map((ingredient, index) => (
                    <tr key={index}>
                        <td>{ingredient.ingredientName}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Modal>

            <ToastContainer />
        </div>
    );
};

export default MealPlan;
