import React, { useState, useRef } from 'react';
import './LuxuryImageUpload.css';

interface LuxuryImageUploadProps {
    label?: string;
    value?: string | string[];
    onChange: (file: File | File[]) => void;
    multiple?: boolean;
    disabled?: boolean;
    error?: string;
    previewClassName?: string;
}

const LuxuryImageUpload: React.FC<LuxuryImageUploadProps> = ({
    label,
    value,
    onChange,
    multiple = false,
    disabled = false,
    error,
    previewClassName = ''
}) => {
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (multiple) {
            onChange(files);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        } else {
            onChange(files[0]);
            setPreviews([URL.createObjectURL(files[0])]);
        }
    };

    const triggerUpload = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const displayPreviews = previews.length > 0 ? previews : (Array.isArray(value) ? value : (value ? [value] : []));

    return (
        <div className={`luxury-upload-container ${disabled ? 'upload-disabled' : ''}`}>
            {label && <label className="luxury-upload-label">{label}</label>}
            
            <div 
                className={`luxury-upload-zone ${error ? 'zone-error' : ''}`}
                onClick={triggerUpload}
            >
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple={multiple}
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={disabled}
                />
                
                {displayPreviews.length > 0 ? (
                    <div className="upload-previews-grid">
                        {displayPreviews.map((url, index) => (
                            <div key={index} className={`upload-preview-item ${previewClassName}`}>
                                <img src={url} alt={`Preview ${index}`} className="preview-img" />
                                {!disabled && <div className="preview-overlay"><span>Change</span></div>}
                            </div>
                        ))}
                        {multiple && !disabled && (
                            <div className="upload-add-more">
                                <span>+</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <div className="placeholder-icon">📸</div>
                        <p className="placeholder-text">Click or Drop images here</p>
                        <p className="placeholder-subtext">JPG, PNG or WEBP (Max 5MB)</p>
                    </div>
                )}
            </div>
            
            {error && <p className="luxury-upload-error-msg">{error}</p>}
        </div>
    );
};

export default LuxuryImageUpload;
