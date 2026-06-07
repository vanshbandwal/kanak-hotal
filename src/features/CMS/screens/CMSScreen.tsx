import React, { useState } from 'react';
import LuxuryPageHeader from '../../../components/Common/LuxuryPageHeader';
import LuxuryTabs from '../../../components/Common/LuxuryTabs';
import CmsEditor from '../components/CmsEditor';
import FaqManager from '../components/FaqManager';
import './CMSScreen.css';

const CMSScreen = () => {
    const [activeTab, setActiveTab] = useState('terms');

    const tabs = [
        { id: 'terms', label: 'Terms & Conditions', icon: '📄' },
        { id: 'privacy', label: 'Privacy Policy', icon: '🛡️' },
        { id: 'faqs', label: 'FAQs', icon: '❔' },
        { id: 'contact', label: 'Contact Us', icon: '📞' },
        { id: 'about', label: 'About Us', icon: 'ℹ️' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'terms':
                return <CmsEditor pageKey="terms_conditions" label="Terms & Conditions" />;
            case 'privacy':
                return <CmsEditor pageKey="privacy_policy" label="Privacy Policy" />;
            case 'about':
                return <CmsEditor pageKey="about_us" label="About Us" />;
            case 'contact':
                return <CmsEditor pageKey="contact_us" label="Contact Us" />;
            case 'faqs':
                return <FaqManager />;
            default:
                return null;
        }
    };

    return (
        <div className="cms-container">
            <LuxuryPageHeader
                title="Content Management System"
                subtitle="Manage your application's static content pages automatically synced with the mobile app."
            />

            <div className="cms-tabs-container">
                <LuxuryTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            <div className="cms-content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default CMSScreen;
