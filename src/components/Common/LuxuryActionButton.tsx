import React from 'react';
import './LuxuryActionButton.css';

export type ActionType = 'edit' | 'delete' | 'view' | 'external' | 'approve' | 'reject';

interface LuxuryActionButtonProps {
    type: ActionType;
    onClick?: () => void;
    href?: string;
    title?: string;
    disabled?: boolean;
    className?: string;
}

const LuxuryActionButton: React.FC<LuxuryActionButtonProps> = ({ 
    type, 
    onClick, 
    href, 
    title, 
    disabled,
    className = ''
}) => {
    const getIcon = () => {
        switch (type) {
            case 'edit':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                );
            case 'delete':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                );
            case 'view':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                );
            case 'external':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                );
            case 'approve':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                );
            case 'reject':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const content = (
        <span className="luxury-action-icon">
            {getIcon()}
        </span>
    );

    if (href) {
        return (
            <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`luxury-action-btn type-${type} ${className}`}
                title={title || type.charAt(0).toUpperCase() + type.slice(1)}
            >
                {content}
            </a>
        );
    }

    return (
        <button 
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`luxury-action-btn type-${type} ${className}`}
            title={title || type.charAt(0).toUpperCase() + type.slice(1)}
        >
            {content}
        </button>
    );
};

export default LuxuryActionButton;
