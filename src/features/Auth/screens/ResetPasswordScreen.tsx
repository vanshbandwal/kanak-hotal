import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import './ResetPasswordScreen.css';

const ResetPasswordScreen = () => {
    const [isComplete, setIsComplete] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setIsComplete(true);
    };

    return (
        <AuthLayout>
            <div className="reset-password-header">
                <h2 className="reset-password-title">RESET PASSWORD</h2>
                <p className="reset-password-subtitle">Enter your new password below to regain access.</p>
            </div>

            {!isComplete ? (
                <form className="reset-password-form" onSubmit={handleReset}>
                    <LuxuryInput 
                        label="NEW PASSWORD"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <LuxuryInput 
                        label="CONFIRM NEW PASSWORD"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <LuxuryButton
                        type="submit"
                        glow
                        className="reset-button-luxury"
                    >
                        RESET PASSWORD
                    </LuxuryButton>
                </form>
            ) : (
                <div className="reset-password-success-state">
                    <div className="reset-password-success-icon">🛡️</div>
                    <p className="reset-password-success-text">Password has been successfully updated.</p>
                    <LuxuryButton 
                        onClick={() => navigate('/login')}
                        variant="secondary"
                    >
                        GO TO SIGN IN
                    </LuxuryButton>
                </div>
            )}
        </AuthLayout>
    );
};

export default ResetPasswordScreen;
