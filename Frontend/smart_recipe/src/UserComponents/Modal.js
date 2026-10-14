import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Modal.css';

const Modal = ({ isOpen, onClose, recipe }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    if (email) {
      setUserEmail(email);
    } else {
      toast.error("User email not found in session storage.");
    }
  }, []);

  if (!isOpen || !recipe) return null;

  const handleRatingChange = (rate) => {
    setRating(rate);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const commentData = {
      content: comment,
      rating: rating,
      flagged: false,
    };
  
    console.log(`Sending comment from email: ${userEmail}`);
    console.log(`To recipe ID: ${recipe.recipeId}`);
  
    try {
      const response = await fetch(`http://localhost:8080/comments/${userEmail}/${recipe.recipeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
  
      if (response.ok) {
        toast.success("Comment submitted successfully!");
        setComment('');
        setRating(0);
      } else {
        const errorResponse = await response.text();
        toast.error("Error submitting comment: " + errorResponse);
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
    }
  };
  
  return (
    <div className="show-all-modal-overlay" onClick={onClose}>
      <div className="show-all-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="show-all-modal-grid">
          <div className="show-all-modal-image">
            <img
              src={recipe.imageData ? `data:image/png;base64,${recipe.imageData}` : ''}
              alt={recipe.title}
            />
          </div>
          <div className="show-all-modal-details">
          <button className="show-all-modal-close-button" onClick={onClose}>Close</button><h2>{recipe.title}</h2>
            
            <div className="show-all-modal-description-nutrition">
              <div className="show-all-modal-description">
                <h3 style={{ marginBottom: '10px' }}>Description:</h3>
                <p>{recipe.description}</p>
              </div>
              <div className="show-all-modal-nutrition">
                <h3 style={{ marginBottom: '10px' }}>Nutritional Information:</h3>
                <pre>{recipe.nutritionaldescription}</pre>
              </div>
            </div>
          </div>
          <div>
            <div className="show-all-modal-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? 'filled' : ''}`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="show-all-modal-comment">
              <h3 style={{ marginLeft: '-180px' }}>Leave a Comment:</h3>
              <textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Write your comment here..."
                rows="4"
                style={{ width: '100%', resize: 'none' }}
              />
              <button className="show-all-modal-comment button" onClick={handleSubmit} >
                Submit
              </button>
            </div>
          </div>
        </div>
       
      </div>
      <ToastContainer />
    </div>
  );
};

export default Modal;
