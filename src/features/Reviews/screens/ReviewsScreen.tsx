import React from 'react';
import './ReviewsScreen.css';

const ReviewsScreen = () => {
    return (
        <div className="reviews-container">
            <h2 className="reviews-title">Review & Rating Management</h2>
            <p className="reviews-subtitle">Moderate and respond to customer feedback.</p>

            <div className="reviews-content-card">
                <div className="reviews-placeholder">
                    <span className="reviews-placeholder-icon">⭐</span>
                    <h3 className="reviews-placeholder-title">No Reviews Found</h3>
                    <p className="reviews-placeholder-text">Reviews from your customers will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewsScreen;
