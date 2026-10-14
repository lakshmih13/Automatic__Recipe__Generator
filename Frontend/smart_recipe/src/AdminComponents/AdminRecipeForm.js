import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminRecipeForm.css'; // Import the CSS file

const AdminRecipeForm = ({ email }) => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [subcategoryId, setSubcategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [nutritionalDescription, setNutritionalDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories');
                setCategories(response.data);
                console.log("Categories data : --",response.data)
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubcategories = async () => {
            if (categoryId) {
                try {
                    const response = await axios.get(`http://localhost:8080/subcategories/${categoryId}`);
                    setSubcategories(response.data);
                } catch (error) {
                    console.error('Error fetching subcategories', error);
                }
            } else {
                setSubcategories([]);
            }
        };
        fetchSubcategories();
    }, [categoryId]);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get('http://localhost:8080/getingredients');
                setIngredients(response.data);
                console.log("Data :-------------" ,response);
            } catch (error) {
                console.error('Error fetching ingredients', error);
            }
        };
        fetchIngredients();
    }, []);

    const handleIngredientChange = (ingredientId) => {
        setSelectedIngredients((prev) => {
            const updatedIngredients = { ...prev };
            if (updatedIngredients[ingredientId] !== undefined) {
                delete updatedIngredients[ingredientId];
            } else {
                updatedIngredients[ingredientId] = true; // Mark as selected
            }
            return updatedIngredients;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = sessionStorage.getItem('email');
        if (!email) {
            toast.error("User email not found in session storage.");
            return;
        }
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);
        formData.append('categoryId', categoryId);
        formData.append('subcategoryId', subcategoryId);
        formData.append('description', description);
        formData.append('nutritionalDescription', nutritionalDescription);
    
        const ingredientsArray = Object.keys(selectedIngredients).map((ingredientId) => ({
            ingredientId: parseInt(ingredientId),
        }));
    
        formData.append('ingredients', JSON.stringify(ingredientsArray));
    
        try {
            const response = await axios.post(`http://localhost:8080/createRecipe/${email}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(response.data);
    
            // Clear all fields
            setTitle('');
            document.getElementById("file").value = null; // Clear file input
            setCategoryId('');
            setSubcategoryId('');
            setDescription('');
            setNutritionalDescription('');
            setSelectedIngredients({});
            setSearchTerm('');
    
        } catch (error) {
            const errorMessage = error.response?.data || 'Error creating recipe';
            toast.error(errorMessage);
        }
    };
    
    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <div className="c-card">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Recipe Title:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label>Image:</label>
                        <input type="file" accept="image/*" id='file' onChange={(e) => setImage(e.target.files[0])} required />
                    </div>
                    <div>
                        <label>Category:</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Subcategory:</label>
                        <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
                            <option value="">Select Subcategory</option>
                            {subcategories.map((subcategory) => (
                                <option key={subcategory.subcategoryId} value={subcategory.subcategoryId}>
                                    {subcategory.subcategoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div>
                        <label>Nutritional Description:</label>
                        <textarea value={nutritionalDescription} onChange={(e) => setNutritionalDescription(e.target.value)} required />
                    </div>
                    <div className="ingredients-card" style={{ marginTop: '10px' }}>
                        <label>Ingredients:</label>
                        <input
                            type="text"
                            placeholder="Search Ingredients"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginBottom: '10px', width: '100%' }}
                        />
                        <div className="ingredients-list">
                            {filteredIngredients.map((ingredient) => (
                                <div className="ingredient-item" key={ingredient.ingredientId}>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={selectedIngredients[ingredient.ingredientId] !== undefined}
                                        onChange={() => handleIngredientChange(ingredient.ingredientId)}
                                    />
                                    <span>{ingredient.ingredientName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            fontSize: '19px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '30px',
                            marginBottom: '1px'
                        }}
                    >
                        Create Recipe
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default AdminRecipeForm;
