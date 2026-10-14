import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import './ManageCategories.css'; // Import your custom CSS



const fetchCategories = async () => {
    const response = await fetch('http://localhost:8080/categories');
    return response.json();
};

const fetchSubcategories = async () => {
    const response = await fetch(`http://localhost:8080/subcategories`);
    return response.json();
};

const createCategory = async (category) => {
    await fetch(`http://localhost:8080/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: category }),
    });
};

const createSubcategory = async (subcategory) => {
    await fetch(`http://localhost:8080/subcategories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subcategory),
    });
};



const removeSubcategory = async (subcategoryId) => {
    await fetch(`http://localhost:8080/subcategories/${subcategoryId}`, {
        method: 'DELETE',
    });
};

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [categoryInput, setCategoryInput] = useState('');
    const [subcategoryInput, setSubcategoryInput] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            const fetchedCategories = await fetchCategories();
            const fetchedSubcategories = await fetchSubcategories();
            
            // Map subcategories to categories
            const categoriesWithSubcategories = fetchedCategories.map(category => {
                const subcategoriesForCategory = fetchedSubcategories.filter(subcategory => 
                    subcategory.category.categoryId === category.categoryId
                );

                return {
                    ...category,
                    subcategories: subcategoriesForCategory,
                };
            });

            setCategories(categoriesWithSubcategories);
        };

        loadCategories();
    }, []);

    const handleCategoryInputChange = (event) => {
        const input = event.target.value;
        setCategoryInput(input);

        if (input) {
            const matchedCategories = categories.filter(category =>
                category.categoryName.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredCategories(matchedCategories);
        } else {
            setFilteredCategories([]);
        }
    };

    const handleSubcategoryInputChange = (event) => {
        const input = event.target.value;
        setSubcategoryInput(input);

        if (selectedCategoryId) {
            const matchedSubcategories = categories
                .find(category => category.categoryId === selectedCategoryId)
                ?.subcategories.filter(subcategory =>
                    subcategory.subcategoryName.toLowerCase().includes(input.toLowerCase())
                ) || [];

            setFilteredSubcategories(matchedSubcategories);
        } else {
            setFilteredSubcategories([]);
        }
    };

    const handleCreateCategory = async () => {
        await createCategory(categoryInput);
        setCategoryInput('');
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
        toast.success('Category added successfully!');
    };

    const handleCreateSubcategory = async () => {
        const newSubcategory = { subcategoryName: subcategoryInput, categoryId: selectedCategoryId };
        await createSubcategory(newSubcategory);

        // Update the local state to include the new subcategory
        setCategories(prevCategories => 
            prevCategories.map(category => {
                if (category.categoryId === selectedCategoryId) {
                    return {
                        ...category,
                        subcategories: [
                            ...category.subcategories,
                            { ...newSubcategory, subcategoryId: Date.now() } // Temporary ID
                        ],
                    };
                }
                return category;
            })
        );

        setSubcategoryInput('');
        toast.success('Subcategory added successfully!');
    };

   

    const handleRemoveSubcategory = async (subcategoryId) => {
      // Optimistically update the state
      const updatedCategories = categories.map(category => ({
          ...category,
          subcategories: category.subcategories.filter(sub => sub.subcategoryId !== subcategoryId),
      }));
  
      setCategories(updatedCategories); // Update state immediately
  
      try {
          // Make the API call to delete the subcategory
          await removeSubcategory(subcategoryId);
          toast.success('Subcategory removed successfully!');
      } catch (error) {
          // If the API call fails, revert the state
          setCategories(categories);
          toast.error('Failed to remove subcategory. Please try again.');
      }
  };
  

    return (
        <div className="container">
            <h2>Manage Categories</h2>

            <div className="card mb-4">
                <div className="card-body">
                    <h3>Add or Search Category</h3>
                    <input
                        type="text"
                        value={categoryInput}
                        onChange={handleCategoryInputChange}
                        placeholder="Type to search or add a new category"
                        className="form-control"
                    />
                    {filteredCategories.length > 0 && (
                        <ul className="dropdown-list">
                            {filteredCategories.map(category => (
                                <li key={category.categoryId} onClick={() => {
                                    setCategoryInput(category.categoryName);
                                    setSelectedCategoryId(category.categoryId);
                                    setFilteredCategories([]);
                                }}>
                                    {category.categoryName}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button onClick={handleCreateCategory} className="btn btn-primary mt-2">Add Category</button>

                    <h3 className="mt-4">Add Subcategory</h3>
                    <input
                        type="text"
                        value={subcategoryInput}
                        onChange={handleSubcategoryInputChange}
                        placeholder="Type to add a new subcategory"
                        className="form-control"
                        disabled={!selectedCategoryId}
                    />
                    {filteredSubcategories.length > 0 && (
                        <ul className="dropdown-list">
                            {filteredSubcategories.map(subcategory => (
                                <li key={subcategory.subcategoryId} onClick={() => {
                                    setSubcategoryInput(subcategory.subcategoryName);
                                    setFilteredSubcategories([]);
                                }}>
                                    {subcategory.subcategoryName}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button onClick={handleCreateSubcategory} className="btn btn-primary mt-2" disabled={!selectedCategoryId}>
                        Add Subcategory
                    </button>
                </div>
            </div>

            <h3>Recipe Categories and Subcategories</h3>
            <table className="table table-striped">
    <thead>
        <tr>
            <th>Sl No</th>
            <th>Recipe Categories</th>
            <th>Recipe Subcategories</th>
        </tr>
    </thead>
    <tbody>
        {categories.map((category, index) => (
            <tr key={category.categoryId}>
                <td>{index + 1}</td>
                <td>{category.categoryName}</td>
                <td>
                    <div className="subcategory-container">
                        {category.subcategories && category.subcategories.length > 0 ? (
                            category.subcategories.map(subcategory => (
                                <div key={subcategory.subcategoryId} className="subcategory-item d-flex justify-content-between align-items-center">
                                    <span>{subcategory.subcategoryName}</span>
                                    <button onClick={() => handleRemoveSubcategory(subcategory.subcategoryId)} className="btn btn-danger btn-sm">
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <span>No subcategories available</span>
                        )}
                    </div>
                </td>
            </tr>
        ))}
    </tbody>
</table>





            <ToastContainer />
        </div>
    );
};

export default ManageCategories;
