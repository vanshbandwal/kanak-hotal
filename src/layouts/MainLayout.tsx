import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import { useAppSelector, useAppDispatch } from '../store';
import { logoutAction } from '../store/slices/authSlice';
import { Outlet } from 'react-router-dom';
import ProfileDropdown from '../components/Header/ProfileDropdown';
import './MainLayout.css';

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const dispatch = useAppDispatch();
    const { hasSidebar } = useAppSelector((state) => state.auth);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const handleLogout = () => {
        dispatch(logoutAction());
    };

    const getThemeIcon = () => {
        switch (theme) {
            case 'light': return '☀️';
            case 'luxury': return '👑';
            case 'minimal': return '▫️';
            default: return '🌙';
        }
    };

    return (
        <div className="main-layout-container">
            {hasSidebar && <Sidebar isOpen={isSidebarOpen} />}
            <div className={`main-layout-content-wrapper ${hasSidebar ? 'with-sidebar' : ''} ${!isSidebarOpen ? 'collapsed' : ''}`}>
                <header className="main-layout-header">
                    <div className="main-layout-header-left">
                        {hasSidebar && (
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="main-layout-menu-btn"
                            >
                                {isSidebarOpen ? '✕' : '☰'}
                            </button>
                        )}
                        <div className="main-layout-breadcrumb">
                            <span className="main-layout-breadcrumb-active">VÉLOUR ADMIN</span>
                        </div>
                    </div>
                    <div className="main-layout-header-actions">
                        <button
                            onClick={toggleTheme}
                            className="main-layout-theme-toggle"
                            title={`Switch theme (Current: ${theme})`}
                        >
                            {getThemeIcon()}
                        </button>
                        <div style={{ position: 'relative' }}>
                            <div
                                className="main-layout-user-profile"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="main-layout-avatar">A</div>
                                <span className="main-layout-user-name">ALEXA</span>
                            </div>
                            <ProfileDropdown
                                isOpen={isProfileOpen}
                                onClose={() => setIsProfileOpen(false)}
                                onLogout={handleLogout}
                            />
                        </div>
                    </div>
                </header>
                <main className="main-layout-content">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
