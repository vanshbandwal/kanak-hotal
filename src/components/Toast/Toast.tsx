import React, { useEffect, useState } from 'react';
import { ToastType, useToast } from '../../context/ToastContext';
import './Toast.css';

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
            className="toast-item"
            role="alert"
            aria-live="polite"
        >
            <div className="toast-content">
                <span className="toast-icon">{getIcon(type)}</span>
                <div className="toast-text-container">
                    <span className="toast-message">{message}</span>
                </div>
                <button
                    onClick={() => removeToast(id)}
                    className="toast-close-btn"
                    aria-label="Close notification"
                >
                    ✕
                </button>
            </div>
            {duration > 0 && (
                <div className="toast-progress-container">
                    <div className="toast-progress-bar" style={{ width: `${progress}%` }} />
                </div>
            )}
        </div>
    );
};

export default Toast;
