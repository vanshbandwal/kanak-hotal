import React, { useState, useEffect } from 'react';
import { roleApi } from '../../../api/roleApi';
import { useNavigate } from 'react-router-dom';
import FashionLoader from '../../../components/Common/FashionLoader';
import { useToast } from '../../../context/ToastContext';
import LuxuryActionButton from '../../../components/Common/LuxuryActionButton';
import './RoleListScreen.css';

interface Role {
    _id: string;
    name: string;
    label: string;
    description: string;
    permissionCount?: number;
    sidebarCount?: number;
}

import LuxuryPageHeader from '../../../components/Common/LuxuryPageHeader';

const RoleListScreen = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRoles = async () => {
        setLoading(true);
        const { data, error } = await roleApi.getAllRoles();
        if (error) {
            addToast('error', 'Failed to load roles');
        } else {
            setRoles(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this role? This cannot be undone.')) {
            const { error } = await roleApi.deleteRole(id);
            if (error) {
                addToast('error', error);
            } else {
                addToast('success', 'Role deleted successfully');
                fetchRoles();
            }
        }
    };

    if (loading && roles.length === 0) return <FashionLoader size="lg" message="Accessing role archives..." />;

    return (
        <div className="role-list-container">
            <LuxuryPageHeader
                title="Roles & Authority"
                subtitle="Manage administrative permissions and organizational hierarchy."
                primaryAction={{
                    label: "ADD NEW ROLE",
                    onClick: () => navigate('/roles/add'),
                    icon: "＋"
                }}
                secondaryAction={{
                    label: "VIEW STAFF",
                    onClick: () => navigate('/roles/staff'),
                    icon: "👥"
                }}
            />


            <div className="role-list-card-grid">
                {roles.map((role) => (
                    <div key={role._id} className="role-list-card">
                        <div className="role-list-card-header">
                            <div className="role-list-icon-container">
                                <span className="role-list-shield-icon">🛡️</span>
                            </div>
                            <div className="role-list-role-info">
                                <h3 className="role-list-role-label">{role.label}</h3>
                                <p className="role-list-system-name">{role.name}</p>
                            </div>
                            <LuxuryActionButton 
                                type="edit" 
                                onClick={() => navigate(`/roles/edit/${role._id}`)} 
                                title="Edit Configuration"
                                className="role-config-action"
                            />
                        </div>

                        <div className="role-list-badge-container">
                            <div className="role-list-badge">
                                <span className="role-list-badge-icon">🔒</span>
                                <span className="role-list-badge-text">{role.permissionCount || 0} Permissions</span>
                            </div>
                            <div className="role-list-badge">
                                <span className="role-list-badge-icon">📂</span>
                                <span className="role-list-badge-text">{role.sidebarCount || 0} Menus</span>
                            </div>
                        </div>

                        <p className="role-list-description">
                            {role.description || 'No description provided for this authority level.'}
                        </p>

                        <div className="role-list-card-footer">
                            <LuxuryActionButton 
                                type="edit" 
                                onClick={() => navigate(`/roles/edit/${role._id}`)} 
                                title="Edit Role"
                            />
                            <LuxuryActionButton 
                                type="delete" 
                                onClick={() => handleDelete(role._id)} 
                                title="Delete Role"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoleListScreen;
