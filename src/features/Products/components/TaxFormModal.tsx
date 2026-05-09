import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taxApi } from '../../../api/taxApi';
import { useToast } from '../../../context/ToastContext';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import { taxSchema, TaxFormData } from '../screens/Products.validation';
import './TaxFormModal.css';

interface TaxFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
    mode?: 'create' | 'edit' | 'view';
}

const TaxFormModal: React.FC<TaxFormModalProps> = ({ isOpen, onClose, onSuccess, initialData, mode = 'create' }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const isViewOnly = mode === 'view';

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors }
    } = useForm<TaxFormData>({
        resolver: zodResolver(taxSchema) as Resolver<TaxFormData>,
        defaultValues: {
            name: '',
            rate: 0,
            type: 'percentage',
            taxType: 'exclusive',
            description: '',
            isActive: true,
        }
    });

    const currentType = watch('type');
    const currentTaxType = watch('taxType');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name || '',
                    rate: initialData.rate || 0,
                    type: initialData.type || 'percentage',
                    taxType: initialData.taxType || 'exclusive',
                    description: initialData.description || '',
                    isActive: initialData.isActive ?? true,
                });
            } else {
                reset({
                    name: '',
                    rate: 0,
                    type: 'percentage',
                    taxType: 'exclusive',
                    description: '',
                    isActive: true,
                });
            }
        }
    }, [isOpen, initialData, reset]);

    const onFormSubmit: SubmitHandler<TaxFormData> = async (data) => {
        if (isViewOnly) return;
        setIsLoading(true);

        const { error } = (mode === 'edit' && initialData)
            ? await taxApi.updateTax(initialData._id, data)
            : await taxApi.createTax(data);

        setIsLoading(false);

        if (error) {
            addToast('error', error);
        } else {
            addToast('success', `Tax rule ${mode === 'edit' ? 'updated' : 'created'} successfully`);
            onSuccess();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="tax-form-overlay">
            <div className="tax-form-modal-card">
                <div className="tax-form-header">
                    <h2 className="tax-form-modal-title">
                        {initialData ? (isViewOnly ? 'Tax Details' : 'Edit Tax Rule') : 'Create New Tax Rule'}
                    </h2>
                    <button onClick={onClose} className="tax-form-close-btn">&times;</button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} className="tax-form-container">
                    <div className="tax-form-scroll-area">
                        <div className="tax-form-row">
                            <LuxuryInput 
                                label="Tax Name *" 
                                {...register('name')}
                                error={errors.name?.message}
                                disabled={isViewOnly}
                                placeholder="e.g. GST 18%, VAT 5%"
                            />
                        </div>

                        <div className="tax-form-row grid-2">
                            <LuxuryInput 
                                label={`Tax Rate (${currentType === 'percentage' ? '%' : 'Fixed'}) *`}
                                type="number" 
                                {...register('rate', { valueAsNumber: true })}
                                error={errors.rate?.message}
                                disabled={isViewOnly}
                                min="0"
                                step="0.01"
                            />
                            
                            <div className="tax-form-group">
                                <label className="tax-form-label">Rate Type</label>
                                <div className="tax-type-selector">
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="selector-buttons">
                                                <button 
                                                    type="button"
                                                    className={`selector-btn ${field.value === 'percentage' ? 'active' : ''}`}
                                                    onClick={() => !isViewOnly && field.onChange('percentage')}
                                                    disabled={isViewOnly}
                                                >
                                                    Percentage
                                                </button>
                                                <button 
                                                    type="button"
                                                    className={`selector-btn ${field.value === 'fixed' ? 'active' : ''}`}
                                                    onClick={() => !isViewOnly && field.onChange('fixed')}
                                                    disabled={isViewOnly}
                                                >
                                                    Fixed
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="tax-form-row">
                            <div className="tax-form-group">
                                <label className="tax-form-label">Tax Configuration (Inclusive/Exclusive)</label>
                                <div className="tax-type-selector">
                                    <Controller
                                        name="taxType"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="selector-buttons full-width">
                                                <button 
                                                    type="button"
                                                    className={`selector-btn ${field.value === 'inclusive' ? 'active' : ''}`}
                                                    onClick={() => !isViewOnly && field.onChange('inclusive')}
                                                    disabled={isViewOnly}
                                                >
                                                    Inclusive
                                                </button>
                                                <button 
                                                    type="button"
                                                    className={`selector-btn ${field.value === 'exclusive' ? 'active' : ''}`}
                                                    onClick={() => !isViewOnly && field.onChange('exclusive')}
                                                    disabled={isViewOnly}
                                                >
                                                    Exclusive
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>
                                <p className="tax-help-text">
                                    {currentTaxType === 'inclusive' 
                                        ? 'Price already includes this tax.' 
                                        : 'Tax will be added on top of the price.'}
                                </p>
                            </div>
                        </div>

                        <div className="tax-form-row">
                            <LuxuryInput 
                                label="Description" 
                                {...register('description')}
                                error={errors.description?.message}
                                disabled={isViewOnly}
                                multiline={true}
                                rows={2}
                                placeholder="Add some notes about this tax rule..."
                            />
                        </div>

                        <div className="tax-form-row">
                            <div className="tax-form-group">
                                <label className="tax-form-label">Active Status</label>
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <LuxuryToggle 
                                            label={field.value ? 'Active' : 'Inactive'}
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

                    <div className="tax-form-footer">
                        <LuxuryButton type="button" onClick={onClose} variant="ghost">
                            {isViewOnly ? 'Close' : 'Cancel'}
                        </LuxuryButton>
                        {!isViewOnly && (
                            <LuxuryButton type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Tax Rule'}
                            </LuxuryButton>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxFormModal;

