import React, { useState, useEffect, useCallback } from 'react';
import orderApi from '../../../api/orderApi';
import LuxuryTable, { ColumnDef } from '../../../components/Common/LuxuryTable';
import LuxuryStatusBadge, { BadgeVariant } from '../../../components/Common/LuxuryStatusBadge';
import LuxurySelect from '../../../components/Common/LuxurySelect';
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
    const [isLoading, setIsLoading] = useState(true);
    
    // Pagination & Filtering State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        const params: any = {
            page: currentPage,
            limit: rowsPerPage,
        };
        if (statusFilter) params.status = statusFilter;
        
        // Search term could be used if backend supported text search, but we'll leave it in state
        
        const { data, error } = await orderApi.getAllOrders(params);
        if (!error && data && data.success) {
            setOrders(data.data);
            setTotalCount(data.pagination.totalOrders);
        } else {
            console.error("Failed to fetch orders:", error);
        }
        setIsLoading(false);
    }, [currentPage, rowsPerPage, statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const { error } = await orderApi.updateOrderStatus(orderId, newStatus);
        if (!error) {
            // Refresh the list after successful update
            fetchOrders();
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
            header: "Order ID",
            key: "_id",
            render: (item) => <span className="order-id-text">#{item._id.substring(item._id.length - 6).toUpperCase()}</span>
        },
        {
            header: "Customer",
            key: "customer",
            render: (item) => (
                <div>
                    <div className="order-customer-name">{item.customer?.name || "Guest"}</div>
                    <div className="order-customer-phone">{item.customer?.phone || ''}</div>
                </div>
            )
        },
        {
            header: "Date",
            key: "createdAt",
            render: (item) => new Date(item.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })
        },
        {
            header: "Total",
            key: "grandTotal",
            render: (item) => <span className="order-grand-total">${item.grandTotal.toFixed(2)}</span>
        },
        {
            header: "Payment",
            key: "paymentStatus",
            render: (item) => (
                <LuxuryStatusBadge 
                    label={item.paymentStatus.toUpperCase()} 
                    variant={getPaymentBadgeVariant(item.paymentStatus)} 
                />
            )
        },
        {
            header: "Order Status",
            key: "orderStatus",
            render: (item) => {
                // If it's a final state, just show a badge to prevent editing
                if (['delivered', 'completed', 'cancelled', 'rejected'].includes(item.orderStatus)) {
                    const variant = item.orderStatus === 'delivered' || item.orderStatus === 'completed' ? 'success' : 'danger';
                    return <LuxuryStatusBadge label={item.orderStatus.replace(/_/g, ' ').toUpperCase()} variant={variant} />;
                }
                
                // Otherwise, show the dropdown to allow editing
                return (
                    <LuxurySelect
                        value={item.orderStatus}
                        options={STATUS_OPTIONS}
                        onChange={(val) => handleStatusChange(item._id, val)}
                        searchable={false}
                    />
                );
            }
        }
    ];

    return (
        <div className="orders-container">
            <div className="orders-filters-row">
                <LuxurySelect
                    value={statusFilter}
                    onChange={(val) => setStatusFilter(val)}
                    options={[{ value: '', label: 'All Statuses' }, ...STATUS_OPTIONS]}
                    searchable={false}
                    placeholder="Filter by Status"
                />
            </div>
            
            <LuxuryTable<OrderData>
                title="Order Archives"
                subtitle="Monitor and manage all customer purchases."
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
                emptyIcon="📦"
                emptyTitle="No Orders Found"
                emptyDescription="Your fulfillment queue is currently empty."
            />
        </div>
    );
};

export default OrdersScreen;
