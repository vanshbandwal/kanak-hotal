import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../../layouts/AuthLayout';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import './ForgotPasswordScreen.css';

const ForgotPasswordScreen = () => {
    const [isSent, setIsSent] = useState(false);
    const navigate = useNavigate();

    return (
        <AuthLayout>
            <div className="forgot-header">
                <h2 className="forgot-title">RECOVER PASSWORD</h2>
                <p className="forgot-subtitle">Enter your email to receive recovery instructions.</p>
            </div>

            {!isSent ? (
                <ForgotPasswordForm 
                    onSubmitSuccess={() => setIsSent(true)}
                    onBackToLogin={() => navigate('/login')}
                />
            ) : (
                <div className="forgot-success-state">
                    <div className="forgot-success-icon">📧</div>
                    <p className="forgot-success-text">Recovery link has been sent to your email.</p>
                    <LuxuryButton
                        onClick={() => navigate('/login')}
                        variant="secondary"
                    >
                        RETURN TO LOGIN
                    </LuxuryButton>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPasswordScreen;
