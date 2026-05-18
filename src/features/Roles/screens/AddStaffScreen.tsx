import React, { useState, useEffect } from 'react';
import { staffApi } from '../../../api/staffApi';
import { roleApi } from '../../../api/roleApi';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { FASHION_TOASTS } from '../../../components/Toast/ToastConstants';
import FashionLoader from '../../../components/Common/FashionLoader';
import LuxuryInput from '../../../components/Common/LuxuryInput';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import './AddStaffScreen.css';

const AddStaffScreen = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingRoles, setFetchingRoles] = useState(true);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !roleId) {
            addToast('warning', 'Please complete all luxury profile fields');
            return;
        }

        setLoading(true);
        const { error } = await staffApi.createStaff({ name, email, password, roleId });
        
        setLoading(false);

        if (error) {
            addToast('error', error || FASHION_TOASTS.error.denied);
        } else {
            addToast('success', FASHION_TOASTS.success.order_placed); 
            navigate('/roles/staff'); // Navigating to staff list
        }
    };

    if (fetchingRoles) return <FashionLoader size="lg" message="Curating staff roles..." />;

    return (
        <div className="add-staff-container">
            {loading && <FashionLoader fullScreen message="Establishing new staff profile..." />}
            <div className="add-staff-header">
                <h2 className="add-staff-title">Add Staff Member</h2>
                <p className="add-staff-subtitle">Create a new administrative account with specific role-based access.</p>
            </div>

            <div className="add-staff-content-card">
                <form onSubmit={handleSubmit} className="add-staff-form" autoComplete="off">
                    <LuxuryInput 
                        label="Full Name"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <LuxuryInput 
                        label="Email Address"
                        type="email"
                        placeholder="e.g. john@velour.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="off"
                    />

                    <LuxuryInput 
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />

                    <LuxurySelect 
                        label="Assign Role"
                        placeholder="Select a role..."
                        options={roles.map(role => ({
                            value: role._id,
                            label: role.label || role.name
                        }))}
                        value={roleId}
                        onChange={setRoleId}
                    />

                    <div style={{ marginTop: '20px' }}>
                        <LuxuryButton
                            type="submit"
                            variant="primary"
                            isLoading={loading}
                            disabled={loading || fetchingRoles}
                            style={{ width: '100%' }}
                        >
                            CREATE STAFF ACCOUNT
                        </LuxuryButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaffScreen;
