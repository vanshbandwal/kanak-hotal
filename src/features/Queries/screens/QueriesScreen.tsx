import React, { useState, useEffect, useCallback } from 'react';
import LuxuryTable from '../../../components/Common/LuxuryTable';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import LuxuryStatsCard from '../../../components/Common/LuxuryStatsCard';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import { queryApi } from '../../../api/queryApi';
import { useToast } from '../../../context/ToastContext';
import QueryDetailsModal from '../components/QueryDetailsModal';
import LuxuryActionButton from '../../../components/Common/LuxuryActionButton';
import './QueriesScreen.css';

const QueriesScreen = () => {
    const { addToast } = useToast();
    const [queries, setQueries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' as 'asc' | 'desc' });
    const [stats, setStats] = useState<any>(null);

    // Modal State
    const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: '',
        title: '',
        message: '',
        variant: 'danger' as 'danger' | 'warning' | 'info'
    });

    const fetchQueries = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                keyword: searchTerm,
                page: currentPage,
                pageSize: rowsPerPage,
                sort: sortConfig.key,
                order: sortConfig.direction
            };
            const { data } = await queryApi.getAllQueries(params);
            if (data.success) {
                setQueries(data.queries);
                setTotalCount(data.total);
            }
        } catch (error) {
            addToast('error', 'Failed to fetch queries');
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, currentPage, rowsPerPage, sortConfig, addToast]);

    useEffect(() => {
        fetchQueries();
    }, [fetchQueries]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await queryApi.getQueryStats();
                if (data?.success) setStats(data.data);
            } catch (error) {
                console.error("Failed to fetch query stats", error);
            }
        };
        fetchStats();
    }, []);

    const handleViewDetails = (query: any) => {
        setSelectedQueryId(query._id);
        setIsDetailsOpen(true);
    };

    const handleDeleteClick = (query: any) => {
        setConfirmModal({
            isOpen: true,
            id: query._id,
            title: 'Delete Query',
            message: `Are you sure you want to permanently delete ticket ${query.ticketId}? This action cannot be undone.`,
            variant: 'danger'
        });
    };

    const handleConfirmDelete = async () => {
        try {
            await queryApi.deleteQuery(confirmModal.id);
            addToast('success', 'Query deleted successfully');
            setConfirmModal(prev => ({ ...prev, isOpen: false }));
            fetchQueries();
        } catch (error) {
            addToast('error', 'Failed to delete query');
        }
    };

    const columns = [
        {
            key: 'ticketId',
            header: 'Ticket ID',
            sortable: true,
            render: (item: any) => <span className="ticket-id-link" onClick={() => handleViewDetails(item)}>{item.ticketId}</span>
        },
        {
            key: 'customer',
            header: 'Customer',
            render: (item: any) => (
                <div className="customer-cell">
                    <span className="customer-name">{item.customerId?.name || 'Unknown'}</span>
                    <span className="customer-phone">{item.customerId?.phone}</span>
                </div>
            )
        },
        {
            key: 'subject',
            header: 'Subject',
            sortable: true,
            render: (item: any) => <span className="subject-text">{item.subject}</span>
        },
        {
            key: 'priority',
            header: 'Priority',
            sortable: true,
            render: (item: any) => {
                const variants: Record<string, any> = {
                    Urgent: 'danger',
                    High: 'warning',
                    Medium: 'info',
                    Low: 'neutral'
                };
                return <LuxuryStatusBadge label={item.priority} variant={variants[item.priority] || 'neutral'} />;
            }
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (item: any) => {
                const variants: Record<string, any> = {
                    Open: 'info',
                    Pending: 'warning',
                    Resolved: 'success',
                    Closed: 'neutral'
                };
                return <LuxuryStatusBadge label={item.status} variant={variants[item.status] || 'neutral'} />;
            }
        },
        {
            key: 'createdAt',
            header: 'Submitted',
            sortable: true,
            render: (item: any) => new Date(item.createdAt).toLocaleDateString()
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (item: any) => (
                <div className="table-actions">
                    <LuxuryActionButton 
                        type="view" 
                        onClick={() => handleViewDetails(item)} 
                        title="View & Reply"
                    />
                    <LuxuryActionButton 
                        type="delete" 
                        onClick={() => handleDeleteClick(item)} 
                        title="Delete"
                    />
                </div>
            )
        }
    ];

    return (
        <div className="queries-screen-container">
            {stats && (
                <div className="service-partner-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <LuxuryStatsCard title="Total Queries" value={stats.total} icon="📬" />
                    <LuxuryStatsCard title="Open Queries" value={stats.open} icon="🔓" />
                    <LuxuryStatsCard title="Pending Queries" value={stats.pending} icon="⏳" />
                    <LuxuryStatsCard title="Resolved Queries" value={stats.resolved} icon="✅" />
                </div>
            )}
            <div className="luxury-content-card">
                <LuxuryTable
                    title="Customer Query Management"
                    subtitle="Address and resolve support tickets from your luxury clientele."
                data={queries}
                columns={columns}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                currentPage={currentPage}
                totalCount={totalCount}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
            />
            </div>

            {isDetailsOpen && (
                <QueryDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    queryId={selectedQueryId}
                    onSuccess={fetchQueries}
                />
            )}

            <LuxuryConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmDelete}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />
        </div>
    );
};

export default QueriesScreen;
