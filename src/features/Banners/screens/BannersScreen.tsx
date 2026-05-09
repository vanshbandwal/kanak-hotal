import React from 'react';
import './BannersScreen.css';

const BannersScreen = () => {
    return (
        <div className="banners-container">
            <h2 className="banners-title">Banner Management</h2>
            <p className="banners-subtitle">Update the visual promotions on your app and website.</p>

            <div className="banners-content-card">
                <div className="banners-placeholder">
                    <span className="banners-placeholder-icon">🖼️</span>
                    <h3 className="banners-placeholder-title">No Banners Found</h3>
                    <p className="banners-placeholder-text">Start by uploading your first promotional banner.</p>
                    <button className="banners-add-button">+ ADD BANNER</button>
                </div>
            </div>
        </div>
    );
};

export default BannersScreen;
