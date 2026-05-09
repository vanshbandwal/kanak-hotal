import React from 'react';
import './LuxuryStatsCard.css';

interface LuxuryStatsCardProps {
    title: string;
    value: string | number;
    icon: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
    description?: string;
    className?: string;
}

const LuxuryStatsCard: React.FC<LuxuryStatsCardProps> = ({
    title,
    value,
    icon,
    trend,
    description,
    className = ''
}) => {
    return (
        <div className={`luxury-stats-card ${className}`}>
            <div className="stats-card-header">
                <div className="stats-card-icon-wrapper">
                    <span className="stats-card-icon">{icon}</span>
                </div>
                {trend && (
                    <div className={`stats-card-trend ${trend.isUp ? 'trend-up' : 'trend-down'}`}>
                        {trend.isUp ? '↑' : '↓'} {trend.value}%
                    </div>
                )}
            </div>
            
            <div className="stats-card-content">
                <h3 className="stats-card-value">{value}</h3>
                <p className="stats-card-title">{title}</p>
                {description && <p className="stats-card-description">{description}</p>}
            </div>
            
            <div className="stats-card-glow" />
        </div>
    );
};

export default LuxuryStatsCard;
