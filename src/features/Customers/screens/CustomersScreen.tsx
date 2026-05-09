import React from 'react';
import './CustomersScreen.css';

const CustomersScreen = () => {
    return (
        <div className="customers-container">
            <h2 className="customers-title">Clientele</h2>
            <p className="customers-subtitle">Manage your exclusive community of shoppers.</p>

            <div className="customers-content-card">
                <div className="customers-placeholder">
                    <span className="customers-placeholder-icon">👤</span>
                    <h3 className="customers-placeholder-title">Your Circle is Empty</h3>
                    <p className="customers-placeholder-text">Customer profiles will be created here upon registration.</p>
                </div>
            </div>
        </div>
    );
};

export default CustomersScreen;
