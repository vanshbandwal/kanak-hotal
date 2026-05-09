import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandApi } from '../../../api/brandApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryImageUpload from '../../../components/Common/LuxuryImageUpload';
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

    // Media State
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

        const response = initialData 
            ? await brandApi.updateBrand(initialData._id, formData)
            : await brandApi.createBrand(formData);

        setIsLoading(false);

        if (response.error) {
            addToast('error', response.error);
            return;
        }

        addToast('success', `Brand ${initialData ? 'updated' : 'created'} successfully`);
        onSuccess();
        onClose();
    };

    const modalTitle = mode === 'create' ? 'Onboard Luxury Brand' : mode === 'edit' ? 'Refine Brand Profile' : 'Brand Insights';

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="lg"
            isLoading={isLoading}
            onSubmit={handleSubmit(onFormSubmit)}
            submitLabel={initialData ? 'Update Profile' : 'Onboard Brand'}
            isViewOnly={isViewOnly}
        >
            <div className="brand-form-container">
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
                        <LuxuryImageUpload 
                            label="Brand Mark (Logo)"
                            value={logoPreview || ''}
                            onChange={(file) => {
                                setLogo(file as File);
                                setLogoPreview(URL.createObjectURL(file as File));
                            }}
                            disabled={isViewOnly}
                        />
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
        </LuxuryModal>
    );
};

export default BrandFormModal;


