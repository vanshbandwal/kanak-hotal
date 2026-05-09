import React, { useState } from 'react';
import AuthLayout from '../../../layouts/AuthLayout';
import './ForgotPasswordScreen.css';

const ForgotPasswordScreen = () => {
    const [isSent, setIsSent] = useState(false);

    return (
        <AuthLayout>
            <div className="forgot-header">
                <h2 className="forgot-title">RECOVER PASSWORD</h2>
                <p className="forgot-subtitle">Enter your email to receive recovery instructions.</p>
            </div>

            {!isSent ? (
                <form className="forgot-form">
                    <div className="forgot-input-group">
                        <label className="forgot-label">EMAIL ADDRESS</label>
                        <input
                            type="email"
                            placeholder="admin@velour.com"
                            className="forgot-input"
                        />
                    </div>

                    <button
                        className="forgot-button"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsSent(true);
                        }}
                    >
                        SEND RECOVERY EMAIL
                    </button>

                    <div className="forgot-back-row">
                        <span className="forgot-back-text">Back to Sign In</span>
                    </div>
                </form>
            ) : (
                <div className="forgot-success-state">
                    <div className="forgot-success-icon">📧</div>
                    <p className="forgot-success-text">Recovery link has been sent to your email.</p>
                    <button
                        className="forgot-button"
                        onClick={() => setIsSent(false)}
                    >
                        RETURN TO LOGIN
                    </button>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPasswordScreen;
