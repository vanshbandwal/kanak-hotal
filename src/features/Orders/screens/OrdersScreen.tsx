import React, { useState, useEffect, useCallback } from 'react';
import orderApi from '../../../api/orderApi';
import LuxuryTable, { ColumnDef } from '../../../components/Common/LuxuryTable';
import LuxuryStatusBadge, { BadgeVariant } from '../../../components/Common/LuxuryStatusBadge';
import LuxurySelect from '../../../components/Common/LuxurySelect';
import LuxuryStatsCard from '../../../components/Common/LuxuryStatsCard';
import './OrdersScreen.css';

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

interface OrderData {
    _id: string;
    customer: Customer;
    createdAt: string;
    grandTotal: number;
    paymentStatus: string;
    orderStatus: string;
}

interface OrderStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
}

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rejected', label: 'Rejected' },
];

const OrdersScreen = () => {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Pagination & Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });

    const fetchStats = async () => {
        const { data, error } = await orderApi.getOrderStats();
        if (!error && data && data.success) {
            setStats(data.data);
        }
    };

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        const params: any = {
            page: currentPage,
            limit: rowsPerPage,
            search: searchTerm,
            sortBy: sortConfig.key,
            sortOrder: sortConfig.direction
        };
        if (statusFilter) params.status = statusFilter;
        
        const { data, error } = await orderApi.getAllOrders(params);
        if (!error && data && data.success) {
            setOrders(data.data);
            setTotalCount(data.pagination.totalOrders);
        } else {
            console.error("Failed to fetch orders:", error);
        }
        setIsLoading(false);
    }, [currentPage, rowsPerPage, statusFilter, searchTerm, sortConfig]);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        // debounce search slightly
        const delayDebounceFn = setTimeout(() => {
            fetchOrders();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchOrders]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const { error } = await orderApi.updateOrderStatus(orderId, newStatus);
        if (!error) {
            fetchOrders();
            fetchStats(); // update stats if status changes
        } else {
            alert(`Failed to update status: ${error}`);
        }
    };

    const getPaymentBadgeVariant = (status: string): BadgeVariant => {
        switch (status) {
            case 'paid': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'danger';
            case 'refunded': return 'info';
            default: return 'neutral';
        }
    };

    const columns: ColumnDef<OrderData>[] = [
        {
            header: "ORDER ID",
            key: "_id",
            sortable: true,
            render: (item) => <span className="order-id-text">#{item._id.substring(item._id.length - 6).toUpperCase()}</span>
        },
        {
            header: "CUSTOMER",
            key: "customer",
            render: (item) => (
                <div>
                    <div className="order-customer-name">{item.customer?.name || "Guest"}</div>
                    <div className="order-customer-phone">{item.customer?.phone || ''}</div>
                </div>
            )
        },
        {
            header: "DATE",
            key: "createdAt",
            sortable: true,
            render: (item) => new Date(item.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })
        },
        {
            header: "TOTAL",
            key: "grandTotal",
            sortable: true,
            render: (item) => <span className="order-grand-total">${item.grandTotal.toFixed(2)}</span>
        },
        {
            header: "PAYMENT",
            key: "paymentStatus",
            sortable: true,
            render: (item) => (
                <LuxuryStatusBadge 
                    label={item.paymentStatus.toUpperCase()} 
                    variant={getPaymentBadgeVariant(item.paymentStatus)} 
                />
            )
        },
        {
            header: "ORDER STATUS",
            key: "orderStatus",
            sortable: true,
            render: (item) => {
                if (['delivered', 'completed', 'cancelled', 'rejected'].includes(item.orderStatus)) {
                    const variant = item.orderStatus === 'delivered' || item.orderStatus === 'completed' ? 'success' : 'danger';
                    return <LuxuryStatusBadge label={item.orderStatus.replace(/_/g, ' ').toUpperCase()} variant={variant} />;
                }
                
                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <LuxurySelect
                            value={item.orderStatus}
                            options={STATUS_OPTIONS}
                            onChange={(val) => handleStatusChange(item._id, val)}
                            searchable={false}
                        />
                    </div>
                );
            }
        }
    ];

    return (
        <div className="orders-container">
            {stats && (
                <div className="order-stats-grid">
                    <LuxuryStatsCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💰" />
                    <LuxuryStatsCard title="Total Orders" value={stats.totalOrders} icon="📦" />
                    <LuxuryStatsCard title="Pending" value={stats.pendingOrders} icon="⏳" />
                    <LuxuryStatsCard title="Completed" value={stats.completedOrders} icon="✅" />
                </div>
            )}

            <div className="orders-content-card">
                <LuxuryTable<OrderData>
                    columns={columns}
                    data={orders}
                    isLoading={isLoading}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    totalCount={totalCount}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={setRowsPerPage}
                    sortConfig={sortConfig}
                    onSortChange={setSortConfig}
                    emptyIcon="📦"
                    emptyTitle="No Orders Found"
                    emptyDescription="Your fulfillment queue is currently empty."
                    extraFilters={
                        <LuxurySelect
                            value={statusFilter}
                            onChange={(val) => setStatusFilter(val)}
                            options={[{ value: '', label: 'All Statuses' }, ...STATUS_OPTIONS]}
                            searchable={false}
                            placeholder="All Statuses"
                        />
                    }
                />
            </div>
        </div>
    );
};

export default OrdersScreen;
