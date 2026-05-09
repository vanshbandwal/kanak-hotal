import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../theme/typography';
import LuxuryModal from '../../../components/Common/LuxuryModal';

interface RoleViewModalProps {
    role: any;
    isOpen: boolean;
    onClose: () => void;
}

const RoleViewModal: React.FC<RoleViewModalProps> = ({ role, isOpen, onClose }) => {
    const { colors, isDark } = useTheme();

    if (!role && isOpen) return null;

    const dynamicStyles = styles(colors, isDark);

    return (
        <LuxuryModal
            isOpen={isOpen}
            onClose={onClose}
            title={role?.label || role?.name || 'Role Details'}
            size="md"
            isViewOnly={true}
        >
            <div style={dynamicStyles.content}>
                {/* Role Identity */}
                <div style={dynamicStyles.section}>
                    <h3 style={dynamicStyles.sectionTitle}>Identity</h3>
                    <div style={dynamicStyles.infoGrid}>
                        <div style={dynamicStyles.infoItem}>
                            <label style={dynamicStyles.label}>System Identifier</label>
                            <span style={dynamicStyles.value}>{role?.name}</span>
                        </div>
                        <div style={dynamicStyles.infoItem}>
                            <label style={dynamicStyles.label}>Display Name</label>
                            <span style={dynamicStyles.value}>{role?.label || role?.name}</span>
                        </div>
                    </div>
                    <div style={dynamicStyles.descriptionContainer}>
                        <label style={dynamicStyles.label}>Narrative Description</label>
                        <p style={dynamicStyles.description}>
                            {role?.description || 'This role serves as a foundational pillar within the administrative hierarchy, ensuring systematic operations.'}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div style={dynamicStyles.statsRow}>
                    <div style={dynamicStyles.statBox}>
                        <span style={dynamicStyles.statValue}>{role?.permissionCount || 0}</span>
                        <span style={dynamicStyles.statLabel}>Permissions</span>
                    </div>
                    <div style={dynamicStyles.statBox}>
                        <span style={dynamicStyles.statValue}>{role?.sidebarCount || 0}</span>
                        <span style={dynamicStyles.statLabel}>Menu Access</span>
                    </div>
                </div>

                <p style={dynamicStyles.footerText}>
                    This role was established on {new Date(role?.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
                </p>
            </div>
        </LuxuryModal>
    );
};

const styles = (colors: any, isDark: boolean): { [key: string]: React.CSSProperties } => ({
    content: {
        padding: '10px 0',
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
    }
});

export default RoleViewModal;

