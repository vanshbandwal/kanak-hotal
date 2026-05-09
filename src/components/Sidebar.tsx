import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { useTheme } from '../context/ThemeContext';
import { SubItem } from '../services/sidebarService';
import './Sidebar.css';

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { colors } = useTheme();
    const [expandedItem, setExpandedItem] = React.useState<string | null>(null);
    const { sidebarItems: menuItems } = useAppSelector((state) => state.auth);

    const isActive = (path: string) => {
        if (path === '/dashboard' && location.pathname === '/') return true;
        return location.pathname === path;
    };

    const isParentActive = (item: any) => {
        if (item.path !== '#' && isActive(item.path)) return true;
        if (item.subItems) {
            return item.subItems.some((sub: SubItem) => 
                (sub.path === '/dashboard' && location.pathname === '/') ||
                location.pathname.startsWith(sub.path)
            );
        }
        return false;
    };

    return (
        <aside 
            className="sidebar" 
            style={{ width: isOpen ? '260px' : '80px' }}
        >
            <div
                onClick={() => navigate('/')}
                className="sidebar-logo-container"
                style={{ padding: isOpen ? '40px 20px' : '30px 0' }}
            >
                {isOpen ? (
                    <>
                        <h1 className="sidebar-logo-text">VÉLOUR</h1>
                        <span className="sidebar-logo-subtext">ADMIN PANEL</span>
                    </>
                ) : (
                    <div className="sidebar-logo-mini">V</div>
                )}
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const parentActive = isParentActive(item);
                    return (
                        <div key={item.name}>
                            <div
                                onClick={() => {
                                    if (item.subItems && item.subItems.length > 0) {
                                        setExpandedItem(expandedItem === item.name ? null : item.name);
                                    } else {
                                        navigate(item.path);
                                    }
                                }}
                                className={`sidebar-nav-item ${parentActive ? 'active' : ''}`}
                                style={{
                                    justifyContent: isOpen ? 'flex-start' : 'center',
                                    padding: isOpen ? '15px 30px' : '15px 0',
                                }}
                            >
                                <span 
                                    className="sidebar-nav-icon"
                                    style={{ color: parentActive ? colors.primary : colors.textSecondary }}
                                >
                                    {item.icon}
                                </span>
                                {isOpen && (
                                    <>
                                        <span className="sidebar-nav-text">
                                            {item.name}
                                        </span>
                                        {item.subItems && item.subItems.length > 0 && (
                                            <span 
                                                className="sidebar-nav-arrow"
                                                style={{
                                                    transform: expandedItem === item.name ? 'rotate(180deg)' : 'rotate(0deg)'
                                                }}
                                            >
                                                ▼
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            {isOpen && item.subItems && item.subItems.length > 0 && expandedItem === item.name && (
                                <div className="sidebar-submenu">
                                    {item.subItems.map((subItem: SubItem) => (
                                        <div
                                            key={subItem.name}
                                            onClick={() => navigate(subItem.path)}
                                            className={`sidebar-subnav-item ${isActive(subItem.path) ? 'active' : ''}`}
                                        >
                                            {subItem.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div 
                className="sidebar-profile"
                style={{
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    padding: isOpen ? '20px' : '20px 0',
                }}
            >
                <div className="sidebar-avatar-border">
                    <div className="sidebar-avatar">AV</div>
                </div>
                {isOpen && (
                    <div className="sidebar-profile-info">
                        <p className="sidebar-profile-name">Admin User</p>
                        <p className="sidebar-profile-role">PLATINUM AGENT</p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
