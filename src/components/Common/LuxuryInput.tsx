import React, { InputHTMLAttributes } from 'react';
import './LuxuryInput.css';

interface LuxuryInputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    multiline?: boolean;
    rows?: number;
}

const LuxuryInput: React.FC<LuxuryInputProps> = ({ label, error, icon, multiline, rows = 3, style, className, ...props }) => {
    const fieldClasses = `luxury-input-field ${icon ? 'with-icon' : ''} ${error ? 'error' : ''} ${multiline ? 'multiline' : ''} ${className || ''}`;

    return (
        <div className="luxury-input-wrapper">
            {label && <label className="luxury-input-label">{label}</label>}
            <div className="luxury-input-container">
                {icon && <span className="luxury-input-icon">{icon}</span>}
                {multiline ? (
                    <textarea 
                        {...(props as any)}
                        rows={rows}
                        className={fieldClasses}
                        style={style}
                    />
                ) : (
                    <input 
                        {...props}
                        className={fieldClasses}
                        style={style}
                    />
                )}
            </div>
            {error && <span className="luxury-input-error-text">{error}</span>}
        </div>
    );
};

export default LuxuryInput;
