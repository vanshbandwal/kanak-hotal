import React from 'react';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import { BASE_URL } from '../../../api/endpoint';
import './PartnerViewModal.css';

interface PartnerViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    partner: any;
}

const PartnerViewModal: React.FC<PartnerViewModalProps> = ({ isOpen, onClose, partner }) => {
    if (!partner) return null;

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
        >
            <div className="partner-view-container">
                <div className="partner-view-header">
                    <div className="partner-view-avatar">
                        {partner.avatar ? (
                            <img src={sanitizePath(partner.avatar)} alt={partner.name} />
                        ) : (
                            <span>{partner.name?.charAt(0) || 'P'}</span>
                        )}
                    </div>
                    <div className="partner-view-title">
                        <h2>{partner.name}</h2>
                        <p>{partner.phone}</p>
                        <div style={{ marginTop: '5px', display: 'flex', gap: '10px' }}>
                            <LuxuryStatusBadge label={partner.kycStatus} variant={kycVariants[partner.kycStatus]} />
                            <LuxuryStatusBadge label={partner.isOnline ? 'Online' : 'Offline'} variant={partner.isOnline ? 'success' : 'neutral'} />
                        </div>
                    </div>
                </div>

                <div className="partner-view-grid">
                    <div className="info-group">
                        <label>Email Address</label>
                        <p>{partner.email || 'Not provided'}</p>
                    </div>
                    <div className="info-group">
                        <label>Vehicle Type</label>
                        <p>{partner.vehicle?.type}</p>
                    </div>
                    <div className="info-group">
                        <label>Vehicle Number</label>
                        <p>{partner.vehicle?.number}</p>
                    </div>
                    <div className="info-group">
                        <label>Wallet Balance</label>
                        <p className="wallet-amount">₹{partner.walletBalance?.toFixed(2) || '0.00'}</p>
                    </div>
                </div>

                <div className="kyc-summary">
                    <h3>Document Verification</h3>
                    <div className="doc-row">
                        <span>Aadhaar Card</span>
                        <LuxuryStatusBadge label={partner.documents?.aadhaar?.status || 'Pending'} variant={kycVariants[partner.documents?.aadhaar?.status] || 'warning'} />
                    </div>
                    <div className="doc-row">
                        <span>PAN Card</span>
                        <LuxuryStatusBadge label={partner.documents?.pan?.status || 'Pending'} variant={kycVariants[partner.documents?.pan?.status] || 'warning'} />
                    </div>
                    <div className="doc-row">
                        <span>Driving License</span>
                        <LuxuryStatusBadge label={partner.documents?.drivingLicense?.status || 'Pending'} variant={kycVariants[partner.documents?.drivingLicense?.status] || 'warning'} />
                    </div>
                </div>
            </div>
        </LuxuryModal>
    );
};

export default PartnerViewModal;
