import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { unitApi } from '../../../api/unitApi';
import { useToast } from '../../../context/ToastContext';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import { unitSchema, UnitFormData } from '../screens/Products.validation';
import './UnitFormModal.css';

interface UnitFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
    mode?: 'create' | 'edit' | 'view';
}

const UnitFormModal: React.FC<UnitFormModalProps> = ({ isOpen, onClose, onSuccess, initialData, mode = 'create' }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const isViewOnly = mode === 'view';

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm<UnitFormData>({
        resolver: zodResolver(unitSchema) as Resolver<UnitFormData>,
        defaultValues: {
            name: '',
            shortName: '',
            description: '',
            isActive: true,
        }
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name || '',
                    shortName: initialData.shorthand || initialData.shortName || '',
                    description: initialData.description || '',
                    isActive: initialData.isActive ?? true,
                });
            } else {
                reset({
                    name: '',
                    shortName: '',
                    description: '',
                    isActive: true,
                });
            }
        }
    }, [isOpen, initialData, reset]);

    const onFormSubmit: SubmitHandler<UnitFormData> = async (data) => {
        if (isViewOnly) return;
        setIsLoading(true);

        // Map shortName to shorthand as expected by backend if necessary
        const payload = {
            ...data,
            shorthand: data.shortName
        };

        const { error } = initialData
            ? await unitApi.updateUnit(initialData._id, payload)
            : await unitApi.createUnit(payload);

        setIsLoading(false);

        if (error) {
            addToast('error', error);
        } else {
            addToast('success', `Unit ${initialData ? 'updated' : 'created'} successfully`);
            onSuccess();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="unit-form-overlay">
            <div className="unit-form-modal-card">
                <div className="unit-form-header">
                    <h2 className="unit-form-modal-title">
                        {initialData ? (isViewOnly ? 'Unit Details' : 'Refine Unit Specs') : 'Define New Unit'}
                    </h2>
                    <button onClick={onClose} className="unit-form-close-btn">&times;</button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="unit-form-container">
                    <div className="unit-form-scroll-area">
                        <div className="unit-form-section">
                            <h3 className="unit-form-section-title">Measurement Basics</h3>
                            <div className="unit-form-row">
                                <LuxuryInput 
                                    label="Unit Full Name *" 
                                    {...register('name')}
                                    error={errors.name?.message}
                                    disabled={isViewOnly}
                                    placeholder="e.g. Kilogram, Pieces, Meters"
                                />
                                <LuxuryInput 
                                    label="Shorthand *" 
                                    {...register('shortName')}
                                    error={errors.shortName?.message}
                                    disabled={isViewOnly}
                                    placeholder="e.g. kg, pcs, m"
                                />
                            </div>
                            <div className="unit-form-group">
                                <LuxuryInput 
                                    label="Narrative Description"
                                    {...register('description')}
                                    error={errors.description?.message}
                                    disabled={isViewOnly}
                                    placeholder="Details about this unit of measurement..."
                                    multiline
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="unit-form-group">
                            <label className="unit-form-label">Status</label>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <LuxuryToggle 
                                        label={field.value ? 'Available for Products' : 'Archived'}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={isViewOnly}
                                        activeColor="var(--success)"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="unit-form-footer">
                        <LuxuryButton type="button" onClick={onClose} variant="ghost">Cancel</LuxuryButton>
                        {!isViewOnly && (
                            <LuxuryButton type="submit" disabled={isLoading}>
                                {isLoading ? 'Processing...' : (initialData ? 'Update Unit' : 'Create Unit')}
                            </LuxuryButton>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UnitFormModal;

