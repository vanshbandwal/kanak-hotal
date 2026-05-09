import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandApi } from '../../../api/brandApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import { brandSchema, BrandFormData } from '../screens/Brands.validation';
import './BrandFormModal.css';

interface BrandFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
    mode?: 'create' | 'edit' | 'view';
}

const BrandFormModal: React.FC<BrandFormModalProps> = ({ isOpen, onClose, onSuccess, initialData, mode = 'create' }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const isViewOnly = mode === 'view';

    // Media State (handled separately as file input is tricky with hook form)
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm<BrandFormData>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: '',
            description: '',
            website: '',
            order: 0,
            isActive: true,
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name || '',
                    description: initialData.description || '',
                    website: initialData.website || '',
                    order: initialData.order || 0,
                    isActive: initialData.isActive ?? true,
                });
                if (initialData.logo) {
                    setLogoPreview(initialData.logo?.startsWith('http') ? initialData.logo : `${BASE_URL}${initialData.logo}`);
                }
            } else {
                reset({
                    name: '',
                    description: '',
                    website: '',
                    order: 0,
                    isActive: true,
                });
                setLogo(null);
                setLogoPreview(null);
            }
        }
    }, [isOpen, initialData, reset]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onFormSubmit = async (data: BrandFormData) => {
        if (isViewOnly) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.website) formData.append('website', data.website);
        formData.append('order', String(data.order));
        formData.append('isActive', String(data.isActive));

        if (logo) {
            formData.append('logo', logo);
        }

        const { data: responseData, error } = initialData 
            ? await brandApi.updateBrand(initialData._id, formData)
            : await brandApi.createBrand(formData);

        setIsLoading(false);

        if (error) {
            addToast('error', error);
            return;
        }

        addToast('success', `Brand ${initialData ? 'updated' : 'created'} successfully`);
        onSuccess();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="brand-form-overlay">
            <div className="brand-form-modal-card">
                <div className="brand-form-header">
                    <h2 className="brand-form-modal-title">
                        {mode === 'create' ? 'Onboard Luxury Brand' : mode === 'edit' ? 'Refine Brand Profile' : 'Brand Insights'}
                    </h2>
                    <button onClick={onClose} className="brand-form-close-btn">&times;</button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="brand-form-container">
                    <div className="brand-form-scroll-area">
                        {/* Section 1: Identity */}
                        <div className="brand-form-section">
                            <h3 className="brand-form-section-title">Identity & Presence</h3>
                            <div className="brand-form-row">
                                <LuxuryInput 
                                    label="Brand Name *" 
                                    {...register('name')}
                                    error={errors.name?.message}
                                    disabled={isViewOnly}
                                    placeholder="e.g. Gucci, Rolex, Versace"
                                />
                                <LuxuryInput 
                                    label="Website URL" 
                                    {...register('website')}
                                    error={errors.website?.message}
                                    disabled={isViewOnly}
                                    placeholder="https://brand.com"
                                />
                            </div>
                            <div className="brand-form-group">
                                <LuxuryInput 
                                    label="Philosophy / Description"
                                    {...register('description')}
                                    error={errors.description?.message}
                                    disabled={isViewOnly}
                                    placeholder="Describe the brand's heritage and luxury appeal..."
                                    multiline
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Section 2: Visuals & Ranking */}
                        <div className="brand-form-row">
                            <div className="brand-form-section" style={{ flex: 1 }}>
                                <h3 className="brand-form-section-title">Brand Mark (Logo)</h3>
                                <div className="brand-form-upload-box">
                                    {logoPreview ? (
                                        <img src={logoPreview} className="brand-form-preview" alt="Logo preview" />
                                    ) : <div className="brand-form-placeholder-box">Upload Logo</div>}
                                    {!isViewOnly && <input type="file" onChange={handleLogoChange} className="brand-form-file-input" accept="image/*" />}
                                </div>
                            </div>
                            <div className="brand-form-section" style={{ flex: 1 }}>
                                <h3 className="brand-form-section-title">Ranking & Visibility</h3>
                                <LuxuryInput 
                                    label="Display Order"
                                    type="number" 
                                    {...register('order', { valueAsNumber: true })}
                                    error={errors.order?.message}
                                    disabled={isViewOnly}
                                />
                                <div className="brand-form-group">
                                    <label className="brand-form-label">Active Status</label>
                                    <Controller
                                        name="isActive"
                                        control={control}
                                        render={({ field }) => (
                                            <LuxuryToggle 
                                                label={field.value ? 'Featured Active' : 'Suspended'}
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={isViewOnly}
                                                activeColor="var(--success)"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="brand-form-footer">
                        <LuxuryButton type="button" onClick={onClose} variant="ghost">Cancel</LuxuryButton>
                        {!isViewOnly && (
                            <LuxuryButton type="submit" disabled={isLoading}>
                                {isLoading ? 'Processing...' : (initialData ? 'Update Profile' : 'Onboard Brand')}
                            </LuxuryButton>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BrandFormModal;

