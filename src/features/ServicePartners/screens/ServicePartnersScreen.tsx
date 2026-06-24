import React, { useState, useEffect, useCallback } from 'react';
import LuxuryTable from '../../../components/Common/LuxuryTable';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import LuxuryStatsCard from '../../../components/Common/LuxuryStatsCard';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import { servicePartnerApi } from '../../../api/servicePartnerApi';
import { useToast } from '../../../context/ToastContext';
import PartnerFormModal from '../components/PartnerFormModal';
import PartnerViewModal from '../components/PartnerViewModal';
import LuxuryActionButton from '../../../components/Common/LuxuryActionButton';
import { BASE_URL } from '../../../api/endpoint';
import './ServicePartnersScreen.css';

const ServicePartnersScreen = () => {
    const { addToast } = useToast();
    const [partners, setPartners] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortKey, setSortKey] = useState('createdAt');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [stats, setStats] = useState<any>(null);

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedPartner, setSelectedPartner] = useState<any>(null);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: '',
        title: '',
        message: '',
        onConfirm: () => { },
        variant: 'warning' as 'danger' | 'warning' | 'info'
    });

    const fetchPartners = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                keyword: searchTerm,
                page: currentPage,
                pageSize: rowsPerPage,
                sort: sortKey,
                order: sortDir
            };
            const { data } = await servicePartnerApi.getAllPartners(params);
            if (data.success) {
                setPartners(data.partners);
                setTotalCount(data.total);
            }
        } catch (error) {
            addToast('error', 'Failed to load service partners');
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, currentPage, rowsPerPage, sortKey, sortDir, addToast]);

    const fetchStats = useCallback(async () => {
        try {
            const { data } = await servicePartnerApi.getPartnerStats();
            if (data?.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Failed to load partner stats', error);
        }
    }, []);

    useEffect(() => {
        fetchPartners();
        fetchStats();
    }, [fetchPartners, fetchStats]);

    const sortConfig = { key: sortKey, direction: sortDir };
    const handleSortChange = (cfg: { key: string; direction: 'asc' | 'desc' }) => {
        setSortKey(cfg.key);
        setSortDir(cfg.direction);
    };

    const handleToggleStatus = (partner: any) => {
        setConfirmModal({
            isOpen: true,
            id: partner._id,
            title: 'Change Account Status',
            message: `Are you sure you want to ${partner.isActive ? 'deactivate' : 'activate'} "${partner.name || 'this partner'}"?`,
            variant: 'warning',
            onConfirm: async () => {
                setIsLoading(true);
                try {
                    await servicePartnerApi.toggleStatus(partner._id);
                    addToast('success', 'Partner status updated successfully');
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    fetchPartners();
                } catch (error) {
                    addToast('error', 'Failed to update status');
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    const handleView = (partner: any) => {
        setSelectedPartner(partner);
        setIsViewOpen(true);
    };

    const handleEdit = (partner: any) => {
        setSelectedPartner(partner);
        setModalMode('edit');
        setIsRegisterOpen(true);
    };

    const handleDelete = (partner: any) => {
        setConfirmModal({
            isOpen: true,
            id: partner._id,
            title: 'Delete Partner',
            message: `Are you sure you want to remove "${partner.name}"? This action cannot be undone.`,
            variant: 'danger',
            onConfirm: async () => {
                setIsLoading(true);
                try {
                    await servicePartnerApi.deletePartner(partner._id);
                    addToast('success', 'Partner removed successfully');
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    fetchPartners();
                } catch (error) {
                    addToast('error', 'Failed to delete partner');
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    const columns = [
        {
            key: 'slNo',
            header: 'Sl.No',
            render: (_: any, index: number) => (currentPage - 1) * rowsPerPage + index + 1
        },
        {
            key: 'avatar',
            header: 'Profile',
            render: (item: any) => {
                const getSanitizedPath = (path: string) => {
                    if (!path) return '';
                    if (path.startsWith('http')) return path;
                    const cleanPath = path.startsWith('/') ? path : `/${path}`;
                    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
                    return `${cleanBase}${cleanPath.replace(/\\/g, '/')}`;
                };

                return (
                    <div className="partner-avatar-cell">
                        <div className="partner-avatar-mini">
                            {item.avatar ? (
                                <img src={getSanitizedPath(item.avatar)} alt={item.name} />
                            ) : (
                                <span>{item.name?.charAt(0) || 'P'}</span>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            key: 'name',
            header: 'Partner Info',
            sortable: true,
            render: (item: any) => (
                <div className="partner-info-cell">
                    <span className="partner-name">{item.name || 'Unnamed Partner'}</span>
                    <span className="partner-phone">{item.phone}</span>
                </div>
            )
        },
        {
            key: 'vehicle.type',
            header: 'Vehicle',
            sortable: true,
            render: (item: any) => (
                <div className="vehicle-cell">
                    <span className="vehicle-type">{item.vehicle?.type}</span>
                    <span className="vehicle-num">{item.vehicle?.number}</span>
                </div>
            )
        },
        {
            key: 'kycStatus',
            header: 'KYC Status',
            sortable: true,
            render: (item: any) => {
                const variants: any = {
                    Verified: 'success',
                    Pending: 'warning',
                    'In Review': 'info',
                    Rejected: 'danger'
                };
                return <LuxuryStatusBadge label={item.kycStatus} variant={variants[item.kycStatus]} />;
            }
        },
        {
            key: 'isActive',
            header: 'Account Status',
            sortable: true,
            render: (item: any) => (
                <LuxuryToggle
                    value={item.isActive}
                    onChange={() => handleToggleStatus(item)}
                />
            )
        },
        {
            key: 'isOnline',
            header: 'Live Status',
            sortable: true,
            render: (item: any) => (
                <LuxuryStatusBadge
                    label={item.isOnline ? 'Online' : 'Offline'}
                    variant={item.isOnline ? 'success' : 'neutral'}
                />
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (item: any) => (
                <div className="table-actions">
                    <LuxuryActionButton
                        type="view"
                        onClick={() => handleView(item)}
                        title="View Profile"
                    />
                    <LuxuryActionButton
                        type="edit"
                        onClick={() => handleEdit(item)}
                        title="Edit Details"
                    />
                    <LuxuryActionButton
                        type="delete"
                        onClick={() => handleDelete(item)}
                        title="Remove Partner"
                    />
                </div>
            )
        }
    ];

    return (
        <div className="service-partners-container">
            {stats && (
                <div className="service-partner-stats-grid">
                    <LuxuryStatsCard title="Total Partners" value={stats.totalPartners} icon="🚚" />
                    <LuxuryStatsCard title="Active Partners" value={stats.activePartners} icon="⚡" />
                    <LuxuryStatsCard title="Verified Partners" value={stats.verifiedPartners} icon="🛡️" />
                    <LuxuryStatsCard title="Online Now" value={stats.onlinePartners} icon="🟢" />
                </div>
            )}

            <div className="service-partners-content-card">
                <LuxuryTable
                    title="Service Partner Fleet"
                    subtitle="Manage and monitor your delivery personnel in real-time."
                    data={partners}
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
                    onSortChange={handleSortChange}
                    onAdd={() => {
                        setSelectedPartner(null);
                        setModalMode('create');
                        setIsRegisterOpen(true);
                    }}
                    addButtonLabel="Register New Partner"
                />
            </div>

            <PartnerFormModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSuccess={fetchPartners}
                mode={modalMode}
                initialData={selectedPartner}
            />

            <PartnerViewModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                partner={selectedPartner}
            />

            <LuxuryConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ServicePartnersScreen;
