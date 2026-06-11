import React, { useEffect, useState } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell, Legend,
    BarChart, Bar
} from 'recharts';
import reportApi, { ReportDataResponse } from '../../../api/reportApi';
import './ReportsScreen.css';

const STATUS_COLORS: Record<string, string> = {
    pending: '#f59e0b',
    accepted: '#3b82f6',
    assigned: '#6366f1',
    out_for_delivery: '#8b5cf6',
    delivered: '#10b981',
    rejected: '#ef4444',
    cancelled: '#f43f5e',
    completed: '#14b8a6'
};
const DEFAULT_COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const ReportsScreen: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ReportDataResponse | null>(null);
    const [dateRange, setDateRange] = useState<'today' | 'last_7_days' | 'last_30_days' | 'this_month' | 'this_year'>('last_30_days');

    useEffect(() => {
        const fetchOverview = async () => {
            setIsLoading(true);
            setError(null);
            const { data: apiResponse, error: apiError } = await reportApi.getOverview({ range: dateRange });
            
            if (apiError) {
                setError(apiError);
            } else if (apiResponse?.data) {
                setData(apiResponse.data);
            }
            setIsLoading(false);
        };

        fetchOverview();
    }, [dateRange]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="reports-container">
            <div className="reports-header">
                <div>
                    <h1 className="reports-title">Business Analytics</h1>
                    <p className="reports-subtitle">Max Industry Level Data Intelligence</p>
                </div>
                
                <div className="reports-filters">
                    <select 
                        className="reports-select-glass" 
                        value={dateRange} 
                        onChange={(e) => setDateRange(e.target.value as any)}
                    >
                        <option value="today">Today</option>
                        <option value="last_7_days">Last 7 Days</option>
                        <option value="last_30_days">Last 30 Days</option>
                        <option value="this_month">This Month</option>
                        <option value="this_year">This Year</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="reports-error-badge">
                    <span>⚠️</span> {error}
                </div>
            )}

            {isLoading ? (
                <div className="reports-loader-container">
                    <div className="reports-spinner"></div>
                    <p>Aggregating data points...</p>
                </div>
            ) : data && (
                <div className="dashboard-grid-max">
                    {/* TOP KPIs ROW (Span Full Width in Grid) */}
                    <div className="kpi-grid">
                        <div className="kpi-card glass-panel primary-gradient">
                            <div className="kpi-icon">💰</div>
                            <div className="kpi-content">
                                <h3>Total Revenue</h3>
                                <h2>{formatCurrency(data.kpis.totalRevenue)}</h2>
                            </div>
                        </div>

                        <div className="kpi-card glass-panel secondary-gradient">
                            <div className="kpi-icon">📦</div>
                            <div className="kpi-content">
                                <h3>Total Orders</h3>
                                <h2>{data.kpis.totalOrders}</h2>
                            </div>
                        </div>

                        <div className="kpi-card glass-panel accent-gradient">
                            <div className="kpi-icon">💎</div>
                            <div className="kpi-content">
                                <h3>Avg Order Value</h3>
                                <h2>{formatCurrency(data.kpis.averageOrderValue)}</h2>
                            </div>
                        </div>

                        <div className="kpi-card glass-panel dark-gradient">
                            <div className="kpi-icon">👥</div>
                            <div className="kpi-content">
                                <h3>Active Customers</h3>
                                <h2>{data.kpis.totalCustomers}</h2>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CHARTS ROW */}
                    <div className="charts-grid-main">
                        {/* REVENUE TREND */}
                        <div className="chart-card glass-panel span-2-col">
                            <div className="chart-header">
                                <h3>Revenue Trend</h3>
                                <div className="chart-badge">Daily Sales</div>
                            </div>
                            <div className="chart-wrapper compact-chart">
                                {data.chart.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <AreaChart data={data.chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="_id" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                                            <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                                            <RechartsTooltip wrapperClassName="custom-tooltip-wrapper" formatter={(value: any) => [formatCurrency(value as number), 'Revenue']} labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} />
                                            <Area type="monotone" dataKey="dailyRevenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="empty-chart">No sales data</div>
                                )}
                            </div>
                        </div>

                        {/* ORDER STATUS DONUT */}
                        <div className="chart-card glass-panel">
                            <div className="chart-header">
                                <h3>Order Status</h3>
                                <div className="chart-badge secondary">Distribution</div>
                            </div>
                            <div className="chart-wrapper compact-chart">
                                {data.orderStatusBreakdown && data.orderStatusBreakdown.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={data.orderStatusBreakdown}
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="count"
                                                nameKey="_id"
                                                stroke="none"
                                            >
                                                {data.orderStatusBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry._id] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip wrapperClassName="custom-tooltip-wrapper" formatter={(value: any, name: string) => [value, name.replace(/_/g, ' ').toUpperCase()]} />
                                            <Legend iconType="circle" className="custom-legend" formatter={(value) => value.replace(/_/g, ' ').toUpperCase()} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="empty-chart">No status data</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECONDARY INSIGHTS ROW */}
                    <div className="charts-grid-main">
                        {/* TOP PRODUCTS LEADERBOARD */}
                        <div className="chart-card glass-panel">
                            <div className="chart-header">
                                <h3>Top Products</h3>
                                <div className="chart-badge accent">Bestsellers</div>
                            </div>
                            <div className="leaderboard-list">
                                {data.topProducts && data.topProducts.length > 0 ? (
                                    data.topProducts.map((product, index) => (
                                        <div key={index} className="leaderboard-item">
                                            <div className="leaderboard-rank">{index + 1}</div>
                                            <div className="leaderboard-img-wrapper">
                                                {product.image ? (
                                                    <img src={`http://localhost:3006/${product.image.replace(/\\/g, '/')}`} alt={product.name} />
                                                ) : (
                                                    <div className="leaderboard-img-placeholder">📦</div>
                                                )}
                                            </div>
                                            <div className="leaderboard-info">
                                                <h4>{product.name}</h4>
                                                <p>{product.totalQuantity} units sold</p>
                                            </div>
                                            <div className="leaderboard-revenue">
                                                {formatCurrency(product.totalRevenue)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-chart">No product data</div>
                                )}
                            </div>
                        </div>

                        {/* CATEGORY REVENUE BAR CHART */}
                        <div className="chart-card glass-panel span-2-col">
                            <div className="chart-header">
                                <h3>Revenue by Category</h3>
                                <div className="chart-badge dark">Segments</div>
                            </div>
                            <div className="chart-wrapper compact-chart">
                                {data.salesByCategory && data.salesByCategory.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={data.salesByCategory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis type="number" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                                            <YAxis dataKey="name" type="category" width={100} stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} wrapperClassName="custom-tooltip-wrapper" formatter={(value: any) => [formatCurrency(value as number), 'Revenue']} />
                                            <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="empty-chart">No category data</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsScreen;
