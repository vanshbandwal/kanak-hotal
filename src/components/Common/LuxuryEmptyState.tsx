import React from 'react';
import LuxuryButton from './LuxuryButton';
import './LuxuryEmptyState.css';

interface LuxuryEmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

const LuxuryEmptyState: React.FC<LuxuryEmptyStateProps> = ({
    icon = '✨',
    title,
    description,
    actionLabel,
    onAction,
    className = ''
}) => {
    return (
        <div className={`luxury-empty-state ${className}`}>
            <div className="empty-state-icon-wrapper">
                <span className="empty-state-icon">{icon}</span>
            </div>
            <h3 className="empty-state-title">{title}</h3>
            <p className="empty-state-description">{description}</p>
            {actionLabel && onAction && (
                <LuxuryButton 
                    onClick={onAction} 
                    className="empty-state-btn"
                >
                    {actionLabel}
                </LuxuryButton>
            )}
        </div>
    );
};

export default LuxuryEmptyState;
