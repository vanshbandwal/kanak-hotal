import React, { useState, useEffect, useCallback } from 'react';
import LuxuryTable, { ColumnDef } from '../../../components/Common/LuxuryTable';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import LuxuryToggle from '../../../components/Common/LuxuryToggle';
import CategoryFormModal from './CategoryFormModal';
import { categoryApi } from '../../../api/categoryApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import LuxuryActionButton from '../../../components/Common/LuxuryActionButton';
import './CategoryManagement.css';

interface CategoryItem {
    _id: string;
    id?: string;
    image: string;
    name: string;
    isActive: boolean;
    order: number;
    // For hierarchy labels - backend populates these with { name, slug, _id }
    categoryId?: { name: string; slug?: string; _id: string };
    subcategoryId?: { name: string; slug?: string; _id: string };
}

const CategoryManagement = () => {
    const { addToast } = useToast();
    const [subTab, setSubTab] = useState<'category' | 'subcategory' | 'subsubcategory'>('category');
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<CategoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);

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
        const params = {
            search: searchTerm,
            page: currentPage,
            limit: rowsPerPage,
            sort: sortConfig.key,
            order: sortConfig.direction
        };

        let response;
        if (subTab === 'category') response = await categoryApi.getAllCategories(params);
        else if (subTab === 'subcategory') response = await categoryApi.getAllSubcategories(params);
        else response = await categoryApi.getAllSubSubcategories(params);

        const { data: responseData, error } = response || { data: null, error: 'Request failed' };

        if (error) {
            addToast('error', error);
        } else {
            if (responseData && typeof responseData === 'object' && 'data' in responseData) {
                setData(responseData.data);
                setTotalCount(responseData.totalCount || responseData.data.length);
            } else {
                setData(responseData || []);
                setTotalCount(Array.isArray(responseData) ? responseData.length : 0);
            }
        }
        setIsLoading(false);
    }, [subTab, searchTerm, currentPage, rowsPerPage, sortConfig, addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [subTab]);

    const handleToggleStatus = (item: CategoryItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Change Status',
            message: `Are you sure you want to ${item.isActive ? 'deactivate' : 'activate'} "${item.name}"?`,
            variant: 'warning',
            onConfirm: async () => {
                let response;
                const updateData = { isActive: !item.isActive };
                if (subTab === 'category') response = await categoryApi.updateCategory(item._id, updateData);
                else if (subTab === 'subcategory') response = await categoryApi.updateSubcategory(item._id, updateData);
                else if (subTab === 'subsubcategory') response = await categoryApi.updateSubSubcategory(item._id, updateData);

                if (response?.error) {
                    addToast('error', response.error);
                } else {
                    addToast('success', 'Status updated');
                    fetchData();
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleView = (item: CategoryItem) => {
        setSelectedItem(item);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleEdit = (item: CategoryItem) => {
        setSelectedItem(item);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Item',
            message: 'Are you sure you want to delete this collection? This action cannot be undone.',
            variant: 'danger',
            onConfirm: async () => {
                let response;
                if (subTab === 'category') response = await categoryApi.deleteCategory(id);
                else if (subTab === 'subcategory') response = await categoryApi.deleteSubcategory(id);
                else if (subTab === 'subsubcategory') response = await categoryApi.deleteSubSubcategory(id);

                if (response?.error) {
                    addToast('error', response.error);
                } else {
                    addToast('success', 'Item deleted successfully');
                    fetchData();
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const getColumns = (): ColumnDef<CategoryItem>[] => {
        const baseColumns: ColumnDef<CategoryItem>[] = [
            { 
                header: 'Sr.No', 
                key: '_id', 
                width: '60px',
                render: (_, index) => index + 1
            },
            { 
                header: 'Image', 
                key: 'image', 
                width: '80px',
                render: (item) => (
                    <div className="category-mgmt-image-container">
                        {item.image ? (
                            <img 
                                src={item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`} 
                                alt={item.name} 
                                className="category-mgmt-table-image" 
                                loading="lazy"
                            />
                        ) : (
                            <div className="category-mgmt-image-placeholder">🖼️</div>
                        )}
                    </div>
                )
            },
            { 
                header: 'Name', 
                key: 'name',
                sortable: true,
                render: (item) => (
                    <div className="category-mgmt-name-container">
                        <span className="category-mgmt-name-text">{item.name}</span>
                    </div>
                )
            }
        ];

        // Add Parent Category column for Subcategory and Sub-subcategory
        if (subTab === 'subcategory' || subTab === 'subsubcategory') {
            baseColumns.push({
                header: 'Category',
                key: 'categoryId',
                render: (item) => (
                    item.categoryId ? (
                        <span className="category-mgmt-location-badge">{item.categoryId.name}</span>
                    ) : <span className="category-mgmt-parent-text">None</span>
                )
            });
        }

        // Add Parent Subcategory column for Sub-subcategory
        if (subTab === 'subsubcategory') {
            baseColumns.push({
                header: 'Subcategory',
                key: 'subcategoryId',
                render: (item) => (
                    item.subcategoryId ? (
                        <span className="category-mgmt-location-badge">{item.subcategoryId.name}</span>
                    ) : <span className="category-mgmt-parent-text">None</span>
                )
            });
        }

        baseColumns.push(
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
                header: 'Order', 
                key: 'order',
                sortable: true,
                render: (item) => (
                    <span className="category-mgmt-location-badge">{item.order || 0}</span>
                )
            },
            { 
                header: 'Actions', 
                key: 'actions',
                render: (item) => (
                    <div className="category-mgmt-actions-cell">
                        <LuxuryActionButton 
                            type="view" 
                            onClick={() => handleView(item)} 
                            title={`View ${subTab}`}
                        />
                        <LuxuryActionButton 
                            type="edit" 
                            onClick={() => handleEdit(item)} 
                            title={`Edit ${subTab}`}
                        />
                        <LuxuryActionButton 
                            type="delete" 
                            onClick={() => handleDelete(item._id)} 
                            title={`Delete ${subTab}`}
                        />
                    </div>
                )
            }
        );

        return baseColumns;
    };

    const getTabTitle = () => {
        if (subTab === 'category') return 'All Categories';
        if (subTab === 'subcategory') return 'All Subcategories';
        return 'All Sub-subcategories';
    };

    return (
        <div className="category-mgmt-container">
            {/* Sub-tab Navigation */}
            <div className="category-mgmt-sub-tab-nav">
                <button 
                    onClick={() => setSubTab('category')}
                    className={`category-mgmt-sub-tab-button ${subTab === 'category' ? 'active' : ''}`}
                >
                    Category
                </button>
                <button 
                    onClick={() => setSubTab('subcategory')}
                    className={`category-mgmt-sub-tab-button ${subTab === 'subcategory' ? 'active' : ''}`}
                >
                    Sub Category
                </button>
                <button 
                    onClick={() => setSubTab('subsubcategory')}
                    className={`category-mgmt-sub-tab-button ${subTab === 'subsubcategory' ? 'active' : ''}`}
                >
                    Sub Sub Category
                </button>
            </div>

            <LuxuryTable
                title={getTabTitle()}
                subtitle={`Manage your luxury ${subTab} collection`}
                columns={getColumns()}
                data={data}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                    setSearchTerm(val);
                    setCurrentPage(1); // Reset to first page on search
                }}
                
                // Pagination props
                totalCount={totalCount}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={(count) => {
                    setRowsPerPage(count);
                    setCurrentPage(1);
                }}
                
                // Sorting props
                sortConfig={sortConfig}
                onSortChange={setSortConfig}
                
                onAdd={() => {
                    setSelectedItem(null);
                    setModalMode('create');
                    setIsModalOpen(true);
                }}
                onExport={() => {}}
                onImport={() => {}}
                addButtonLabel={`+ ADD ${subTab.toUpperCase().replace('SUB', 'SUB ')}`}
            />

            {/* Form Modal */}
            <CategoryFormModal 
                isOpen={isModalOpen}
                mode={modalMode}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                }}
                onSuccess={fetchData}
                type={subTab}
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

export default CategoryManagement;

