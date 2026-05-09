import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { staffApi } from '../../../api/staffApi';
interface StaffMember {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}
import { useNavigate } from 'react-router-dom';
import FashionLoader from '../../../components/Common/FashionLoader';
import StaffFormModal from '../components/StaffFormModal';
import './StaffListScreen.css';

const StaffListScreen = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchStaff = async () => {
        setLoading(true);
        const { data, error } = await staffApi.getAllStaff();
        if (error) {
            console.error('Failed to fetch staff:', error);
        } else {
            setStaff(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    if (loading && staff.length === 0) return <FashionLoader size="lg" message="Accessing personnel records..." />;

    return (
        <div className="staff-list-container">
            <div className="staff-list-header">
                <div className="staff-list-title-section">
                    <h2 className="staff-list-title">Staff Members</h2>
                    <p className="staff-list-subtitle">Manage administrative access and personnel profiles.</p>
                </div>
                <div className="staff-list-header-actions">
                    <button
                        onClick={() => navigate('/roles/list')}
                        className="staff-list-secondary-button"
                    >
                        VIEW ROLES
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="staff-list-add-button"
                    >
                        + ADD NEW STAFF
                    </button>
                </div>
            </div>

            <div className="staff-list-card-grid">
                {staff.map((member) => (
                    <div key={member._id} className="staff-list-card">
                        <div className="staff-list-card-header">
                            <div className="staff-list-avatar-container">
                                <span className="staff-list-avatar-icon">👤</span>
                            </div>
                            <div className="staff-list-staff-info">
                                <h3 className="staff-list-staff-name">{member.name}</h3>
                                <p className="staff-list-staff-email">{member.email}</p>
                            </div>
                        </div>

                        <div className="staff-list-badge-container">
                            <div className="staff-list-badge">
                                <span className="staff-list-badge-icon">🛡️</span>
                                <span className="staff-list-badge-text">{member.role}</span>
                            </div>
                        </div>

                        <div className="staff-list-card-footer">
                            <p className="staff-list-member-since">
                                Member since {new Date(member.createdAt).toLocaleDateString()}
                            </p>
                            <button className="staff-list-edit-button">
                                Manage
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <StaffFormModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={() => {
                    setShowAddModal(false);
                    fetchStaff();
                }}
            />

        </div>
    );
};

export default StaffListScreen;
