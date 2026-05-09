import React, { useState } from 'react';
import AuthLayout from '../../../layouts/AuthLayout';
import './ResetPasswordScreen.css';

const ResetPasswordScreen = () => {
    const [isComplete, setIsComplete] = useState(false);

    return (
        <AuthLayout>
            <div className="reset-password-header">
                <h2 className="reset-password-title">RESET PASSWORD</h2>
                <p className="reset-password-subtitle">Enter your new password below to regain access.</p>
            </div>

            {!isComplete ? (
                <form className="reset-password-form">
                    <div className="reset-password-input-group">
                        <label className="reset-password-label">NEW PASSWORD</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="reset-password-input"
                        />
                    </div>

                    <div className="reset-password-input-group">
                        <label className="reset-password-label">CONFIRM NEW PASSWORD</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="reset-password-input"
                        />
                    </div>

                    <button
                        className="reset-password-button"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsComplete(true);
                        }}
                    >
                        RESET PASSWORD
                    </button>
                </form>
            ) : (
                <div className="reset-password-success-state">
                    <div className="reset-password-success-icon">🛡️</div>
                    <p className="reset-password-success-text">Password has been successfully updated.</p>
                    <button className="reset-password-button">GO TO SIGN IN</button>
                </div>
            )}
        </AuthLayout>
    );
};

export default ResetPasswordScreen;
