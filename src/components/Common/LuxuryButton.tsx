import React, { ButtonHTMLAttributes } from 'react';
import './LuxuryButton.css';

interface LuxuryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'neutral';
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
    isLoading?: boolean;
    glow?: boolean;
}

const LuxuryButton: React.FC<LuxuryButtonProps> = ({ 
    variant = 'primary', 
    size = 'medium',
    children, 
    style, 
    disabled,
    icon,
    isLoading,
    glow,
    ...props 
}) => {
    return (
        <button 
            {...props}
            disabled={disabled || isLoading}
            className={`luxury-button variant-${variant} size-${size} ${glow ? 'glow' : ''} ${isLoading ? 'loading' : ''} ${props.className || ''}`}
            style={style}
        >
            {isLoading ? (
                <div className="button-loader">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    {icon && <span className="luxury-button-icon">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default LuxuryButton;
