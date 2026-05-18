import React, { useEffect } from 'react';
import LuxuryButton from './LuxuryButton';
import './LuxuryModal.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface LuxuryModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: ModalSize;
    isLoading?: boolean;
    onSubmit?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    isViewOnly?: boolean;
    footer?: React.ReactNode;
    hideFooter?: boolean;
}

const sizeMap: Record<ModalSize, string> = {
    sm: '400px',
    md: '550px',
    lg: '850px',
    xl: '1100px',
    full: '95vw'
};

const LuxuryModal: React.FC<LuxuryModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    isLoading = false,
    onSubmit,
    submitLabel = 'Save Changes',
    cancelLabel = 'Cancel',
    isViewOnly = false,
    footer,
    hideFooter = false
}) => {
    // Handle Escape key to close
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="luxury-modal-overlay" onClick={onClose}>
            <div 
                className={`luxury-modal-card size-${size}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="luxury-modal-header">
                    <h2 className="luxury-modal-title">{title}</h2>
                    <button onClick={onClose} className="luxury-modal-close-btn">&times;</button>
                </div>

                <div className="luxury-modal-content">
                    {children}
                </div>

                {!hideFooter && (
                    <div className="luxury-modal-footer">
                        {footer ? footer : (
                            <>
                                <LuxuryButton 
                                    type="button" 
                                    onClick={onClose} 
                                    variant="ghost"
                                >
                                    {isViewOnly ? 'Close' : cancelLabel}
                                </LuxuryButton>
                                {!isViewOnly && onSubmit && (
                                    <LuxuryButton 
                                        type="submit" 
                                        onClick={onSubmit}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Saving...' : submitLabel}
                                    </LuxuryButton>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LuxuryModal;
