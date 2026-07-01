import React, { useState, useEffect } from 'react';
import { roleApi } from '../../../api/roleApi';
import { sidebarApi } from '../../../api/sidebarApi';
import { permissionApi } from '../../../api/permissionApi';

interface Permission {
    _id: string;
    module: string;
    action: string;
}

interface SidebarItem {
    _id: string;
    name: string;
    icon: string;
}
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { FASHION_TOASTS } from '../../../components/Toast/ToastConstants';
import FashionLoader from '../../../components/Common/FashionLoader';
import './AddRoleScreen.css';

const AddRoleScreen = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
    const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [selectedSidebarItems, setSelectedSidebarItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [permRes, sidebarRes] = await Promise.all([
                permissionApi.getAllPermissions(),
                sidebarApi.getAllSidebarItems()
            ]);

            if (permRes.error || sidebarRes.error) {
                addToast('error', 'Failed to load access data');
            } else {
                // Group permissions by module
                const permissionsList = permRes.data?.data || [];
                const grouped = permissionsList.reduce((acc: any, perm: any) => {
                    if (!acc[perm.module]) acc[perm.module] = [];
                    acc[perm.module].push(perm);
                    return acc;
                }, {});

                setPermissions(grouped);
                setSidebarItems(sidebarRes.data?.data || []);
            }
            setLoading(false);
        };
        fetchData();
    }, [addToast]);

    const togglePermission = (id: string) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const toggleSidebar = (id: string) => {
        setSelectedSidebarItems(prev =>
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await roleApi.createRole({
            name,
            label,
            description,
            permissionIds: selectedPermissions,
            sidebarIds: selectedSidebarItems
        });

        if (error) {
            addToast('error', error || FASHION_TOASTS.error.denied);
        } else {
            addToast('success', FASHION_TOASTS.success.curation);
            navigate('/roles/list');
        }
    };

    if (loading) return <FashionLoader size="lg" message="Loading configurations..." />;

    return (
        <div className="add-role-container">
            <div className="add-role-header">
                <h2 className="add-role-title">Create New Role</h2>
                <button onClick={handleSubmit} className="add-role-save-button">Save Role</button>
            </div>

            <form className="add-role-form">
                <div className="add-role-row">
                    <div className="add-role-input-group">
                        <label className="add-role-label">Name <span className="add-role-required">*</span></label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. manager"
                            className="add-role-input"
                        />
                        <span className="add-role-hint">(Name must be lowercase, no spaces)</span>
                    </div>
                    <div className="add-role-input-group">
                        <label className="add-role-label">Label <span className="add-role-required">*</span></label>
                        <input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g. Regional Manager"
                            className="add-role-input"
                        />
                    </div>
                </div>

                <div className="add-role-input-group-full">
                    <label className="add-role-label">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the responsibilities of this role..."
                        className="add-role-textarea"
                    />
                </div>

                <div className="add-role-section-header">
                    <h3 className="add-role-section-title">Permissions & Menu Access</h3>
                </div>

                <div className="add-role-access-grid">
                    {/* Sidebar Access */}
                    <div className="add-role-access-column">
                        <h4 className="add-role-column-title">Sidebar Menus</h4>
                        <div className="add-role-scroll-area">
                            {sidebarItems.map(item => (
                                <div key={item._id} className="add-role-check-item" onClick={() => toggleSidebar(item._id)}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSidebarItems.includes(item._id)}
                                        onChange={() => { }}
                                        className="add-role-checkbox"
                                    />
                                    <span className="add-role-check-icon">{item.icon}</span>
                                    <span className="add-role-check-label">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Permissions Access */}
                    <div className="add-role-access-column">
                        <h4 className="add-role-column-title">Module Permissions</h4>
                        <div className="add-role-scroll-area">
                            {Object.entries(permissions).map(([module, perms]) => (
                                <div key={module} className="add-role-permission-module">
                                    <h5 className="add-role-module-name">{module.toUpperCase()}</h5>
                                    <div className="add-role-action-grid">
                                        {perms.map(p => (
                                            <div key={p._id} className="add-role-check-item-small" onClick={() => togglePermission(p._id)}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(p._id)}
                                                    onChange={() => { }}
                                                    className="add-role-checkbox-small"
                                                />
                                                <span className="add-role-check-label-small">{p.action}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddRoleScreen;
