import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ConfirmationIcon } from '../../context/ConfirmationContext';
import './ConfirmationDialog.css';

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    subtitle: string;
    confirmLabel?: string;
    cancelLabel?: string;
    icon?: ConfirmationIcon;
    onConfirm: () => void;
    onClose: () => void;
    critical?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    title,
    subtitle,
    confirmLabel = "Remove It",
    cancelLabel = "Keep It",
    icon = "trash",
    onConfirm,
    onClose,
    critical = false
}) => {
    const { theme } = useTheme();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !critical) onClose();
            if (e.key === 'Enter') onConfirm();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose, onConfirm, critical]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (icon) {
            case 'trash': return '🗑️';
            case 'hanger': return '👗';
            case 'heart-break': return '💔';
            case 'box': return '📦';
            case 'user-minus': return '👤';
            case 'map-pin': return '📍';
            default: return '📍';
        }
    };

    const isMinimal = theme === 'minimal';
    const isLuxury = theme === 'luxury';

    return (
        <div className="conf-backdrop" onClick={critical ? undefined : onClose}>
            <div
                className={`conf-modal ${isMinimal ? 'minimal' : ''}`}
                onClick={(e) => e.stopPropagation()}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="conf-title"
                aria-describedby="conf-desc"
            >
                <div className="conf-icon-container">{getIcon()}</div>

                <h2 id="conf-title" className={`conf-title ${isMinimal ? 'minimal' : ''}`}>{title}</h2>
                <p id="conf-desc" className="conf-subtitle">{subtitle}</p>

                <div className="conf-actions">
                    <button
                        onClick={onClose}
                        className={`conf-cancel-btn ${isMinimal ? 'minimal' : ''}`}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`conf-confirm-btn ${isMinimal ? 'minimal' : ''}`}
                    >
                        {confirmLabel}
                    </button>
                </div>

                {isLuxury && <div className="conf-luxury-divider" />}
            </div>
        </div>
    );
};

export default ConfirmationDialog;
