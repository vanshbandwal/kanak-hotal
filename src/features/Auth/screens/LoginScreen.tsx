import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '../../../store';
import { authApi } from '../../../api/authApi';
import { setCredentials, setLoading } from '../../../store/slices/authSlice';
import AuthLayout from '../../../layouts/AuthLayout';
import FashionLoader from '../../../components/Common/FashionLoader';
import { useNavigate } from 'react-router-dom';
import { loginSchema, LoginFormData } from './Auth.validation';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import './LoginScreen.css';

const LoginScreen = () => {
    const [authError, setAuthError] = useState<string | null>(null);
    const [isLocalLoading, setIsLocalLoading] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onFormSubmit = async (data: LoginFormData) => {
        setAuthError(null);
        setIsLocalLoading(true);
        dispatch(setLoading(true));

        const { data: result, error } = await authApi.loginUser(data);

        if (error) {
            console.error('Login failed:', error);
            setAuthError(error || 'Unauthorized access. Verification failed.');
            setIsLocalLoading(false);
            dispatch(setLoading(false));
            return;
        }

        if (result) {
            dispatch(setCredentials({
                token: result.token,
                admin: {
                    id: result._id,
                    name: result.name,
                    email: result.email,
                    role: result.role
                }
            }));
            navigate('/');
        }
        
        setIsLocalLoading(false);
        dispatch(setLoading(false));
    };

    return (
        <AuthLayout>
            {isLocalLoading && <FashionLoader fullScreen message="Authenticating your style profile..." />}
            <div className="login-container">
                <h2 className="login-title">SIGN IN</h2>
                <div className="login-divider" />
            </div>

            <form className="login-form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
                <LuxuryInput 
                    label="ADMIN IDENTIFIER"
                    type="email"
                    {...register('email')}
                    placeholder="admin@velour.com"
                    error={errors.email?.message}
                />

                <LuxuryInput 
                    label="ENCRYPTED PASSCODE"
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    error={errors.password?.message}
                />

                {authError && (
                    <div className="login-error-text">
                        <span className="login-error-icon">⚠️</span> {authError}
                    </div>
                )}

                <div className="login-forgot-row">
                    <span
                        className="login-forgot-link"
                        onClick={() => navigate('/forgot-password')}
                    >
                        RECOVER ACCESS
                    </span>
                </div>

                <LuxuryButton
                    type="submit"
                    isLoading={isLocalLoading}
                    glow
                    className="login-button-submit"
                >
                    ESTABLISH SESSION
                </LuxuryButton>
            </form>

            <div className="login-footer">
                <div className="login-security-badge">
                    <div className="login-dot" />
                    <span className="login-footer-text">ENCRYPTED CONNECTION</span>
                </div>
            </div>
        </AuthLayout>
    );
};

export default LoginScreen;

