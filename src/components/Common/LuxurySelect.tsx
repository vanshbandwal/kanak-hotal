import React, { useState, useRef, useEffect } from 'react';
import './LuxurySelect.css';

interface Option {
    value: string | number;
    label: string;
}

interface LuxurySelectProps {
    label?: string;
    options: Option[];
    value: string | number;
    onChange: (value: any) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    searchable?: boolean;
    style?: React.CSSProperties;
}

const LuxurySelect: React.FC<LuxurySelectProps> = ({ 
    label, options, value, onChange, placeholder = 'Select...', error, disabled = false, searchable = true, style 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => String(opt.value) === String(value));
    const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div ref={wrapperRef} className="luxury-select-wrapper">
            {label && <label className="luxury-select-label">{label}</label>}
            
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`luxury-select-trigger ${isOpen ? 'open' : ''} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
                style={style}
            >
                <span className="luxury-select-value">
                    {selectedOption ? selectedOption.label : <span className="luxury-select-placeholder">{placeholder}</span>}
                </span>
                <span className={`luxury-select-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && (
                <div className="luxury-select-dropdown">
                    {searchable && (
                        <div className="luxury-select-search-container">
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                onClick={(e) => e.stopPropagation()}
                                className="luxury-select-search-input"
                            />
                        </div>
                    )}
                    
                    <div className="luxury-select-options-list">
                        {filteredOptions.length === 0 ? (
                            <div className="luxury-select-no-options">No options found</div>
                        ) : (
                            filteredOptions.map((opt) => (
                                <div 
                                    key={String(opt.value)}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className={`luxury-select-option ${String(opt.value) === String(value) ? 'selected' : ''}`}
                                >
                                    {opt.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            {error && <span className="luxury-select-error-text">{error}</span>}
        </div>
    );
};

export default LuxurySelect;
