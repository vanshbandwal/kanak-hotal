import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './ProfileDropdown.css';

interface ProfileDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose, onLogout }) => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const isMinimal = theme === 'minimal';
    const isLuxury = theme === 'luxury';

    return (
        <>
            <div className="profile-dropdown-overlay" onClick={onClose} />
            <div className={`profile-dropdown ${isMinimal ? 'minimal' : ''}`}>
                <div className="profile-dropdown-header">
                    <span className={`profile-dropdown-header-label ${isLuxury ? 'luxury' : ''}`}>MY PROFILE</span>
                </div>

                <div className="profile-dropdown-menu-list">
                    <button 
                        className={`profile-dropdown-menu-item ${isMinimal ? 'minimal' : ''}`} 
                        onClick={() => {
                            navigate('/profile-settings');
                            onClose();
                        }}
                    >
                        <span className="profile-dropdown-menu-icon">👤</span>
                        <span className="profile-dropdown-menu-text">Profile Settings</span>
                    </button>

                    <button
                        className={`profile-dropdown-menu-item logout ${isMinimal ? 'minimal' : ''}`}
                        onClick={() => {
                            onLogout();
                            onClose();
                        }}
                    >
                        <span className="profile-dropdown-menu-icon">🚪</span>
                        <span className="profile-dropdown-menu-text">Logout</span>
                    </button>
                </div>

                {isLuxury && <div className="profile-dropdown-luxury-accent" />}
            </div>
        </>
    );
};

export default ProfileDropdown;
