import React, { useEffect, useState } from 'react';
import FashionLoader from '../../../components/Common/FashionLoader';
import LuxuryPageHeader from '../../../components/Common/LuxuryPageHeader';
import LuxuryStatsCard from '../../../components/Common/LuxuryStatsCard';
import LuxuryTable, { ColumnDef } from '../../../components/Common/LuxuryTable';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import { useAppSelector } from '../../../store';
import { dashboardApi } from '../../../api/dashboardApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './DashboardScreen.css';

interface TrendData {
    value: number;
    isUp: boolean;
}

interface DashboardStats {
    statCards: {
        totalRevenue: { value: number; trend: TrendData };
        totalOrders: { value: number; trend: TrendData };
        totalCustomers: { value: number; trend: TrendData };
        pendingOrders: number;
        deliveredOrders: number;
        cancelledOrders: number;
        activeCustomers: number;
        totalProducts: number;
        vegProducts: number;
        nonVegProducts: number;
        featuredProducts: number;
        totalCategories: number;
        totalBrands: number;
        totalCoupons: number;
        totalQueries: number;
        pendingQueries: number;
        totalReviews: number;
        averageRating: number;
        totalServicePartners: number;
        activeServicePartners: number;
    };
    graphs: {
        ordersByStatus: { name: string; value: number }[];
        revenueOverTime: { month: string; revenue: number; orders: number }[];
    };
    tables: {
        recentCustomers: any[];
        recentOrders: any[];
    };
}

// Velour brand colors for the charts
const COLORS = ['#D4AF37', '#8E7322', '#FFFFFF', '#A0A0A0', '#4A4A4A'];

