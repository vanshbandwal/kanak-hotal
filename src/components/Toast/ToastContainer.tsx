import React from 'react';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';
import './Toast.css';

const ToastContainer: React.FC = () => {
    const { toasts } = useToast();

    return (
        <div className="toast-container-wrapper">
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

// CSS for mobile responsiveness and animations will be added to index.css
export default ToastContainer;
