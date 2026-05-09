import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../theme/typography';

interface RoleViewModalProps {
    role: any;
    onClose: () => void;
}

const RoleViewModal: React.FC<RoleViewModalProps> = ({ role, onClose }) => {
    const { colors, isDark } = useTheme();

    if (!role) return null;

    const dynamicStyles = styles(colors, isDark);

    return (
        <div style={dynamicStyles.overlay} onClick={onClose}>
            <div style={dynamicStyles.modal} onClick={e => e.stopPropagation()}>
                <div style={dynamicStyles.header}>
                    <div style={dynamicStyles.titleGroup}>
                        <h2 style={dynamicStyles.title}>{role.label || role.name}</h2>
                        <p style={dynamicStyles.subtitle}>Role Configuration Blueprint</p>
                    </div>
                    <button style={dynamicStyles.closeButton} onClick={onClose}>×</button>
                </div>

                <div style={dynamicStyles.content}>
                    {/* Role Identity */}
                    <div style={dynamicStyles.section}>
                        <h3 style={dynamicStyles.sectionTitle}>Identity</h3>
                        <div style={dynamicStyles.infoGrid}>
                            <div style={dynamicStyles.infoItem}>
                                <label style={dynamicStyles.label}>System Identifier</label>
                                <span style={dynamicStyles.value}>{role.name}</span>
                            </div>
                            <div style={dynamicStyles.infoItem}>
                                <label style={dynamicStyles.label}>Display Name</label>
                                <span style={dynamicStyles.value}>{role.label || role.name}</span>
                            </div>
                        </div>
                        <div style={dynamicStyles.descriptionContainer}>
                            <label style={dynamicStyles.label}>Narrative Description</label>
                            <p style={dynamicStyles.description}>
                                {role.description || 'This role serves as a foundational pillar within the administrative hierarchy, ensuring systematic operations.'}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={dynamicStyles.statsRow}>
                        <div style={dynamicStyles.statBox}>
                            <span style={dynamicStyles.statValue}>{role.permissionCount}</span>
                            <span style={dynamicStyles.statLabel}>Permissions</span>
                        </div>
                        <div style={dynamicStyles.statBox}>
                            <span style={dynamicStyles.statValue}>{role.sidebarCount}</span>
                            <span style={dynamicStyles.statLabel}>Menu Access</span>
                        </div>
                    </div>

                    <p style={dynamicStyles.footerText}>
                        This role was established on {new Date(role.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
                    </p>
                </div>

                <div style={dynamicStyles.footer}>
                    <button style={dynamicStyles.doneButton} onClick={onClose}>Acknowledge</button>
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
        animation: 'fadeIn 0.3s ease-out',
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
    section: {
        marginBottom: '25px',
    },
    sectionTitle: {
        fontSize: '13px',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '15px',
        fontWeight: 'bold',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px',
    },
    infoItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    label: {
        fontSize: '11px',
        color: colors.textSecondary,
        letterSpacing: '0.5px',
    },
    value: {
        fontSize: '14px',
        color: colors.textPrimary,
        fontWeight: '500',
    },
    descriptionContainer: {
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
        padding: '15px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
    },
    description: {
        margin: '8px 0 0 0',
        fontSize: '13px',
        lineHeight: '1.6',
        color: colors.textLight,
        fontStyle: 'italic',
    },
    statsRow: {
        display: 'flex',
        gap: '15px',
        marginBottom: '25px',
    },
    statBox: {
        flex: 1,
        backgroundColor: isDark ? 'rgba(232, 201, 123, 0.05)' : 'rgba(184, 134, 11, 0.05)',
        padding: '15px',
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
    },
    statValue: {
        fontSize: '24px',
        fontFamily: TYPOGRAPHY.brand,
        color: colors.primary,
    },
    statLabel: {
        fontSize: '10px',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    footerText: {
        textAlign: 'center',
        fontSize: '12px',
        color: colors.textSecondary,
        margin: 0,
    },
    footer: {
        padding: '20px 30px 30px',
        display: 'flex',
        justifyContent: 'center',
    },
    doneButton: {
        backgroundColor: colors.primary,
        color: colors.buttonText,
        border: 'none',
        padding: '12px 40px',
        borderRadius: '12px',
        fontWeight: 'bold',
        letterSpacing: '1.5px',
        fontSize: '12px',
        cursor: 'pointer',
        boxShadow: `0 10px 20px ${colors.glow}`,
        textTransform: 'uppercase',
    }
});

export default RoleViewModal;
