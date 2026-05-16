import React, { useState, useEffect, useCallback, useRef } from 'react';
import { customerApi } from '../../../api/customerApi';
import { useToast } from '../../../context/ToastContext';
import LuxuryTable from '../../../components/Common/LuxuryTable';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import CustomerFormModal from '../components/CustomerFormModal';
import LuxuryActionButton from '../../../components/Common/LuxuryActionButton';
import './CustomersScreen.css';

const CustomersScreen: React.FC = () => {
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [viewCustomer, setViewCustomer] = useState<any>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortKey, setSortKey] = useState('createdAt');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [isActionLoading, setIsActionLoading] = useState(false);

    const [confirmAction, setConfirmAction] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant: 'danger' | 'warning' | 'info';
    }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, variant: 'info' });

    const { addToast } = useToast();

    // ── keep a ref to avoid stale-closure issues in callbacks ──
    const isMounted = useRef(true);
    useEffect(() => { isMounted.current = true; return () => { isMounted.current = false; }; }, []);

    // ── Root fix: primitives in deps, not an object ref ──────────
    const loadCustomers = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await customerApi.getAllCustomers({
                keyword: searchTerm,
                sort: sortKey,
                order: sortDir,
                page: currentPage,
                pageSize: rowsPerPage
            });
            if (!isMounted.current) return;
            if (error) { addToast('error', error); return; }
            setCustomers(data?.customers || []);
            setTotalItems(data?.total || 0);
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    }, [searchTerm, sortKey, sortDir, currentPage, rowsPerPage]); // ← primitives only

    useEffect(() => { loadCustomers(); }, [loadCustomers]);

    // Wrap sortConfig as an object so LuxuryTable is still happy
    const sortConfig = { key: sortKey, direction: sortDir };
    const handleSortChange = (cfg: { key: string; direction: 'asc' | 'desc' }) => {
        setSortKey(cfg.key);
        setSortDir(cfg.direction);
    };

    // ── Actions ───────────────────────────────────────────────────
    const handleCreate = () => { setSelectedCustomer(null); setIsFormOpen(true); };
    const handleEdit   = (c: any) => { setSelectedCustomer(c); setIsFormOpen(true); };
    const handleView   = (c: any) => setViewCustomer(c);

    const handleToggleStatus = (customer: any) => {
        setConfirmAction({
            isOpen: true,
            title: 'Change Status',
            message: `${customer.isActive ? 'Deactivate' : 'Activate'} "${customer.name || customer.phone}"?`,
            variant: 'warning',
            onConfirm: async () => {
                setIsActionLoading(true);
                const { error } = await customerApi.toggleStatus(customer._id);
                setIsActionLoading(false);
                setConfirmAction(p => ({ ...p, isOpen: false }));
                if (error) { addToast('error', error); return; }
                addToast('success', 'Status updated');
                loadCustomers();
            }
        });
    };

    const handleDeleteClick = (customer: any) => {
        setConfirmAction({
            isOpen: true,
            title: 'Delete Customer',
            message: `Delete "${customer.name || customer.phone}"? This cannot be undone.`,
            variant: 'danger',
            onConfirm: async () => {
                setIsActionLoading(true);
                const { error } = await customerApi.deleteCustomer(customer._id);
                setIsActionLoading(false);
                setConfirmAction(p => ({ ...p, isOpen: false }));
                if (error) { addToast('error', error); return; }
                addToast('success', 'Customer deleted');
                loadCustomers();
            }
        });
    };

    // ── Table Columns ─────────────────────────────────────────────
    const columns = [
        {
            key: 'sno', header: 'Sr.No', width: '60px',
            render: (_: any, index: number) => (currentPage - 1) * rowsPerPage + index + 1
        },
        {
            key: 'name', header: 'Customer Details', sortable: true,
            render: (c: any) => (
                <div className="customer-info-cell">
                    <div className="customer-avatar-small">
                        {c.avatar
                            ? <img src={`http://localhost:3006/${c.avatar.replace(/\\/g, '/')}`} alt="avatar" />
                            : <span className="avatar-placeholder">{c.name ? c.name[0].toUpperCase() : '?'}</span>
                        }
                    </div>
                    <div className="customer-text">
                        <span className="customer-name">{c.name || 'Unnamed Client'}</span>
                        <span className="customer-email">{c.email || '—'}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'phone', header: 'Contact', sortable: true,
            render: (c: any) => <span className="phone-badge">{c.phone}</span>
        },
        {
            key: 'isVerified', header: 'Verification',
            render: (c: any) => (
                <LuxuryStatusBadge
                    label={c.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                    variant={c.isVerified ? 'success' : 'warning'}
                />
            )
        },
        {
            key: 'isActive', header: 'Status',
            render: (c: any) => (
                <LuxuryToggle 
                    value={c.isActive}
                    onChange={() => handleToggleStatus(c)}
                />
            )
        },
        {
            key: 'createdAt', header: 'Registered', sortable: true,
            render: (c: any) => new Date(c.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
            })
        },
        {
            key: 'actions', header: 'Actions', width: '130px',
            render: (c: any) => (
                <div className="customer-actions">
                    <LuxuryActionButton 
                        type="view" 
                        onClick={() => handleView(c)} 
                        title="View Details"
                    />
                    <LuxuryActionButton 
                        type="edit" 
                        onClick={() => handleEdit(c)} 
                        title="Edit Profile"
                    />
                    <LuxuryActionButton 
                        type="delete" 
                        onClick={() => handleDeleteClick(c)} 
                        title="Delete Customer"
                    />
                </div>
            )
        }
    ];

    return (
        <div className="customers-screen-container">
            <LuxuryTable
                title="Clientele Management"
                subtitle="Manage your exclusive community of shoppers."
                columns={columns}
                data={customers}
                isLoading={isLoading}
                onAdd={handleCreate}
                addButtonLabel="ONBOARD CLIENT"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
                currentPage={currentPage}
                totalCount={totalItems}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
                emptyTitle="No Clients Found"
                emptyDescription="Your luxury circle is waiting for its first member."
                emptyIcon="👤"
            />

            {/* View Drawer */}
            {viewCustomer && (
                <div className="customer-view-overlay" onClick={() => setViewCustomer(null)}>
                    <div className="customer-view-drawer" onClick={e => e.stopPropagation()}>
                        <div className="drawer-header">
                            <h3>Customer Details</h3>
                            <button className="drawer-close" onClick={() => setViewCustomer(null)}>&times;</button>
                        </div>
                        <div className="drawer-avatar">
                            {viewCustomer.avatar
                                ? <img src={`http://localhost:3006/${viewCustomer.avatar.replace(/\\/g, '/')}`} alt="avatar" />
                                : <span>{viewCustomer.name ? viewCustomer.name[0].toUpperCase() : '?'}</span>
                            }
                        </div>
                        <p className="drawer-name">{viewCustomer.name || 'Unnamed'}</p>
                        <div className="drawer-fields">
                            <div className="drawer-field"><label>Phone</label><span>{viewCustomer.phone}</span></div>
                            <div className="drawer-field"><label>Email</label><span>{viewCustomer.email || '—'}</span></div>
                            <div className="drawer-field"><label>Verified</label><span>{viewCustomer.isVerified ? '✅ Yes' : '❌ No'}</span></div>
                            <div className="drawer-field"><label>Profile Done</label><span>{viewCustomer.isProfileCompleted ? '✅ Yes' : '❌ No'}</span></div>
                            <div className="drawer-field"><label>Status</label><span>{viewCustomer.isActive ? 'Active' : 'Inactive'}</span></div>
                            <div className="drawer-field"><label>Registered</label><span>{new Date(viewCustomer.createdAt).toLocaleString('en-IN')}</span></div>
                        </div>
                        <div className="drawer-actions">
                            <button className="drawer-edit-btn" onClick={() => { setViewCustomer(null); handleEdit(viewCustomer); }}>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isFormOpen && (
                <CustomerFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    initialData={selectedCustomer}
                    onSuccess={() => { setIsFormOpen(false); loadCustomers(); }}
                />
            )}

            <LuxuryConfirmModal
                isOpen={confirmAction.isOpen}
                onClose={() => setConfirmAction(p => ({ ...p, isOpen: false }))}
                onConfirm={confirmAction.onConfirm}
                title={confirmAction.title}
                message={confirmAction.message}
                variant={confirmAction.variant}
                isLoading={isActionLoading}
            />
        </div>
    );
};

export default CustomersScreen;
