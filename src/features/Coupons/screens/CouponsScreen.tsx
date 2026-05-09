import React from 'react';
import './CouponsScreen.css';

const CouponsScreen = () => {
    return (
        <div className="coupons-screen-container">
            <h2 className="coupons-screen-title">Coupon & Discount Management</h2>
            <p className="coupons-screen-subtitle">Create and manage promotional offers for your customers.</p>

            <div className="coupons-screen-content-card">
                <div className="coupons-screen-placeholder">
                    <span className="coupons-screen-placeholder-icon">🎫</span>
                    <h3 className="coupons-screen-placeholder-title">No Coupons Found</h3>
                    <p className="coupons-screen-placeholder-text">Start by creating your first discount code.</p>
                    <button className="coupons-screen-add-button">+ ADD COUPON</button>
                </div>
            </div>
        </div>
    );
};

export default CouponsScreen;
