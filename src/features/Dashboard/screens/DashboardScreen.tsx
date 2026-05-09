import React from 'react';
import FashionLoader from '../../../components/Common/FashionLoader';
import './DashboardScreen.css';

const DashboardScreen = () => {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <FashionLoader size="lg" message="Summoning the dashboard..." />;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header-row">
                <div>
                    <h2 className="dashboard-title">Welcome back, Alexa</h2>
                    <p className="dashboard-subtitle">Here is what's happening with Vélour today.</p>
                </div>
            </div>

            <div className="dashboard-stats-grid">
                {[
                    { label: 'TOTAL SALES', value: '$124,500', change: '+12%', icon: '📈' },
                    { label: 'ACTIVE ORDERS', value: '45', change: '+5', icon: '📦' },
                    { label: 'NEW CUSTOMERS', value: '12', change: '+3', icon: '✨' },
                    { label: 'PENDING REVIEWS', value: '8', change: '-2', icon: '✍️' },
                ].map((stat) => (
                    <div key={stat.label} className="dashboard-stat-card">
                        <div className="dashboard-card-header">
                            <span className="dashboard-card-label">{stat.label}</span>
                            <span className="dashboard-card-icon">{stat.icon}</span>
                        </div>
                        <div className="dashboard-card-value">{stat.value}</div>
                        <div className="dashboard-card-change">{stat.change} <span className="dashboard-change-label">this week</span></div>
                    </div>
                ))}
            </div>

            <div className="dashboard-recent-activity">
                <h3 className="dashboard-section-title">RECENT ACTIVITY</h3>
                <div className="dashboard-activity-list">
                    <div className="dashboard-activity-item">New order #1234 by Elena Gilbert</div>
                    <div className="dashboard-activity-item">Product "Silk Scarf" stock low</div>
                    <div className="dashboard-activity-item">New user registration: Damon Salvatore</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
