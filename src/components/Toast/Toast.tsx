import React, { useEffect, useState } from 'react';
import { ToastType, useToast } from '../../context/ToastContext';
import { COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';

interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration: number;
}

import { TOAST_ICONS } from './ToastConstants';

const getIcon = (type: ToastType) => {
    return TOAST_ICONS[type] || '📣';
};

const Toast: React.FC<ToastProps> = ({ id, type, message, duration }) => {
    const { removeToast } = useToast();
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (duration <= 0) return;

        const startTime = Date.now();
        const endTime = startTime + duration;

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, endTime - now);
            const percentage = (remaining / duration) * 100;
            setProgress(percentage);

            if (percentage <= 0) {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [duration]);

    return (
        <div
            style={styles.toast(type)}
            role="alert"
            aria-live="polite"
        >
            <div style={styles.content}>
                <span style={styles.icon}>{getIcon(type)}</span>
                <div style={styles.textContainer}>
                    <span style={styles.message}>{message}</span>
                </div>
                <button
                    onClick={() => removeToast(id)}
                    style={styles.closeButton}
                    aria-label="Close notification"
                >
                    ✕
                </button>
            </div>
            {duration > 0 && (
                <div style={styles.progressContainer}>
                    <div style={styles.progressBar(type, progress)} />
                </div>
            )}
        </div>
    );
};

const styles = {
    toast: (type: ToastType): React.CSSProperties => ({
        backgroundColor: COLORS.glassBackground,
        backdropFilter: 'blur(40px) saturate(180%)',
        minWidth: '320px',
        borderRadius: '20px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '15px',
        border: `1px solid ${COLORS.glassBorder}`,
        boxShadow: COLORS.cardShadow,
        animation: 'toast-slide-in 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        overflow: 'hidden',
        position: 'relative' as const,
    }),
    content: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    icon: {
        fontSize: '20px',
    },
    textContainer: {
        flex: 1,
    },
    message: {
        fontFamily: TYPOGRAPHY.brand,
        color: COLORS.textPrimary,
        fontSize: '13px',
        letterSpacing: '0.8px',
        fontWeight: '500',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        color: COLORS.textSecondary,
        cursor: 'pointer',
        fontSize: '14px',
        padding: '5px',
        opacity: 0.6,
        transition: 'opacity 0.2s',
    },
    progressContainer: {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    progressBar: (type: ToastType, progress: number): React.CSSProperties => ({
        height: '100%',
        width: `${progress}%`,
        backgroundColor: COLORS.primary,
        transition: 'width 0.03s linear',
    }),
};

export default Toast;
