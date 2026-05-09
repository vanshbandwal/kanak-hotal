import React from 'react';
import './ReportsScreen.css';

const ReportsScreen = () => {
    return (
        <div className="reports-container">
            <h2 className="reports-title">Business Reports</h2>
            <p className="reports-subtitle">Analyze your store's performance with detailed data.</p>

            <div className="reports-content-card">
                <div className="reports-placeholder">
                    <span className="reports-placeholder-icon">📉</span>
                    <h3 className="reports-placeholder-title">No Reports Generated</h3>
                    <p className="reports-placeholder-text">Start by selecting a time period to generate a report.</p>
                    <button className="reports-add-button">GENERATE REPORT</button>
                </div>
            </div>
        </div>
    );
};

export default ReportsScreen;
