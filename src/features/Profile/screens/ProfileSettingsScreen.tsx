import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../store';
import { setCredentials } from '../../../store/slices/authSlice';
import authApi from '../../../api/authApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryImageUpload from '../../../components/Common/LuxuryImageUpload';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import './ProfileSettingsScreen.css';

const ProfileSettingsScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const { addToast } = useToast();
    
    // Core Profile States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Modal & Security Password Change States
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const sanitizePath = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
        return `${cleanBase}${cleanPath.replace(/\\/g, '/')}`;
    };

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await authApi.getUserProfile();
            if (error) {
                addToast('error', error);
                return;
            }
            if (data) {
                setName(data.name || '');
                setEmail(data.email || '');
                setPhone(data.phone || '');
                setRole(data.role || 'Admin');
                setAvatarUrl(data.avatar || '');
            }
        } catch (err: any) {
            addToast('error', err.message || 'Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Update Profile details (Name, Email, Phone, Avatar)
    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const { data, error } = await authApi.updateAdminProfile(formData);
            if (error) {
                addToast('error', error);
                return;
            }
            if (data) {
                addToast('success', 'Profile configuration updated successfully ✨');
                setName(data.name || '');
                setEmail(data.email || '');
                setPhone(data.phone || '');
                setAvatarUrl(data.avatar || '');
                setAvatarFile(null); // Clear selected file

                // Keep redux auth state in sync
                dispatch(setCredentials({
                    token: localStorage.getItem('token') || '',
                    admin: {
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        role: data.role
                    }
                }));
            }
        } catch (err: any) {
            addToast('error', err.message || 'Failed to save configuration');
        } finally {
            setIsSaving(false);
        }
    };

    // Step 1: Request Password Change OTP
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword) {
            addToast('error', 'Please enter your current password to receive a security verification code.');
            return;
        }
        setIsRequestingOtp(true);
        try {
            const { data, error } = await authApi.requestPasswordOtp({ currentPassword });
            if (error) {
                addToast('error', error);
                return;
            }
            setIsOtpSent(true);
            addToast('success', 'Security verification OTP dispatched! Check your email or console log. ✨');
            
            // Print OTP to developer console in dev mode
            if (data && data.otp) {
                console.log(`🔑 [Dev Mode Security Alert] Verification OTP is: ${data.otp}`);
            }
        } catch (err: any) {
            addToast('error', err.message || 'Failed to request verification code');
        } finally {
            setIsRequestingOtp(false);
        }
    };

    // Step 2: Confirm OTP & Commit New Password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !otp) {
            addToast('error', 'Please complete all password security fields');
            return;
        }
        setIsChangingPassword(true);
        try {
            const { data, error } = await authApi.changePassword({
                currentPassword,
                newPassword,
                otp
            });
            if (error) {
                addToast('error', error);
                return;
            }
            addToast('success', 'Security credentials updated! All other active sessions terminated. 🔐');
            
            // Clear and close
            setCurrentPassword('');
            setNewPassword('');
            setOtp('');
            setIsOtpSent(false);
            setIsPasswordModalOpen(false);

            // Update the JWT token locally so the current device remains securely logged in
            if (data && data.token) {
                localStorage.setItem('token', data.token);
                dispatch(setCredentials({
                    token: data.token,
                    admin: {
                        id: localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user')!).id : '',
                        name,
                        email,
                        role
                    }
                }));
            }
        } catch (err: any) {
            addToast('error', err.message || 'Failed to update security credentials');
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <div className="profile-settings-page">
                <div style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', textAlign: 'center', marginTop: '100px', letterSpacing: '1px' }}>
                    Loading Your Premium Admin Space...
                </div>
            </div>
        );
    }

    return (
        <div className="profile-settings-page animate-fade-in">
            <div className="profile-settings-container">
                {/* 👑 Left Section: Admin Profile Summary */}
                <div className="owner-summary-card">
                    <div className="avatar-section">
                        <LuxuryImageUpload 
                            value={sanitizePath(avatarUrl)}
                            onChange={(file) => setAvatarFile(file as File)}
                            previewClassName="avatar-preview-circle"
                        />
                        <span className="premium-badge">{role === 'admin' ? 'SUPER ADMIN' : role}</span>
                    </div>
                    <div className="owner-meta-info">
                        <h2>{name || 'System Owner'}</h2>
                        <p className="owner-role-desc">System Operations Director</p>
                    </div>
                    
                    <button 
                        type="button" 
                        className="security-modal-trigger-btn"
                        onClick={() => {
                            setIsPasswordModalOpen(true);
                            setIsOtpSent(false);
                            setCurrentPassword('');
                            setNewPassword('');
                            setOtp('');
                        }}
                    >
                        🛡️ Change Password
                    </button>
                </div>

                {/* 📝 Right Section: Administrative Details Form */}
                <div className="profile-details-card">
                    <div className="details-header">
                        <h2>System Configuration</h2>
                        <p>Maintain your direct administrative identity, primary email, and secure contact details.</p>
                    </div>
                    <form onSubmit={handleSaveProfile} className="high-density-form">
                        <div className="grid-2">
                            <LuxuryInput 
                                label="Administrative Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Jay"
                                required
                            />
                            <LuxuryInput 
                                label="Secured Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter contact phone number"
                            />
                        </div>
                        <div className="form-single-col">
                            <LuxuryInput 
                                label="Primary Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="owner@website.com"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="submit-btn-premium compact" 
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Commit Details ✨'}
                        </button>
                    </form>
                </div>
            </div>

            {/* 🛡️ Secure Multi-Step Change Password Modal */}
            <LuxuryModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Change Password Security Wizard"
                size="md"
                hideFooter
            >
                <div className="password-wizard-content">
                    {/* Step 1: Confirm Current Password & Request OTP */}
                    {!isOtpSent ? (
                        <form onSubmit={handleRequestOtp} className="wizard-step animate-fade-in">
                            <div className="wizard-icon">🔑</div>
                            <h3>Step 1: Verification Request</h3>
                            <p className="wizard-description">
                                Enter your current password to receive a secure 6-digit OTP verification code to verify your identity.
                            </p>
                            
                            <div className="wizard-input-wrap">
                                <LuxuryInput 
                                    label="Confirm Current Password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>

                            <div className="wizard-footer-actions">
                                <button 
                                    type="button" 
                                    className="wizard-cancel-btn" 
                                    onClick={() => setIsPasswordModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="wizard-submit-btn" 
                                    disabled={isRequestingOtp}
                                >
                                    {isRequestingOtp ? 'Requesting Code...' : 'Request OTP Code 🔑'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Step 2: Input OTP & Enter New Password
                        <form onSubmit={handleChangePassword} className="wizard-step animate-fade-in">
                            <div className="wizard-icon">🛡️</div>
                            <h3>Step 2: Authorization Console</h3>
                            <p className="wizard-description">
                                Input the verification code received via email/console and specify your new security credentials.
                            </p>

                            <div className="otp-alert-badge">
                                ⚡️ Verification OTP has been dispatched successfully!
                            </div>

                            <div className="wizard-input-grid">
                                <LuxuryInput 
                                    label="Verification OTP Code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    required
                                />
                                <LuxuryInput 
                                    label="Specify New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min 8 characters"
                                    required
                                />
                            </div>

                            <div className="wizard-footer-actions">
                                <button 
                                    type="button" 
                                    className="wizard-back-btn" 
                                    onClick={() => setIsOtpSent(false)}
                                >
                                    Back
                                </button>
                                <button 
                                    type="submit" 
                                    className="wizard-submit-btn confirm" 
                                    disabled={isChangingPassword}
                                >
                                    {isChangingPassword ? 'Committing...' : 'Commit Password Change 🔐'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </LuxuryModal>
        </div>
    );
};

export default ProfileSettingsScreen;
