import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { customerApi } from '../../../api/customerApi';
import { useToast } from '../../../context/ToastContext';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import './CustomerFormModal.css';

const phoneSchema = z.object({
    phone: z.string().length(10, 'Phone number must be exactly 10 digits').regex(/^\d+$/, 'Only numbers allowed'),
});

const otpSchema = z.object({
    otp: z.string().length(4, 'OTP must be 4 digits').regex(/^\d+$/, 'Only numbers allowed'),
});


const profileSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email required').optional().or(z.literal('')),
});

interface CustomerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onSuccess: () => void;
}

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
    const { addToast } = useToast();
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Complete Profile
    const [isLoading, setIsLoading] = useState(false);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [customerPhone, setCustomerPhone] = useState<string>('');

    const [receivedOtp, setReceivedOtp] = useState<string | null>(null);

    // Form instances for each step
    const phoneForm = useForm({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phone: '' }
    });

    const otpForm = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' }
    });

    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: '', email: '' }
    });

    // Reset logic for edit mode or fresh start
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Edit mode: Skip to profile step or just allow editing
                setStep(3);
                setCustomerId(initialData._id);
                profileForm.reset({
                    name: initialData.name || '',
                    email: initialData.email || ''
                });
            } else {
                setStep(1);
                setCustomerId(null);
                setCustomerPhone('');
                setReceivedOtp(null);
                phoneForm.reset();
                otpForm.reset();
                profileForm.reset();
            }
        }
    }, [isOpen, initialData, phoneForm, otpForm, profileForm]);

    // Step 1: Send OTP
    const handleSendOtp = async (data: any) => {
        setIsLoading(true);
        try {
            const { data: resData, error } = await customerApi.sendOtp(data.phone);
            
            if (error) {
                addToast('error', error);
                return;
            }

            setCustomerPhone(data.phone);
            setCustomerId(resData.customerId);
            
            // 🎁 Set the received OTP for the animated popup
            setReceivedOtp(resData.otp);
            addToast('success', 'Verification code generated');
            
            setStep(2);
        } catch (err: any) {
            addToast('error', 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (data: any) => {
        setIsLoading(true);
        try {
            const { error } = await customerApi.verifyOtp(customerPhone, data.otp);
            
            if (error) {
                addToast('error', error);
                return;
            }

            addToast('success', 'Phone verified successfully');
            setReceivedOtp(null); // Clear the popup
            setStep(3);
        } catch (err: any) {
            addToast('error', 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Complete Profile (or Update)
    const handleSaveProfile = async (data: any) => {
        if (!customerId) {
            addToast('error', 'Customer ID missing. Please restart onboarding.');
            return;
        }
        setIsLoading(true);
        try {
            const { error } = initialData 
                ? await customerApi.updateCustomer(customerId, data)
                : await customerApi.completeProfile(customerId, data);

            if (error) {
                addToast('error', error);
                return;
            }

            addToast('success', initialData ? 'Customer updated successfully' : 'Customer created successfully');
            onSuccess();
            onClose();
        } catch (err: any) {
            addToast('error', 'Failed to save profile');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            {/* 🎁 Animated OTP Popup */}
            {receivedOtp && (
                <div className="otp-popup-overlay">
                    <div className="otp-popup-card">
                        <div className="otp-popup-icon">📱</div>
                        <h3>Verification Code</h3>
                        <div className="otp-digits">
                            {receivedOtp.split('').map((digit, i) => (
                                <span key={i} className="otp-digit">{digit}</span>
                            ))}
                        </div>
                        <p>Tell the client this code to verify their number.</p>
                        <button className="otp-popup-close" onClick={() => setReceivedOtp(null)}>Got it</button>
                    </div>
                </div>
            )}

            <LuxuryModal 
                isOpen={isOpen} 
                onClose={onClose} 
                title={initialData ? 'Edit Customer' : 'Onboard New Customer'}
                size="sm"
            >
            <div className="customer-form-steps">
                {!initialData && (
                    <div className="step-indicator">
                        <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
                        <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
                        <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
                        <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
                        <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="step-form">
                        <p className="step-desc">Enter the customer's phone number to send a verification code.</p>
                        <Controller
                            name="phone"
                            control={phoneForm.control}
                            render={({ field }) => (
                                <LuxuryInput 
                                    label="Phone Number"
                                    {...field}
                                    type="tel"
                                    maxLength={10}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        field.onChange(val.slice(0, 10));
                                    }}
                                    placeholder="e.g. 9876543210"
                                    error={phoneForm.formState.errors.phone?.message}
                                />
                            )}
                        />
                        <div className="form-actions">
                            <LuxuryButton variant="neutral" onClick={onClose} type="button">Cancel</LuxuryButton>
                            <LuxuryButton variant="primary" type="submit" isLoading={isLoading}>Send OTP</LuxuryButton>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="step-form">
                        <p className="step-desc">Enter the 4-digit code sent to <strong>{customerPhone}</strong>.</p>
                        <Controller
                            name="otp"
                            control={otpForm.control}
                            render={({ field }) => (
                                <LuxuryInput 
                                    label="Verification Code"
                                    {...field}
                                    type="tel"
                                    maxLength={4}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        field.onChange(val.slice(0, 4));
                                    }}
                                    placeholder="0000"
                                    error={otpForm.formState.errors.otp?.message}
                                />
                            )}
                        />
                        <div className="form-actions">
                            <LuxuryButton variant="neutral" onClick={() => setStep(1)} type="button">Back</LuxuryButton>
                            <LuxuryButton variant="primary" type="submit" isLoading={isLoading}>Verify Code</LuxuryButton>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="step-form">
                        <p className="step-desc">Enter the customer's basic information to complete the profile.</p>
                        <Controller
                            name="name"
                            control={profileForm.control}
                            render={({ field }) => (
                                <LuxuryInput 
                                    label="Full Name *"
                                    {...field}
                                    placeholder="Enter customer name"
                                    error={profileForm.formState.errors.name?.message}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={profileForm.control}
                            render={({ field }) => (
                                <LuxuryInput 
                                    label="Email Address"
                                    {...field}
                                    placeholder="customer@example.com"
                                    error={profileForm.formState.errors.email?.message}
                                />
                            )}
                        />
                        <div className="form-actions">
                            {!initialData && <LuxuryButton variant="neutral" onClick={() => setStep(2)} type="button">Back</LuxuryButton>}
                            <LuxuryButton variant="primary" type="submit" isLoading={isLoading} glow>
                                {initialData ? 'Update Profile' : 'Complete Onboarding'}
                            </LuxuryButton>
                        </div>
                    </form>
                )}
            </div>
        </LuxuryModal>
        </>
    );
};

export default CustomerFormModal;
