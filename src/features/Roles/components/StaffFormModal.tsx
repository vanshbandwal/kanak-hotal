import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../theme/typography';
import { staffApi } from '../../../api/staffApi';
import { roleApi } from '../../../api/roleApi';
import { useToast } from '../../../context/ToastContext';
import { FASHION_TOASTS } from '../../../components/Toast/ToastConstants';
import FashionLoader from '../../../components/Common/FashionLoader';
import { staffSchema, StaffFormData } from '../screens/Staff.validation';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import LuxuryButton from '../../../components/Common/LuxuryButton';

interface StaffFormModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const StaffFormModal: React.FC<StaffFormModalProps> = ({ onClose, onSuccess }) => {
    const { colors, isDark } = useTheme();
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
    }, []);

    const onFormSubmit = async (data: StaffFormData) => {
        setLoading(true);
        const { error } = await staffApi.createStaff(data);
        setLoading(false);

        if (error) {
            addToast('error', error || FASHION_TOASTS.error.denied);
        } else {
            addToast('success', 'New staff profile established successfully.');
            onSuccess();
        }
    };

    const dynamicStyles = styles(colors, isDark);

    return (
        <div style={dynamicStyles.overlay} onClick={onClose}>
            <div style={dynamicStyles.modal} onClick={e => e.stopPropagation()}>
                {loading && <FashionLoader fullScreen message="Establishing new staff profile..." />}

                <div style={dynamicStyles.header}>
                    <div style={dynamicStyles.titleGroup}>
                        <h2 style={dynamicStyles.title}>Add Staff Member</h2>
                        <p style={dynamicStyles.subtitle}>New Administrative Personnel</p>
                    </div>
                    <button style={dynamicStyles.closeButton} onClick={onClose}>×</button>
                </div>

                <div style={dynamicStyles.content}>
                    <form onSubmit={handleSubmit(onFormSubmit)} style={dynamicStyles.form} autoComplete="off">
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

                        <div style={dynamicStyles.footer}>
                            <LuxuryButton
                                type="submit"
                                disabled={loading || fetchingRoles}
                            >
                                {loading ? 'PROCESSING...' : 'CREATE STAFF ACCOUNT'}
                            </LuxuryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = (colors: any, isDark: boolean): { [key: string]: React.CSSProperties } => ({
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(15px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
    },
    modal: {
        backgroundColor: colors.surface,
        width: '90%',
        maxWidth: '500px',
        borderRadius: '24px',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        padding: '25px 30px',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: isDark ? 'linear-gradient(to right, rgba(232, 201, 123, 0.05), transparent)' : 'transparent',
    },
    titleGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        margin: 0,
        fontSize: '22px',
        fontFamily: TYPOGRAPHY.brand,
        color: colors.textWhite,
        letterSpacing: '1px',
    },
    subtitle: {
        margin: '4px 0 0 0',
        fontSize: '11px',
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: colors.textSecondary,
        fontSize: '28px',
        cursor: 'pointer',
        padding: '0 5px',
        lineHeight: 1,
    },
    content: {
        padding: '30px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    footer: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'center',
    }
});

export default StaffFormModal;

