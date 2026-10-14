import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './ManageIngredients.css'; 

const ManageIngredients = () => {
    const [ingredients, setIngredients] = useState([]);
    const [ingredientName, setIngredientName] = useState('');
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/getingredients');
            setIngredients(response.data);
        } catch (err) {
            setError('Error fetching ingredients');
            toast.error('Error fetching ingredients');
        }
    };

    const handleAddOrUpdate = async () => {
        try {
            const ingredient = { ingredientName };
            if (editId) {
                await axios.put(`http://localhost:8080/ingredients/${editId}`, ingredient);
                toast.success('Ingredient updated successfully!');
            } else {
                await axios.post('http://localhost:8080/ingredients', ingredient);
                toast.success('Ingredient added successfully!');
            }
            resetForm();
            fetchIngredients();
        } catch (err) {
            setError('Error saving ingredient');
            toast.error('Error saving ingredient or ingredient already added');
        }
    };

    const handleEdit = (ingredient) => {
        setIngredientName(ingredient.ingredientName);
        setEditId(ingredient.ingredientId);
    };

  

    const resetForm = () => {
        setIngredientName('');
        setEditId(null);
        setError('');
    };

    return (
        <div className="container ">
            <h2>Manage Ingredients</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
    
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">{editId ? 'Edit Ingredient' : 'Add Ingredient'}</h5>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingredient Name"
                        value={ingredientName}
                        onChange={(e) => setIngredientName(e.target.value)}
                    />
                    <button className="btn btn-primary mt-3" onClick={handleAddOrUpdate}>
                        {editId ? 'Update' : 'Add'} Ingredient
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Ingredients List</h5>
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Ingredient Name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map((ingredient) => (
                                <tr key={ingredient.ingredientId}>
                                    <td>{ingredient.ingredientName}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(ingredient)}>Edit</button>
                                        {/* <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ingredient.ingredientId)}>Delete</button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default ManageIngredients;
