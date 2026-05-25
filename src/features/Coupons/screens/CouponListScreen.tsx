import React, { useState, useEffect } from 'react';
import { couponApi } from '../../../api/couponApi';
import { useToast } from '../../../context/ToastContext';
import LuxuryTable from '../../../components/Common/LuxuryTable';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import LuxuryActionButton from '../../../components/Common/LuxuryActionButton';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import CouponFormModal from '../components/CouponFormModal';

const CouponListScreen: React.FC = () => {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
        key: 'createdAt',
        direction: 'desc'
    });

    const [confirmAction, setConfirmAction] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant: 'danger' | 'warning' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        variant: 'info'
    });

    const [isActionLoading, setIsActionLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        loadCoupons();
    }, [searchTerm, sortConfig, currentPage, rowsPerPage]);

    const loadCoupons = async () => {
        setIsLoading(true);
        try {
            const { data } = await couponApi.getAllCoupons({
                search: searchTerm,
                sort: sortConfig.key,
                order: sortConfig.direction,
                page: currentPage,
                limit: rowsPerPage
            });
            // Handle both paginated and unpaginated responses just in case
            if (Array.isArray(data)) {
                setCoupons(data);
                setTotalItems(data.length);
            } else if (data && data.data) {
                setCoupons(data.data);
                setTotalItems(data.pagination?.totalItems || data.data.length);
            } else {
                setCoupons([]);
                setTotalItems(0);
            }
        } catch (error) {
            addToast('error', 'Failed to load coupons');
            setCoupons([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedCoupon(null);
        setIsFormOpen(true);
    };

    const handleEdit = (coupon: any) => {
        setSelectedCoupon(coupon);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (coupon: any) => {
        setConfirmAction({
            isOpen: true,
            title: 'Delete Coupon',
            message: `Are you sure you want to delete coupon "${coupon.code}"? This action cannot be undone.`,
            variant: 'danger',
            onConfirm: async () => {
                setIsActionLoading(true);
                try {
                    await couponApi.deleteCoupon(coupon._id);
                    addToast('success', 'Coupon deleted successfully');
                    setConfirmAction(prev => ({ ...prev, isOpen: false }));
                    loadCoupons();
                } catch (error) {
                    addToast('error', 'Failed to delete coupon');
                } finally {
                    setIsActionLoading(false);
                }
            }
        });
    };

    const columns = [
        {
            key: 'sno',
            header: 'Sr.No',
            width: '60px',
            render: (_: any, index: number) => (currentPage - 1) * rowsPerPage + index + 1
        },
        {
            key: 'code',
            header: 'Coupon Code',
            sortable: true,
            render: (coupon: any) => (
                <div style={{ fontWeight: 'bold', color: '#B8860B' }}>
                    {coupon.code}
                </div>
            )
        },
        {
            key: 'discount',
            header: 'Discount',
            render: (coupon: any) => (
                <LuxuryStatusBadge
                    label={coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`}
                    variant={coupon.discountType === 'percentage' ? 'gold' : 'success'}
                />
            )
        },
        {
            key: 'validity',
            header: 'Validity',
            render: (coupon: any) => {
                const start = new Date(coupon.startDate).toLocaleDateString();
                const end = new Date(coupon.endDate).toLocaleDateString();
                return (
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        <div>{start} to</div>
                        <div>{end}</div>
                    </div>
                );
            }
        },
        {
            key: 'usage',
            header: 'Usage Limit',
            render: (coupon: any) => (
                <div style={{ fontSize: '0.9rem' }}>
                    {coupon.usageLimit ? `${coupon.usageLimit} total` : 'Unlimited'}
                    <br />
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>{coupon.userCountLimit} per user</span>
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '120px',
            render: (coupon: any) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <LuxuryActionButton
                        type="edit"
                        onClick={() => handleEdit(coupon)}
                        title="Edit Coupon"
                    />
                    <LuxuryActionButton
                        type="delete"
                        onClick={() => handleDeleteClick(coupon)}
                        title="Delete Coupon"
                    />
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <LuxuryTable
                title="Coupons Management"
                subtitle="Create and manage discount codes for your customers."
                columns={columns}
                data={coupons}
                isLoading={isLoading}
                onAdd={handleCreate}
                addButtonLabel="ADD COUPON"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
                currentPage={currentPage}
                totalCount={totalItems}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
                emptyTitle="No Coupons Found"
                emptyDescription="Start by creating your first promotional discount code."
                emptyIcon="🎫"
            />

            {isFormOpen && (
                <CouponFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    initialData={selectedCoupon}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        loadCoupons();
                    }}
                />
            )}

            <LuxuryConfirmModal
                isOpen={confirmAction.isOpen}
                onClose={() => setConfirmAction(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmAction.onConfirm}
                title={confirmAction.title}
                message={confirmAction.message}
                variant={confirmAction.variant}
                isLoading={isActionLoading}
            />
        </div>
    );
};

export default CouponListScreen;
