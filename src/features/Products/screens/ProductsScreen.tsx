import React, { lazy, Suspense } from 'react';
import { useToast } from '../../../context/ToastContext';
import FashionLoader from '../../../components/Common/FashionLoader';
import './ProductsScreen.css';

const CategoryManagement = lazy(() => import('../components/CategoryManagement'));
const ProductManagement = lazy(() => import('../components/ProductManagement'));
const BrandManagement = lazy(() => import('../components/BrandManagement'));
const UnitManagement = lazy(() => import('../components/UnitManagement'));
const TaxManagement = lazy(() => import('../components/TaxManagement'));

const ProductsScreen = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = React.useState('Products');

    const tabs = ['Products', 'Bulk Import', 'Categories', 'Brands', 'Units', 'Tax'];

    const renderContent = () => {
        return (
            <Suspense fallback={<FashionLoader size="md" message="Draping the gallery..." />}>
                {(() => {
                    if (activeTab === 'Categories') {
                        return <CategoryManagement />;
                    }
                    if (activeTab === 'Products') {
                        return <ProductManagement />;
                    }
                    if (activeTab === 'Brands') {
                        return <BrandManagement />;
                    }
                    if (activeTab === 'Units') {
                        return <UnitManagement />;
                    }
                    if (activeTab === 'Tax') {
                        return <TaxManagement />;
                    }

                    interface TabData {
                        icon: string;
                        title: string;
                        subtitle: string;
                        button: string;
                    }

                    const tabDataMap: Record<string, TabData> = {
                        'Bulk Import': { icon: '📦', title: 'Bulk Import', subtitle: 'Upload your collection via CSV or Excel mapping.', button: 'UPLOAD FILE' },
                        'Department': { icon: '🏢', title: 'No Departments', subtitle: 'Organize your products into high-level departments.', button: '+ ADD DEPARTMENT' },
                        'Brands': { icon: '🏷️', title: 'No Brands', subtitle: 'Manage your portfolio of luxury designer brands.', button: '+ ADD BRAND' },
                        'Units': { icon: '📏', title: 'Units of Measure', subtitle: 'Set up standard units for your product variants.', button: '+ ADD UNIT' },
                        'Tax': { icon: '📉', title: 'Tax Settings', subtitle: 'Configure regional tax rules for your luxury items.', button: '+ ADD TAX RULE' },
                    };

                    const currentData = tabDataMap[activeTab];

                    if (!currentData) return null;

                    return (
                        <div className="products-placeholder">
                            <span className="products-placeholder-icon">{currentData.icon}</span>
                            <h3 className="products-placeholder-title">{currentData.title}</h3>
                            <p className="products-placeholder-text">{currentData.subtitle}</p>
                            <button className="products-add-button">{currentData.button}</button>
                        </div>
                    );
                })()}
            </Suspense>
        );
    };

    const isTableView = ['Categories', 'Products', 'Brands', 'Units', 'Tax'].includes(activeTab);

    return (
        <div className="products-container">
            <div className="products-header">
                <div>
                    <h2 className="products-title">Product Management</h2>
                    <p className="products-subtitle">Curate and manage your luxury collection.</p>
                </div>
            </div>

            <div className="products-tab-container">
                {tabs.map((tab) => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`products-tab-item ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab}
                        {activeTab === tab && <div className="products-tab-underline" />}
                    </div>
                ))}
            </div>

            <div className={`products-content-card ${isTableView ? 'table-view' : ''}`}>
                {renderContent()}
            </div>
        </div>
    );
};

export default ProductsScreen;
