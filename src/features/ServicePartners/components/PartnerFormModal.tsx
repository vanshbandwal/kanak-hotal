import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import LuxuryImageUpload from '../../../components/Common/LuxuryImageUpload';
import { servicePartnerApi } from '../../../api/servicePartnerApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import './PartnerFormModal.css';
import { 
    phoneSchema, PhoneFormData, 
    otpSchema, OtpFormData, 
    partnerDetailsSchema, PartnerDetailsFormData 
} from '../screens/ServicePartners.validation';

interface PartnerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode?: 'create' | 'edit';
    initialData?: any;
}

type Step = 'PHONE' | 'OTP' | 'DETAILS';

const VEHICLE_OPTIONS = [
    { value: 'Motorcycle', label: 'Motorcycle' },
    { value: 'Scooter', label: 'Scooter' },
    { value: 'Bicycle', label: 'Bicycle' },
    { value: 'Car', label: 'Car' },
];

const KYC_STATUS_OPTIONS = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Review', label: 'In Review' },
    { value: 'Verified', label: 'Verified' },
    { value: 'Rejected', label: 'Rejected' },
];

const DOC_STATUS_OPTIONS = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
];

const PartnerFormModal: React.FC<PartnerFormModalProps> = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    mode = 'create',
    initialData 
}) => {
    const { addToast } = useToast();
    const [step, setStep] = useState<Step>(mode === 'edit' ? 'DETAILS' : 'PHONE');
    const [activeTab, setActiveTab] = useState<'basic' | 'vehicle' | 'kyc' | 'status'>(mode === 'edit' ? 'basic' : 'basic');
    const [isLoading, setIsLoading] = useState(false);
    
    // File States
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [aadhaarFrontFile, setAadhaarFrontFile] = useState<File | null>(null);
    const [aadhaarBackFile, setAadhaarBackFile] = useState<File | null>(null);
    const [panFile, setPanFile] = useState<File | null>(null);
    const [dlFile, setDlFile] = useState<File | null>(null);
    
    // Data carried between steps
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [partnerId, setPartnerId] = useState(initialData?._id || '');
    const [serverOtp, setServerOtp] = useState('');

    // Step 1: Phone Form
    const phoneForm = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema) as any,
        defaultValues: { phone: '' }
    });

    // Step 2: OTP Form
    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema) as any,
        defaultValues: { otp: '' }
    });

    const getInitialDetailsValues = (data: any) => ({
        name: data?.name || '',
        email: data?.email || '',
        phone: data?.phone || '',
        avatar: data?.avatar || '',
        vehicle: {
            type: data?.vehicle?.type || 'Motorcycle',
            number: data?.vehicle?.number || '',
            model: data?.vehicle?.model || '',
        },
        kycStatus: data?.kycStatus || 'Pending',
        documents: {
            aadhaar: {
                number: data?.documents?.aadhaar?.number || '',
                frontImage: data?.documents?.aadhaar?.frontImage || '',
                backImage: data?.documents?.aadhaar?.backImage || '',
                status: data?.documents?.aadhaar?.status || 'Pending',
            },
            pan: {
                number: data?.documents?.pan?.number || '',
                image: data?.documents?.pan?.image || '',
                status: data?.documents?.pan?.status || 'Pending',
            },
            drivingLicense: {
                number: data?.documents?.drivingLicense?.number || '',
                image: data?.documents?.drivingLicense?.image || '',
                expiryDate: data?.documents?.drivingLicense?.expiryDate 
                    ? new Date(data.documents.drivingLicense.expiryDate).toISOString().split('T')[0] 
                    : '',
                status: data?.documents?.drivingLicense?.status || 'Pending',
            },
        },
        walletBalance: data?.walletBalance || 0,
        totalEarnings: data?.totalEarnings || 0,
        isOnline: data?.isOnline || false,
        isActive: data?.isActive ?? true,
        isVerified: data?.isVerified || false,
    });

    // Step 3: Details Form
    const detailsForm = useForm<PartnerDetailsFormData>({
        resolver: zodResolver(partnerDetailsSchema) as any,
        defaultValues: getInitialDetailsValues(initialData)
    });

    // Sync form with initialData when it changes
    React.useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setStep('DETAILS');
                setPhone(initialData.phone);
                setPartnerId(initialData._id);
                detailsForm.reset(getInitialDetailsValues(initialData));
                setActiveTab('basic');
            } else {
                setStep('PHONE');
                setPhone('');
                setPartnerId('');
                phoneForm.reset();
                otpForm.reset();
                detailsForm.reset(getInitialDetailsValues(null));
                setActiveTab('basic');
            }
            // Clear files
            setAvatarFile(null);
            setAadhaarFrontFile(null);
            setAadhaarBackFile(null);
            setPanFile(null);
            setDlFile(null);
        }
    }, [isOpen, initialData, mode, detailsForm, phoneForm, otpForm]);

    const sanitizePath = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
        return `${cleanBase}${cleanPath.replace(/\\/g, '/')}`;
    };

    const handleSendOtp = async (data: PhoneFormData) => {
        setIsLoading(true);
        try {
            const response = await servicePartnerApi.sendOtp(data.phone);
            if (response.data.success) {
                setPhone(data.phone);
                setServerOtp(response.data.otp);
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
            const formData = new FormData();
            
            // Append basic fields
            formData.append('partnerId', partnerId);
            formData.append('name', data.name);
            if (data.email) formData.append('email', data.email);
            formData.append('phone', phone);
            
            // Append objects as JSON strings (controller handles parsing)
            formData.append('vehicle', JSON.stringify(data.vehicle));
            formData.append('documents', JSON.stringify(data.documents));
            formData.append('kycStatus', data.kycStatus || 'Pending');
            formData.append('walletBalance', String(data.walletBalance || 0));
            formData.append('totalEarnings', String(data.totalEarnings || 0));
            formData.append('isOnline', String(data.isOnline));
            formData.append('isActive', String(data.isActive));
            formData.append('isVerified', String(data.isVerified));

            // Append Files
            if (avatarFile) formData.append('avatar', avatarFile);
            if (aadhaarFrontFile) formData.append('aadhaarFront', aadhaarFrontFile);
            if (aadhaarBackFile) formData.append('aadhaarBack', aadhaarBackFile);
            if (panFile) formData.append('panImage', panFile);
            if (dlFile) formData.append('dlImage', dlFile);

            let response;
            if (mode === 'edit') {
                response = await servicePartnerApi.updatePartner(partnerId, formData);
            } else {
                response = await servicePartnerApi.completeRegistration(formData);
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

    const getModalProps = () => {
        switch (step) {
            case 'PHONE':
                return {
                    title: 'Verify Partner Phone',
                    onSubmit: phoneForm.handleSubmit(handleSendOtp) as any,
                    submitLabel: 'Send OTP'
                };
            case 'OTP':
                return {
                    title: 'Enter Verification Code',
                    onSubmit: otpForm.handleSubmit(handleVerifyOtp) as any,
                    submitLabel: 'Verify Code'
                };
            case 'DETAILS':
                return {
                    title: mode === 'edit' ? 'Edit Partner Profile' : 'Partner Information',
                    onSubmit: detailsForm.handleSubmit(handleCompleteRegistration) as any,
                    submitLabel: mode === 'edit' ? 'Update Partner' : 'Complete Registration'
                };
        }
    };

    const { title, onSubmit, submitLabel } = getModalProps();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <div className="tab-pane animate-fade-in">
                        <div className="grid-2">
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
                        <div className="grid-2">
                            <LuxuryInput 
                                label="Phone (Fixed)" 
                                value={phone}
                                disabled
                            />
                            <div className="avatar-upload-box">
                                <LuxuryImageUpload 
                                    label="Profile Picture"
                                    value={sanitizePath(detailsForm.watch('avatar') || '')}
                                    onChange={(file) => setAvatarFile(file as File)}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'vehicle':
                return (
                    <div className="tab-pane animate-fade-in">
                        <div className="grid-2">
                            <Controller
                                name="vehicle.type"
                                control={detailsForm.control}
                                render={({ field }) => (
                                    <LuxurySelect 
                                        label="Vehicle Type *"
                                        options={VEHICLE_OPTIONS}
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={detailsForm.formState.errors.vehicle?.type?.message}
                                    />
                                )}
                            />
                            <LuxuryInput 
                                label="Vehicle Number *" 
                                {...detailsForm.register('vehicle.number')}
                                error={detailsForm.formState.errors.vehicle?.number?.message}
                                placeholder="MH 12 AB 1234"
                            />
                            <LuxuryInput 
                                label="Vehicle Model" 
                                {...detailsForm.register('vehicle.model')}
                                placeholder="Pulsar 220 / Activa 6G"
                            />
                        </div>
                    </div>
                );
            case 'kyc':
                return (
                    <div className="tab-pane animate-fade-in">
                        <div className="mb-20">
                            <Controller
                                name="kycStatus"
                                control={detailsForm.control}
                                render={({ field }) => (
                                    <LuxurySelect 
                                        label="KYC Overall Status"
                                        options={KYC_STATUS_OPTIONS}
                                        value={field.value || 'Pending'}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                        
                        <div className="document-sections">
                            <div className="doc-group">
                                <h4>Aadhaar Card</h4>
                                <div className="grid-2">
                                    <LuxuryInput label="Aadhaar Number" {...detailsForm.register('documents.aadhaar.number')} />
                                    <Controller
                                        name="documents.aadhaar.status"
                                        control={detailsForm.control}
                                        render={({ field }) => (
                                            <LuxurySelect 
                                                label="Status"
                                                options={DOC_STATUS_OPTIONS}
                                                value={field.value || 'Pending'}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="grid-2" style={{ marginTop: '10px' }}>
                                    <LuxuryImageUpload 
                                        label="Front Image" 
                                        value={sanitizePath(detailsForm.watch('documents.aadhaar.frontImage') || '')}
                                        onChange={(file) => setAadhaarFrontFile(file as File)}
                                    />
                                    <LuxuryImageUpload 
                                        label="Back Image" 
                                        value={sanitizePath(detailsForm.watch('documents.aadhaar.backImage') || '')}
                                        onChange={(file) => setAadhaarBackFile(file as File)}
                                    />
                                </div>
                            </div>

                            <div className="doc-group">
                                <h4>PAN Card</h4>
                                <div className="grid-2">
                                    <LuxuryInput label="PAN Number" {...detailsForm.register('documents.pan.number')} />
                                    <Controller
                                        name="documents.pan.status"
                                        control={detailsForm.control}
                                        render={({ field }) => (
                                            <LuxurySelect 
                                                label="Status"
                                                options={DOC_STATUS_OPTIONS}
                                                value={field.value || 'Pending'}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <LuxuryImageUpload 
                                        label="PAN Card Image" 
                                        value={sanitizePath(detailsForm.watch('documents.pan.image') || '')}
                                        onChange={(file) => setPanFile(file as File)}
                                    />
                                </div>
                            </div>

                            <div className="doc-group">
                                <h4>Driving License</h4>
                                <div className="grid-2">
                                    <LuxuryInput label="DL Number" {...detailsForm.register('documents.drivingLicense.number')} />
                                    <div className="luxury-input-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label className="luxury-input-label" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expiry Date</label>
                                        <Controller
                                            name="documents.drivingLicense.expiryDate"
                                            control={detailsForm.control}
                                            render={({ field }) => (
                                                <DatePicker 
                                                    style={{ width: '100%', height: '44px', background: 'var(--bg-dark-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(date, dateString) => field.onChange(dateString)}
                                                    format="YYYY-MM-DD"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="grid-2" style={{ marginTop: '10px' }}>
                                    <Controller
                                        name="documents.drivingLicense.status"
                                        control={detailsForm.control}
                                        render={({ field }) => (
                                            <LuxurySelect 
                                                label="Status"
                                                options={DOC_STATUS_OPTIONS}
                                                value={field.value || 'Pending'}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <LuxuryImageUpload 
                                        label="DL Image" 
                                        value={sanitizePath(detailsForm.watch('documents.drivingLicense.image') || '')}
                                        onChange={(file) => setDlFile(file as File)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'status':
                return (
                    <div className="tab-pane animate-fade-in">
                        <div className="grid-2">
                            <LuxuryInput 
                                type="number" 
                                label="Wallet Balance" 
                                {...detailsForm.register('walletBalance', { valueAsNumber: true })}
                            />
                            <LuxuryInput 
                                type="number" 
                                label="Total Earnings" 
                                {...detailsForm.register('totalEarnings', { valueAsNumber: true })}
                            />
                        </div>
                        <div className="status-toggles">
                            <Controller
                                        name="isOnline"
                                        control={detailsForm.control}
                                        render={({ field }) => (
                                            <div className="toggle-item">
                                                <span>Online Status</span>
                                                <LuxuryToggle value={!!field.value} onChange={field.onChange} />
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name="isActive"
                                        control={detailsForm.control}
                                        render={({ field }) => (
                                            <div className="toggle-item">
                                                <span>Active Account</span>
                                                <LuxuryToggle value={!!field.value} onChange={field.onChange} />
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name="isVerified"
                                        control={detailsForm.control}
                                        render={({ field }) => (
                                            <div className="toggle-item">
                                                <span>Phone Verified</span>
                                                <LuxuryToggle value={!!field.value} onChange={field.onChange} />
                                            </div>
                                        )}
                                    />
                        </div>
                    </div>
                );
        }
    };

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            size="lg"
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
                        <div className="form-tabs">
                            <button type="button" className={activeTab === 'basic' ? 'active' : ''} onClick={() => setActiveTab('basic')}>Basic</button>
                            <button type="button" className={activeTab === 'vehicle' ? 'active' : ''} onClick={() => setActiveTab('vehicle')}>Vehicle</button>
                            <button type="button" className={activeTab === 'kyc' ? 'active' : ''} onClick={() => setActiveTab('kyc')}>KYC & Docs</button>
                            <button type="button" className={activeTab === 'status' ? 'active' : ''} onClick={() => setActiveTab('status')}>Status & Finance</button>
                        </div>
                        
                        <div className="tab-container">
                            {renderTabContent()}
                        </div>
                    </div>
                )}
            </div>
        </LuxuryModal>
    );
};

export default PartnerFormModal;
