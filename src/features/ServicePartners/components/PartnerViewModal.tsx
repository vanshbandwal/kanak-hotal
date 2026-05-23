import React, { useState, useEffect } from 'react';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import { servicePartnerApi } from '../../../api/servicePartnerApi';
import { useToast } from '../../../context/ToastContext';
import { BASE_URL } from '../../../api/endpoint';
import './PartnerViewModal.css';

interface PartnerViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    partner: any;
}

const PartnerViewModal: React.FC<PartnerViewModalProps> = ({ isOpen, onClose, partner }) => {
    const { addToast } = useToast();
    const [fullPartner, setFullPartner] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (isOpen && partner?._id) {
                setIsLoading(true);
                try {
                    const { data } = await servicePartnerApi.getPartnerById(partner._id);
                    if (data.success) {
                        setFullPartner(data.partner);
                    } else {
                        setFullPartner(partner);
                    }
                } catch (error) {
                    addToast('error', 'Failed to fetch detailed partner profile');
                    setFullPartner(partner);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setFullPartner(null);
            }
        };

        fetchDetails();
    }, [isOpen, partner, addToast]);

    const displayPartner = fullPartner || partner;

    if (!displayPartner) return null;

    const kycVariants: any = {
        Verified: 'success',
        Pending: 'warning',
        'In Review': 'info',
        Rejected: 'danger'
    };

    const sanitizePath = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
        return `${cleanBase}${cleanPath.replace(/\\/g, '/')}`;
    };

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={onClose}
            title="Service Partner Profile"
            size="md"
            submitLabel="Close"
            onSubmit={onClose}
            isLoading={isLoading}
        >
            <div className="partner-view-container">
                <div className="partner-view-header">
                    <div className="partner-view-avatar">
                        {displayPartner.avatar ? (
                            <img src={sanitizePath(displayPartner.avatar)} alt={displayPartner.name} />
                        ) : (
                            <span>{displayPartner.name?.charAt(0) || 'P'}</span>
                        )}
                    </div>
                    <div className="partner-view-title">
                        <h2>{displayPartner.name}</h2>
                        <p>{displayPartner.phone}</p>
                        <div style={{ marginTop: '5px', display: 'flex', gap: '10px' }}>
                            <LuxuryStatusBadge label={displayPartner.kycStatus} variant={kycVariants[displayPartner.kycStatus]} />
                            <LuxuryStatusBadge label={displayPartner.isOnline ? 'Online' : 'Offline'} variant={displayPartner.isOnline ? 'success' : 'neutral'} />
                        </div>
                    </div>
                </div>

                <div className="partner-view-grid">
                    <div className="info-group">
                        <label>Email Address</label>
                        <p>{displayPartner.email || 'Not provided'}</p>
                    </div>
                    <div className="info-group">
                        <label>Vehicle Type</label>
                        <p>{displayPartner.vehicle?.type}</p>
                    </div>
                    <div className="info-group">
                        <label>Vehicle Number</label>
                        <p>{displayPartner.vehicle?.number}</p>
                    </div>
                    <div className="info-group">
                        <label>Wallet Balance</label>
                        <p className="wallet-amount">₹{displayPartner.walletBalance?.toFixed(2) || '0.00'}</p>
                    </div>
                </div>

                <div className="kyc-summary">
                    <h3>Document Verification</h3>
                    <div className="doc-row">
                        <span>Aadhaar Card</span>
                        <LuxuryStatusBadge label={displayPartner.documents?.aadhaar?.status || 'Pending'} variant={kycVariants[displayPartner.documents?.aadhaar?.status] || 'warning'} />
                    </div>
                    <div className="doc-row">
                        <span>PAN Card</span>
                        <LuxuryStatusBadge label={displayPartner.documents?.pan?.status || 'Pending'} variant={kycVariants[displayPartner.documents?.pan?.status] || 'warning'} />
                    </div>
                    <div className="doc-row">
                        <span>Driving License</span>
                        <LuxuryStatusBadge label={displayPartner.documents?.drivingLicense?.status || 'Pending'} variant={kycVariants[displayPartner.documents?.drivingLicense?.status] || 'warning'} />
                    </div>
                </div>
            </div>
        </LuxuryModal>
    );
};

export default PartnerViewModal;
