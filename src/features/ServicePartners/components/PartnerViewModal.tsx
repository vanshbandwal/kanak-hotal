import React from 'react';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';

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
                            <img src={partner.avatar} alt={partner.name} />
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

            <style>{`
                .partner-view-header {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    padding-bottom: 20px;
                    border-bottom: 1px solid var(--glass-border);
                    margin-bottom: 20px;
                }
                .partner-view-avatar {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: var(--glass-bg);
                    border: 2px solid var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--primary);
                    overflow: hidden;
                }
                .partner-view-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .partner-view-title h2 {
                    margin: 0;
                    font-size: 20px;
                    color: var(--text-primary);
                }
                .partner-view-title p {
                    margin: 2px 0 0 0;
                    color: var(--text-secondary);
                    font-size: 14px;
                }
                .partner-view-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 25px;
                }
                .info-group label {
                    display: block;
                    font-size: 11px;
                    text-transform: uppercase;
                    color: var(--text-secondary);
                    margin-bottom: 4px;
                }
                .info-group p {
                    margin: 0;
                    font-size: 14px;
                    color: var(--text-primary);
                    font-weight: 500;
                }
                .wallet-amount {
                    color: var(--success) !important;
                }
                .kyc-summary {
                    background: rgba(255,255,255,0.03);
                    padding: 15px;
                    border-radius: 12px;
                    border: 1px solid var(--glass-border);
                }
                .kyc-summary h3 {
                    font-size: 14px;
                    margin: 0 0 15px 0;
                    color: var(--text-primary);
                }
                .doc-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 13px;
                    color: var(--text-secondary);
                }
            `}</style>
        </LuxuryModal>
    );
};

export default PartnerViewModal;
