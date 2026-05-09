import React from 'react';
import './LuxuryToggle.css';

interface LuxuryToggleProps {
    label?: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    activeColor?: string;
}

const LuxuryToggle: React.FC<LuxuryToggleProps> = ({ 
    label, 
    value, 
    onChange, 
    disabled = false,
    activeColor
}) => {
    return (
        <div 
            className={`luxury-toggle-wrapper ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && onChange(!value)}
        >
            <div 
                className={`luxury-toggle-track ${value ? 'active' : ''}`}
                style={value && activeColor ? { backgroundColor: activeColor } : {}}
            >
                <div className={`luxury-toggle-thumb ${value ? 'active' : ''}`} />
            </div>
            {label && <span className="luxury-toggle-label">{label}</span>}
        </div>
    );
};

export default LuxuryToggle;
