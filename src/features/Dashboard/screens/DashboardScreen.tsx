import React from 'react';
import FashionLoader from '../../../components/Common/FashionLoader';
import './DashboardScreen.css';

import LuxuryPageHeader from '../../../components/Common/LuxuryPageHeader';
import LuxuryStatsCard from '../../../components/Common/LuxuryStatsCard';

const DashboardScreen = () => {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <FashionLoader size="lg" message="Summoning the dashboard..." />;

    const statsData = [
        { title: 'TOTAL SALES', value: '$124,500', change: 12, isUp: true, icon: '📈' },
        { title: 'ACTIVE ORDERS', value: '45', change: 5, isUp: true, icon: '📦' },
        { title: 'NEW CUSTOMERS', value: '12', change: 3, isUp: true, icon: '✨' },
        { title: 'PENDING REVIEWS', value: '8', change: 2, isUp: false, icon: '✍️' },
    ];

    return (
        <div className="dashboard-container">
            <LuxuryPageHeader 
                title="Welcome back, Alexa"
                subtitle="Here is what's happening with Vélour today."
                primaryAction={{
                    label: "EXPORT REPORT",
                    onClick: () => console.log('Exporting...'),
                    icon: "📊"
                }}
            />

            <div className="dashboard-stats-grid">
                {statsData.map((stat) => (
                    <LuxuryStatsCard 
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        trend={{ value: stat.change, isUp: stat.isUp }}
                        description="vs last week"
                    />
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
