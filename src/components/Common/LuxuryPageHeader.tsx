import React from 'react';
import LuxuryButton from './LuxuryButton';
import './LuxuryPageHeader.css';

interface Action {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'ghost' | 'danger';
    icon?: React.ReactNode;
}

interface LuxuryPageHeaderProps {
    title: string;
    subtitle?: string;
    primaryAction?: Action;
    secondaryAction?: Action;
    className?: string;
}

const LuxuryPageHeader: React.FC<LuxuryPageHeaderProps> = ({
    title,
    subtitle,
    primaryAction,
    secondaryAction,
    className = ''
}) => {
    // If there are no action buttons, don't render the header wrapper at all.
    if (!primaryAction && !secondaryAction) {
        return null;
    }

    return (
        <div className={`luxury-page-header ${className}`} style={{ borderBottom: 'none', justifyContent: 'flex-end', marginBottom: 0 }}>
            
            <div className="luxury-header-actions">
                {secondaryAction && (
                    <LuxuryButton 
                        onClick={secondaryAction.onClick} 
                        variant="ghost"
                        className="luxury-header-btn"
                    >
                        {secondaryAction.icon && <span className="btn-icon-spacing">{secondaryAction.icon}</span>}
                        {secondaryAction.label}
                    </LuxuryButton>
                )}
                {primaryAction && (
                    <LuxuryButton 
                        onClick={primaryAction.onClick} 
                        className="luxury-header-btn"
                    >
                        {primaryAction.icon && <span className="btn-icon-spacing">{primaryAction.icon}</span>}
                        {primaryAction.label}
                    </LuxuryButton>
                )}
            </div>
        </div>
    );
};

export default LuxuryPageHeader;
