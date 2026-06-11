import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { bannerApi } from '../../../api/bannerApi';
import { useToast } from '../../../context/ToastContext';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryImageUpload from '../../../components/Common/LuxuryImageUpload';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import './BannerFormModal.css';

const bannerSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    subtitle: z.string().optional(),
    link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    type: z.enum(['hero', 'promotion', 'footer']),
    order: z.number().min(0),
    isActive: z.boolean()
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onSuccess: () => void;
}

const BannerFormModal: React.FC<BannerFormModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { addToast } = useToast();

    const { control, handleSubmit, reset, formState: { errors } } = useForm<BannerFormData>({
        resolver: zodResolver(bannerSchema),
        defaultValues: {
            title: '',
            subtitle: '',
            link: '',
            type: 'hero',
            order: 0,
            isActive: true
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title || '',
                subtitle: initialData.subtitle || '',
                link: initialData.link || '',
                type: initialData.type || 'hero',
                order: initialData.order || 0,
                isActive: initialData.isActive ?? true
            });
            if (initialData.image) {
                setImagePreview(`http://localhost:3006/${initialData.image.replace(/\\/g, '/')}`);
            }
        } else {
            reset({
                title: '',
                subtitle: '',
                link: '',
                type: 'hero',
                order: 0,
                isActive: true
            });
            setImageFile(null);
            setImagePreview(null);
        }
    }, [initialData, reset]);

    const handleFormSubmit = async (data: BannerFormData) => {
        if (!imageFile && !initialData?.image) {
            addToast('error', 'Please upload a banner image');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            
            // ✅ Fix: Safely handle optional/undefined values
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });
            
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (initialData) {
                await bannerApi.updateBanner(initialData._id, formData);
                addToast('success', 'Banner updated successfully');
            } else {
                await bannerApi.createBanner(formData);
                addToast('success', 'Banner created successfully');
            }
            
            onClose(); 
            onSuccess();
            navigate('/banners');
        } catch (error) {
            addToast('error', 'Failed to save banner');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LuxuryModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={initialData ? 'Edit Banner' : 'Create Banner'}
            size="md"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="banner-form">
                <div className="banner-form-grid">
                    <div className="banner-form-image-section">
                        <LuxuryImageUpload 
                            label="Banner Image (High Resolution Recommended)"
                            value={imagePreview || undefined}
                            onChange={(file: any) => {
                                const singleFile = Array.isArray(file) ? file[0] : file;
                                if (singleFile) {
                                    setImageFile(singleFile);
                                    setImagePreview(URL.createObjectURL(singleFile));
                                }
                            }}

                        />
                    </div>

                    <div className="banner-form-fields">
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <LuxuryInput 
                                    label="Banner Title *"
                                    {...field}
                                    placeholder="Enter eye-catching title"
                                    error={errors.title?.message}
                                />
                            )}
                        />

                        <Controller
                            name="subtitle"
                            control={control}
                            render={({ field }) => (
                                <LuxuryInput 
                                    label="Subtitle / Catchphrase"
                                    {...field}
                                    placeholder="Brief description or offer"
                                />
                            )}
                        />

                        <div className="form-row-double">
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <LuxurySelect 
                                        label="Banner Type"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={[
                                            { value: 'hero', label: 'Main Hero' },
                                            { value: 'promotion', label: 'Promotional' },
                                            { value: 'footer', label: 'Footer Banner' }
                                        ]}
                                    />
                                )}
                            />
                            <Controller
                                name="order"
                                control={control}
                                render={({ field }) => (
                                    <LuxuryInput 
                                        label="Display Order"
                                        type="number"
                                        value={field.value.toString()}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                )}
                            />
                        </div>

                        <Controller
                            name="link"
                            control={control}
                            render={({ field }) => (
                                <LuxuryInput 
                                    label="Action Link (URL)"
                                    {...field}
                                    placeholder="https://example.com/promotion"
                                    error={errors.link?.message}
                                />
                            )}
                        />

                        <div className="form-toggle-row">
                            <span className="toggle-label">Active Status</span>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <LuxuryToggle 
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="banner-form-actions">
                    <LuxuryButton variant="neutral" onClick={onClose} type="button">
                        Cancel
                    </LuxuryButton>
                    <LuxuryButton 
                        variant="primary" 
                        type="submit" 
                        isLoading={isSubmitting}
                        glow
                    >
                        💾 {initialData ? 'Update Banner' : 'Create Banner'}
                    </LuxuryButton>
                </div>
            </form>
        </LuxuryModal>
    );
};

export default BannerFormModal;
