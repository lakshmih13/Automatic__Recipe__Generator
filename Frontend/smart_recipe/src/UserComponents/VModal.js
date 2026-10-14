import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Modal.css';

const VModal = ({ isOpen, onClose, recipe }) => {
  const [rating, setRating] = useState(0);
  

 

  if (!isOpen || !recipe) return null;

 
 
  
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
           
            
          </div>
        </div>
       
      </div>
      <ToastContainer />
    </div>
  );
};

export default VModal;
