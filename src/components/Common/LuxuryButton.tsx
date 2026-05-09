import React, { ButtonHTMLAttributes } from 'react';
import './LuxuryButton.css';

interface LuxuryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
}

const LuxuryButton: React.FC<LuxuryButtonProps> = ({ 
    variant = 'primary', 
    size = 'medium',
    children, 
    style, 
    disabled,
    icon,
    ...props 
}) => {
    return (
        <button 
            {...props}
            disabled={disabled}
            className={`luxury-button variant-${variant} size-${size} ${props.className || ''}`}
            style={style}
        >
            {icon && <span className="luxury-button-icon">{icon}</span>}
            {children}
        </button>
    );
};

export default LuxuryButton;
