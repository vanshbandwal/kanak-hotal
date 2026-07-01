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
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import FashionLoader from '../../../components/Common/FashionLoader';
import './EditRoleScreen.css';

const EditRoleScreen = () => {
    const { id } = useParams<{ id: string }>();
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            const [permRes, sidebarRes, roleRes] = await Promise.all([
                permissionApi.getAllPermissions(),
                sidebarApi.getAllSidebarItems(),
                roleApi.getRoleById(id)
            ]);

            if (permRes.error || sidebarRes.error || roleRes.error) {
                setError('Failed to load role details');
                addToast('error', 'The archive could not be accessed.');
            } else {
                // Group permissions
                const permissionsList = permRes.data?.data || [];
                const grouped = permissionsList.reduce((acc: any, perm: any) => {
                    if (!acc[perm.module]) acc[perm.module] = [];
                    acc[perm.module].push(perm);
                    return acc;
                }, {});

                setPermissions(grouped);
                setSidebarItems(sidebarRes.data?.data || []);

                const roleData = roleRes.data;
                if (roleData) {
                    setName(roleData.name || '');
                    setLabel(roleData.label || '');
                    setDescription(roleData.description || '');
                    setSelectedPermissions(roleData.permissionIds || []);
                    setSelectedSidebarItems(roleData.sidebarIds || []);
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [id, addToast]);

    const togglePermission = (permId: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permId) ? prev.filter(pId => pId !== permId) : [...prev, permId]
        );
    };

    const toggleSidebar = (sidebarId: string) => {
        setSelectedSidebarItems(prev =>
            prev.includes(sidebarId) ? prev.filter(sId => sId !== sidebarId) : [...prev, sidebarId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        const { error: submitError } = await roleApi.updateRole(id, {
            name,
            label,
            description,
            permissionIds: selectedPermissions,
            sidebarIds: selectedSidebarItems
        });

        if (submitError) {
            addToast('error', submitError || 'The update sequence failed.');
        } else {
            addToast('success', 'The curation has been refined.');
            navigate('/roles/list');
        }
    };

    if (loading) return <FashionLoader size="lg" message="Refining configurations..." />;
    if (error) return <div className="edit-role-error-container">{error}</div>;

    return (
        <div className="edit-role-container">
            <div className="edit-role-header">
                <h2 className="edit-role-title">Refine Role</h2>
                <button onClick={handleSubmit} className="edit-role-save-button">Refine Role</button>
            </div>

            <form className="edit-role-form">
                <div className="edit-role-row">
                    <div className="edit-role-input-group">
                        <label className="edit-role-label">Identifier <span className="edit-role-required">*</span></label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. manager"
                            className="edit-role-input"
                        />
                        <span className="edit-role-hint">(System name, e.g. manager)</span>
                    </div>
                    <div className="edit-role-input-group">
                        <label className="edit-role-label">Display Label <span className="edit-role-required">*</span></label>
                        <input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g. Regional Manager"
                            className="edit-role-input"
                        />
                    </div>
                </div>

                <div className="edit-role-input-group-full">
                    <label className="edit-role-label">Narrative Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the essence of this role..."
                        className="edit-role-textarea"
                    />
                </div>

                <div className="edit-role-section-header">
                    <h3 className="edit-role-section-title">Access Architecture</h3>
                </div>

                <div className="edit-role-access-grid">
                    {/* Sidebar Access */}
                    <div className="edit-role-access-column">
                        <h4 className="edit-role-column-title">Navigation Menus</h4>
                        <div className="edit-role-scroll-area">
                            {sidebarItems.map(item => (
                                <div key={item._id} className="edit-role-check-item" onClick={() => toggleSidebar(item._id)}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSidebarItems.includes(item._id)}
                                        onChange={() => {}}
                                        className="edit-role-checkbox"
                                    />
                                    <span className="edit-role-check-icon">{item.icon}</span>
                                    <span className="edit-role-check-label">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Permissions Access */}
                    <div className="edit-role-access-column">
                        <h4 className="edit-role-column-title">Module Authority</h4>
                        <div className="edit-role-scroll-area">
                            {Object.entries(permissions).map(([module, perms]) => (
                                <div key={module} className="edit-role-permission-module">
                                    <h5 className="edit-role-module-name">{module.toUpperCase()}</h5>
                                    <div className="edit-role-action-grid">
                                        {perms.map(p => (
                                            <div key={p._id} className="edit-role-check-item-small" onClick={() => togglePermission(p._id)}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(p._id)}
                                                    onChange={() => {}}
                                                    className="edit-role-checkbox-small"
                                                />
                                                <span className="edit-role-check-label-small">{p.action}</span>
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

export default EditRoleScreen;
