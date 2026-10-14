import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Navbar, Spinner } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Visitor.css';
import VModal from './UserComponents/VModal';
import CommentsModal from './UserComponents/CommentsModal';

const Visitor = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [ratings, setRatings] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    let isMounted = true;
  
    const fetchRecipes = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch('http://localhost:8080/getAllRecipes');
        if (!response.ok) throw new Error(`Failed to fetch recipes: ${response.statusText}`);
        
        const data = await response.json();
  
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format: expected an array');
        }
  
        // Limit to the first three recipes
        const limitedData = data.slice(0, 10);
  
        if (isMounted) {
          setRecipes(limitedData);
          setFilteredRecipes(limitedData);
          await fetchRatings(limitedData);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        if (isMounted) toast.error('Error fetching recipes');
      } finally {
        if (isMounted) setLoading(false); // End loading
      }
    };
  
    fetchRecipes();
  
    return () => {
      isMounted = false; // Cleanup on unmount
    };
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
      const response = await fetch(`http://localhost:8080/comments/${recipeId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleSeeCommentsClick = async (recipeId) => {
    const recipeComments = await fetchComments(recipeId);
    setComments(recipeComments);
    setIsCommentsModalOpen(true);
  };

  const handleSignupClick = () => {
    navigate('/login');
  };

  return (
    <div className="visitor-container">
      <div className="overlay"></div>

      {/* Navbar */}
      <div className="navbar-custom">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand className="navbar-brand">
              Automatic Recipe Generator
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Button variant="info" onClick={handleSignupClick} size="sm">
                <FaUserPlus style={{ marginRight: '2px' }} /> Sign Up
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="mb-4">
          <Col>
            <Form onSubmit={handleSearch}>
              <Form.Group controlId="search">
                <Form.Control
                  type="text"
                  placeholder="Search Recipes"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </Form.Group>
              <Button type="submit" variant="danger" className="search-button">Search</Button>
            </Form>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" role="status" variant="primary">
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
                    e.stopPropagation();
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
        <VModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} recipe={selectedRecipe} />
        <CommentsModal isOpen={isCommentsModalOpen} onClose={() => setIsCommentsModalOpen(false)} comments={comments} />
      </Container>
    </div>
  );
};

export default Visitor;
