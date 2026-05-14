import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import { servicePartnerApi } from '../../../api/servicePartnerApi';
import { useToast } from '../../../context/ToastContext';
import { 
    phoneSchema, PhoneFormData, 
    otpSchema, OtpFormData, 
    partnerDetailsSchema, PartnerDetailsFormData 
} from '../ServicePartners.validation';

interface PartnerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode?: 'create' | 'edit';
    initialData?: any;
}

type Step = 'PHONE' | 'OTP' | 'DETAILS';

const PartnerFormModal: React.FC<PartnerFormModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    mode = 'create',
    initialData 
}) => {
    const { addToast } = useToast();
    const [step, setStep] = useState<Step>(mode === 'edit' ? 'DETAILS' : 'PHONE');
    const [isLoading, setIsLoading] = useState(false);
    
    // Data carried between steps
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [partnerId, setPartnerId] = useState(initialData?._id || '');
    const [serverOtp, setServerOtp] = useState(''); // Just for demo/debugging

    // Step 1: Phone Form
    const phoneForm = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phone: '' }
    });

    // Step 2: OTP Form
    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: '' }
    });

    // Step 3: Details Form
    const detailsForm = useForm<PartnerDetailsFormData>({
        resolver: zodResolver(partnerDetailsSchema),
        defaultValues: {
            name: initialData?.name || '',
            email: initialData?.email || '',
            vehicleType: initialData?.vehicle?.type || 'Motorcycle',
            vehicleNumber: initialData?.vehicle?.number || ''
        }
    });

    // Sync form with initialData when it changes
    React.useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setStep('DETAILS');
                setPhone(initialData.phone);
                setPartnerId(initialData._id);
                detailsForm.reset({
                    name: initialData.name,
                    email: initialData.email,
                    vehicleType: initialData.vehicle?.type,
                    vehicleNumber: initialData.vehicle?.number
                });
            } else {
                setStep('PHONE');
                setPhone('');
                setPartnerId('');
                phoneForm.reset();
                otpForm.reset();
                detailsForm.reset({
                    name: '',
                    email: '',
                    vehicleType: 'Motorcycle',
                    vehicleNumber: ''
                });
            }
        }
    }, [isOpen, initialData, mode, detailsForm, phoneForm, otpForm]);

    const handleSendOtp = async (data: PhoneFormData) => {
        setIsLoading(true);
        try {
            const response = await servicePartnerApi.sendOtp(data.phone);
            if (response.data.success) {
                setPhone(data.phone);
                setServerOtp(response.data.otp); // Show for demo purposes
                addToast('success', `OTP sent to ${data.phone}`);
                setStep('OTP');
            }
        } catch (error: any) {
            addToast('error', error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (data: OtpFormData) => {
        setIsLoading(true);
        try {
            const response = await servicePartnerApi.verifyOtp(phone, data.otp);
            if (response.data.success) {
                setPartnerId(response.data.partnerId);
                addToast('success', 'Phone verified successfully');
                setStep('DETAILS');
            }
        } catch (error: any) {
            addToast('error', error.response?.data?.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteRegistration = async (data: PartnerDetailsFormData) => {
        setIsLoading(true);
        try {
            let response;
            if (mode === 'edit') {
                response = await servicePartnerApi.updatePartner(partnerId, data);
            } else {
                response = await servicePartnerApi.completeRegistration({
                    partnerId,
                    ...data
                });
            }

            if (response.data.success) {
                addToast('success', `Service Partner ${mode === 'edit' ? 'updated' : 'registered'} successfully`);
                handleClose();
                onSuccess();
            }
        } catch (error: any) {
            addToast('error', error.response?.data?.message || 'Failed to complete registration');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStep('PHONE');
        setPhone('');
        setPartnerId('');
        phoneForm.reset();
        otpForm.reset();
        detailsForm.reset();
        onClose();
    };

    // Determine current form props based on step
    const getModalProps = () => {
        switch (step) {
            case 'PHONE':
                return {
                    title: 'Verify Partner Phone',
                    onSubmit: phoneForm.handleSubmit(handleSendOtp),
                    submitLabel: 'Send OTP'
                };
            case 'OTP':
                return {
                    title: 'Enter Verification Code',
                    onSubmit: otpForm.handleSubmit(handleVerifyOtp),
                    submitLabel: 'Verify Code'
                };
            case 'DETAILS':
                return {
                    title: mode === 'edit' ? 'Edit Partner Profile' : 'Partner Information',
                    onSubmit: detailsForm.handleSubmit(handleCompleteRegistration),
                    submitLabel: mode === 'edit' ? 'Update Partner' : 'Complete Registration'
                };
        }
    };

    const { title, onSubmit, submitLabel } = getModalProps();

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            size="md"
            isLoading={isLoading}
            onSubmit={onSubmit}
            submitLabel={submitLabel}
        >
            <div className="partner-wizard">
                {step === 'PHONE' && (
                    <div className="step-content">
                        <p className="step-description">Enter the partner's mobile number to send a verification code.</p>
                        <LuxuryInput 
                            label="Phone Number *" 
                            {...phoneForm.register('phone')}
                            error={phoneForm.formState.errors.phone?.message}
                            placeholder="e.g. 9876543210"
                        />
                    </div>
                )}

                {step === 'OTP' && (
                    <div className="step-content">
                        <p className="step-description">Verification code sent to <b>{phone}</b>. Enter it below.</p>
                        <LuxuryInput 
                            label="OTP Code *" 
                            {...otpForm.register('otp')}
                            error={otpForm.formState.errors.otp?.message}
                            placeholder="4-digit code"
                        />
                        {serverOtp && (
                            <div className="demo-otp-hint">
                                Demo OTP: <span className="otp-code">{serverOtp}</span>
                            </div>
                        )}
                        <button type="button" className="resend-btn" onClick={() => setStep('PHONE')}>Change Phone Number</button>
                    </div>
                )}

                {step === 'DETAILS' && (
                    <div className="step-content">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <LuxuryInput 
                                label="Full Name *" 
                                {...detailsForm.register('name')}
                                error={detailsForm.formState.errors.name?.message}
                                placeholder="John Doe"
                            />
                            <LuxuryInput 
                                label="Email Address" 
                                {...detailsForm.register('email')}
                                error={detailsForm.formState.errors.email?.message}
                                placeholder="john@example.com"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                            <div className="form-group">
                                <label className="luxury-label">Vehicle Type *</label>
                                <select className="luxury-select" {...detailsForm.register('vehicleType')}>
                                    <option value="Motorcycle">Motorcycle</option>
                                    <option value="Scooter">Scooter</option>
                                    <option value="Bicycle">Bicycle</option>
                                    <option value="Car">Car</option>
                                </select>
                            </div>
                            <LuxuryInput 
                                label="Vehicle Number *" 
                                {...detailsForm.register('vehicleNumber')}
                                error={detailsForm.formState.errors.vehicleNumber?.message}
                                placeholder="MH 12 AB 1234"
                            />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .step-description {
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin-bottom: 20px;
                }
                .demo-otp-hint {
                    margin-top: 15px;
                    font-size: 12px;
                    color: var(--warning);
                    padding: 8px;
                    background: rgba(var(--warning-rgb), 0.1);
                    border-radius: 6px;
                    text-align: center;
                }
                .otp-code {
                    font-weight: 700;
                    letter-spacing: 2px;
                }
                .resend-btn {
                    background: none;
                    border: none;
                    color: var(--primary);
                    font-size: 12px;
                    margin-top: 15px;
                    cursor: pointer;
                    text-decoration: underline;
                }
                .luxury-label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 12px;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                }
                .luxury-select {
                    width: 100%;
                    padding: 12px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    color: white;
                    outline: none;
                }
            `}</style>
        </LuxuryModal>
    );
};

export default PartnerFormModal;
