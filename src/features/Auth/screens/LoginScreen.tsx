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

            <form className="login-form" onSubmit={handleSubmit(onFormSubmit)}>
                <div className="login-input-group">
                    <label className="login-label">ADMIN IDENTIFIER</label>
                    <input
                        type="email"
                        {...register('email')}
                        placeholder="admin@velour.com"
                        className={`login-input ${errors.email ? 'error-border' : ''}`}
                    />
                    {errors.email && <span className="login-field-error">{errors.email.message}</span>}
                </div>

                <div className="login-input-group">
                    <label className="login-label">ENCRYPTED PASSCODE</label>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="••••••••"
                        className={`login-input ${errors.password ? 'error-border' : ''}`}
                    />
                    {errors.password && <span className="login-field-error">{errors.password.message}</span>}
                </div>

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

                <button
                    type="submit"
                    disabled={isLocalLoading}
                    className="login-button"
                >
                    ESTABLISH SESSION
                </button>
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

