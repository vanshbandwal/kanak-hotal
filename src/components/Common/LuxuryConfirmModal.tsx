import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './LuxuryConfirmModal.css';

interface LuxuryConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

const LuxuryConfirmModal: React.FC<LuxuryConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'CONFIRM',
    cancelLabel = 'CANCEL',
    type = 'danger',
    isLoading = false
}) => {
    const { colors } = useTheme();
    if (!isOpen) return null;

    const getIcon = () => {
        if (type === 'danger') return '⚠️';
        if (type === 'warning') return '🔔';
        return 'ℹ️';
    };

    const getAccentColor = () => {
        if (type === 'danger') return colors.error;
        if (type === 'warning') return colors.primary;
        return '#00a2ff';
    };

    const accentColor = getAccentColor();

    return (
        <div className="luxury-confirm-overlay" onClick={onClose}>
            <div className="luxury-confirm-modal-card" onClick={e => e.stopPropagation()}>
                <div 
                    className="luxury-confirm-accent-bar" 
                    style={{ backgroundColor: accentColor }} 
                />
                
                <div className="luxury-confirm-content">
                    <div 
                        className="luxury-confirm-icon-wrapper" 
                        style={{ border: `1px solid ${accentColor}44` }}
                    >
                        <span className="luxury-confirm-icon">{getIcon()}</span>
                    </div>
                    
                    <h3 className="luxury-confirm-title">{title}</h3>
                    <p className="luxury-confirm-message">{message}</p>
                </div>

                <div className="luxury-confirm-footer">
                    <button 
                        onClick={onClose} 
                        className="luxury-confirm-cancel-btn"
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="luxury-confirm-confirm-btn"
                        style={{
                            backgroundColor: accentColor,
                            boxShadow: `0 8px 20px ${accentColor}44`
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? '...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LuxuryConfirmModal;
