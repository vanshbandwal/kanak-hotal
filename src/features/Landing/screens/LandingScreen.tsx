import React from 'react';
import { useAppSelector } from '../../../store';
import { useNavigate } from 'react-router-dom';
import './LandingScreen.css';

const LandingScreen = () => {
    const { admin, hasSidebar } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Hero Section */}
            <header className="landing-hero">
                <div className="landing-hero-content">
                    <h1 className="landing-app-name">VELOUR ADMIN</h1>
                    <h2 className="landing-welcome-text">Welcome back, {admin?.name || 'Authorized User'}</h2>
                    <p className="landing-description">
                        Your premium control center for luxury retail management.
                        Optimize your operations, analyze performance, and curate the ultimate customer experience.
                    </p>
                    <div className="landing-cta-container">
                        {hasSidebar ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="landing-primary-button"
                            >
                                GO TO DASHBOARD
                            </button>
                        ) : (
                            <button className="landing-disabled-button" disabled>
                                AWAITING ASSIGNMENT
                            </button>
                        )}
                        <button className="landing-secondary-button">GO TO WEBSITE</button>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="landing-features-section">
                <h3 className="landing-section-title">Key Features</h3>
                <div className="landing-features-grid">
                    <div className="landing-feature-card">
                        <span className="landing-feature-icon">🛡️</span>
                        <h4 className="landing-feature-title">RBAC Security</h4>
                        <p className="landing-feature-text">Granular Role-Based Access Control for all staff members.</p>
                    </div>
                    <div className="landing-feature-card">
                        <span className="landing-feature-icon">📊</span>
                        <h4 className="landing-feature-title">Analytics</h4>
                        <p className="landing-feature-text">Real-time data visualization and business reporting.</p>
                    </div>
                    <div className="landing-feature-card">
                        <span className="landing-feature-icon">📝</span>
                        <h4 className="landing-feature-title">CMS</h4>
                        <p className="landing-feature-text">Integrated Content Management System for easy updates.</p>
                    </div>
                </div>
            </section>

            {!hasSidebar && (
                <div className="landing-alert">
                    <span className="landing-alert-icon">⚠️</span>
                    <p className="landing-alert-text">
                        Your account hasn't been assigned any sidebar menus yet.
                        Please contact the Super Admin to set up your access permissions.
                    </p>
                </div>
            )}
        </div>
    );
};

export default LandingScreen;
