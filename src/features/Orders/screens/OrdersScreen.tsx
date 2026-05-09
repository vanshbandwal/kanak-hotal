import React from 'react';
import './OrdersScreen.css';

const OrdersScreen = () => {
    return (
        <div className="orders-container">
            <h2 className="orders-title">Order Tracking</h2>
            <p className="orders-subtitle">Monitor and fulfill your customer requests.</p>

            <div className="orders-content-card">
                <div className="reports-placeholder">
                    <span className="orders-placeholder-icon">📋</span>
                    <h3 className="orders-placeholder-title">No Active Orders</h3>
                    <p className="orders-placeholder-text">Your orders will appear here once customers start shopping.</p>
                </div>
            </div>
        </div>
    );
};

export default OrdersScreen;
