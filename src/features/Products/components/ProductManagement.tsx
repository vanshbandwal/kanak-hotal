import React, { useState, useEffect, useCallback } from 'react';
import LuxuryTable, { ColumnDef } from '../../../components/Common/LuxuryTable';
import LuxuryConfirmModal from '../../../components/Common/LuxuryConfirmModal';
import ProductFormModal from './ProductFormModal';
import { productApi } from '../../../api/productApi';
import { BASE_URL } from '../../../api/endpoint';
import { useToast } from '../../../context/ToastContext';
import LuxuryStatusBadge from '../../../components/Common/LuxuryStatusBadge';
import './ProductManagement.css';

interface ProductItem {
    _id: string;
    name: string;
    productType: 'single' | 'variant' | 'combo';
    category: { name: string; _id: string };
    subcategory?: { name: string; _id: string };
    price: number;
    stock: number;
    isActive: boolean;
    mainImage: string;
    sku?: string;
}

const ProductManagement = () => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<ProductItem[]>([]);
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
        type: 'danger' as 'danger' | 'warning' | 'info'
    });

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
        key: 'createdAt',
        direction: 'desc'
    });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const { data: responseData, error } = await productApi.getAllProducts({
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

    const handleToggleStatus = (item: ProductItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Change Status',
            message: `Are you sure you want to ${item.isActive ? 'deactivate' : 'activate'} "${item.name}"?`,
            type: 'warning',
            onConfirm: async () => {
                const { error } = await productApi.toggleProductStatus(item._id);
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

    const handleView = (item: ProductItem) => {
        setSelectedItem(item);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleEdit = (item: ProductItem) => {
        setSelectedItem(item);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Product',
            message: 'Are you sure you want to delete this luxury item? This action will remove it from the catalog permanently.',
            type: 'danger',
            onConfirm: async () => {
                const { error } = await productApi.deleteProduct(id);
                if (error) {
                    addToast('error', error);
                } else {
                    addToast('success', 'Product deleted successfully');
                    fetchData();
                }
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const getColumns = (): ColumnDef<ProductItem>[] => [
        { 
            header: 'Sr.No', 
            key: '_id', 
            width: '60px',
            render: (_, index) => index + 1
        },
        { 
            header: 'Image', 
            key: 'mainImage', 
            width: '80px',
            render: (item) => (
                <div className="product-mgmt-image-container">
                    {item?.mainImage ? (
                        <img 
                            src={(() => {
                                const path = item.mainImage || '';
                                if (path.startsWith('http')) return path;
                                const uploadIndex = path.indexOf('uploads');
                                const cleanPath = uploadIndex !== -1 ? path.substring(uploadIndex) : path;
                                return `${BASE_URL}/${cleanPath.replace(/\\/g, '/')}`;
                            })()} 
                            alt={item?.name} 
                            className="product-mgmt-table-image" 
                            loading="lazy"
                        />
                    ) : (
                        <div className="product-mgmt-image-placeholder">🖼️</div>
                    )}
                </div>
            )
        },
        { 
            header: 'Product Info', 
            key: 'name',
            sortable: true,
            render: (item) => (
                <div className="product-mgmt-info-cell">
                    <span className="product-mgmt-name-text">{item.name}</span>
                    <LuxuryStatusBadge label={item.productType.toUpperCase()} variant="info" />
                </div>
            )
        },
        { 
            header: 'Hierarchy', 
            key: 'category',
            render: (item) => (
                <div className="product-mgmt-hierarchy-cell">
                    <LuxuryStatusBadge 
                        label={item.category?.name || 'Uncategorized'} 
                        variant="warning" 
                    />
                    {item.subcategory && (
                        <div className="product-mgmt-subcategory-wrapper">
                            <span className="subcategory-arrow">↳</span>
                            <span className="product-mgmt-subcategory-text">{item.subcategory.name}</span>
                        </div>
                    )}
                </div>
            )
        },
        { 
            header: 'Price', 
            key: 'price',
            sortable: true,
            render: (item) => (
                <span className="product-mgmt-price-text">
                    {item.productType === 'variant' ? 'Varied' : `₹${item.price.toLocaleString()}`}
                </span>
            )
        },
        {
            header: 'Tax',
            key: 'taxRule',
            render: (item: any) => (
                <div className="product-mgmt-tax-cell">
                    {item.taxRule ? (
                        <>
                            <span className="tax-name">{item.taxRule.name}</span>
                            <span className="tax-rate">({item.taxRule.rate}%)</span>
                        </>
                    ) : (
                        <span className="tax-none">No Tax</span>
                    )}
                </div>
            )
        },
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
                <div className="product-mgmt-actions-cell">
                    <button className="product-mgmt-view-btn" onClick={() => handleView(item)} title="View">👁️</button>
                    <button className="product-mgmt-edit-btn" onClick={() => handleEdit(item)} title="Edit">✏️</button>
                    <button className="product-mgmt-delete-btn" onClick={() => handleDelete(item._id)} title="Delete">🗑️</button>
                </div>
            )
        }
    ];


    return (
        <div className="product-mgmt-container">
            <LuxuryTable
                title="Luxury Catalog"
                subtitle="Manage your gallery of high-end products"
                columns={getColumns()}
                data={data}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                    setSearchTerm(val);
                    setCurrentPage(1);
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
                addButtonLabel="+ ADD LUXURY PRODUCT"
            />

            <ProductFormModal 
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
                type={confirmModal.type}
                onConfirm={confirmModal.onConfirm}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ProductManagement;
