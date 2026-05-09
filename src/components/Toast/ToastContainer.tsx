import React from 'react';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
    const { toasts } = useToast();

    return (
        <div style={styles.container}>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    message={toast.message}
                    duration={toast.duration || 4000}
                />
            ))}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed' as const,
        top: '30px',
        right: '30px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-end',
        pointerEvents: 'none' as const,
    },
};

// CSS for mobile responsiveness and animations will be added to index.css
export default ToastContainer;
