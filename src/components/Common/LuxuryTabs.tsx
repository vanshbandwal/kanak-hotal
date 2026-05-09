import React from 'react';
import './LuxuryTabs.css';

interface Tab {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
}

interface LuxuryTabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

const LuxuryTabs: React.FC<LuxuryTabsProps> = ({
    tabs,
    activeTab,
    onChange,
    className = ''
}) => {
    return (
        <div className={`luxury-tabs-container ${className}`}>
            <div className="luxury-tabs-list">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`luxury-tab-item ${activeTab === tab.id ? 'tab-active' : ''}`}
                        onClick={() => !tab.disabled && onChange(tab.id)}
                        disabled={tab.disabled}
                    >
                        {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                        <span className="tab-label">{tab.label}</span>
                        {activeTab === tab.id && <div className="tab-indicator" />}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LuxuryTabs;
