import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { productApi } from '../../../api/productApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import FashionLoader from '../../../components/Common/FashionLoader';
import dayjs from 'dayjs';
import './ProductDashboardScreen.css';

const COLORS = ['#d4af37', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const ProductDashboardScreen = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToast } = useToast();
    
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);

    const fetchDashboardStats = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        const { data, error } = await productApi.getProductDashboardStats(id);
        
        if (error) {
            addToast('error', error || 'Failed to fetch dashboard data');
            navigate('/products');
        } else {
            setDashboardData(data?.data);
        }
        setIsLoading(false);
    }, [id, addToast, navigate]);

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    // Optimized data transformations using useMemo
    const formattedSalesTrend = useMemo(() => {
        if (!dashboardData?.salesTrend) return [];
        return dashboardData.salesTrend.map((item: any) => ({
            ...item,
            formattedDate: dayjs(item.date).format('MMM DD')
        }));
    }, [dashboardData?.salesTrend]);

    const formattedRevenueDivision = useMemo(() => {
        if (!dashboardData?.revenueDivision) return [];
        return dashboardData.revenueDivision;
    }, [dashboardData?.revenueDivision]);

    if (isLoading) {
        return <FashionLoader fullScreen />;
    }

    if (!dashboardData) {
        return null; // or some error state
    }

    const { product, overall, recentOrders } = dashboardData;

    return (
        <div className="product-dashboard-container">
            <header className="product-dashboard-header">
                <div className="dashboard-title-section">
                    <div className="product-info-wrapper">
                        {product.mainImage && (
                            <img 
                                src={product.mainImage.startsWith('http') ? product.mainImage : `${BASE_URL}/${product.mainImage.replace(/\\/g, '/')}`} 
                                alt={product.name} 
                                className="dashboard-product-img"
                            />
                        )}
                        <div className="product-info-text">
                            <h1>{product.name}</h1>
                            <p>
                                {product.category?.name && <span className="product-category-badge">{product.category.name}</span>}
                                {product.brand?.name && <span className="product-brand-badge">{product.brand.name}</span>}
                                <span className="product-type-badge">{product.productType}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <button className="back-button" onClick={() => navigate('/products')}>
                    &larr; Back to Catalog
                </button>
            </header>

            <div className="dashboard-overview-cards">
                <div className="overview-card">
                    <div className="card-icon">💰</div>
                    <div className="card-content">
                        <h3>Total Revenue</h3>
                        <div className="card-value">₹{overall?.totalRevenue?.toLocaleString() || 0}</div>
                    </div>
                </div>
                <div className="overview-card">
                    <div className="card-icon">📦</div>
                    <div className="card-content">
                        <h3>Units Sold</h3>
                        <div className="card-value">{overall?.totalUnitsSold?.toLocaleString() || 0}</div>
                    </div>
                </div>
                <div className="overview-card">
                    <div className="card-icon">🧾</div>
                    <div className="card-content">
                        <h3>Orders Included</h3>
                        <div className="card-value">{overall?.totalOrders?.toLocaleString() || 0}</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-charts-section">
                <div className="chart-container">
                    <h2>Revenue Trend (Last 30 Days)</h2>
                    <div className="chart-wrapper">
                        {formattedSalesTrend.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={formattedSalesTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="formattedDate" stroke="#888" tick={{ fill: '#888' }} />
                                    <YAxis stroke="#888" tick={{ fill: '#888' }} tickFormatter={(val) => `₹${val}`} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#d4af37', color: '#fff' }}
                                        itemStyle={{ color: '#d4af37' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#d4af37" fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                                No sales data for the last 30 days
                            </div>
                        )}
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Revenue by Variant</h2>
                    <div className="chart-wrapper">
                        {formattedRevenueDivision.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={formattedRevenueDivision}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {formattedRevenueDivision.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value: number) => `₹${value.toLocaleString()}`}
                                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: '#fff' }}
                                    />
                                    <Legend wrapperStyle={{ color: '#aaa', fontSize: '0.85rem' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                                No variant data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard-orders-section">
                <h2>Recent Orders</h2>
                {recentOrders && recentOrders.length > 0 ? (
                    <div className="premium-table-wrapper">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Order Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order: any) => (
                                    <tr key={order._id}>
                                        <td>{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                                        <td>{dayjs(order.createdAt).format('DD MMM YYYY, hh:mm A')}</td>
                                        <td>{order.customer?.fullName || 'Guest'}</td>
                                        <td>
                                            <span className={`status-badge ${order.orderStatus}`}>
                                                {order.orderStatus.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>₹{order.grandTotal?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: '#666' }}>No orders found containing this product.</p>
                )}
            </div>
        </div>
    );
};

export default ProductDashboardScreen;
