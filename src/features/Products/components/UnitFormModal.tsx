import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { unitApi } from '../../../api/unitApi';
import { useToast } from '../../../context/ToastContext';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import LuxuryModal from '../../../components/Common/LuxuryModal';
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

    const modalTitle = initialData ? (isViewOnly ? 'Unit Details' : 'Refine Unit Specs') : 'Define New Unit';

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={onClose}
            title={modalTitle}
            size="md"
            isLoading={isLoading}
            onSubmit={handleSubmit(onFormSubmit)}
            submitLabel={initialData ? 'Update Unit' : 'Create Unit'}
            isViewOnly={isViewOnly}
        >
            <div className="unit-form-container">
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
        </LuxuryModal>
    );
};

export default UnitFormModal;


