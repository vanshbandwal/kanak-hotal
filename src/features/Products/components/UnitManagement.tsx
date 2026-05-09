import React, { useState, useEffect, useCallback } from 'react';
import LuxuryTable, { ColumnDef } from '../../../components/Common/LuxuryTable';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import UnitFormModal from './UnitFormModal';
import { unitApi } from '../../../api/unitApi';
import { useToast } from '../../../context/ToastContext';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import './UnitManagement.css';

interface UnitItem {
    _id: string;
    name: string;
    shorthand: string;
    description: string;
    isActive: boolean;
}

const UnitManagement = () => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<UnitItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create'|'edit'|'view'>('create');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'danger' as 'danger'|'warning'|'info'
    });

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc'|'desc' }>({
        key: 'name',
        direction: 'asc'
    });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const { data: responseData, error } = await unitApi.getAllUnits({
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

    const handleToggleStatus = (item: UnitItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Change Status',
            message: `Are you sure you want to ${item.isActive ? 'deactivate' : 'activate'} unit "${item.name}"?`,
            type: 'warning',
            onConfirm: async () => {
                const { error } = await unitApi.toggleUnitStatus(item._id);
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

    const handleView = (item: UnitItem) => {
        setSelectedItem(item);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleEdit = (item: UnitItem) => {
        setSelectedItem(item);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Unit',
            message: 'Are you sure you want to delete this unit? This might affect products using it.',
            type: 'danger',
            onConfirm: async () => {
                const { error } = await unitApi.deleteUnit(id);
                if (error) {
                    addToast('error', error);
                } else {
                    addToast('success', 'Unit deleted');
                    fetchData();
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const getColumns = (): ColumnDef<UnitItem>[] => [
        { header: 'Sr.No', key: '_id', width: '60px', render: (_, index) => index + 1 },
        { header: 'Unit Name', key: 'name', sortable: true },
        { 
            header: 'Shorthand', 
            key: 'shorthand', 
            sortable: true, 
            render: (item) => (
                <LuxuryStatusBadge label={item.shorthand} variant="info" />
            ) 
        },
        { header: 'Description', key: 'description', render: (item) => item.description || '-' },
        { 
            header: 'Status', 
            key: 'isActive',
            sortable: true,
            render: (item) => (
                <div onClick={() => handleToggleStatus(item)} style={{ cursor: 'pointer' }}>
                    <LuxuryStatusBadge 
                        label={item.isActive ? 'Active' : 'Inactive'}
                        variant={item.isActive ? 'success' : 'danger'}
                    />
                </div>
            )
        },
        { 
            header: 'Actions', 
            key: 'actions',
            render: (item) => (
                <div className="unit-mgmt-actions-cell">
                    <button className="unit-mgmt-view-btn" onClick={() => handleView(item)}>👁️</button>
                    <button className="unit-mgmt-edit-btn" onClick={() => handleEdit(item)}>✏️</button>
                    <button className="unit-mgmt-delete-btn" onClick={() => handleDelete(item._id)}>🗑️</button>
                </div>
            )
        }
    ];


    return (
        <div className="unit-mgmt-container">
            <LuxuryTable
                title="Unit Configuration"
                subtitle="Manage measurement units for your inventory"
                columns={getColumns()}
                data={data}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
                totalCount={totalCount}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
                onAdd={() => { setSelectedItem(null); setModalMode('create'); setIsModalOpen(true); }}
                addButtonLabel="+ ADD UNIT"
            />

            <UnitFormModal 
                isOpen={isModalOpen}
                mode={modalMode}
                initialData={selectedItem}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />

            <LuxuryConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                isLoading={isLoading}
            />
        </div>
    );
};

export default UnitManagement;
