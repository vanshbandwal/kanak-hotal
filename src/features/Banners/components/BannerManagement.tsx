import React, { useState, useEffect } from 'react';
import { bannerApi } from '../../../api/bannerApi';
import { useToast } from '../../../context/ToastContext';
import LuxuryPageHeader from '../../../components/Common/LuxuryPageHeader';
import LuxuryButton from '../../../components/Common/LuxuryButton';
import LuxuryTable from '../../../components/Common/LuxuryTable';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import BannerFormModal from './BannerFormModal';
import './BannerManagement.css';

const BannerManagement: React.FC = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
        key: 'order',
        direction: 'asc'
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
        onConfirm: () => {},
        variant: 'info'
    });
    const { addToast } = useToast();

    useEffect(() => {
        loadBanners();
    }, [searchTerm, sortConfig, currentPage, rowsPerPage]);

    const loadBanners = async () => {
        setIsLoading(true);
        try {
            const { data } = await bannerApi.getAllBanners({ 
                search: searchTerm,
                sort: sortConfig.key,
                order: sortConfig.direction,
                page: currentPage,
                limit: rowsPerPage
            });
            setBanners(data?.data || []);
            setTotalItems(data?.pagination?.totalItems || 0);
        } catch (error) {
            addToast('error', 'Failed to load banners');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedBanner(null);
        setIsFormOpen(true);
    };

    const handleEdit = (banner: any) => {
        setSelectedBanner(banner);
        setIsFormOpen(true);
    };

    const [isActionLoading, setIsActionLoading] = useState(false);

    const handleToggleStatus = (banner: any) => {
        setConfirmAction({
            isOpen: true,
            title: 'Change Status',
            message: `Are you sure you want to ${banner.isActive ? 'deactivate' : 'activate'} "${banner.title}"?`,
            variant: 'warning',
            onConfirm: async () => {
                setIsActionLoading(true);
                try {
                    await bannerApi.updateBanner(banner._id, { isActive: !banner.isActive });
                    addToast('success', 'Status updated successfully');
                    setConfirmAction(prev => ({ ...prev, isOpen: false }));
                    loadBanners();
                } catch (error) {
                    addToast('error', 'Failed to update status');
                } finally {
                    setIsActionLoading(false);
                }
            }
        });
    };

    const handleDeleteClick = (banner: any) => {
        setConfirmAction({
            isOpen: true,
            title: 'Delete Banner',
            message: `Are you sure you want to delete "${banner.title}"? This action cannot be undone.`,
            variant: 'danger',
            onConfirm: async () => {
                setIsActionLoading(true);
                try {
                    await bannerApi.deleteBanner(banner._id);
                    addToast('success', 'Banner deleted successfully');
                    setConfirmAction(prev => ({ ...prev, isOpen: false }));
                    loadBanners();
                } catch (error) {
                    addToast('error', 'Failed to delete banner');
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
            key: 'image',
            header: 'Visual',
            width: '100px',
            render: (banner: any) => {
                const imagePath = banner?.image;
                return (
                    <div className="banner-thumbnail">
                        {typeof imagePath === 'string' && imagePath ? (
                            <img src={`http://localhost:3006/${imagePath.replace(/\\/g, '/')}`} alt="banner" />
                        ) : (
                            <div className="banner-placeholder">🖼️</div>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'title',
            header: 'Banner Title',
            sortable: true,
            render: (banner: any) => (
                <div className="banner-info">
                    <span className="banner-name">{banner?.title || 'Untitled Banner'}</span>
                    <span className="banner-subtitle">{banner?.subtitle || ''}</span>
                </div>
            )
        },
        {
            key: 'type',
            header: 'Type',
            sortable: true,
            render: (banner: any) => (
                <LuxuryStatusBadge
                    label={typeof banner?.type === 'string' ? banner.type.toUpperCase() : 'UNKNOWN'}
                    variant={banner?.type === 'hero' ? 'gold' : banner?.type === 'promotion' ? 'warning' : 'neutral'}
                />
            )
        },
        {
            key: 'isActive',
            header: 'Status',
            render: (banner: any) => (
                <LuxuryToggle 
                    value={banner?.isActive}
                    onChange={() => handleToggleStatus(banner)}
                />
            )
        },
        {
            key: 'order',
            header: 'Order',
            width: '80px',
            sortable: true,
            render: (banner: any) => banner?.order ?? 0
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '120px',
            render: (banner: any) => (
                <div className="banner-actions">
                    <button className="action-btn edit" onClick={() => handleEdit(banner)} title="Edit">
                        ✎
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteClick(banner)} title="Delete">
                        🗑
                    </button>
                    {banner.link && (
                        <a href={banner.link} target="_blank" rel="noopener noreferrer" className="action-btn link" title="View Link">
                            ↗
                        </a>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="banner-management-container">
            <div className="banner-content">
                <LuxuryTable
                    title="Banner Management"
                    subtitle="Update the visual promotions on your app and website."
                    columns={columns}
                    data={banners}
                    isLoading={isLoading}
                    onAdd={handleCreate}
                    addButtonLabel="ADD BANNER"
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    sortConfig={sortConfig}
                    onSortChange={setSortConfig}
                    // Pagination Props
                    currentPage={currentPage}
                    totalCount={totalItems}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={setRowsPerPage}
                    emptyTitle="No Banners Found"
                    emptyDescription="Start by uploading your first promotional banner."
                    emptyIcon="🖼️"
                />
            </div>

            {isFormOpen && (
                <BannerFormModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    initialData={selectedBanner}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        loadBanners();
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

export default BannerManagement;