const DashboardScreen = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Local state for tables
    const [customerSearch, setCustomerSearch] = useState('');
    const [orderSearch, setOrderSearch] = useState('');
    const [customerEntries, setCustomerEntries] = useState(10);
    const [orderEntries, setOrderEntries] = useState(10);

    const adminUser = useAppSelector((state: any) => state.auth?.admin);
    const displayName = adminUser?.name || 'Admin';

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await dashboardApi.getDashboardStats();
                if (response.data?.success) {
                    setDashboardData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading || !dashboardData) {
        return <FashionLoader size="lg" message="Summoning live metrics..." />;
    }

    const { statCards, graphs, tables } = dashboardData;

    // 20 Stat Cards Data Array
    const statsData = [
        { title: 'TOTAL REVENUE', value: `$${statCards.totalRevenue.value.toLocaleString()}`, icon: '💰', trend: statCards.totalRevenue.trend, desc: 'vs last month' },
        { title: 'TOTAL ORDERS', value: statCards.totalOrders.value.toLocaleString(), icon: '📦', trend: statCards.totalOrders.trend, desc: 'vs last month' },
        { title: 'TOTAL CUSTOMERS', value: statCards.totalCustomers.value.toLocaleString(), icon: '👥', trend: statCards.totalCustomers.trend, desc: 'vs last month' },
        { title: 'PENDING ORDERS', value: statCards.pendingOrders.toLocaleString(), icon: '⏳', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'DELIVERED ORDERS', value: statCards.deliveredOrders.toLocaleString(), icon: '✅', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'CANCELLED ORDERS', value: statCards.cancelledOrders.toLocaleString(), icon: '🚫', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'ACTIVE CUSTOMERS', value: statCards.activeCustomers.toLocaleString(), icon: '🟢', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'TOTAL PRODUCTS', value: statCards.totalProducts.toLocaleString(), icon: '✨', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'VEG PRODUCTS', value: statCards.vegProducts.toLocaleString(), icon: '🥦', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'NON-VEG PRODUCTS', value: statCards.nonVegProducts.toLocaleString(), icon: '🥩', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'FEATURED PRODUCTS', value: statCards.featuredProducts.toLocaleString(), icon: '🌟', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'TOTAL CATEGORIES', value: statCards.totalCategories.toLocaleString(), icon: '📁', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'TOTAL BRANDS', value: statCards.totalBrands.toLocaleString(), icon: '🏷️', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'TOTAL COUPONS', value: statCards.totalCoupons.toLocaleString(), icon: '🎟️', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'TOTAL QUERIES', value: statCards.totalQueries.toLocaleString(), icon: '❓', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'PENDING QUERIES', value: statCards.pendingQueries.toLocaleString(), icon: '📨', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'TOTAL REVIEWS', value: statCards.totalReviews.toLocaleString(), icon: '💬', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'AVERAGE RATING', value: `${statCards.averageRating} / 5`, icon: '⭐', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'SERVICE PARTNERS', value: statCards.totalServicePartners.toLocaleString(), icon: '🛵', trend: { value: 0, isUp: true }, desc: 'All time' },
        { title: 'ACTIVE PARTNERS', value: statCards.activeServicePartners.toLocaleString(), icon: '🏍️', trend: { value: 0, isUp: true }, desc: 'All time' },
    ];

    const customerColumns: ColumnDef<any>[] = [
        { header: 'NAME', key: 'name', render: (item) => item.name || 'N/A' },
        { header: 'PHONE', key: 'phone' },
        { header: 'STATUS', key: 'isActive', render: (item) => (
            <LuxuryStatusBadge label={item.isActive ? 'ACTIVE' : 'INACTIVE'} variant={item.isActive ? 'success' : 'danger'} />
        )},
    ];

    const orderColumns: ColumnDef<any>[] = [
        { header: 'CUSTOMER', key: 'customer', render: (item) => item.customer?.name || 'Guest' },
        { header: 'TOTAL', key: 'grandTotal', render: (item) => `$${item.grandTotal}` },
        { header: 'STATUS', key: 'orderStatus', render: (item) => {
            const variant = (item.orderStatus === 'completed' || item.orderStatus === 'delivered') ? 'success' : 
                            (item.orderStatus === 'cancelled' || item.orderStatus === 'rejected') ? 'danger' : 'warning';
            return <LuxuryStatusBadge label={item.orderStatus.toUpperCase()} variant={variant} />;
        }},
    ];

    // Local filtering
    const filteredCustomers = tables.recentCustomers
        .filter(c => c.name?.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone?.includes(customerSearch))
        .slice(0, customerEntries);

    const filteredOrders = tables.recentOrders
        .filter(o => o.customer?.name?.toLowerCase().includes(orderSearch.toLowerCase()) || o.orderStatus?.toLowerCase().includes(orderSearch.toLowerCase()))
        .slice(0, orderEntries);

    return (
        <div className="dashboard-container">
            <div className="dashboard-custom-topbar">
                <div className="topbar-greeting">
                    Good Morning, <span className="topbar-name">{displayName}</span>
                </div>
                <div className="topbar-right">
                    <div className="topbar-datetime">
                        <div className="topbar-date">{currentTime.toLocaleDateString('en-GB')}</div>
                        <div className="topbar-time">{currentTime.toLocaleTimeString('en-US', { hour12: true }).toLowerCase()}</div>
                    </div>
                    <button className="topbar-refresh-btn" onClick={() => window.location.reload()} title="Refresh Data">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 2v6h-6"></path>
                            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                            <path d="M3 22v-6h6"></path>
                            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="dashboard-stats-grid">
                {statsData.map((stat, idx) => (
                    <LuxuryStatsCard 
                        key={`${stat.title}-${idx}`}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        trend={stat.trend}
                        description={stat.desc}
                    />
                ))}
            </div>

            <div className="dashboard-charts-grid">
                <div className="dashboard-card-section">
                    <h3 className="dashboard-section-title">REVENUE OVER TIME</h3>
                    <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {graphs.revenueOverTime.length === 0 ? (
                            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', fontFamily: 'var(--font-main)' }}>
                                <div style={{ fontSize: 32, marginBottom: 10 }}>📉</div>
                                No revenue data yet.
                            </div>
                        ) : (
                            <ResponsiveContainer>
                                <AreaChart data={graphs.revenueOverTime}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="month" stroke="#A0A0A0" fontSize={12} tickLine={false} />
                                    <YAxis stroke="#A0A0A0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: '#fff' }}
                                        itemStyle={{ color: '#D4AF37' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="dashboard-card-section">
                    <h3 className="dashboard-section-title">ORDERS BY STATUS</h3>
                    <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {graphs.ordersByStatus.length === 0 ? (
                            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', fontFamily: 'var(--font-main)' }}>
                                <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
                                No orders placed yet.
                            </div>
                        ) : (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={graphs.ordersByStatus}
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {graphs.ordersByStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: 8, color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard-tables-grid">
                <div className="dashboard-card-section">
                    <LuxuryTable 
                        title="RECENT CUSTOMERS"
                        columns={customerColumns}
                        data={filteredCustomers}
                        searchTerm={customerSearch}
                        onSearchChange={setCustomerSearch}
                        rowsPerPage={customerEntries}
                        onRowsPerPageChange={setCustomerEntries}
                        totalCount={filteredCustomers.length}
                    />
                </div>
                <div className="dashboard-card-section">
                    <LuxuryTable 
                        title="RECENT ORDERS"
                        columns={orderColumns}
                        data={filteredOrders}
                        searchTerm={orderSearch}
                        onSearchChange={setOrderSearch}
                        rowsPerPage={orderEntries}
                        onRowsPerPageChange={setOrderEntries}
                        totalCount={filteredOrders.length}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
