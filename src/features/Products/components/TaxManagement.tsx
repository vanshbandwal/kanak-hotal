import React, { useState, useEffect, useCallback } from 'react';
import LuxuryTable, { ColumnDef } from '../../../components/Common/LuxuryTable';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import TaxFormModal from './TaxFormModal';
import { taxApi } from '../../../api/taxApi';
import { useToast } from '../../../context/ToastContext';
import './TaxManagement.css';

interface TaxItem {
    _id: string;
    name: string;
    rate: number;
    type: 'percentage' | 'fixed';
    taxType: 'inclusive' | 'exclusive';
    description: string;
    isActive: boolean;
}

const TaxManagement = () => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<TaxItem[]>([]);
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

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await taxApi.getAllTaxes({ search: searchTerm });
        if (error) {
            addToast('error', error);
        } else {
            setData(data || []);
        }
        setIsLoading(false);
    }, [searchTerm, addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggleStatus = (item: TaxItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Change Status',
            message: `Are you sure you want to ${item.isActive ? 'deactivate' : 'activate'} tax rule "${item.name}"?`,
            type: 'warning',
            onConfirm: async () => {
                const { error } = await taxApi.updateTax(item._id, { isActive: !item.isActive });
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

    const handleView = (item: TaxItem) => {
        setSelectedItem(item);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleEdit = (item: TaxItem) => {
        setSelectedItem(item);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Tax Rule',
            message: 'Are you sure you want to delete this tax rule? This might affect products using it.',
            type: 'danger',
            onConfirm: async () => {
                const { error } = await taxApi.deleteTax(id);
                if (error) {
                    addToast('error', error);
                } else {
                    addToast('success', 'Tax rule deleted');
                    fetchData();
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const getColumns = (): ColumnDef<TaxItem>[] => [
        { header: 'Sr.No', key: '_id', width: '60px', render: (_, index) => index + 1 },
        { header: 'Tax Name', key: 'name', sortable: true },
        { 
            header: 'Rate', 
            key: 'rate', 
            render: (item) => (
                <span className="tax-mgmt-code-tag">
                    {item.type === 'percentage' ? `${item.rate}%` : `$${item.rate}`}
                </span>
            ) 
        },
        { 
            header: 'Type', 
            key: 'taxType', 
            render: (item) => (
                <span className="tax-mgmt-type-tag" style={{
                    backgroundColor: item.taxType === 'inclusive' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(52, 152, 219, 0.1)',
                    color: item.taxType === 'inclusive' ? '#2ecc71' : '#3498db'
                }}>
                    {item.taxType.charAt(0).toUpperCase() + item.taxType.slice(1)}
                </span>
            ) 
        },
        { header: 'Description', key: 'description', render: (item) => item.description || '-' },
        { 
            header: 'Status', 
            key: 'isActive',
            sortable: true,
            render: (item) => (
                <div className="tax-mgmt-toggle-wrapper" onClick={() => handleToggleStatus(item)}>
                    <div className="tax-mgmt-toggle-bg" style={{
                        backgroundColor: item.isActive ? 'var(--success)' : 'rgba(255,255,255,0.1)'
                    }}>
                        <div className="tax-mgmt-toggle-circle" style={{
                            left: item.isActive ? '18px' : '2px'
                        }} />
                    </div>
                </div>
            )
        },
        { 
            header: 'Actions', 
            key: 'actions',
            render: (item) => (
                <div className="tax-mgmt-actions-cell">
                    <button className="tax-mgmt-view-btn" onClick={() => handleView(item)}>👁️</button>
                    <button className="tax-mgmt-edit-btn" onClick={() => handleEdit(item)}>✏️</button>
                    <button className="tax-mgmt-delete-btn" onClick={() => handleDelete(item._id)}>🗑️</button>
                </div>
            )
        }
    ];

    return (
        <div className="tax-mgmt-container">
            <LuxuryTable
                title="Tax Configuration"
                subtitle="Manage tax rules and rates for your catalog"
                columns={getColumns()}
                data={data}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={(val) => { setSearchTerm(val); }}
                onAdd={() => { setSelectedItem(null); setModalMode('create'); setIsModalOpen(true); }}
                addButtonLabel="+ ADD TAX RULE"
            />

            <TaxFormModal 
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

export default TaxManagement;
