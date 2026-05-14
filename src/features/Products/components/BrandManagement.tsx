import React, { useState, useEffect, useCallback } from 'react';
import LuxuryTable, { ColumnDef } from '../../../components/Common/LuxuryTable';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import BrandFormModal from './BrandFormModal';
import { brandApi } from '../../../api/brandApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import './BrandManagement.css';

interface BrandItem {
    _id: string;
    name: string;
    logo: string;
    description: string;
    website: string;
    isActive: boolean;
    order: number;
}

const BrandManagement = () => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<BrandItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        variant: 'danger' as 'danger' | 'warning' | 'info'
    });

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
        key: 'order',
        direction: 'asc'
    });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const { data: responseData, error } = await brandApi.getAllBrands({
            search: searchTerm,
            page: currentPage,
            limit: rowsPerPage,
            sort: sortConfig.key,
            order: sortConfig.direction
        });

        if (error) {
            addToast('error', error);
        } else {
            setData(responseData?.data || []);
            setTotalCount(responseData?.pagination?.totalItems || 0);
        }
        setIsLoading(false);
    }, [searchTerm, currentPage, rowsPerPage, sortConfig, addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggleStatus = (item: BrandItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Change Status',
            message: `Are you sure you want to ${item.isActive ? 'deactivate' : 'activate'} "${item.name}"?`,
            variant: 'warning',
            onConfirm: async () => {
                const { error } = await brandApi.toggleBrandStatus(item._id);
                if (error) {
                    addToast('error', error);
                } else {
                    addToast('success', 'Status updated');
                    fetchData();
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleView = (item: BrandItem) => {
        setSelectedItem(item);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleEdit = (item: BrandItem) => {
        setSelectedItem(item);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Brand',
            message: 'Are you sure you want to delete this brand? This action is permanent.',
            variant: 'danger',
            onConfirm: async () => {
                const { error } = await brandApi.deleteBrand(id);
                if (error) {
                    addToast('error', error);
                } else {
                    addToast('success', 'Brand deleted successfully');
                    fetchData();
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const getColumns = (): ColumnDef<BrandItem>[] => [
        { 
            header: 'Sr.No', 
            key: '_id', 
            width: '60px',
            render: (_, index) => index + 1
        },
        { 
            header: 'Logo', 
            key: 'logo', 
            width: '80px',
            render: (item) => (
                <div className="brand-mgmt-image-container">
                    {item?.logo ? (
                        <img 
                            src={item.logo?.startsWith('http') ? item.logo : `${BASE_URL}${item.logo}`} 
                            alt={item?.name} 
                            className="brand-mgmt-table-image" 
                            loading="lazy"
                        />
                    ) : (
                        <div className="brand-mgmt-image-placeholder">📛</div>
                    )}
                </div>
            )
        },
        { 
            header: 'Brand Name', 
            key: 'name',
            sortable: true,
            render: (item) => (
                <div className="brand-mgmt-info-cell">
                    <span className="brand-mgmt-name-text">{item.name}</span>
                    {item.website && <span className="brand-mgmt-website-text">{item.website}</span>}
                </div>
            )
        },
        { 
            header: 'Order', 
            key: 'order',
            sortable: true,
        },
        { 
            header: 'Status', 
            key: 'isActive',
            sortable: true,
            render: (item) => (
                <LuxuryToggle 
                    value={item.isActive}
                    onChange={() => handleToggleStatus(item)}
                />
            )
        },
        { 
            header: 'Actions', 
            key: 'actions',
            render: (item) => (
                <div className="brand-mgmt-actions-cell">
                    <button className="brand-mgmt-view-btn" onClick={() => handleView(item)} title="View">👁️</button>
                    <button className="brand-mgmt-edit-btn" onClick={() => handleEdit(item)} title="Edit">✏️</button>
                    <button className="brand-mgmt-delete-btn" onClick={() => handleDelete(item._id)} title="Delete">🗑️</button>
                </div>
            )
        }
    ];

    return (
        <div className="brand-mgmt-container">
            <LuxuryTable
                title="Brand Directory"
                subtitle="Manage your luxury brand partnerships"
                columns={getColumns()}
                data={data}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                    setSearchTerm(val);
                    setCurrentPage(1);
                }}
                
                totalCount={totalCount}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={(count) => {
                    setRowsPerPage(count);
                    setCurrentPage(1);
                }}

                sortConfig={sortConfig}
                onSortChange={setSortConfig}

                onAdd={() => {
                    setSelectedItem(null);
                    setModalMode('create');
                    setIsModalOpen(true);
                }}
                addButtonLabel="+ ADD BRAND"
            />

            <BrandFormModal 
                isOpen={isModalOpen}
                mode={modalMode}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                }}
                onSuccess={fetchData}
                initialData={selectedItem}
            />

            <LuxuryConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                isLoading={isLoading}
            />
        </div>
    );
};

export default BrandManagement;
