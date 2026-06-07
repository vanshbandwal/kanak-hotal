import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LuxuryModal from '../../../components/Common/LuxuryModal';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import { useToast } from '../../../context/ToastContext';
import couponApi from '../../../api/couponApi';

const couponSchema = z.object({
    code: z.string().min(1, 'Coupon code is required').toUpperCase(),
    description: z.string().optional().default(''),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().min(0, 'Discount value cannot be negative'),
    minPurchaseAmount: z.number().min(0).optional().default(0),
    maxDiscountAmount: z.number().min(0).optional().default(0),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    usageLimit: z.number().min(1).optional().default(100),
    userCountLimit: z.number().min(1).optional().default(1)
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"]
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

const CouponFormModal: React.FC<CouponFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            code: '',
            description: '',
            discountType: 'percentage',
            discountValue: 0,
            minPurchaseAmount: 0,
            maxDiscountAmount: 0,
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
            usageLimit: 100,
            userCountLimit: 1
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                code: initialData.code || '',
                description: initialData.description || '',
                discountType: initialData.discountType || 'percentage',
                discountValue: initialData.discountValue || 0,
                minPurchaseAmount: initialData.minPurchaseAmount || 0,
                maxDiscountAmount: initialData.maxDiscountAmount || 0,
                startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
                endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
                usageLimit: initialData.usageLimit || 100,
                userCountLimit: initialData.userCountLimit || 1
            });
        } else {
            reset({
                code: '',
                description: '',
                discountType: 'percentage',
                discountValue: 0,
                minPurchaseAmount: 0,
                maxDiscountAmount: 0,
                startDate: new Date().toISOString().slice(0, 10),
                endDate: new Date().toISOString().slice(0, 10),
                usageLimit: 100,
                userCountLimit: 1
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit = async (data: CouponFormData) => {
        setIsSubmitting(true);
        try {
            if (initialData) {
                await couponApi.updateCoupon(initialData._id, data);
                addToast('success', 'Coupon updated successfully');
            } else {
                await couponApi.createCoupon(data);
                addToast('success', 'Coupon created successfully');
            }
            onClose();
            onSuccess();
        } catch (error: any) {
            addToast('error', error?.message || 'Failed to save coupon');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Coupon' : 'Create Coupon'}
            size="md"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="coupon-form coupon-form-grid">
                <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                        <LuxuryInput
                            label="Coupon Code *"
                            {...field}
                            placeholder="e.g. SUMMER2024"
                            error={errors.code?.message}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <LuxuryInput
                            label="Description"
                            {...field}
                            placeholder="Brief description of the coupon"
                        />
                    )}
                />

                <div className="coupon-form-row">
                    <div className="coupon-form-col">
                        <Controller
                            name="discountType"
                            control={control}
                            render={({ field }) => (
                                <LuxurySelect
                                    label="Discount Type *"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: 'percentage', label: 'Percentage (%)' },
                                        { value: 'fixed', label: 'Fixed Amount ($)' }
                                    ]}
                                />
                            )}
                        />
                    </div>
                    <div className="coupon-form-col">
                        <Controller
                            name="discountValue"
                            control={control}
                            render={({ field }) => (
                                <LuxuryInput
                                    label="Discount Value *"
                                    type="number"
                                    value={field.value.toString()}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    error={errors.discountValue?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="coupon-form-row">
                    <div className="coupon-form-col">
                        <Controller
                            name="minPurchaseAmount"
                            control={control}
                            render={({ field }) => (
                                <LuxuryInput
                                    label="Min Purchase Amount"
                                    type="number"
                                    value={(field.value || 0).toString()}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            )}
                        />
                    </div>
                    <div className="coupon-form-col">
                        <Controller
                            name="maxDiscountAmount"
                            control={control}
                            render={({ field }) => (
                                <LuxuryInput
                                    label="Max Discount Amount"
                                    type="number"
                                    value={(field.value || 0).toString()}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="coupon-form-row">
                    <div className="coupon-form-col">
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => (
                                <LuxuryInput
                                    label="Start Date *"
                                    type="date"
                                    {...field}
                                    error={errors.startDate?.message}
                                />
                            )}
                        />
                    </div>
                    <div className="coupon-form-col">
                        <Controller
                            name="endDate"
                            control={control}
                            render={({ field }) => (
                                <LuxuryInput
                                    label="End Date *"
                                    type="date"
                                    {...field}
                                    error={errors.endDate?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="coupon-form-row">
                    <div className="coupon-form-col">
                        <Controller
                            name="usageLimit"
                            control={control}
                            render={({ field }) => (
                                <LuxuryInput
                                    label="Total Usage Limit"
                                    type="number"
                                    value={(field.value || 100).toString()}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 100)}
                                />
                            )}
                        />
                    </div>
                    <div className="coupon-form-col">
                        <Controller
                            name="userCountLimit"
                            control={control}
                            render={({ field }) => (
                                <LuxuryInput
                                    label="Uses Per User"
                                    type="number"
                                    value={(field.value || 1).toString()}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="coupon-form-footer">
                    <LuxuryButton variant="neutral" onClick={onClose} type="button">
                        Cancel
                    </LuxuryButton>
                    <LuxuryButton
                        variant="primary"
                        type="submit"
                        isLoading={isSubmitting}
                        glow
                    >
                        {initialData ? 'Update Coupon' : 'Create Coupon'}
                    </LuxuryButton>
                </div>
            </form>
        </LuxuryModal>
    );
};

export default CouponFormModal;
