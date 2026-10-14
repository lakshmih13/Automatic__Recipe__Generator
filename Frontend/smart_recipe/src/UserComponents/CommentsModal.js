import React from 'react';
import './CommentsModal.css';

const CommentsModal = ({ isOpen, onClose, comments }) => {
    if (!isOpen) return null;

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < rating ? 'star filled' : 'star'}>
                ★
            </span>
        ));
    };

    return (
        <div className="comments-modal-overlay">
            <div className="comments-modal">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Comments</h2>
                {comments.length > 0 ? (
                    comments.map((comment, index) => {
                        const userEmail = comment.user?.name;

                        return (
                            <div key={index} className="comment">
                                <p className="comment-email">
                                    <strong>
                                        {userEmail === "admin@gmail.com" ? "Admin" : userEmail || 'Anonymous'}
                                    </strong>
                                </p>
                                <p className="comment-content">{comment.content}</p>
                                <div className="rating">
                                    {renderStars(comment.rating)}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No comments available.</p>
                )}
            </div>
        </div>
    );
};

export default CommentsModal;
