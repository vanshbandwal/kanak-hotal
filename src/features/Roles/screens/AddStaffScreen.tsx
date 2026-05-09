import React, { useState, useEffect } from 'react';
import { staffApi } from '../../../api/staffApi';
import { roleApi } from '../../../api/roleApi';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { FASHION_TOASTS } from '../../../components/Toast/ToastConstants';
import FashionLoader from '../../../components/Common/FashionLoader';
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
                    <div className="add-staff-input-group">
                        <label className="add-staff-label">Full Name</label>
                        <input
                            className="add-staff-input"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="add-staff-input-group">
                        <label className="add-staff-label">Email Address</label>
                        <input
                            className="add-staff-input"
                            type="email"
                            placeholder="e.g. john@velour.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                        />
                    </div>

                    <div className="add-staff-input-group">
                        <label className="add-staff-label">Password</label>
                        <input
                            className="add-staff-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="add-staff-input-group">
                        <label className="add-staff-label">Assign Role</label>
                        <select
                            className="add-staff-select"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                        >
                            <option value="">Select a role...</option>
                            {roles.map(role => (
                                <option key={role._id} value={role._id}>
                                    {role.label || role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || fetchingRoles}
                        className="add-staff-add-button"
                    >
                        {loading ? 'PROCESSING...' : 'CREATE STAFF ACCOUNT'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStaffScreen;
