import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffApi } from '../../../api/staffApi';
import { roleApi } from '../../../api/roleApi';
import { useToast } from '../../../context/ToastContext';
import { FASHION_TOASTS } from '../../../components/Toast/ToastConstants';
import FashionLoader from '../../../components/Common/FashionLoader';
import { staffSchema, StaffFormData } from '../screens/Staff.validation';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import LuxuryModal from '../../../components/Common/LuxuryModal';

interface StaffFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const StaffFormModal: React.FC<StaffFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { addToast } = useToast();
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingRoles, setFetchingRoles] = useState(true);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            roleId: '',
        }
    });

    useEffect(() => {
        if (isOpen) {
            const fetchRoles = async () => {
                const { data, error } = await roleApi.getAllRoles();
                if (error) {
                    console.error('Failed to fetch roles:', error);
                } else {
                    setRoles(data || []);
                }
                setFetchingRoles(false);
            };
            fetchRoles();
        }
    }, [isOpen]);

    const onFormSubmit = async (data: StaffFormData) => {
        setLoading(true);
        const { error } = await staffApi.createStaff(data);
        setLoading(false);

        if (error) {
            addToast('error', error || FASHION_TOASTS.error.denied);
        } else {
            addToast('success', 'New staff profile established successfully.');
            onSuccess();
            onClose();
        }
    };

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Staff Member"
            size="md"
            isLoading={loading}
            onSubmit={handleSubmit(onFormSubmit)}
            submitLabel="CREATE STAFF ACCOUNT"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading && <FashionLoader fullScreen message="Establishing new staff profile..." />}
                
                <LuxuryInput
                    label="Full Name *"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="e.g. John Doe"
                />

                <LuxuryInput
                    label="Email Address *"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="e.g. john@velour.com"
                    autoComplete="off"
                />

                <LuxuryInput
                    label="Password *"
                    type="password"
                    {...register('password')}
                    error={errors.password?.message}
                    placeholder="••••••••"
                    autoComplete="new-password"
                />

                <Controller
                    name="roleId"
                    control={control}
                    render={({ field }) => (
                        <LuxurySelect
                            label="Assign Role *"
                            value={field.value}
                            onChange={field.onChange}
                            options={roles.map(r => ({ value: r._id, label: r.label || r.name }))}
                            placeholder={fetchingRoles ? 'Curating roles...' : 'Select a role...'}
                            disabled={fetchingRoles}
                            error={errors.roleId?.message}
                        />
                    )}
                />
            </div>
        </LuxuryModal>
    );
};

export default StaffFormModal;


