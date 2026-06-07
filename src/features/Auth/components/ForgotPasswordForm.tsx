import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../screens/Auth.validation';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';

interface ForgotPasswordFormProps {
    onSubmitSuccess: () => void;
    onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmitSuccess, onBackToLogin }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onFormSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        // Simulate API call or integrate with authApi here
        console.log('Recovery email requested for:', data.email);
        
        // Mocking a delay
        setTimeout(() => {
            setIsLoading(false);
            onSubmitSuccess();
        }, 1500);
    };

    return (
        <form className="forgot-form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <LuxuryInput 
                label="EMAIL ADDRESS"
                type="email"
                placeholder="admin@velour.com"
                {...register('email')}
                error={errors.email?.message as string}
            />

            <LuxuryButton
                type="submit"
                isLoading={isLoading}
                glow
                className="forgot-button-submit"
            >
                SEND RECOVERY EMAIL
            </LuxuryButton>

            <div className="forgot-back-row">
                <span className="forgot-back-text" onClick={onBackToLogin}>
                    Back to Sign In
                </span>
            </div>
        </form>
    );
};

export default ForgotPasswordForm;
