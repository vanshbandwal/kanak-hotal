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

const EmailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);

const LoginScreen = () => {
    const [authError, setAuthError] = useState<string | null>(null);
    const [isLocalLoading, setIsLocalLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                    icon={<EmailIcon />}
                />

                <LuxuryInput 
                    label="ENCRYPTED PASSCODE"
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    placeholder="••••••••"
                    error={errors.password?.message}
                    icon={<LockIcon />}
                    rightIcon={
                        <div onClick={() => setShowPassword(!showPassword)} style={{ display: 'flex' }}>
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </div>
                    }
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

