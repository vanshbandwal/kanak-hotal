import React from 'react';
import './LuxuryStatusBadge.css';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'gold' | 'neutral';

interface LuxuryStatusBadgeProps {
    label: string;
    variant?: BadgeVariant;
    icon?: string;
    className?: string;
    onClick?: () => void;
}

const LuxuryStatusBadge: React.FC<LuxuryStatusBadgeProps> = ({ 
    label, 
    variant = 'neutral', 
    icon, 
    className = '',
    onClick 
}) => {
    return (
        <div 
            className={`luxury-badge-container badge-${variant} ${onClick ? 'badge-interactive' : ''} ${className}`}
            onClick={onClick}
        >
            {icon && <span className="luxury-badge-icon">{icon}</span>}
            <span className="luxury-badge-text">{label}</span>
        </div>
    );
};

export default LuxuryStatusBadge;
