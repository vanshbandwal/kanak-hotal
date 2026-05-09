import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

const FloatingIcon = ({ d, size = 48, top, left, right, bottom, delay, duration }: any) => (
    <div 
        className="floating-icon"
        style={{
            top,
            left,
            right,
            bottom,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
        }}
    >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d={d} />
        </svg>
    </div>
);

const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className="auth-layout-container">
            <div className="auth-layout-background-canvas">
                <div className="auth-layout-gradient-overlay" />

                {/* Left Side Items */}
                <FloatingIcon top="15%" left="10%" delay={0} duration={25} d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z M3 6h18 M16 10a4 4 0 01-8 0" />
                <FloatingIcon top="55%" left="8%" delay={2} duration={30} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" />
                <FloatingIcon bottom="20%" left="15%" delay={7} duration={35} d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" />
                <FloatingIcon top="35%" left="20%" delay={5} duration={28} d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01" />

                {/* Right Side Items */}
                <FloatingIcon top="10%" right="12%" delay={1} duration={22} d="M12 2L3 9h18L12 2z M12 22a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                <FloatingIcon top="60%" right="8%" delay={3} duration={27} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <FloatingIcon bottom="15%" right="20%" delay={6} duration={32} d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z M3 6h18 M16 10a4 4 0 01-8 0" />
                <FloatingIcon bottom="45%" right="15%" delay={4} duration={24} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </div>

            <div className="auth-layout-content">
                <div className="auth-layout-card">
                    <div className="auth-layout-logo-container">
                        <h1 className="auth-layout-logo-text">VÉLOUR</h1>
                        <span className="auth-layout-logo-subtext">ADMIN PORTAL</span>
                    </div>
                    {children || <Outlet />}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
