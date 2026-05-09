import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import LuxuryModal from './LuxuryModal';
import LuxuryButton from './LuxuryButton';
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

    const footer = (
        <div className="luxury-confirm-footer">
            <LuxuryButton 
                onClick={onClose} 
                variant="ghost"
                disabled={isLoading}
            >
                {cancelLabel}
            </LuxuryButton>
            <LuxuryButton 
                onClick={onConfirm} 
                style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 8px 20px ${accentColor}44`,
                    border: 'none',
                    color: 'white'
                }}
                disabled={isLoading}
            >
                {isLoading ? '...' : confirmLabel}
            </LuxuryButton>
        </div>
    );

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={footer}
        >
            <div className="luxury-confirm-content">
                <div 
                    className="luxury-confirm-icon-wrapper" 
                    style={{ border: `1px solid ${accentColor}44` }}
                >
                    <span className="luxury-confirm-icon">{getIcon()}</span>
                </div>
                
                <p className="luxury-confirm-message">{message}</p>
            </div>
        </LuxuryModal>
    );
};

export default LuxuryConfirmModal;

